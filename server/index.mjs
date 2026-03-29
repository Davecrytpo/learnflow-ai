import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// --- CONFIGURATION ---
const PORT = process.env.PORT || process.env.API_PORT || 8787;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGODB_URI || !JWT_SECRET) {
  console.error("FATAL ERROR: MONGODB_URI or JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
const corsOrigin = process.env.FRONTEND_URL || "*";

const app = express();
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));

// --- MONGODB CONNECTION ---
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

// --- MODELS ---
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  display_name: String,
  avatar_url: String,
  role: { type: String, enum: ["admin", "instructor", "student"], default: "student" },
  admission_number: { type: String, unique: true, sparse: true },
  bio: String,
  institution: String,
  phone: String,
  city: String,
  state: String,
  country: String,
  date_of_birth: Date,
  gender: String,
  address: String,
  zip_code: String,
  grade_level: String,
  subject_areas: [String],
  department: String,
  specialization: String,
  status: { type: String, default: "active" },
  email_verified: { type: Boolean, default: false },
  email_verification_token: String,
  email_verification_expires: Date,
  password_reset_token: String,
  password_reset_expires: Date,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

const admissionApplicationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  date_of_birth: Date,
  gender: String,
  address: String,
  city: String,
  state: String,
  country: String,
  zip_code: String,
  program_of_interest: { type: String, required: true },
  academic_level: { type: String, enum: ["Undergraduate", "Graduate", "Doctoral"], required: true },
  previous_school: String,
  gpa: Number,
  test_scores: String,
  personal_statement: String,
  status: { type: String, enum: ["pending", "reviewed", "accepted", "rejected"], default: "pending" },
  admission_number_assigned: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const AdmissionApplication = mongoose.model("AdmissionApplication", admissionApplicationSchema);

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: String,
  description: String,
  category: String,
  level: { type: String, default: "Undergraduate" },
  duration: String,
  credits: Number,
  price_cents: { type: Number, default: 0 },
  cover_image_url: String,
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  published: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const Course = mongoose.model("Course", courseSchema);

const moduleSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const Module = mongoose.model("Module", moduleSchema);

const lessonSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  module_id: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
  title: { type: String, required: true },
  content: String,
  video_url: String,
  duration_seconds: Number,
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const Lesson = mongoose.model("Lesson", lessonSchema);

const enrollmentSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected", "active", "completed"], default: "pending" },
  enrolled_at: { type: Date, default: Date.now },
  completed_at: Date
});
const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

const assignmentSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  description: String,
  due_date: Date,
  max_score: { type: Number, default: 100 },
  created_at: { type: Date, default: Date.now }
});
const Assignment = mongoose.model("Assignment", assignmentSchema);

const submissionSchema = new mongoose.Schema({
  assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: String,
  file_url: String,
  score: Number,
  feedback: String,
  submitted_at: { type: Date, default: Date.now },
  graded_at: Date
});
const Submission = mongoose.model("Submission", submissionSchema);

const attendanceSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["present", "absent", "late"], default: "present" }
});
const Attendance = mongoose.model("Attendance", attendanceSchema);

const announcementSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  content: String,
  created_at: { type: Date, default: Date.now }
});
const Announcement = mongoose.model("Announcement", announcementSchema);

const lessonProgressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  completed: { type: Boolean, default: true },
  completed_at: { type: Date, default: Date.now }
});
const LessonProgress = mongoose.model("LessonProgress", lessonProgressSchema);

const quizAttemptSchema = new mongoose.Schema({
  quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true },
  total_points: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  answers: mongoose.Schema.Types.Mixed,
  completed_at: { type: Date, default: Date.now }
});
const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

const certificateSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  verification_code: { type: String, required: true, unique: true },
  issued_at: { type: Date, default: Date.now }
});
const Certificate = mongoose.model("Certificate", certificateSchema);

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: String,
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});
const Notification = mongoose.model("Notification", notificationSchema);

// --- EMAIL (SENDGRID) ---
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_SENDER_EMAIL = process.env.SENDGRID_SENDER_EMAIL || "noreply@globaluniversityinstitute.com";

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// --- UTILS & HELPERS ---
const normalizeEmail = (email) => email?.trim().toLowerCase();
const generateToken = () => crypto.randomBytes(32).toString("hex");
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const buildAppUrl = (path, token) => `${frontendUrl.replace(/\/$/, "")}${path}?token=${token}`;

