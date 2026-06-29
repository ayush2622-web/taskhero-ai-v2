import { GoogleGenerativeAI } from "@google/generative-ai";
console.log(import.meta.env.VITE_GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

export async function generateTaskPlan(tasks) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are an AI productivity coach.

Tasks:
${tasks.join("\n")}

Give:
1. Priority order
2. Estimated completion time
3. Productivity advice
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}