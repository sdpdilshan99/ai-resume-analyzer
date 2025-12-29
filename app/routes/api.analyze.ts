// routes/api.analyze.ts (React Router v7)
import type { ActionFunctionArgs } from "react-router";
import { analyzeResumeOnServer } from "~/services/ai.serve.server";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const file = formData.get("resume") as File;
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;

    const buffer = Buffer.from(await file.arrayBuffer());
    
    try {
        const feedback = await analyzeResumeOnServer(buffer, file.type, jobTitle, jobDescription);
        return { feedback };
    } catch (error) {
        return { error: "AI Analysis failed" };
    }
}