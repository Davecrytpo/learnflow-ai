import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// --- CONFIGURATION ---
const PORT = process.env.API_PORT || 8787;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://obiakordavid2000_db_user:I9AZfGnuyn0KpWJT@cluster0.9jgqa6k.mongodb.net/gui_db?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Supabase client (Now only for Storage and AI)
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
  : null;

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
  bio: String,
  institution: String,
  phone: String,
  city: String,
  state: String,
  grade_level: String,
  subject_areas: [String],
  status: { type: String, default: "active" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

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
  status: { type: String, default: "active" },
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

const discussionSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  content: String,
  created_at: { type: Date, default: Date.now }
});

const Discussion = mongoose.model("Discussion", discussionSchema);

const replySchema = new mongoose.Schema({
  discussion_id: { type: mongoose.Schema.Types.ObjectId, ref: "Discussion", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: String,
  created_at: { type: Date, default: Date.now }
});

const Reply = mongoose.model("Reply", replySchema);

const attendanceSessionSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  date: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});
const AttendanceSession = mongoose.model("AttendanceSession", attendanceSessionSchema);

const attendanceRecordSchema = new mongoose.Schema({
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: "AttendanceSession", required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["present", "absent", "late", "excused"], default: "present" }
});
attendanceRecordSchema.index({ session_id: 1, student_id: 1 }, { unique: true });
const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceRecordSchema);

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: "General" },
  is_important: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});
const News = mongoose.model("News", newsSchema);

const webinarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, default: "Webinar" },
  speakers: String,
  created_at: { type: Date, default: Date.now }
});
const Webinar = mongoose.model("Webinar", webinarSchema);

const certificateSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  verification_code: { type: String, required: true, unique: true },
  issued_at: { type: Date, default: Date.now }
});
const Certificate = mongoose.model("Certificate", certificateSchema);

const announcementSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  content: String,
  created_at: { type: Date, default: Date.now }
});
const Announcement = mongoose.model("Announcement", announcementSchema);

const accreditationSchema = new mongoose.Schema({
  agency: { type: String, required: true },
  status: { type: String, enum: ["active", "review", "expired"], default: "active" },
  renewal_date: Date,
  created_at: { type: Date, default: Date.now }
});
const Accreditation = mongoose.model("Accreditation", accreditationSchema);

const newsletterSubSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now }
});
const NewsletterSub = mongoose.model("NewsletterSub", newsletterSubSchema);

const auditLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },
  details: mongoose.Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now }
});
const AuditLog = mongoose.model("AuditLog", auditLogSchema);

const systemSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
  description: String,
  updated_at: { type: Date, default: Date.now }
});
const SystemSetting = mongoose.model("SystemSetting", systemSettingSchema);

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: String,
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});
const Notification = mongoose.model("Notification", notificationSchema);

const resourceSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ["link", "file", "video"], default: "link" },
  created_at: { type: Date, default: Date.now }
});
const Resource = mongoose.model("Resource", resourceSchema);

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
app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, role, display_name } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role: role || "student",
      display_name: display_name || email.split("@")[0]
    });

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, display_name: user.display_name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid email or password." });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, display_name: user.display_name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Manage Users/Instructors
app.get("/admin/users", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/admin/users/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Course Status
app.patch("/admin/courses/:id/status", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const { status, published } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id, 
      { $set: { status, published, updated_at: Date.now() } }, 
      { new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profiles
app.get("/profiles/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/profiles/me", authenticate, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { $set: req.body, updated_at: Date.now() }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EMAIL (SENDGRID) ---
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_SENDER_EMAIL = process.env.SENDGRID_SENDER_EMAIL || "noreply@globaluniversityinstitute.com";

const sendEmail = async ({ to, subject, htmlContent }) => {
  if (!SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY is not set. Skipping email.");
    return;
  }
  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }]
        }],
        from: { email: SENDGRID_SENDER_EMAIL, name: "Global University Institute" },
        subject,
        content: [{
          type: "text/html",
          value: htmlContent
        }]
      })
    });
    return { success: response.ok };
  } catch (error) {
    console.error("SendGrid Email Error:", error);
    return { error: error.message };
  }
};

