import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Get the Gemini Pro model
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

/**
 * Generate AI response using Gemini
 */
async function generateAIResponse(prompt: string): Promise<string> {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini AI Error:', error);
        throw new Error('AI generation failed');
    }
}

/**
 * Generate structured task plan from task list
 */
export async function generateTaskPlan(tasks: string[]): Promise<string> {
    const prompt = `You are an expert productivity coach. Break down this goal into actionable sub-tasks:

Goal: ${tasks[0]}

Create a JSON array of 3-5 specific, achievable sub-tasks. Each task must follow this EXACT structure:
[
  {
    "task": "Clear, actionable task title (5-8 words)",
    "priority": "high" | "medium" | "low",
    "estimatedTime": "15-120 minutes" (realistic estimate),
    "deadline": "Today" | "Tomorrow" | "This Week" | "Next Week",
    "tips": "One specific tip to complete this task efficiently (10-15 words)"
  }
]

Rules:
- Make tasks SPECIFIC and ACTIONABLE (avoid vague tasks)
- Order by priority and logical sequence
- Keep task titles concise but descriptive
- Provide ONE clear tip per task
- Return ONLY valid JSON, no markdown, no explanations

Example good task: "Research and select 3 online Spanish courses"
Example bad task: "Start learning Spanish"`;

    return generateAIResponse(prompt);
}

/**
 * Generate daily schedule from tasks and preferences
 */
export async function generateDailySchedule(
    tasks: string[],
    workingHours: { start: string; end: string },
    preferences: { focusDuration: number; breakDuration: number }
): Promise<string> {
    const prompt = `Create an optimized daily schedule using the Pomodoro technique.

Tasks to schedule:
${tasks.map((task, i) => `${i + 1}. ${task}`).join('\n')}

Working hours: ${workingHours.start} to ${workingHours.end}
Focus duration: ${preferences.focusDuration} minutes
Break duration: ${preferences.breakDuration} minutes

Create a time-blocked schedule in this format:
{
  "time": "HH:MM",
  "activity": "Task name or Break",
  "duration": "duration in minutes",
  "type": "focus/break/lunch"
}

Return a JSON array. Include lunch break. Prioritize important tasks early. Be realistic with time estimates.`;

    return generateAIResponse(prompt);
}

/**
 * Summarize note content
 */
export async function summarizeNote(content: string): Promise<string> {
    const prompt = `Summarize the following note content in a clear, concise format.

Note Content:
${content}

Provide a summary with:
1. **Main Points** (2-3 key takeaways in 1-2 sentences each)
2. **Key Details** (3-5 bullet points of important information)

Rules:
- ONLY summarize what is explicitly written in the note
- Do NOT add external information, suggestions, or recommendations
- Keep it factual and objective
- Use clear, simple language
- Format with markdown (bold headers, bullet points)
- Be concise but complete`;

    return generateAIResponse(prompt);
}

/**
 * Generate motivational message based on context
 */
export async function generateMotivation(
    context: string,
    mood?: string
): Promise<string> {
    const prompt = `You are a supportive productivity coach. The user says: "${context}"${mood ? ` They feel: ${mood}` : ''
        }

Provide:
1. **Encouragement** (2-3 sentences of empathy and support)
2. **Actionable Tip** (one specific, practical suggestion)
3. **Motivation** (inspiring quote or thought)

Be warm, concise, and helpful. Use emojis sparingly.`;

    return generateAIResponse(prompt);
}

/**
 * Analyze potential distractions and suggest blocking strategy
 */
export async function analyzeDistractions(
    distractions: string[]
): Promise<string> {
    const prompt = `Analyze these common distractions and suggest blocking strategies:

Distractions:
${distractions.map((d, i) => `${i + 1}. ${d}`).join('\n')}

For each distraction, provide:
- **Type** (digital/environmental/internal)
- **Impact** (high/medium/low)
- **Solution** (specific actionable advice)

Format as a structured list. Be practical and specific.`;

    return generateAIResponse(prompt);
}

/**
 * Break down complex task into subtasks
 */
export async function breakdownComplexTask(
    taskTitle: string,
    taskDescription: string
): Promise<string> {
    const prompt = `Break down this complex task into smaller, actionable subtasks:

Task: ${taskTitle}
Description: ${taskDescription}

Provide a list of 3-7 subtasks that are:
- Specific and actionable
- In logical order
- Each completable in 30-90 minutes

Format:
1. [Subtask name] - Brief description (estimated time)

Be practical and helpful.`;

    return generateAIResponse(prompt);
}

export default {
    generateTaskPlan,
    generateDailySchedule,
    summarizeNote,
    generateMotivation,
    analyzeDistractions,
    breakdownComplexTask,
};
