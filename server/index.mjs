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

const port = process.env.API_PORT || 8787;
app.listen(port, () => {
  console.log(`Learnflow API listening on port ${port}`);
});
