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
const ADMIN_BOOTSTRAP_EMAIL = "globaluniversityinstitutes@gmail.com";

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

const quizSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  module_id: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
  title: { type: String, required: true },
  description: String,
  quiz_type: { type: String, enum: ["practice", "quiz", "test", "exam"], default: "quiz" },
  time_limit_minutes: { type: Number, default: 30 },
  passing_score: { type: Number, default: 70 },
  max_attempts: { type: Number, default: 3 },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const Quiz = mongoose.model("Quiz", quizSchema);

const quizQuestionSchema = new mongoose.Schema({
  quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  question_text: { type: String, required: true },
  question_type: { type: String, enum: ["multiple_choice", "true_false", "short_answer"], default: "multiple_choice" },
  options: [String],
  correct_answer: String,
  points: { type: Number, default: 1 },
  order: { type: Number, default: 0 }
});
const QuizQuestion = mongoose.model("QuizQuestion", quizQuestionSchema);

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

const discussionSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const Discussion = mongoose.model("Discussion", discussionSchema);

const discussionReplySchema = new mongoose.Schema({
  discussion_id: { type: mongoose.Schema.Types.ObjectId, ref: "Discussion", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const DiscussionReply = mongoose.model("DiscussionReply", discussionReplySchema);

const dynamicRecordSchema = new mongoose.Schema(
  {
    table: { type: String, required: true, index: true }
  },
  {
    strict: false
  }
);
dynamicRecordSchema.add({
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const DynamicRecord = mongoose.model("DynamicRecord", dynamicRecordSchema);

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
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const createUniqueSlug = async (title, excludeCourseId = null) => {
  const baseSlug = slugify(title) || "course";
  let slug = baseSlug;
  let counter = 1;
  while (await Course.exists({
    slug,
    ...(excludeCourseId ? { _id: { $ne: excludeCourseId } } : {})
  })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
  return slug;
};
const serializeDoc = (doc) => {
  if (!doc) return null;
  const plain = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    ...plain,
    id: plain._id?.toString?.() || plain.id
  };
};
const serializeCollection = (docs = []) => docs.map((doc) => serializeDoc(doc));
const toObjectIdIfValid = (value) => (isValidObjectId(value) ? new mongoose.Types.ObjectId(value) : value);
const dynamicTables = new Set([
  "accreditations",
  "ai_governance_logs",
  "audit_logs",
  "attendance_records",
  "attendance_sessions",
  "billing_invoices",
  "compliance_records",
  "course_groups",
  "course_resources",
  "data_exports",
  "data_pipelines",
  "directory_syncs",
  "group_members",
  "marketplace_orders",
  "newsletter_subs",
  "permissions_roles",
  "plagiarism_cases",
  "proctoring_sessions",
  "sso_providers",
  "support_tickets",
  "tenants",
  "webhook_configs",
  "news",
  "webinars"
]);

const getTableModel = (table) => {
  switch (table) {
    case "courses":
      return { type: "model", model: Course };
    case "modules":
      return { type: "model", model: Module };
    case "lessons":
      return { type: "model", model: Lesson };
    case "enrollments":
      return { type: "model", model: Enrollment };
    case "assignments":
      return { type: "model", model: Assignment };
    case "submissions":
      return { type: "model", model: Submission };
    case "quizzes":
      return { type: "model", model: Quiz };
    case "quiz_questions":
      return { type: "model", model: QuizQuestion };
    case "quiz_attempts":
      return { type: "model", model: QuizAttempt };
    case "certificates":
      return { type: "model", model: Certificate };
    case "announcements":
      return { type: "model", model: Announcement };
    case "lesson_progress":
      return { type: "model", model: LessonProgress };
    case "notifications":
      return { type: "model", model: Notification };
    case "discussions":
      return { type: "model", model: Discussion };
    case "discussion_replies":
      return { type: "model", model: DiscussionReply };
    case "profiles":
      return { type: "profile", model: User };
    default:
      return { type: "dynamic", model: DynamicRecord, table };
  }
};

const buildMongoMatch = (table, filters = []) => {
  const match = {};
  if (table && dynamicTables.has(table)) {
    match.table = table;
  }

  for (const filter of filters) {
    const field = filter.column === "id" ? "_id" : filter.column;
    const value = Array.isArray(filter.value)
      ? filter.value.map((item) => toObjectIdIfValid(item))
      : toObjectIdIfValid(filter.value);

    if (filter.type === "eq") {
      match[field] = value;
    }
    if (filter.type === "neq") {
      match[field] = { ...(match[field] || {}), $ne: value };
    }
    if (filter.type === "in") {
      match[field] = { $in: value };
    }
    if (filter.type === "ilike") {
      const pattern = String(filter.value || "").replace(/%/g, ".*");
      match[field] = { $regex: pattern, $options: "i" };
    }
  }

  return match;
};

const applyPopulate = (table, query) => {
  switch (table) {
    case "courses":
      return query.populate("author_id", "display_name avatar_url bio department email");
    case "enrollments":
      return query
        .populate("student_id", "display_name avatar_url email")
        .populate("course_id", "title cover_image_url category");
    case "assignments":
      return query.populate("course_id", "title");
    case "submissions":
      return query
        .populate("assignment_id", "title max_score course_id")
        .populate("student_id", "display_name avatar_url email");
    case "quizzes":
      return query.populate("course_id", "title");
    case "quiz_attempts":
      return query
        .populate({ path: "quiz_id", populate: { path: "course_id", select: "title" } })
        .populate("user_id", "display_name avatar_url email");
    case "certificates":
      return query.populate("course_id", "title");
    case "announcements":
      return query.populate("course_id", "title");
    case "discussions":
    case "discussion_replies":
      return query.populate("user_id", "display_name avatar_url");
    default:
      return query;
  }
};

const normalizeRecord = (table, input) => {
  const item = serializeDoc(input);
  if (!item) return item;

  if (item._id && !item.id) {
    item.id = item._id.toString();
  }

  if (table === "profiles") {
    return {
      ...item,
      id: item.id || item._id?.toString?.(),
      user_id: item.id || item._id?.toString?.()
    };
  }

  if (table === "courses" && item.author_id && typeof item.author_id === "object") {
    item.profiles = {
      display_name: item.author_id.display_name || null,
      avatar_url: item.author_id.avatar_url || null,
      bio: item.author_id.bio || null,
      department: item.author_id.department || null
    };
    item.author_id = item.author_id.id || item.author_id._id?.toString?.() || item.author_id;
  }

  if (table === "enrollments") {
    if (item.student_id && typeof item.student_id === "object") {
      item.profiles = {
        display_name: item.student_id.display_name || null,
        avatar_url: item.student_id.avatar_url || null
      };
      item.student_id = item.student_id.id || item.student_id._id?.toString?.() || item.student_id;
    }
    if (item.course_id && typeof item.course_id === "object") {
      item.courses = {
        title: item.course_id.title || null
      };
      item.course_id = item.course_id.id || item.course_id._id?.toString?.() || item.course_id;
    }
  }

  if (table === "assignments" && item.course_id && typeof item.course_id === "object") {
    item.courses = { title: item.course_id.title || null };
    item.course_id = item.course_id.id || item.course_id._id?.toString?.() || item.course_id;
  }

  if (table === "quizzes" && item.course_id && typeof item.course_id === "object") {
    item.courses = { title: item.course_id.title || null };
    item.course_id = item.course_id.id || item.course_id._id?.toString?.() || item.course_id;
  }

  if (table === "submissions") {
    if (item.assignment_id && typeof item.assignment_id === "object") {
      item.assignment = {
        title: item.assignment_id.title || null,
        max_score: item.assignment_id.max_score || null,
        course_id: item.assignment_id.course_id || null
      };
      item.assignment_id = item.assignment_id.id || item.assignment_id._id?.toString?.() || item.assignment_id;
    }
    if (item.student_id && typeof item.student_id === "object") {
      item.profiles = {
        display_name: item.student_id.display_name || null,
        avatar_url: item.student_id.avatar_url || null
      };
      item.student_id = item.student_id.id || item.student_id._id?.toString?.() || item.student_id;
    }
  }

  if (table === "quiz_attempts") {
    if (item.quiz_id && typeof item.quiz_id === "object") {
      item.quiz = {
        title: item.quiz_id.title || null,
        course_id: item.quiz_id.course_id || null
      };
      item.quiz_id = item.quiz_id.id || item.quiz_id._id?.toString?.() || item.quiz_id;
    }
    if (item.user_id && typeof item.user_id === "object") {
      item.profiles = {
        display_name: item.user_id.display_name || null,
        avatar_url: item.user_id.avatar_url || null
      };
      item.user_id = item.user_id.id || item.user_id._id?.toString?.() || item.user_id;
    }
  }

  if (table === "certificates" && item.course_id && typeof item.course_id === "object") {
    item.courses = { title: item.course_id.title || null };
    item.course_id = item.course_id.id || item.course_id._id?.toString?.() || item.course_id;
  }

  if ((table === "discussions" || table === "discussion_replies") && item.user_id && typeof item.user_id === "object") {
    item.profiles = {
      display_name: item.user_id.display_name || null,
      avatar_url: item.user_id.avatar_url || null
    };
    item.user_id = item.user_id.id || item.user_id._id?.toString?.() || item.user_id;
  }

  return item;
};

const normalizeRecords = (table, docs = []) => docs.map((doc) => normalizeRecord(table, doc));
const ensureInstructorCourse = async (courseId, user) => {
  if (!isValidObjectId(courseId)) return null;
  const query = { _id: courseId };
  if (user.role !== "admin") {
    query.author_id = user.id;
  }
  return Course.findOne(query);
};

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

const buildCourseDraft = (topic) => {
  const normalizedTopic = topic.trim() || "General Studies";
  const categoryHints = [
    { match: /data|code|software|web|ai|cyber|cloud|computer/i, category: "Technology" },
    { match: /math|statistics|calculus|algebra/i, category: "Mathematics" },
    { match: /biology|chemistry|physics|science/i, category: "Science" },
    { match: /business|finance|management|marketing/i, category: "Business" },
    { match: /health|medical|nursing/i, category: "Health" },
    { match: /engineering|mechanical|electrical|civil/i, category: "Engineering" },
    { match: /history|language|philosophy|literature/i, category: "Humanities" }
  ];
  const category = categoryHints.find((hint) => hint.match.test(normalizedTopic))?.category || "General";
  
  const modules = Array.from({ length: 6 }, (_, i) => ({
    title: `Module ${i + 1}: ${normalizedTopic} ${i === 0 ? "Foundations" : i === 5 ? "Capstone Strategy" : "Applied Practice"}`,
    lessons: Array.from({ length: 4 }, (_, j) => {
      const lessonTitle = `Lesson ${j + 1}: ${normalizedTopic} Segment ${i + 1}.${j + 1}`;
      const type = j === 3 ? (i % 2 === 0 ? "assignment" : "quiz") : "content";
      return {
        title: lessonTitle,
        type,
        content: type === "content" ? buildLessonContent(normalizedTopic, lessonTitle) : "",
        video_url: type === "content" ? "https://www.youtube.com/watch?v=ysz5S6PUM-U" : "",
        image_url: type === "content"
          ? `https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80&topic=${encodeURIComponent(normalizedTopic)}`
          : "",
        reading_materials: type === "content"
          ? [
              `${normalizedTopic} lecture guide`,
              `${normalizedTopic} worked example`,
              `${normalizedTopic} reflection prompt`
            ]
          : []
      };
    })
  }));

  return {
    title: `Advanced ${normalizedTopic} and Professional Application`,
    summary: `A comprehensive academic curriculum focused on mastering ${normalizedTopic} through rigorous research and applied methodologies.`,
    description: `
      <h2>Institutional Course Narrative</h2>
      <p>This course provides a deep, multi-dimensional exploration of <strong>${normalizedTopic}</strong>. Designed for scholars seeking to bridge the gap between theoretical frameworks and global industry applications, this curriculum covers eight distinct modules of study.</p>
      
      <h3>Scholarly Learning Outcomes</h3>
      <ul>
        <li>Synthesize complex principles of ${normalizedTopic} into actionable professional strategies.</li>
        <li>Execute advanced analytical methodologies to solve real-world pedagogical and technical challenges.</li>
        <li>Demonstrate institutional mastery through a culminating capstone project and rigorous proctored evaluations.</li>
        <li>Critically evaluate ethical considerations and global impacts within the field of ${normalizedTopic}.</li>
      </ul>

      <h3>Academic Rigor and Accreditation</h3>
      <p>The curriculum is structured to meet international accreditation standards, requiring approximately 150 hours of total study time over a 12-15 week semester. Students will engage with interactive lectures, case-based assignments, and collaborative discourse modules.</p>
      
      <h3>Prerequisite Knowledge</h3>
      <p>A foundational understanding of general academic principles and an introductory awareness of ${normalizedTopic} is recommended for optimal performance.</p>
    `.trim(),
    category,
    level: "Undergraduate",
    credits: 4,
    duration: "15 Weeks",
    image_search_term: normalizedTopic,
    syllabus: modules
  };
};

const buildCurriculumOutline = (courseTitle) => ({
  modules: [
    {
      title: `Foundations of ${courseTitle}`,
      lessons: [
        { title: "Orientation and learning goals", type: "content", content: buildLessonContent(courseTitle, "Orientation and learning goals") },
        { title: `Core principles of ${courseTitle}`, type: "content", content: buildLessonContent(courseTitle, `Core principles of ${courseTitle}`) },
        { title: "Key terminology and frameworks", type: "quiz" }
      ]
    },
    {
      title: `${courseTitle} in practice`,
      lessons: [
        { title: "Applied workflows and use cases", type: "content", content: buildLessonContent(courseTitle, "Applied workflows and use cases") },
        { title: "Case study review", type: "assignment" },
        { title: "Hands-on exercise", type: "content", content: buildLessonContent(courseTitle, "Hands-on exercise") }
      ]
    },
    {
      title: `Advanced ${courseTitle}`,
      lessons: [
        { title: "Evaluation and quality standards", type: "content", content: buildLessonContent(courseTitle, "Evaluation and quality standards") },
        { title: "Common risks and mitigation", type: "test" },
        { title: "Final project preparation", type: "content", content: buildLessonContent(courseTitle, "Final project preparation") }
      ]
    }
  ]
});

const buildLessonContent = (courseTitle, lessonTitle) => `
  <h2>${lessonTitle}</h2>
  <p>This lesson is part of <strong>${courseTitle}</strong> and is designed to move students from concept recognition to practical application.</p>
  <h3>Lesson Goals</h3>
  <ul>
    <li>Introduce the main concept in clear academic language.</li>
    <li>Connect theory to realistic examples.</li>
    <li>Prepare students for discussion, assessment, or project work.</li>
  </ul>
  <h3>Instruction</h3>
  <p>Start with a concise explanation of the topic, then demonstrate how it appears in real instructional or professional settings.</p>
  <p>Use one worked example, one reflective prompt, and one short activity to reinforce mastery.</p>
  <h3>Worked Example</h3>
  <p>Model how an instructor or practitioner would apply ${lessonTitle} by identifying the context, evaluating evidence, and selecting an appropriate response.</p>
  <h3>Practice Task</h3>
  <ol>
    <li>Summarize the idea in one paragraph.</li>
    <li>Compare one strong application and one weak application of the concept.</li>
    <li>Write a short reflection on how this lesson connects to the wider course.</li>
  </ol>
  <h3>Suggested Media</h3>
  <p>Pair this lesson with one explainer video, one visual diagram, and one short reading excerpt to support multimodal learning.</p>
  <h3>Check for Understanding</h3>
  <p>Ask students to summarize the concept, identify one challenge, and propose a practical response.</p>
`.trim();

const buildQuiz = (lessonTitle, difficulty = "medium") => {
  const difficultyLabel = difficulty.toLowerCase();
  const points = difficultyLabel === "hard" ? 3 : difficultyLabel === "easy" ? 1 : 2;
  return {
    title: `${lessonTitle} Knowledge Check`,
    description: `A ${difficultyLabel} quiz covering the main ideas from ${lessonTitle}.`,
    quiz_type: "quiz",
    time_limit_minutes: difficultyLabel === "hard" ? 20 : 10,
    passing_score: 70,
    max_attempts: 3,
    questions: [
      {
        question_text: `Which statement best captures the main purpose of ${lessonTitle}?`,
        question_type: "multiple_choice",
        options: [
          "To memorize isolated facts without context",
          "To understand concepts and apply them in practice",
          "To replace all course assessments",
          "To focus only on historical background"
        ],
        correct_answer: "To understand concepts and apply them in practice",
        points,
        order: 0
      },
      {
        question_text: `${lessonTitle} should connect theory to real-world application.`,
        question_type: "true_false",
        options: ["True", "False"],
        correct_answer: "True",
        points,
        order: 1
      },
      {
        question_text: `Name one practical outcome students should gain from ${lessonTitle}.`,
        question_type: "short_answer",
        correct_answer: "practical application",
        points,
        order: 2
      }
    ]
  };
};

const buildAssessment = (topic, type = "quiz") => {
  const normalizedTopic = topic?.trim() || "Course Topic";
  const assessmentType = String(type || "quiz").toLowerCase();

  if (assessmentType === "assignment") {
    return {
      title: `${normalizedTopic} Applied Assignment`,
      description: `A practical assignment that asks students to apply the core concepts from ${normalizedTopic}.`,
      due_in_days: 7,
      max_score: 100,
      prompts: [
        {
          question: `Explain the central principles of ${normalizedTopic}.`,
          expected_answer: `A strong answer defines the concept clearly, identifies its key components, and explains why those components matter in practice.`
        },
        {
          question: `Analyze a realistic case where ${normalizedTopic} should be applied.`,
          expected_answer: `A strong answer evaluates the context, identifies constraints, compares options, and justifies the chosen approach.`
        },
        {
          question: `Recommend one improvement strategy for implementing ${normalizedTopic}.`,
          expected_answer: `A strong answer proposes a concrete improvement plan, includes measurable steps, and addresses quality or ethical considerations.`
        }
      ],
      rubric: [
        "Concept accuracy and depth",
        "Use of evidence or examples",
        "Clarity, structure, and professional presentation"
      ]
    };
  }

  if (assessmentType === "test") {
    return {
      ...buildQuiz(`${normalizedTopic} Summative Test`, "hard"),
      quiz_type: "test",
      time_limit_minutes: 30,
      max_attempts: 1
    };
  }

  return buildQuiz(normalizedTopic, "medium");
};

const buildPerformanceAnalysis = (studentData) => {
  const courses = Number(studentData?.courses || 0);
  const students = Number(studentData?.students || 0);
  const submissions = Number(studentData?.submissions || 0);
  const attendance = Number(studentData?.attendance || 0);
  const attendanceRate = students > 0 ? Math.min(100, Math.round((attendance / students) * 100)) : 0;

  return `
    <h3>Faculty Performance Snapshot</h3>
    <p>You currently manage <strong>${courses}</strong> courses serving <strong>${students}</strong> enrolled students.</p>
    <ul>
      <li><strong>Submission volume:</strong> ${submissions} recorded submissions.</li>
      <li><strong>Attendance signal:</strong> ${attendanceRate}% attendance coverage based on current records.</li>
      <li><strong>Priority:</strong> Review courses with low participation and add one formative checkpoint per module.</li>
    </ul>
    <p>Recommended next step: publish at least one assignment or quiz in every active course so engagement can be measured consistently.</p>
  `.trim();
};

const buildInstitutionalReport = (systemData) => `
  <h3>Institutional Executive Summary</h3>
  <p>The platform currently reports <strong>${Number(systemData?.users || 0)}</strong> active students, <strong>${Number(systemData?.courses || 0)}</strong> courses, and <strong>${Number(systemData?.activeInstructors || 0)}</strong> active instructors.</p>
  <ul>
    <li><strong>Pipeline pressure:</strong> ${Number(systemData?.pendingCourses || 0)} courses are waiting for approval.</li>
    <li><strong>Enrollment operations:</strong> ${Number(systemData?.pendingEnr || 0)} enrollments are pending verification.</li>
    <li><strong>Governance focus:</strong> accelerate approvals and expand instructor onboarding to reduce queue time.</li>
  </ul>
  <p>Recommended next step: clear approval bottlenecks first, then measure student-to-course ratios for staffing decisions.</p>
`.trim();

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

const attachOptionalUser = (req, _res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch {
    req.user = null;
  }
  next();
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
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) return res.status(403).json({ error: "System already initialized." });
    if (normalizedEmail !== ADMIN_BOOTSTRAP_EMAIL) {
      return res.status(403).json({ error: "Only the authorized institutional admin email can be initialized." });
    }

    const user = new User({
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      role: "admin",
      display_name: "Institutional Administrator",
      email_verified: true,
      status: "active"
    });
    await user.save();
    await sendEmail({
      to: normalizedEmail,
      subject: "Admin Account Created",
      htmlContent: wrapEmail(`<h2>Admin Access Ready</h2><p>Your administrative account for Global University Institute has been created successfully.</p><p>You can now sign in at <a href="${frontendUrl.replace(/\/$/, "")}/admin/login">Admin Login</a>.</p>`)
    });
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
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    if (user.role === "admin" && normalizedEmail !== ADMIN_BOOTSTRAP_EMAIL) {
      return res.status(403).json({ error: "This account is not authorized for admin access." });
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
app.get("/instructor/submissions/pending", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const courses = await Course.find(req.user.role === "admin" ? {} : { author_id: req.user.id }).select("_id");
    const cIds = courses.map(c => c._id);
    const assignments = await Assignment.find({ course_id: { $in: cIds } }).select("_id");
    const aIds = assignments.map(a => a._id);
    
    const submissions = await Submission.find({ 
      assignment_id: { $in: aIds },
      score: { $exists: false } 
    })
    .populate("assignment_id", "title max_score")
    .populate("student_id", "display_name email")
    .sort({ submitted_at: 1 });
    
    res.json(serializeCollection(submissions));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/instructor/submissions/:id/grade", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { 
        score: req.body.score,
        feedback: req.body.feedback,
        graded_at: new Date()
      },
      { new: true }
    );
    res.json(serializeDoc(submission));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
    res.json(serializeCollection(courses));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/instructor/courses", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const {
      title,
      description,
      summary,
      category,
      level,
      credits,
      duration,
      cover_image_url
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: "Course title is required." });
    }

    const slug = await createUniqueSlug(title);
    const course = await Course.create({
      title: title.trim(),
      slug,
      description: description || "",
      summary: summary || "",
      category: category || "",
      level: level || "Undergraduate",
      credits: Number(credits) || 3,
      duration: duration || "12 Weeks",
      cover_image_url: cover_image_url || "",
      author_id: req.user.id,
      published: false,
      status: "pending",
      updated_at: new Date()
    });

    res.status(201).json(serializeDoc(course));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/instructor/courses/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const course = await ensureInstructorCourse(req.params.id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });

    const modules = await Module.find({ course_id: course._id }).sort({ order: 1, created_at: 1 });
    const lessons = await Lesson.find({ course_id: course._id }).sort({ order: 1, created_at: 1 });

    const sectionMap = new Map(
      modules.map((module) => [
        module._id.toString(),
        {
          ...serializeDoc(module),
          lessons: []
        }
      ])
    );

    for (const lesson of lessons) {
      const section = sectionMap.get(lesson.module_id.toString());
      if (section) {
        section.lessons.push(serializeDoc(lesson));
      }
    }

    res.json({
      course: serializeDoc(course),
      sections: Array.from(sectionMap.values())
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/instructor/courses/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const course = await ensureInstructorCourse(req.params.id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });

    const allowedFields = ["title", "description", "summary", "category", "level", "credits", "duration", "cover_image_url", "published", "status"];
    for (const field of allowedFields) {
      if (field in req.body) {
        course[field] = req.body[field];
      }
    }
    if ("title" in req.body && req.body.title?.trim()) {
      course.slug = await createUniqueSlug(req.body.title, course._id);
    }
    course.updated_at = new Date();
    await course.save();

    res.json(serializeDoc(course));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/instructor/courses/:id/modules", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const course = await ensureInstructorCourse(req.params.id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });

    const moduleCount = await Module.countDocuments({ course_id: course._id });
    const module = await Module.create({
      course_id: course._id,
      title: req.body.title?.trim() || `Module ${moduleCount + 1}`,
      order: Number.isFinite(Number(req.body.order)) ? Number(req.body.order) : moduleCount,
      updated_at: new Date()
    });

    res.status(201).json(serializeDoc(module));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/instructor/modules/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(404).json({ error: "Module not found." });
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ error: "Module not found." });

    const course = await ensureInstructorCourse(module.course_id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });

    const lessons = await Lesson.find({ module_id: module._id }).select("_id");
    const lessonIds = lessons.map((lesson) => lesson._id);

    await Promise.all([
      Lesson.deleteMany({ module_id: module._id }),
      Assignment.deleteMany({ course_id: course._id, lesson_id: { $in: lessonIds } }).catch(() => undefined),
      Quiz.deleteMany({ module_id: module._id }),
      Module.deleteOne({ _id: module._id })
    ]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/instructor/modules/:id/lessons", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(404).json({ error: "Module not found." });
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ error: "Module not found." });

    const course = await ensureInstructorCourse(module.course_id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });

    const lessonCount = await Lesson.countDocuments({ module_id: module._id });
    const lesson = await Lesson.create({
      course_id: course._id,
      module_id: module._id,
      title: req.body.title?.trim() || `Lesson ${lessonCount + 1}`,
      content: req.body.content || "",
      video_url: req.body.video_url || "",
      duration_seconds: Number(req.body.duration_seconds) || undefined,
      order: Number.isFinite(Number(req.body.order)) ? Number(req.body.order) : lessonCount,
      published: "published" in req.body ? Boolean(req.body.published) : true,
      updated_at: new Date()
    });

    res.status(201).json(serializeDoc(lesson));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/instructor/lessons/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(404).json({ error: "Lesson not found." });
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found." });

    const course = await ensureInstructorCourse(lesson.course_id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });

    const allowedFields = ["title", "content", "video_url", "duration_seconds", "order", "published"];
    for (const field of allowedFields) {
      if (field in req.body) {
        lesson[field] = req.body[field];
      }
    }
    lesson.updated_at = new Date();
    await lesson.save();

    res.json(serializeDoc(lesson));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/instructor/lessons/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(404).json({ error: "Lesson not found." });
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found." });

    const course = await ensureInstructorCourse(lesson.course_id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });

    await Lesson.deleteOne({ _id: lesson._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/instructor/assignments", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const courses = await Course.find(req.user.role === "admin" ? {} : { author_id: req.user.id }).select("_id title");
    const courseIds = courses.map((course) => course._id);
    const courseMap = new Map(courses.map((course) => [course._id.toString(), course.title]));
    const assignments = await Assignment.find({ course_id: { $in: courseIds } }).sort({ created_at: -1 });
    res.json(assignments.map((assignment) => ({
      ...serializeDoc(assignment),
      courses: { title: courseMap.get(assignment.course_id.toString()) || "Untitled Course" }
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/instructor/assignments", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const course = await ensureInstructorCourse(req.body.course_id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });
    if (!req.body.title?.trim()) return res.status(400).json({ error: "Assignment title is required." });

    const assignment = await Assignment.create({
      course_id: course._id,
      title: req.body.title.trim(),
      description: req.body.description || "",
      due_date: req.body.due_date || null,
      max_score: Number(req.body.max_score) || 100
    });

    res.status(201).json({
      ...serializeDoc(assignment),
      courses: { title: course.title }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/instructor/assignments/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(404).json({ error: "Assignment not found." });
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: "Assignment not found." });

    const course = await ensureInstructorCourse(assignment.course_id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });

    await Submission.deleteMany({ assignment_id: assignment._id });
    await Assignment.deleteOne({ _id: assignment._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/instructor/quizzes", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const courses = await Course.find(req.user.role === "admin" ? {} : { author_id: req.user.id }).select("_id title");
    const courseIds = courses.map((course) => course._id);
    const courseMap = new Map(courses.map((course) => [course._id.toString(), course.title]));
    const quizzes = await Quiz.find({ course_id: { $in: courseIds } }).sort({ created_at: -1 });
    res.json(quizzes.map((quiz) => ({
      ...serializeDoc(quiz),
      courses: { title: courseMap.get(quiz.course_id.toString()) || "Untitled Course" }
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/instructor/quizzes", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const course = await ensureInstructorCourse(req.body.course_id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });
    if (!req.body.title?.trim()) return res.status(400).json({ error: "Quiz title is required." });

    const quiz = await Quiz.create({
      course_id: course._id,
      title: req.body.title.trim(),
      description: req.body.description || "",
      quiz_type: req.body.quiz_type || "quiz",
      time_limit_minutes: Number(req.body.time_limit_minutes) || 30,
      passing_score: Number(req.body.passing_score) || 70,
      max_attempts: Number(req.body.max_attempts) || 3,
      published: "published" in req.body ? Boolean(req.body.published) : true,
      updated_at: new Date()
    });

    const seedQuestions = Array.isArray(req.body.questions) ? req.body.questions : [];
    if (seedQuestions.length > 0) {
      await QuizQuestion.insertMany(seedQuestions.map((question, index) => ({
        quiz_id: quiz._id,
        question_text: question.question_text,
        question_type: question.question_type || "multiple_choice",
        options: question.options || [],
        correct_answer: question.correct_answer || "",
        points: Number(question.points) || 1,
        order: Number.isFinite(Number(question.order)) ? Number(question.order) : index
      })));
    }

    res.status(201).json({
      ...serializeDoc(quiz),
      courses: { title: course.title }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/instructor/quizzes/:id", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(404).json({ error: "Quiz not found." });
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found." });

    const course = await ensureInstructorCourse(quiz.course_id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });

    await QuizQuestion.deleteMany({ quiz_id: quiz._id });
    await QuizAttempt.deleteMany({ quiz_id: quiz._id });
    await Quiz.deleteOne({ _id: quiz._id });
    res.json({ success: true });
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

app.get("/instructor/analytics/enrollments", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const courseQuery = req.user.role === "admin" ? {} : { author_id: req.user.id };
    const courses = await Course.find(courseQuery).select("_id title");

    const chartData = await Promise.all(
      courses.map(async (course) => {
        const students = await Enrollment.countDocuments({
          course_id: course._id,
          status: { $in: ["approved", "active", "completed"] }
        });
        return {
          name: course.title.length > 18 ? `${course.title.slice(0, 16)}..` : course.title,
          fullTitle: course.title,
          students
        };
      })
    );

    res.json(chartData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/instructor/attendance/courses/:courseId/sessions", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const course = await ensureInstructorCourse(req.params.courseId, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });

    const sessions = await DynamicRecord.find({
      table: "attendance_sessions",
      course_id: course._id.toString()
    }).sort({ date: -1, created_at: -1 });

    res.json(serializeCollection(sessions));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/instructor/attendance/courses/:courseId/sessions", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    const course = await ensureInstructorCourse(req.params.courseId, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });
    if (!req.body.date) return res.status(400).json({ error: "Session date is required." });

    const existing = await DynamicRecord.findOne({
      table: "attendance_sessions",
      course_id: course._id.toString(),
      date: req.body.date
    });

    if (existing) {
      return res.json(serializeDoc(existing));
    }

    const session = await DynamicRecord.create({
      table: "attendance_sessions",
      course_id: course._id.toString(),
      date: req.body.date,
      created_by: req.user.id
    });

    res.status(201).json(serializeDoc(session));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/instructor/attendance/sessions/:sessionId", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.sessionId)) return res.status(404).json({ error: "Session not found." });

    const session = await DynamicRecord.findOne({
      _id: req.params.sessionId,
      table: "attendance_sessions"
    });
    if (!session) return res.status(404).json({ error: "Session not found." });

    const course = await ensureInstructorCourse(session.course_id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });

    const enrollments = await Enrollment.find({
      course_id: course._id,
      status: { $in: ["approved", "active", "completed"] }
    }).populate("student_id", "display_name avatar_url email");

    const records = await DynamicRecord.find({
      table: "attendance_records",
      session_id: session._id.toString()
    }).sort({ created_at: 1 });

    res.json({
      session: serializeDoc(session),
      students: enrollments.map((enrollment) => ({
        id: enrollment._id.toString(),
        student_id: serializeDoc(enrollment.student_id)
      })),
      records: serializeCollection(records)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/instructor/attendance/sessions/:sessionId/records", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.sessionId)) return res.status(404).json({ error: "Session not found." });
    const session = await DynamicRecord.findOne({
      _id: req.params.sessionId,
      table: "attendance_sessions"
    });
    if (!session) return res.status(404).json({ error: "Session not found." });

    const course = await ensureInstructorCourse(session.course_id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });

    const enrollment = await Enrollment.findOne({
      course_id: course._id,
      student_id: req.body.student_id,
      status: { $in: ["approved", "active", "completed"] }
    });
    if (!enrollment) return res.status(404).json({ error: "Student is not enrolled in this course." });

    const record = await DynamicRecord.findOneAndUpdate(
      {
        table: "attendance_records",
        session_id: session._id.toString(),
        student_id: String(req.body.student_id)
      },
      {
        table: "attendance_records",
        course_id: course._id.toString(),
        session_id: session._id.toString(),
        student_id: String(req.body.student_id),
        status: ["present", "late", "absent"].includes(req.body.status) ? req.body.status : "present",
        updated_at: new Date()
      },
      { upsert: true, new: true }
    );

    res.json(serializeDoc(record));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/instructor/attendance/sessions/:sessionId/records/bulk", authenticate, authorize(["instructor", "admin"]), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.sessionId)) return res.status(404).json({ error: "Session not found." });
    const session = await DynamicRecord.findOne({
      _id: req.params.sessionId,
      table: "attendance_sessions"
    });
    if (!session) return res.status(404).json({ error: "Session not found." });

    const course = await ensureInstructorCourse(session.course_id, req.user);
    if (!course) return res.status(404).json({ error: "Course not found." });

    const enrollments = await Enrollment.find({
      course_id: course._id,
      status: { $in: ["approved", "active", "completed"] }
    }).select("student_id");

    const status = ["present", "late", "absent"].includes(req.body.status) ? req.body.status : "present";
    await Promise.all(
      enrollments.map((enrollment) =>
        DynamicRecord.findOneAndUpdate(
          {
            table: "attendance_records",
            session_id: session._id.toString(),
            student_id: enrollment.student_id.toString()
          },
          {
            table: "attendance_records",
            course_id: course._id.toString(),
            session_id: session._id.toString(),
            student_id: enrollment.student_id.toString(),
            status,
            updated_at: new Date()
          },
          { upsert: true, new: true }
        )
      )
    );

    res.json({ success: true });
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
  try {
    const enrollments = await Enrollment.find({
      student_id: _req.user.id,
      status: { $in: ["approved", "active", "completed"] }
    }).select("course_id");
    const courseIds = enrollments.map((enrollment) => enrollment.course_id);
    const quizzes = await Quiz.find({
      course_id: { $in: courseIds },
      published: true
    })
      .sort({ created_at: -1 })
      .populate("course_id", "title");
    res.json(serializeCollection(quizzes));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/quiz-attempts/me", authenticate, authorize(["student", "admin"]), async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user_id: req.user.id }).populate({
      path: "quiz_id",
      populate: { path: "course_id", select: "title" }
    });
    res.json(serializeCollection(attempts));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LEARNING ROUTES ---
app.get("/courses/:id", authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("author_id", "display_name");
    res.json(serializeDoc(course));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/courses/:id/modules", authenticate, async (req, res) => {
  try {
    const modules = await Module.find({ course_id: req.params.id }).sort({ order: 1 });
    res.json(serializeCollection(modules));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/courses/:id/lessons", authenticate, async (req, res) => {
  try {
    const lessons = await Lesson.find({ course_id: req.params.id }).sort({ order: 1 });
    res.json(serializeCollection(lessons));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/courses/:id/quizzes", authenticate, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course_id: req.params.id }).sort({ order: 1 });
    res.json(serializeCollection(quizzes));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/courses/:id/assignments", authenticate, async (req, res) => {
  try {
    const assignments = await Assignment.find({ course_id: req.params.id });
    res.json(serializeCollection(assignments));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/quizzes/:id/questions", authenticate, async (req, res) => {
  try {
    const questions = await QuizQuestion.find({ quiz_id: req.params.id }).sort({ order: 1 });
    res.json(serializeCollection(questions));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/lesson-progress", authenticate, async (req, res) => {
  try {
    const progress = await LessonProgress.findOneAndUpdate(
      { user_id: req.user.id, lesson_id: req.body.lesson_id },
      { ...req.body, user_id: req.user.id, completed_at: new Date() },
      { upsert: true, new: true }
    );
    res.json(serializeDoc(progress));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/lesson-progress/:courseId", authenticate, async (req, res) => {
  try {
    const progress = await LessonProgress.find({ user_id: req.user.id, course_id: req.params.courseId, completed: true });
    res.json(serializeCollection(progress));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/quiz-attempts", authenticate, async (req, res) => {
  try {
    const attempt = new QuizAttempt({ ...req.body, user_id: req.user.id });
    await attempt.save();
    res.json(serializeDoc(attempt));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/quiz-attempts/me", authenticate, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user_id: req.user.id });
    res.json(serializeCollection(attempts));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/submissions", authenticate, async (req, res) => {
  try {
    const submission = new Submission({ ...req.body, student_id: req.user.id });
    await submission.save();
    res.json(serializeDoc(submission));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/submissions/me", authenticate, async (req, res) => {
  try {
    const submissions = await Submission.find({ student_id: req.user.id });
    res.json(serializeCollection(submissions));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/enrollments/check/:courseId", authenticate, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ student_id: req.user.id, course_id: req.params.courseId });
    res.json(serializeDoc(enrollment));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- COURSES ---
app.get("/courses", async (req, res) => {
  try {
    const { search, level, category } = req.query;
    const query = { published: true, status: "approved" };
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (level) {
      query.level = level;
    }
    if (category) {
      query.category = category;
    }
    const courses = await Course.find(query).populate("author_id", "display_name");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/db/query/:table", attachOptionalUser, async (req, res) => {
  try {
    const table = req.params.table;
    const { operation = "select", filters = [], payload, order, options = {}, limit } = req.body || {};
    const resource = getTableModel(table);
    const match = buildMongoMatch(resource.type === "dynamic" ? table : null, filters);
    const isPublicTable = ["courses", "news", "webinars"].includes(table);

    if (!req.user && !(operation === "select" && isPublicTable) && !(table === "newsletter_subs" && operation === "insert")) {
      return res.status(401).json({ error: "Authentication required." });
    }

    if (resource.type === "profile") {
      if (operation === "select") {
        let query = User.find(match).select("-password");
        if (order?.column) {
          query = query.sort({ [order.column === "id" ? "_id" : order.column]: order.ascending === false ? -1 : 1 });
        }
        if (limit) {
          query = query.limit(Number(limit));
        }
        const docs = await query.exec();
        const records = normalizeRecords(table, docs);
        if (options.head && options.count) {
          return res.json({ data: null, count: records.length, error: null });
        }
        if (options.single || options.maybeSingle) {
          return res.json({ data: records[0] || null, error: null });
        }
        return res.json({ data: records, count: options.count ? records.length : null, error: null });
      }

      if (operation === "update") {
        const update = { ...payload, updated_at: new Date() };
        const docs = await User.find(match);
        for (const doc of docs) {
          Object.assign(doc, update);
          await doc.save();
        }
        return res.json({ data: normalizeRecords(table, docs), error: null });
      }
    }

    const Model = resource.model;

    if (operation === "select") {
      if (options.head && options.count) {
        const count = await Model.countDocuments(match);
        return res.json({ data: null, count, error: null });
      }

      let query = Model.find(match);
      query = applyPopulate(table, query);
      if (order?.column) {
        query = query.sort({ [order.column === "id" ? "_id" : order.column]: order.ascending === false ? -1 : 1 });
      }
      if (limit) {
        query = query.limit(Number(limit));
      }

      const docs = await query.exec();
      const records = normalizeRecords(table, docs);
      if (options.single || options.maybeSingle) {
        return res.json({ data: records[0] || null, error: null });
      }
      return res.json({ data: records, count: options.count ? records.length : null, error: null });
    }

    if (operation === "insert") {
      const rows = Array.isArray(payload) ? payload : [payload];
      const preparedRows = [];
      const existingRows = [];
      for (const row of rows) {
        const nextRow = { ...row, updated_at: new Date() };
        if (resource.type === "dynamic") {
          nextRow.table = table;
        }
        if (table === "newsletter_subs") {
          nextRow.email = normalizeEmail(nextRow.email);
        }
        if (table === "enrollments") {
          const existingEnrollment = await Enrollment.findOne({
            course_id: toObjectIdIfValid(nextRow.course_id),
            student_id: toObjectIdIfValid(nextRow.student_id)
          });
          if (existingEnrollment) {
            existingRows.push(existingEnrollment);
            continue;
          }

          const course = await Course.findById(nextRow.course_id);
          if (!course || !course.published || course.status !== "approved") {
            return res.status(400).json({ error: "This course is not open for student enrollment yet." });
          }
          nextRow.status = "active";
          nextRow.enrolled_at = nextRow.enrolled_at || new Date();
        }
        preparedRows.push(nextRow);
      }

      if (table === "course_resources" && req.user?.role === "instructor") {
        for (const row of preparedRows) {
          const course = await ensureInstructorCourse(row.course_id, req.user);
          if (!course) return res.status(404).json({ error: "Course not found." });
        }
      }

      const docs = preparedRows.length > 0 ? await Model.insertMany(preparedRows, { ordered: true }) : [];
      const records = normalizeRecords(table, [...existingRows, ...docs]);
      if (options.single) {
        return res.json({ data: records[0] || null, error: null });
      }
      return res.json({ data: records, error: null });
    }

    if (operation === "update") {
      const docs = await Model.find(match);
      for (const doc of docs) {
        Object.assign(doc, { ...payload, updated_at: new Date() });
        await doc.save();
      }
      return res.json({ data: normalizeRecords(table, docs), error: null });
    }

    if (operation === "delete") {
      const docs = await Model.find(match);
      await Model.deleteMany(match);
      return res.json({ data: normalizeRecords(table, docs), error: null });
    }

    if (operation === "upsert") {
      const rows = Array.isArray(payload) ? payload : [payload];
      const conflictFields = String(options.onConflict || "")
        .split(",")
        .map((field) => field.trim())
        .filter(Boolean);

      const results = [];
      for (const row of rows) {
        const conflictMatch = {};
        for (const field of conflictFields) {
          conflictMatch[field === "id" ? "_id" : field] = toObjectIdIfValid(row[field]);
        }
        if (resource.type === "dynamic") {
          conflictMatch.table = table;
        }
        let doc = conflictFields.length > 0 ? await Model.findOne(conflictMatch) : null;
        if (doc) {
          Object.assign(doc, { ...row, updated_at: new Date() });
          await doc.save();
        } else {
          doc = await Model.create({
            ...(resource.type === "dynamic" ? { table } : {}),
            ...row,
            updated_at: new Date()
          });
        }
        results.push(doc);
      }
      return res.json({ data: normalizeRecords(table, results), error: null });
    }

    return res.status(400).json({ error: "Unsupported database operation." });
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

app.post("/ai/assist", authenticate, authorize(["admin", "instructor"]), async (req, res) => {
  try {
    const { action, payload } = req.body || {};
    switch (action) {
      case "generate_course_draft":
        return res.json({ result: JSON.stringify(buildCourseDraft(payload?.topic || "")) });
      case "generate_curriculum_outline":
        return res.json({ result: JSON.stringify(buildCurriculumOutline(payload?.courseTitle || "")) });
      case "generate_lesson_content":
        return res.json({ result: buildLessonContent(payload?.courseTitle || "Course", payload?.lessonTitle || "Lesson") });
      case "generate_quiz":
        return res.json({ result: JSON.stringify(buildQuiz(payload?.lessonTitle || "Lesson", payload?.difficulty || "medium")) });
      case "generate_assessment":
        return res.json({ result: JSON.stringify(buildAssessment(payload?.topic || "Lesson", payload?.type || "quiz")) });
      case "analyze_student_performance":
        return res.json({ result: buildPerformanceAnalysis(payload?.studentData || {}) });
      case "generate_institutional_report":
        return res.json({ result: buildInstitutionalReport(payload?.systemData || {}) });
      default:
        return res.status(400).json({ error: "Unsupported AI action." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