const wrapEmail = (body) => `
  <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:24px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; padding:24px; border:1px solid #e2e8f0;">
      ${body}
      <p style="margin-top:24px; font-size:12px; color:#64748b;">Global University Institute</p>
    </div>
  </div>
`;

const sendEmail = async ({ to, subject, htmlContent }) => {
  if (!SENDGRID_API_KEY) return { success: false, error: "SENDGRID_API_KEY is not set." };
  const msg = {
    to,
    from: { email: SENDGRID_SENDER_EMAIL, name: "Global University Institute" },
    subject,
    html: htmlContent,
  };
  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error("SendGrid Error:", error.response?.body || error.message);
    return { success: false, error: error.message };
  }
};

const sendLoginEmail = async (email) => {
  const timestamp = new Date().toLocaleString();
  return sendEmail({
    to: email,
    subject: "Institutional Login Detected",
    htmlContent: wrapEmail(`<h2>Login Security Notification</h2><p>New login at ${timestamp}.</p>`)
  });
};

const sendContactEmails = async ({ name, email, subject, message, context }) => {
  const to = context === "admissions" ? "admissions@globaluniversityinstitute.com" : "support@globaluniversityinstitute.com";
  await sendEmail({
    to,
    subject: `[${context.toUpperCase()}] ${subject}`,
    htmlContent: wrapEmail(`<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`)
  });
  if (email) {
    await sendEmail({
      to: email,
      subject: "We received your inquiry",
      htmlContent: wrapEmail(`<p>Thank you for contacting GUI. We will respond shortly.</p>`)
    });
  }
  return { success: true };
};

// --- MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: "Invalid token." });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

