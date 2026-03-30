import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function callAI(systemPrompt: string, userPrompt: string, maxTokens = 1024): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: false,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw new Error("Rate limit exceeded. Please try again in a moment.");
    if (status === 402) throw new Error("AI credits exhausted. Please add credits in workspace settings.");
    const text = await response.text();
    console.error("AI gateway error:", status, text);
    throw new Error(`AI gateway error: ${status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, payload } = await req.json();

    let result: string;

    switch (action) {
      case "generate_course_draft": {
        const { topic } = payload;
        result = await callAI(
          "You are a curriculum design expert. Always respond with valid JSON only, no markdown fences.",
          `Create a professional course draft for an LMS about "${topic}".
Provide the response in the following JSON format:
{
  "title": "Clear Course Title",
  "summary": "One sentence punchy summary",
  "description": "Full HTML description with <p>, <ul>, <li> tags",
  "category": "One of: Technology, Science, Mathematics, Business, Arts, Health, Engineering, Humanities",
  "level": "One of: Undergraduate, Graduate, Doctoral, Certificate, Online",
  "credits": 3,
  "duration": "12 Weeks"
}
Only return the JSON object.`
        );
        break;
      }

      case "generate_curriculum_outline": {
        const { courseTitle } = payload;
        result = await callAI(
          "You are a curriculum design expert. Always respond with valid JSON only, no markdown fences.",
          `Create a comprehensive curriculum outline for a course titled "${courseTitle}".
Provide the response in the following JSON format:
{
  "modules": [
    {
      "title": "Module Title",
      "summary": "Brief module summary",
      "lessons": [
        { "title": "Lesson Title", "type": "content|video|quiz|assignment", "duration": "15 min" }
      ]
    }
  ]
}
Create 4-6 modules, each with 3-4 lessons. Ensure the flow is logical and educational. Only return the JSON object.`
        );
        break;
      }

      case "generate_full_curriculum": {
        const { topic } = payload;
        result = await callAI(
          "You are a master educator. Always respond with valid JSON only, no markdown fences.",
          `Create a COMPLETE curriculum for a course about "${topic}".
Include modules, lessons, and the FULL content for each lesson.
Provide the response in the following JSON format:
{
  "title": "Course Title",
  "description": "Full HTML description",
  "modules": [
    {
      "title": "Module Title",
      "lessons": [
        { 
          "title": "Lesson Title", 
          "content": "Full HTML content with <h2>, <p>, <ul>, <li>",
          "type": "content"
        }
      ]
    }
  ]
}
Limit to 3 modules and 2 lessons per module to ensure quality within token limits. Only return the JSON object.`,
          4096
        );
        break;
      }

      case "generate_lesson_content": {
        const { courseTitle, lessonTitle } = payload;
        result = await callAI(
          "You are an educational content writer. Write professional HTML content suitable for a modern LMS.",
          `Write educational content for a lesson titled "${lessonTitle}" as part of a course on "${courseTitle}".
Format the content as professional HTML suitable for a modern LMS.
Include:
- An "Objective" section at the top (<h2>).
- 3-5 sub-sections with <h3> tags and detailed <p> content.
- Practical examples or case studies.
- A "Check for Understanding" question (text-only).
- A "Key Takeaways" section at the end (<ul>/<li>).
Ensure it is thorough (at least 500 words) and engaging. Only return the HTML content.`,
          3000
        );
        break;
      }

      case "generate_quiz": {
        const { lessonTitle, difficulty = "medium" } = payload;
        result = await callAI(
          "You are an assessment design expert. Always respond with valid JSON only, no markdown fences.",
          `Create a quiz for a lesson titled "${lessonTitle}" with ${difficulty} difficulty.
Provide the response in the following JSON format:
{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "The question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 0,
      "points": 10,
      "explanation": "Why this is correct"
    }
  ]
}
Create 5 questions. Assign points to each. Only return the JSON object.`,
          2000
        );
        break;
      }

      case "generate_assessment": {
        const { topic, type } = payload;
        result = await callAI(
          "You are an assessment design expert. Always respond with valid JSON only, no markdown fences.",
          `Create a comprehensive ${type} about "${topic}".
Include specific point values for each task and a clear answer key for instructors.
Provide the response in the following JSON format:
{
  "title": "Assessment Title",
  "description": "Instructions for the student (HTML)",
  "max_points": 100,
  "tasks": [
    {
      "instruction": "What the student needs to do",
      "points": 25,
      "answer_key": "Detailed explanation of what a correct answer looks like for the instructor"
    }
  ]
}
Create 4 substantial tasks. Only return the JSON object.`,
          2500
        );
        break;
      }

      case "ai_grade_submission": {
        const { question, studentAnswer, correctAnswer } = payload;
        result = await callAI(
          "You are a fair and rigorous academic grader. Respond with JSON only.",
          `Grade the following student response based on the question and the provided answer key.
Question: ${question}
Expected Answer: ${correctAnswer}
Student Response: ${studentAnswer}

Provide the response in JSON:
{
  "score": 0-100,
  "feedback": "Constructive feedback for the student",
  "justification": "Internal reasoning for the instructor"
}
Only return the JSON object.`
        );
        break;
      }

      case "analyze_student_performance": {
        const { studentData } = payload;
        result = await callAI(
          "You are an educational analytics expert. Format your analysis as professional HTML.",
          `Analyze the following student performance data and provide insights for the instructor.
Data: ${JSON.stringify(studentData)}

Provide the response in a structured format:
1. Summary of overall performance.
2. Identified strengths and weaknesses.
3. Actionable recommendations for the instructor to help these students.

Format as HTML.`
        );
        break;
      }

      case "generate_institutional_report": {
        const { systemData } = payload;
        result = await callAI(
          "You are an institutional analytics expert. Format your report as professional HTML with clear headings.",
          `Generate an institutional executive report for the university administrator based on the following system data.
Data: ${JSON.stringify(systemData)}

The report should cover:
- Enrollment trends.
- Faculty productivity.
- Course quality and student satisfaction.
- Financial health (revenue).
- Recommendations for institutional growth.

Format as professional HTML with clear headings and sections.`,
          1500
        );
        break;
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-assist error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    const status = message.includes("Rate limit") ? 429 : message.includes("credits") ? 402 : 500;
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
