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
          "category": "One of: Technology, Science, Mathematics, English/Language Arts, Social Studies, Business, Arts, Health Sciences, Engineering"
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
              "lessons": ["Lesson 1 Title", "Lesson 2 Title"]
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

