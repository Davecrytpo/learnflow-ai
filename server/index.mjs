import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
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

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. API will run in degraded mode.");
}

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
  description: String,
  date: { type: String, required: true },
  type: { type: String, default: "Webinar" },
  speakers: String,
  is_recorded: { type: Boolean, default: false },
  recording_url: String,
  created_at: { type: Date, default: Date.now }
});
const Webinar = mongoose.model("Webinar", webinarSchema);

const webinarRegistrationSchema = new mongoose.Schema({
  webinar_id: { type: mongoose.Schema.Types.ObjectId, ref: "Webinar", required: true },
  email: { type: String, required: true },
  name: String,
  registered_at: { type: Date, default: Date.now }
});
webinarRegistrationSchema.index({ webinar_id: 1, email: 1 }, { unique: true });
const WebinarRegistration = mongoose.model("WebinarRegistration", webinarRegistrationSchema);

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
app.post("/auth/init-admin", async (req, res) => {
  try {
    const { email, password, key } = req.body;
    
    // Check if any admin exists
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      return res.status(403).json({ error: "System already initialized." });
    }

    // Optional: Use JWT_SECRET as a simple 'key' to prevent random access
    if (key !== JWT_SECRET) {
      return res.status(403).json({ error: "Invalid initialization key." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email: normalizeEmail(email),
      password: hashedPassword,
      role: "admin",
      display_name: "System Administrator",
      email_verified: true,
      status: "active"
    });

    await user.save();
    res.json({ success: true, message: "Admin account created successfully. You can now log in at /admin/login" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, role, display_name, department, specialization, bio } = req.body;
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ error: "User already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admissionNumber = role === "student" ? `GUI-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined;

    const user = new User({
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "student",
      display_name: display_name || normalizedEmail.split("@")[0],
      admission_number: admissionNumber,
      department,
      specialization,
      bio,
      email_verified: true, // Auto-verify for now as requested to ensure it works
    });

    await user.save();

    // Send welcome email
    await sendEmail({
      to: normalizedEmail,
      subject: `Welcome to Global University Institute`,
      htmlContent: wrapEmail(`
        <h2 style="margin:0 0 12px;">Welcome, ${user.display_name}!</h2>
        <p style="margin:0 0 16px; color:#475569;">Your account has been successfully created as a <strong>${user.role}</strong>.</p>
        ${admissionNumber ? `<p style="margin:0 0 16px; color:#475569;"><strong>Your Admission Number:</strong> ${admissionNumber}</p>` : ""}
        <p style="margin:0 0 16px; color:#475569;">You can now log in to your portal to complete your profile and explore our platform.</p>
      `)
    }).catch(err => console.error("Email error:", err));

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, display_name: user.display_name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ error: "Invalid email or password." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid email or password." });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    
    // Send login notification
    sendLoginEmail(user.email).catch(err => console.error("Login email error:", err));

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
      role: user.role,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      email_verified: user.email_verified
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/verify-email", async (req, res) => {
  try {
    const token = req.body.token || req.query.token;
    if (!token) return res.status(400).json({ error: "Verification token is required." });

    const tokenHash = hashToken(token);
    const user = await User.findOne({
      email_verification_token: tokenHash,
      email_verification_expires: { $gt: new Date() }
    });
    if (!user) return res.status(400).json({ error: "Invalid or expired verification link." });

    user.email_verified = true;
    user.email_verification_token = undefined;
    user.email_verification_expires = undefined;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/request-password-reset", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({ email });
    if (user) {
      const resetToken = generateToken();
      user.password_reset_token = hashToken(resetToken);
      user.password_reset_expires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
      await sendPasswordResetEmail(user.email, resetToken);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: "Token and password are required." });
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });

    const tokenHash = hashToken(token);
    const user = await User.findOne({
      password_reset_token: tokenHash,
      password_reset_expires: { $gt: new Date() }
    });
    if (!user) return res.status(400).json({ error: "Invalid or expired reset token." });

    user.password = await bcrypt.hash(password, 10);
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;
    await user.save();

    res.json({ success: true });
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

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

const sendEmail = async ({ to, subject, htmlContent }) => {
  if (!SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY is not set. Skipping email.");
    return { success: false, error: "SENDGRID_API_KEY is not set." };
  }

  const msg = {
    to,
    from: {
      email: SENDGRID_SENDER_EMAIL,
      name: "Global University Institute"
    },
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("SendGrid Email Error:");
    if (error.response) {
      console.error(error.response.body);
    } else {
      console.error(error);
    }
    return { success: false, error: error.message };
  }
};

// Test route for diagnostics
app.get("/auth/test-email", async (req, res) => {
  const testEmail = req.query.email || "test@example.com";
  const result = await sendEmail({
    to: testEmail,
    subject: "Diagnostic Test - Global University Institute",
    htmlContent: "<h1>Success</h1><p>Your institutional email system is configured correctly.</p>"
  });
  
  if (result.success) {
    res.json({ message: `Test email sent to ${testEmail}. Please check your inbox/spam.` });
  } else {
    res.status(500).json({ 
      error: "Email system failed.", 
      details: result.error,
      hint: "Ensure SENDGRID_SENDER_EMAIL is a 'Verified Sender' in your SendGrid dashboard."
    });
  }
});

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

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = buildAppUrl("/verify-email", token);
  return sendEmail({
    to: email,
    subject: "Verify your Global University Institute account",
    htmlContent: wrapEmail(`
      <h2 style="margin:0 0 12px;">Confirm your email</h2>
      <p style="margin:0 0 16px; color:#475569;">Thanks for registering. Please verify your email to activate your account.</p>
      <p style="margin:0 0 20px;">
        <a href="${verifyUrl}" style="display:inline-block; background:#2563eb; color:#fff; text-decoration:none; padding:12px 18px; border-radius:10px; font-weight:700;">
          Verify Email
        </a>
      </p>
      <p style="margin:0; color:#64748b; font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
    `)
  });
};

const sendLoginEmail = async (email) => {
  const timestamp = new Date().toLocaleString();
  const result = await sendEmail({
    to: email,
    subject: "New login to your Global University Institute account",
    htmlContent: wrapEmail(`
      <h2 style="margin:0 0 12px;">New login detected</h2>
      <p style="margin:0 0 12px; color:#475569;">We noticed a login to your account on ${timestamp}.</p>
      <p style="margin:0; color:#64748b; font-size:13px;">If this wasn't you, please reset your password immediately.</p>
    `)
  });
  if (!result?.success) {
    throw new Error("Login email failed to send.");
  }
  return result;
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = buildAppUrl("/reset-password", token);
  return sendEmail({
    to: email,
    subject: "Reset your Global University Institute password",
    htmlContent: wrapEmail(`
      <h2 style="margin:0 0 12px;">Password reset request</h2>
      <p style="margin:0 0 16px; color:#475569;">Click the button below to reset your password. This link expires in 1 hour.</p>
      <p style="margin:0 0 20px;">
        <a href="${resetUrl}" style="display:inline-block; background:#0f172a; color:#fff; text-decoration:none; padding:12px 18px; border-radius:10px; font-weight:700;">
          Reset Password
        </a>
      </p>
      <p style="margin:0; color:#64748b; font-size:13px;">If you didn't request a password reset, you can ignore this email.</p>
    `)
  });
};

const sendContactEmails = async ({ name, email, subject, message, context }) => {
  const admissionsEmail = "admissions@globaluniversityinstitute.com";
  const supportEmail = "support@globaluniversityinstitute.com";
  const to = context === "admissions" ? admissionsEmail : supportEmail;

  const primaryResult = await sendEmail({
    to,
    subject: `[${context === "admissions" ? "Admissions" : "Contact"}] ${subject || "New inquiry"}`,
    htmlContent: wrapEmail(`
      <h2 style="margin:0 0 12px;">New inquiry received</h2>
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${name || "N/A"}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
      <p style="margin:0 0 8px;"><strong>Subject:</strong> ${subject || "N/A"}</p>
      <p style="margin:16px 0 0; color:#475569;">${message || "No message provided."}</p>
    `)
  });

  let confirmResult = { success: true };
  if (email) {
    confirmResult = await sendEmail({
      to: email,
      subject: "We received your message",
      htmlContent: wrapEmail(`
        <h2 style="margin:0 0 12px;">Thanks for reaching out</h2>
        <p style="margin:0 0 12px; color:#475569;">Our team has received your message and will respond shortly.</p>
        <p style="margin:0; color:#64748b; font-size:13px;">Reference: ${subject || "General Inquiry"}</p>
      `)
    });
  }

  return { success: primaryResult?.success && confirmResult?.success };
};

const sendNewsletterConfirmation = async (email) => {
  return sendEmail({
    to: email,
    subject: "Subscription confirmed",
    htmlContent: wrapEmail(`
      <h2 style="margin:0 0 12px;">Welcome to the Institutional Gazette</h2>
      <p style="margin:0; color:#475569;">You're subscribed to weekly updates on research, programs, and campus news.</p>
    `)
  });
};

const sendWebinarRegistrationEmail = async ({ email, webinar }) => {
  if (!email || !webinar) return;
  const date = new Date(webinar.date);
  const dateStr = isNaN(date.getTime()) ? webinar.date : date.toLocaleString();
  const recordingLine = webinar.recording_url
    ? `<p style="margin:12px 0 0; color:#475569;">Recording link: <a href="${webinar.recording_url}">${webinar.recording_url}</a></p>`
    : "";

  return sendEmail({
    to: email,
    subject: `You're registered: ${webinar.title}`,
    htmlContent: wrapEmail(`
      <h2 style="margin:0 0 12px;">Webinar registration confirmed</h2>
      <p style="margin:0 0 8px; color:#475569;"><strong>Title:</strong> ${webinar.title}</p>
      <p style="margin:0 0 8px; color:#475569;"><strong>Date:</strong> ${dateStr}</p>
      <p style="margin:0 0 8px; color:#475569;"><strong>Type:</strong> ${webinar.type || "Webinar"}</p>
      ${recordingLine}
    `)
  });
};

app.post("/notifications/send-email", async (req, res) => {
  try {
    const { to, subject, content } = req.body;
    const result = await sendEmail({ to, subject, htmlContent: `<html><body>${content}</body></html>` });
    if (!result?.success) {
      return res.status(502).json({ error: "Email delivery failed." });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Email delivery failed." });
  }
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

// --- ADMISSIONS ROUTES ---
app.post("/admissions/apply", async (req, res) => {
  try {
    const { 
      email, password, first_name, last_name, phone, date_of_birth, 
      gender, address, city, state, country, zip_code, 
      program_of_interest, academic_level, previous_school, gpa, 
      test_scores, personal_statement 
    } = req.body;

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ error: "User with this email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admissionNumber = `GUI-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const user = new User({
      email: normalizedEmail,
      password: hashedPassword,
      display_name: `${first_name} ${last_name}`,
      role: "student",
      admission_number: admissionNumber,
      phone,
      city,
      state,
      country,
      date_of_birth,
      gender,
      address,
      zip_code,
      email_verified: false,
      status: "active"
    });

    await user.save();

    const application = new AdmissionApplication({
      user_id: user._id,
      first_name,
      last_name,
      email: normalizedEmail,
      phone,
      date_of_birth,
      gender,
      address,
      city,
      state,
      country,
      zip_code,
      program_of_interest,
      academic_level,
      previous_school,
      gpa,
      test_scores,
      personal_statement,
      status: "pending",
      admission_number_assigned: admissionNumber
    });

    await application.save();

    // Send confirmation emails
    await sendEmail({
      to: normalizedEmail,
      subject: "Application Received - Global University Institute",
      htmlContent: wrapEmail(`
        <h2 style="margin:0 0 12px;">Application Received</h2>
        <p style="margin:0 0 16px; color:#475569;">Dear ${first_name},</p>
        <p style="margin:0 0 16px; color:#475569;">Thank you for applying to Global University Institute. Your application for the <strong>${program_of_interest}</strong> (${academic_level}) program has been received and is currently under review.</p>
        <p style="margin:0 0 8px; color:#475569;"><strong>Your Admission Number:</strong> ${admissionNumber}</p>
        <p style="margin:0 0 16px; color:#475569;">You can use this number to track your application status. We will contact you once a decision has been made.</p>
        <p style="margin:0; color:#64748b; font-size:13px;">If you have any questions, please contact the admissions office.</p>
      `)
    });

    res.json({ success: true, admission_number: admissionNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- COURSES ROUTES ---
app.get("/courses", async (req, res) => {
  try {
    const { level, category, search } = req.query;
    let query = { published: true };
    
    if (level && level !== "All") query.level = level;
    if (category && category !== "All") query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const courses = await Course.find(query)
      .populate("author_id", "display_name")
      .sort("-created_at");
    
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("author_id", "display_name avatar_url bio");
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
    const email = normalizeEmail(req.body.email);
    if (!email) return res.status(400).json({ error: "Email is required." });

    const sub = new NewsletterSub({ email });
    await sub.save();
    const emailResult = await sendNewsletterConfirmation(email);
    if (!emailResult?.success) {
      return res.status(502).json({ error: "Subscription email could not be delivered." });
    }
    res.json({ success: true });
  } catch (err) {
    if (err.code === 11000) {
      const email = normalizeEmail(req.body.email);
      if (email) {
        const emailResult = await sendNewsletterConfirmation(email);
        if (!emailResult?.success) {
          return res.status(502).json({ error: "Subscription email could not be delivered." });
        }
      }
      return res.json({ success: true }); // Already subscribed
    }
    res.status(500).json({ error: err.message });
  }
});

// Contact / Admissions inquiries
app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message, context } = req.body;
    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required." });
    }
    const emailResult = await sendContactEmails({
      name,
      email: normalizeEmail(email),
      subject,
      message,
      context: context === "admissions" ? "admissions" : "general"
    });
    if (!emailResult?.success) {
      return res.status(502).json({ error: "Contact emails could not be delivered." });
    }
    res.json({ success: true });
  } catch (err) {
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
  res.json({ ok: true, service: "learnflow-api", ts: new Date().toISOString() });
});

app.get("/metrics/overview", async (_req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const [{ count: users }, { count: courses }, { count: enrollments }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("enrollments").select("*", { count: "exact", head: true }),
  ]);
  res.json({ users, courses, enrollments });
});

app.post("/career/mentorship/request", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({ student_id: z.string().uuid(), goals: z.string().min(5) });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("mentorship_requests").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/career/job-application", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    job_post_id: z.string().uuid(),
    student_id: z.string().uuid(),
    cover_letter: z.string().optional(),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("job_applications").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/courses/:id/contact-instructor", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required." });
    }

    const course = await Course.findById(req.params.id).populate("author_id", "display_name email");
    if (!course) return res.status(404).json({ error: "Course not found" });

    const instructorEmail = course.author_id?.email;
    if (!instructorEmail) return res.status(400).json({ error: "Instructor email not available." });

    await sendEmail({
      to: instructorEmail,
      subject: `Course inquiry: ${course.title}`,
      htmlContent: wrapEmail(`
        <h2 style="margin:0 0 12px;">New course inquiry</h2>
        <p style="margin:0 0 8px;"><strong>Course:</strong> ${course.title}</p>
        <p style="margin:0 0 8px;"><strong>From:</strong> ${name || "Prospective learner"} (${email})</p>
        <p style="margin:16px 0 0; color:#475569;">${message}</p>
      `)
    });

    await sendEmail({
      to: normalizeEmail(email),
      subject: `We sent your message to ${course.author_id?.display_name || "the instructor"}`,
      htmlContent: wrapEmail(`
        <h2 style="margin:0 0 12px;">Message delivered</h2>
        <p style="margin:0 0 8px; color:#475569;">Your inquiry about "${course.title}" has been forwarded.</p>
        <p style="margin:0; color:#64748b; font-size:13px;">We will contact you if any additional details are needed.</p>
      `)
    });

    res.json({ success: true });
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

