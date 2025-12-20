
import { prepareInstructions } from "~/constants";
import { resumeModel } from "~/lib/ai";


async function fileToGenerativePart(file: File) {
    return new Promise<{inlineData: {data: string; mimeType: string;}}>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64Data = (reader.result as string).split(",")[1];
            
            resolve({
                inlineData: {data: base64Data, mimeType: file.type},
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    }); 

}

export const analyzeResume = async (file: File, jobTitle: string, jobDescription: string): Promise<Feedback> => {
    try {
        //Preparee data parts
        const prompt = prepareInstructions({jobTitle, jobDescription});
        const resumePart = await fileToGenerativePart(file);

        //Excute Ai generation
        const result = await resumeModel.generateContent([prompt, resumePart]);
        const response = await result.response;
        const responseText = response.text();


        const parsedData = JSON.parse(responseText);

        return parsedData as Feedback;
        

    } catch (error: any) {
        console.error("AI Service Error: ", error);

        if (error.message?.includes("404")) {
             throw new Error("Model not found. Please check the model name in lib/ai.ts");
        }
        throw new Error("The AI failed to analyze your resume. Check your file format")
    }
}