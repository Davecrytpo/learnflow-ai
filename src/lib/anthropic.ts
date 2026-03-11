import Anthropic from "@anthropic-ai/sdk";

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

export const anthropic = apiKey 
  ? new Anthropic({ apiKey, dangerouslyAllowBrowser: true }) 
  : null;

export const generateCourseDraft = async (topic: string) => {
  if (!anthropic) throw new Error("Anthropic API key is not configured.");

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Create a professional course draft for an LMS about "${topic}".
        Provide the response in the following JSON format:
        {
          "title": "Clear Course Title",
          "summary": "One sentence punchy summary",
          "description": "Full HTML description with <p>, <ul>, <li> tags",
          "category": "One of: Technology, Science, Mathematics, English/Language Arts, Social Studies, Business, Arts, Health Sciences, Engineering",
          "level": "One of: Undergraduate, Graduate, Doctoral, Certificate, Online",
          "credits": 3,
          "duration": "12 Weeks"
        }
        Only return the JSON object.`
      }
    ],
  });

  const content = response.content[0];
  if (content.type === "text") {
    try {
      return JSON.parse(content.text);
    } catch (e) {
      throw new Error("AI returned invalid data format.");
    }
  }
  throw new Error("AI failed to generate a response.");
};

export const generateCurriculumOutline = async (courseTitle: string) => {
  if (!anthropic) throw new Error("Anthropic API key is not configured.");

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Create a comprehensive curriculum outline for a course titled "${courseTitle}".
        Provide the response in the following JSON format:
        {
          "modules": [
            {
              "title": "Module Title",
              "lessons": [
                { "title": "Lesson Title", "type": "content|video|quiz" }
              ]
            }
          ]
        }
        Create 3-5 modules, each with 2-3 lessons. Only return the JSON object.`
      }
    ],
  });

  const content = response.content[0];
  if (content.type === "text") {
    try {
      return JSON.parse(content.text);
    } catch (e) {
      throw new Error("AI returned invalid data format.");
    }
  }
  throw new Error("AI failed to generate a response.");
};

export const generateLessonContent = async (courseTitle: string, lessonTitle: string) => {
  if (!anthropic) throw new Error("Anthropic API key is not configured.");

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Write educational content for a lesson titled "${lessonTitle}" as part of a course on "${courseTitle}".
        Format the content as professional HTML suitable for a modern LMS.
        Include sections with <h2> tags, paragraphs with <p>, and bullet points with <ul>/<li>.
        Add an "Objective" section at the top and a "Key Takeaways" section at the end.
        Ensure it is thorough and engaging. Only return the HTML content.`
      }
    ],
  });

  const content = response.content[0];
  if (content.type === "text") {
    return content.text;
  }
  throw new Error("AI failed to generate a response.");
};

export const generateQuiz = async (lessonTitle: string, difficulty: string = "medium") => {
  if (!anthropic) throw new Error("Anthropic API key is not configured.");

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `Create a quiz for a lesson titled "${lessonTitle}" with ${difficulty} difficulty.
        Provide the response in the following JSON format:
        {
          "title": "Quiz Title",
          "questions": [
            {
              "question": "The question text?",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correct_index": 0,
              "explanation": "Why this is correct"
            }
          ]
        }
        Create 5 questions. Only return the JSON object.`
      }
    ],
  });

  const content = response.content[0];
  if (content.type === "text") {
    try {
      return JSON.parse(content.text);
    } catch (e) {
      throw new Error("AI returned invalid data format.");
    }
  }
  throw new Error("AI failed to generate a response.");
};

export const analyzeStudentPerformance = async (studentData: any) => {
  if (!anthropic) throw new Error("Anthropic API key is not configured.");

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analyze the following student performance data and provide insights for the instructor.
        Data: ${JSON.stringify(studentData)}
        
        Provide the response in a structured format:
        1. Summary of overall performance.
        2. Identified strengths and weaknesses.
        3. Actionable recommendations for the instructor to help these students.
        
        Format as HTML.`
      }
    ],
  });

  const content = response.content[0];
  if (content.type === "text") {
    return content.text;
  }
  throw new Error("AI failed to generate a response.");
};

export const generateInstitutionalReport = async (systemData: any) => {
  if (!anthropic) throw new Error("Anthropic API key is not configured.");

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `Generate an institutional executive report for the university administrator based on the following system data.
        Data: ${JSON.stringify(systemData)}
        
        The report should cover:
        - Enrollment trends.
        - Faculty productivity.
        - Course quality and student satisfaction.
        - Financial health (revenue).
        - Recommendations for institutional growth.
        
        Format as professional HTML with clear headings and sections.`
      }
    ],
  });

  const content = response.content[0];
  if (content.type === "text") {
    return content.text;
  }
  throw new Error("AI failed to generate a response.");
};