app.post("/commerce/orders", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    student_id: z.string().uuid(),
    item_name: z.string().min(2),
    amount_cents: z.number().int().min(0),
    status: z.string().min(2).default("paid"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("purchases").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/accreditation/evidence", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    standard: z.string().min(2),
    artifact_title: z.string().min(2),
    owner_id: z.string().uuid().optional(),
    status: z.string().min(2).default("pending"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("accreditation_evidence").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/integrity/cases", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    course_id: z.string().uuid(),
    student_id: z.string().uuid(),
    issue: z.string().min(3),
    severity: z.string().min(3).default("medium"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("integrity_cases").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/marketplace/listings", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    name: z.string().min(2),
    provider: z.string().min(2),
    price_cents: z.number().int().min(0),
    status: z.string().min(2).default("active"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("marketplace_listings").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/marketplace/orders", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    listing_id: z.string().uuid(),
    buyer_name: z.string().min(2),
    amount_cents: z.number().int().min(0),
    status: z.string().min(2).default("paid"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("marketplace_orders").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/analytics/pipelines", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    pipeline_name: z.string().min(2),
    status: z.string().min(2).default("healthy"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("data_pipeline_runs").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/analytics/cohort-insights", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    cohort_name: z.string().min(2),
    completion_rate: z.number().min(0).max(100),
    retention_rate: z.number().min(0).max(100),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("cohort_insights").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/catalog/segments", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    name: z.string().min(2),
    rules: z.string().min(2),
    status: z.string().min(2).default("active"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("catalog_segments").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/campuses", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    name: z.string().min(2),
    status: z.string().min(2).default("active"),
    cohorts: z.number().int().min(0).default(0),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("campuses").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/admin/support-tickets", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    subject: z.string().min(2),
    priority: z.string().min(2).default("medium"),
    status: z.string().min(2).default("open"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("support_tickets").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/admin/sso-providers", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    name: z.string().min(2),
    method: z.string().min(2).default("saml"),
    status: z.string().min(2).default("connected"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("sso_providers").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/admin/directory-connectors", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    name: z.string().min(2),
    status: z.string().min(2).default("active"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("directory_connectors").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/admin/brand-themes", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    name: z.string().min(2),
    status: z.string().min(2).default("draft"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("brand_themes").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/enrollments/bulk", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    course_id: z.string().uuid(),
    student_ids: z.array(z.string().uuid()).min(1),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const payload = parse.data.student_ids.map((student_id) => ({
    course_id: parse.data.course_id,
    student_id,
  }));
  const { data, error } = await supabase.from("enrollments").insert(payload).select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json({ inserted: data?.length || 0 });
});

app.post("/users/roles/assign", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    user_id: z.string().uuid(),
    role: z.enum(["student", "instructor", "admin"]),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("user_roles").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/courses/publish", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({ course_id: z.string().uuid(), published: z.boolean() });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("courses").update({ published: parse.data.published }).eq("id", parse.data.course_id).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/reports/schedule", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    report_name: z.string().min(2),
    cadence: z.string().min(2),
    status: z.string().min(2).default("active"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("report_schedules").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/exports/schedule", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    export_name: z.string().min(2),
    cadence: z.string().min(2),
    status: z.string().min(2).default("active"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("export_schedules").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/audit/logs", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    actor_id: z.string().uuid(),
    action: z.string().min(2),
    entity: z.string().min(2),
    metadata: z.record(z.any()).optional(),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("audit_logs").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/automation/rules", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    name: z.string().min(2),
    trigger: z.string().min(2),
    action: z.string().min(2),
    status: z.string().min(2).default("active"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("automation_rules").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/webhooks", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    name: z.string().min(2),
    endpoint: z.string().url(),
    events: z.array(z.string()).default([]),
    status: z.string().min(2).default("active"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("webhook_configs").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/notifications/queue", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    user_id: z.string().uuid(),
    title: z.string().min(2),
    message: z.string().min(2),
    channel: z.string().min(2).default("in_app"),
    status: z.string().min(2).default("queued"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("notification_queue").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/jobs/scheduled", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    job_name: z.string().min(2),
    cadence: z.string().min(2),
    status: z.string().min(2).default("active"),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("scheduled_jobs").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
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

app.post("/webinars/:id/register", async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) return res.status(404).json({ error: "Webinar not found." });

    const registration = new WebinarRegistration({
      webinar_id: webinar._id,
      email: normalizeEmail(email),
      name
    });
    await registration.save();

    const emailResult = await sendWebinarRegistrationEmail({ email: normalizeEmail(email), webinar });
    if (!emailResult?.success) {
      return res.status(502).json({ error: "Registration email could not be delivered." });
    }
    res.json({ success: true });
  } catch (err) {
    if (err.code === 11000) {
      const webinar = await Webinar.findById(req.params.id);
      const emailResult = await sendWebinarRegistrationEmail({ email: normalizeEmail(req.body.email), webinar });
      if (!emailResult?.success) {
        return res.status(502).json({ error: "Registration email could not be delivered." });
      }
      return res.json({ success: true });
    }
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

// --- STATIC FILES ---
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

const port = process.env.API_PORT || 8787;

// Fallback for SPA routing: serve index.html for all non-API routes
app.get("*", (req, res) => {
  if (req.path.startsWith("/auth/") || req.path.startsWith("/admin/") || req.path.startsWith("/courses/") || req.path.startsWith("/notifications/") || req.path.startsWith("/attendance/")) {
    return; // Let other routes handle it
  }
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Learnflow API listening on port ${port}`);
});
