// services/ai.service.server.ts
import { resumeModel, AIResponseFormat } from "~/lib/ai.server";

export const analyzeResumeOnServer = async (buffer: Buffer, mimeType: string, jobTitle: string, jobDescription: string) => {
    const prompt = `You are a senior technical recruiter and ATS specialist. 
      
      TASK:
      Analyze the provided resume against the following specific role:
      Role: ${jobTitle}
      Job Description: ${jobDescription}
    
      CRITERIA:
      - Be critical. If the resume doesn't match the keywords or requirements of the job description, give a low score.
      - Provide actionable, detailed explanations for every "improve" tip.
      - Ensure the "tip" is a short title (e.g., "Missing Quantifiable Metrics") and the "explanation" is a detailed paragraph.
    
      OUTPUT FORMAT:
      Return ONLY a JSON object following this interface: ${AIResponseFormat}
      Do not include markdown formatting, backticks, or any conversational text.`; 

    const result = await resumeModel.generateContent([
        prompt,
        { inlineData: { data: buffer.toString("base64"), mimeType } }
    ]);

    return JSON.parse(result.response.text());
}