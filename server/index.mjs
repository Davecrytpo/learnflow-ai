import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. API will run in degraded mode.");
}

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
  : null;

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

app.post("/assessments/proctoring/session", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
  const schema = z.object({
    course_id: z.string().uuid(),
    student_id: z.string().uuid(),
    status: z.string().min(2),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { data, error } = await supabase.from("proctoring_sessions").insert(parse.data).select("*").single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
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

const port = process.env.API_PORT || 8787;
app.listen(port, () => {
  console.log(`Learnflow API listening on port ${port}`);
});
