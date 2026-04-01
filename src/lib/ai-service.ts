import { apiClient } from "@/lib/api-client";

async function callAIFunction(action: string, payload: Record<string, unknown>) {
  const data = await apiClient.fetch("/ai/assist", {
    method: "POST",
    body: JSON.stringify({ action, payload }),
  });
  if (data?.error) throw new Error(data.error);
  return data.result;
}

function cleanJSON(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

export const generateCourseDraft = async (topic: string) => {
  const raw = await callAIFunction("generate_course_draft", { topic });
  try {
    return JSON.parse(cleanJSON(raw));
  } catch {
    throw new Error("AI returned invalid data format.");
  }
};

export const generateFullCurriculum = async (topic: string) => {
  const raw = await callAIFunction("generate_full_curriculum", { topic });
  try {
    return JSON.parse(cleanJSON(raw));
  } catch {
    throw new Error("AI returned invalid data format.");
  }
};

export const generateCurriculumOutline = async (courseTitle: string) => {
  const raw = await callAIFunction("generate_curriculum_outline", { courseTitle });
  try {
    return JSON.parse(cleanJSON(raw));
  } catch {
    throw new Error("AI returned invalid data format.");
  }
};

export const generateLessonContent = async (courseTitle: string, lessonTitle: string) => {
  return await callAIFunction("generate_lesson_content", { courseTitle, lessonTitle });
};

export const generateQuiz = async (lessonTitle: string, difficulty: string = "medium") => {
  const raw = await callAIFunction("generate_quiz", { lessonTitle, difficulty });
  try {
    return JSON.parse(cleanJSON(raw));
  } catch {
    throw new Error("AI returned invalid data format.");
  }
};

export const generateAssessment = async (topic: string, type: "quiz" | "assignment" | "test" = "quiz") => {
  const raw = await callAIFunction("generate_assessment", { topic, type });
  try {
    return JSON.parse(cleanJSON(raw));
  } catch {
    throw new Error("AI returned invalid data format.");
  }
};

export const formatAssignmentDescription = (draft: any) => {
  const prompts = Array.isArray(draft?.prompts) ? draft.prompts : [];
  const rubric = Array.isArray(draft?.rubric) ? draft.rubric : [];

  return `
    <h2>${draft?.title || "Assignment Brief"}</h2>
    <p>${draft?.description || "Complete the following assignment tasks using evidence, analysis, and clear reasoning."}</p>
    <h3>Tasks</h3>
    <ol>
      ${prompts.map((prompt: any) => `<li><strong>${prompt.question}</strong></li>`).join("")}
    </ol>
    <h3>Instructor Answer Guide</h3>
    <ul>
      ${prompts.map((prompt: any) => `<li>${prompt.expected_answer || "Use the course concepts to justify a high-quality response."}</li>`).join("")}
    </ul>
    <h3>Rubric</h3>
    <ul>
      ${rubric.map((item: string) => `<li>${item}</li>`).join("")}
    </ul>
  `.trim();
};

export const aiGradeSubmission = async (question: string, studentAnswer: string, correctAnswer: string) => {
  return await callAIFunction("ai_grade_submission", { question, studentAnswer, correctAnswer });
};

export const analyzeStudentPerformance = async (studentData: unknown) => {
  return await callAIFunction("analyze_student_performance", { studentData });
};

export const generateInstitutionalReport = async (systemData: unknown) => {
  return await callAIFunction("generate_institutional_report", { systemData });
};