app.post("/notifications/send-email", async (req, res) => {
  const { to, subject, content } = req.body;
  const result = await sendEmail({ to, subject, htmlContent: `<html><body>${content}</body></html>` });
  res.json(result);
});

const lessonProgressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  completed: { type: Boolean, default: true },
  completed_at: { type: Date, default: Date.now }
});
lessonProgressSchema.index({ user_id: 1, lesson_id: 1 }, { unique: true });
const LessonProgress = mongoose.model("LessonProgress", lessonProgressSchema);

const quizSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  module_id: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
  title: { type: String, required: true },
  description: String,
  passing_score: { type: Number, default: 70 },
  time_limit_minutes: Number,
  quiz_type: { type: String, enum: ["quiz", "exam", "test"], default: "quiz" },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});
const Quiz = mongoose.model("Quiz", quizSchema);

const quizQuestionSchema = new mongoose.Schema({
  quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  question_text: { type: String, required: true },
  question_type: { type: String, enum: ["multiple_choice", "true_false", "short_answer"], default: "multiple_choice" },
  options: [String],
  correct_answer: { type: String, required: true },
  points: { type: Number, default: 10 },
  order: { type: Number, default: 0 }
});
const QuizQuestion = mongoose.model("QuizQuestion", quizQuestionSchema);

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

// --- DATA ROUTES ---