// --- AUTH ROUTES ---
app.post("/auth/init-admin", async (req, res) => {
  try {
    const { email, password, key } = req.body;
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) return res.status(403).json({ error: "System already initialized." });
    if (key !== JWT_SECRET) return res.status(403).json({ error: "Invalid initialization key." });

    const user = new User({
      email: normalizeEmail(email),
      password: await bcrypt.hash(password, 10),
      role: "admin",
      display_name: "System Administrator",
      email_verified: true,
      status: "active"
    });
    await user.save();
    res.json({ success: true, message: "Admin account created." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, role, display_name } = req.body;
    if (role && !["student", "instructor"].includes(role)) return res.status(403).json({ error: "Restricted registration." });
    
    const existingUser = await User.findOne({ email: normalizeEmail(email) });
    if (existingUser) return res.status(400).json({ error: "Already registered." });

    const admissionNumber = `GUI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const requestedRole = role === "instructor" ? "instructor" : "student";
    const user = new User({
      email: normalizeEmail(email),
      password: await bcrypt.hash(password, 10),
      role: requestedRole,
      display_name: display_name || email.split("@")[0],
      admission_number: requestedRole === "student" ? admissionNumber : undefined,
      department: req.body.department,
      specialization: req.body.specialization,
      bio: req.body.bio,
      email_verified: true,
      status: requestedRole === "instructor" ? "pending" : "active"
    });
    await user.save();
    res.json({ success: true, token: jwt.sign({ id: user._id, role: user.role }, JWT_SECRET) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: normalizeEmail(email) });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, display_name: user.display_name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/auth/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({
      id: user._id,
      email: user.email,
      display_name: user.display_name,
      role: user.role,
      avatar_url: user.avatar_url,
      email_verified: user.email_verified,
      status: user.status
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/setup-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    const tokenHash = hashToken(token);
    const user = await User.findOne({ email_verification_token: tokenHash, email_verification_expires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ error: "Invalid link." });
    user.password = await bcrypt.hash(password, 10);
    user.status = "active";
    user.email_verification_token = undefined;
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN ROUTES ---
app.post("/admin/create-instructor", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const { email, name, department, specialization } = req.body;
    const existingUser = await User.findOne({ email: normalizeEmail(email) });
    if (existingUser) return res.status(400).json({ error: "Already registered." });
    const inviteToken = generateToken();
    const user = new User({
      email: normalizeEmail(email),
      password: await bcrypt.hash(generateToken(), 10),
      display_name: name,
      role: "instructor",
      department,
      specialization,
      status: "pending",
      email_verification_token: hashToken(inviteToken),
      email_verification_expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    await user.save();
    const setupUrl = buildAppUrl("/setup-password", inviteToken);
    await sendEmail({
      to: email,
      subject: "Faculty Invitation",
      htmlContent: wrapEmail(`<p>Welcome ${name}. <a href="${setupUrl}">Set up account</a></p>`)
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/admin/stats", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const [u, c, e, pi, pc, pendingEnr, activeInstructors] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Course.countDocuments({}),
      Enrollment.countDocuments({}),
      User.countDocuments({ role: "instructor", status: "pending" }),
      Course.countDocuments({ status: "pending" }),
      Enrollment.countDocuments({ status: "pending" }),
      User.countDocuments({ role: "instructor", status: { $ne: "pending" } })
    ]);
    res.json({ users: u, courses: c, enrollments: e, pendingInstructors: pi, pendingCourses: pc, pendingEnr, activeInstructors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/admin/users", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/admin/pending-courses", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const courses = await Course.find({ status: "pending" }).populate("author_id", "display_name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/admin/pending-enrollments", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ status: "pending" })
      .populate("student_id", "display_name email")
      .populate("course_id", "title");
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/admin/faculty-apps", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor", status: "pending" }).select("-password");
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/admin/instructors", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }).select("-password");
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/admin/courses/:id/status", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updated_at: new Date()
      },
      { new: true }
    );
    if (!course) return res.status(404).json({ error: "Course not found." });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/admin/enrollments/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!enrollment) return res.status(404).json({ error: "Enrollment not found." });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/admin/users/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/admin/users/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/admin/instructors/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const instructor = await User.findOneAndDelete({ _id: req.params.id, role: "instructor" });
    if (!instructor) return res.status(404).json({ error: "Instructor not found." });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- INSTRUCTOR ROUTES ---
app.get("/instructor/stats", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const courses = await Course.find({ author_id: req.user.id });
    const cIds = courses.map(c => c._id);
    const count = await Enrollment.countDocuments({ course_id: { $in: cIds } });
    res.json({ students: count, activeCourses: courses.length, revenue: 0, rating: 4.8 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/instructor/courses", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { author_id: req.user.id };
    const courses = await Course.find(query).sort({ updated_at: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/instructor/performance-data", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const courses = await Course.find({ author_id: req.user.id }).select("_id title");
    const courseIds = courses.map((course) => course._id);
    const [students, submissions, attendance] = await Promise.all([
      Enrollment.countDocuments({ course_id: { $in: courseIds }, status: { $in: ["approved", "active", "completed"] } }),
      Submission.countDocuments({}),
      Attendance.countDocuments({ course_id: { $in: courseIds }, status: "present" })
    ]);
    res.json({
      courses: courses.length,
      students,
      submissions,
      attendance,
      courseTitles: courses.map((course) => course.title)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/enrollments/me", authenticate, authorize(["student", "admin"]), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student_id: req.user.id, status: { $in: ["approved", "active", "completed"] } })
      .populate("course_id", "title cover_image_url category updated_at");
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/announcements", authenticate, async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const announcements = await Announcement.find({})
      .sort({ created_at: -1 })
      .limit(limit)
      .populate("course_id", "title");
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/assignments/me", authenticate, authorize(["student", "admin"]), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student_id: req.user.id }).select("course_id");
    const courseIds = enrollments.map((enrollment) => enrollment.course_id);
    const assignments = await Assignment.find({ course_id: { $in: courseIds } })
      .sort({ due_date: 1 })
      .populate("course_id", "title");
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/submissions/me", authenticate, authorize(["student", "admin"]), async (req, res) => {
  try {
    const submissions = await Submission.find({ student_id: req.user.id }).populate("assignment_id", "title max_score");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/quizzes/me", authenticate, authorize(["student", "admin"]), async (_req, res) => {
  res.json([]);
});

app.get("/quiz-attempts/me", authenticate, authorize(["student", "admin"]), async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user_id: req.user.id });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- COURSES ---
app.get("/courses", async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { title: { $regex: search, $options: "i" }, published: true } : { published: true };
    const courses = await Course.find(query).populate("author_id", "display_name");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- STATIC & SPA ---
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  const acceptsHtml = req.accepts(["html", "json"]) === "html";
  if (!acceptsHtml) {
    return res.status(404).json({ error: "Not found." });
  }
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
