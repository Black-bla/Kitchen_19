const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined
});

module.exports = {
  // Ask AI a question
  ask: async (prompt, options = {}) => {
    try {
      const {
        model = 'gpt-3.5-turbo',
        maxTokens = 1000,
        temperature = 0.7,
        systemMessage = 'You are a helpful assistant for a student management platform.'
      } = options;

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature
      });

      const answer = completion.choices[0]?.message?.content || 'No response generated';

      return {
        success: true,
        answer,
        usage: completion.usage,
        model: completion.model
      };
    } catch (error) {
      console.error('AI request failed:', error);
      return {
        success: false,
        answer: 'Sorry, I encountered an error processing your request.',
        error: error.message
      };
    }
  },

  // Process document content with AI
  processDocument: async (content, documentType = 'general') => {
    const prompts = {
      syllabus: `Analyze this course syllabus and extract key information:
- Course objectives
- Topics covered
- Assessment methods
- Prerequisites

Syllabus content: ${content}`,
      assignment: `Analyze this assignment and provide:
- Key requirements
- Due date (if mentioned)
- Grading criteria
- Estimated difficulty level

Assignment content: ${content}`,
      general: `Summarize the main points of this document: ${content}`
    };

    return module.exports.ask(prompts[documentType] || prompts.general, {
      model: 'gpt-4',
      maxTokens: 1500
    });
  },

  // Generate study questions from content
  generateQuestions: async (content, count = 5) => {
    const prompt = `Generate ${count} study questions based on this content. Include a mix of multiple choice, short answer, and essay questions. Format them clearly.

Content: ${content}`;

    return module.exports.ask(prompt, {
      maxTokens: 1000,
      temperature: 0.8
    });
  },

  // Chat with AI about course material
  chatAboutCourse: async (message, courseContext = '') => {
    const systemMessage = `You are an AI tutor helping students with their coursework. Be encouraging, patient, and provide clear explanations. Use the course context when relevant.

Course Context: ${courseContext}`;

    return module.exports.ask(message, {
      systemMessage,
      maxTokens: 800,
      temperature: 0.7
    });
  },

  // Analyze student performance
  analyzePerformance: async (grades, attendance, assignments) => {
    const prompt = `Analyze this student's academic performance and provide insights:

Grades: ${JSON.stringify(grades)}
Attendance: ${attendance}%
Completed Assignments: ${assignments}

Provide:
1. Overall performance summary
2. Strengths and weaknesses
3. Recommendations for improvement
4. Predicted grade trend`;

    return module.exports.ask(prompt, {
      model: 'gpt-4',
      maxTokens: 1000,
      temperature: 0.3
    });
  }
};