app.get("/courses/:id/learning-data", authenticate, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    // Check enrollment
    const enrollment = await Enrollment.findOne({ course_id: courseId, student_id: userId });
    if (!enrollment) return res.status(403).json({ error: "Not enrolled in this course" });

    const [course, modules, lessons, quizzes, assignments, progress, attempts, submissions] = await Promise.all([
      Course.findById(courseId).populate("author_id", "display_name avatar_url bio"),
      Module.find({ course_id: courseId }).sort("order"),
      Lesson.find({ course_id: courseId, published: true }).sort("order"),
      Quiz.find({ course_id: courseId, published: true }).sort("order"),
      Assignment.find({ course_id: courseId }).sort("created_at"),
      LessonProgress.find({ course_id: courseId, user_id: userId, completed: true }),
      QuizAttempt.find({ user_id: userId }),
      Submission.find({ student_id: userId })
    ]);

    res.json({
      course, modules, lessons, quizzes, assignments, progress, attempts, submissions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/lesson-progress", authenticate, async (req, res) => {
  try {
    const { lesson_id, course_id } = req.body;
    const progress = await LessonProgress.findOneAndUpdate(
      { user_id: req.user.id, lesson_id },
      { $set: { course_id, completed: true, completed_at: Date.now() } },
      { upsert: true, new: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/quizzes/:id/questions", authenticate, async (req, res) => {
  try {
    const questions = await QuizQuestion.find({ quiz_id: req.params.id }).sort("order");
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/quiz-attempts", authenticate, async (req, res) => {
  try {
    const attempt = new QuizAttempt({ ...req.body, user_id: req.user.id });
    await attempt.save();
    res.json(attempt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/certificates", authenticate, async (req, res) => {
  try {
    const { course_id } = req.body;
    const verification_code = `GUI-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const cert = new Certificate({
      user_id: req.user.id,
      course_id,
      verification_code
    });
    await cert.save();
    
    // Mark enrollment complete
    await Enrollment.findOneAndUpdate(
      { student_id: req.user.id, course_id },
      { $set: { status: "completed", completed_at: Date.now() } }
    );
    
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Announcements
app.get("/announcements", authenticate, async (req, res) => {
  try {
    const { course_id } = req.query;
    const query = course_id ? { course_id } : {};
    const announcements = await Announcement.find(query).sort("-created_at");
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/announcements", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accreditations
app.get("/accreditations", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const accrs = await Accreditation.find({}).sort("-created_at");
    res.json(accrs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/accreditations", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const accr = new Accreditation(req.body);
    await accr.save();
    res.json(accr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/accreditations/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    await Accreditation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Newsletter
app.post("/newsletter/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    const sub = new NewsletterSub({ email });
    await sub.save();
    res.json({ success: true });
  } catch (err) {
    if (err.code === 11000) return res.json({ success: true }); // Already subscribed
    res.status(500).json({ error: err.message });
  }
});

// Admin: Audit Logs
app.get("/admin/audit-logs", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const logs = await AuditLog.find({}).sort("-created_at").populate("user_id", "display_name email");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Settings
app.get("/admin/settings/:key", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const setting = await SystemSetting.findOne({ key: req.params.key });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/admin/settings", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const { key, value, description } = req.body;
    const setting = await SystemSetting.findOneAndUpdate(
      { key },
      { $set: { value, description, updated_at: Date.now() } },
      { upsert: true, new: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Quizzes
app.get("/quizzes", authenticate, async (req, res) => {
  try {
    const { course_id } = req.query;
    const query = course_id ? { course_id } : {};
    const quizzes = await Quiz.find(query).sort("-created_at");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/quizzes", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/quizzes/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    await QuizQuestion.deleteMany({ quiz_id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resources
app.get("/resources", authenticate, async (req, res) => {
  try {
    const { course_id } = req.query;
    const resources = await Resource.find({ course_id }).sort("-created_at");
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/resources", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? "connected" : "disconnected", ts: new Date().toISOString() });
});

// Metrics
app.get("/metrics/overview", authenticate, authorize(["admin"]), async (_req, res) => {
  try {
    const [users, courses, enrollments] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments()
    ]);
    res.json({ users, courses, enrollments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Courses
app.get("/courses", async (req, res) => {
  try {
    const { search, category, level } = req.query;
    let query = { published: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } }
      ];
    }
    if (category && category !== "All") query.category = category;
    if (level && level !== "All") query.level = level;

    const courses = await Course.find(query).populate("author_id", "display_name avatar_url");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("author_id", "display_name avatar_url bio");
    if (!course) return res.status(404).json({ error: "Course not found" });
    
    const modules = await Module.find({ course_id: course._id }).sort("order");
    const lessons = await Lesson.find({ course_id: course._id }).sort("order");
    
    res.json({ ...course.toObject(), modules, lessons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/courses", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const courseData = { ...req.body, author_id: req.user.id };
    const course = new Course(courseData);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/courses/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, author_id: req.user.id },
      { $set: req.body, updated_at: Date.now() },
      { new: true }
    );
    if (!course) return res.status(404).json({ error: "Course not found or unauthorized" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modules & Lessons
app.post("/modules", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const module = new Module(req.body);
    await module.save();
    res.json(module);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/lessons", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/lessons/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/lessons/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/modules/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(module);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/modules/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    await Lesson.deleteMany({ module_id: req.params.id });
    await Module.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enrollments
app.post("/enrollments", authenticate, async (req, res) => {
  try {
    const { course_id } = req.body;
    const existing = await Enrollment.findOne({ course_id, student_id: req.user.id });
    if (existing) return res.status(400).json({ error: "Already enrolled" });

    const enrollment = new Enrollment({ course_id, student_id: req.user.id });
    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/enrollments/me", authenticate, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student_id: req.user.id }).populate("course_id");
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assignments
app.get("/assignments", authenticate, async (req, res) => {
  try {
    const { course_id } = req.query;
    const query = course_id ? { course_id } : {};
    const assignments = await Assignment.find(query);
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/assignments", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submissions
app.get("/submissions", authenticate, async (req, res) => {
  try {
    const { assignment_id, student_id } = req.query;
    const query = {};
    if (assignment_id) query.assignment_id = assignment_id;
    if (student_id) query.student_id = student_id;
    
    const submissions = await Submission.find(query).populate("student_id", "display_name avatar_url");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/submissions", authenticate, async (req, res) => {
  try {
    const submission = new Submission({ ...req.body, student_id: req.user.id });
    await submission.save();
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/submissions/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body, graded_at: Date.now() } },
      { new: true }
    );
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Attendance
app.get("/attendance", authenticate, async (req, res) => {
  try {
    const { course_id } = req.query;
    const query = course_id ? { course_id } : {};
    const attendance = await Attendance.find(query).populate("student_id", "display_name");
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/attendance", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Discussions
app.get("/discussions", authenticate, async (req, res) => {
  try {
    const { course_id } = req.query;
    const query = course_id ? { course_id } : {};
    const discussions = await Discussion.find(query).populate("user_id", "display_name avatar_url");
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/discussions", authenticate, async (req, res) => {
  try {
    const discussion = new Discussion({ ...req.body, user_id: req.user.id });
    await discussion.save();
    res.json(discussion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/replies", authenticate, async (req, res) => {
  try {
    const { discussion_id } = req.query;
    const replies = await Reply.find({ discussion_id }).populate("user_id", "display_name avatar_url");
    res.json(replies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/replies", authenticate, async (req, res) => {
  try {
    const reply = new Reply({ ...req.body, user_id: req.user.id });
    await reply.save();
    res.json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Instructor-specific
app.get("/instructor/courses", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const courses = await Course.find({ author_id: req.user.id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/courses/:id/gradebook", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const courseId = req.params.id;
    const enrollments = await Enrollment.find({ course_id: courseId }).populate("student_id", "display_name avatar_url");
    const assignments = await Assignment.find({ course_id: courseId }).sort("created_at");
    const submissions = await Submission.find({ 
      assignment_id: { $in: await Assignment.find({ course_id: courseId }).distinct("_id") } 
    });
    res.json({ enrollments, assignments, submissions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Attendance Sessions
app.get("/attendance/sessions", authenticate, async (req, res) => {
  try {
    const { course_id } = req.query;
    const sessions = await AttendanceSession.find({ course_id }).sort("-date");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/attendance/sessions", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const session = new AttendanceSession(req.body);
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/attendance/records", authenticate, async (req, res) => {
  try {
    const { session_id } = req.query;
    const records = await AttendanceRecord.find({ session_id });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/attendance/records/upsert", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const { session_id, student_id, status } = req.body;
    const record = await AttendanceRecord.findOneAndUpdate(
      { session_id, student_id },
      { $set: { status } },
      { upsert: true, new: true }
    );
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/attendance/records/bulk-upsert", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const { updates } = req.body;
    const ops = updates.map(u => ({
      updateOne: {
        filter: { session_id: u.session_id, student_id: u.student_id },
        update: { $set: { status: u.status } },
        upsert: true
      }
    }));
    await AttendanceRecord.bulkWrite(ops);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// News
app.get("/news", async (req, res) => {
  try {
    const news = await News.find({}).sort("-created_at");
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webinars
app.get("/webinars", async (req, res) => {
  try {
    const webinars = await Webinar.find({}).sort("date");
    res.json(webinars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notifications
app.get("/notifications/me", authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id }).sort("-created_at");
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/notifications", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Certificates
app.get("/certificates/me", authenticate, async (req, res) => {
  try {
    const certs = await Certificate.find({ user_id: req.user.id }).populate("course_id", "title");
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/certificates/verify", async (req, res) => {
  try {
    const { code } = req.query;
    const cert = await Certificate.findOne({ verification_code: code })
      .populate("user_id", "display_name")
      .populate({
        path: "course_id",
        select: "title author_id",
        populate: { path: "author_id", select: "display_name" }
      });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Learnflow API listening on port ${PORT}`);
});
