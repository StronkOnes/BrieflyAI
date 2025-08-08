
import { GoogleGenAI } from "@google/genai";
import { Contact } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
};

export const researchAndSummarize = async (topic: string) => {
  try {
    const prompt = `Research the topic '${topic}'. Provide a 3-point summary with insights, stats, and trends in bullet form.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        ...generationConfig,
        tools: [{googleSearch: {}}],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error in researchAndSummarize:", error);
    return "Error: Could not perform research. Please check the console for details.";
  }
};

export const generateArticle = async (researchSummary: string) => {
  try {
    const prompt = `Write a 500-word blog article based on this research: \n\n${researchSummary}\n\n Include a professional tone, subheadings, and a clear conclusion. Format the output nicely.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: generationConfig,
    });
    return response.text;
  } catch (error) {
    console.error("Error in generateArticle:", error);
    return "Error: Could not generate article. Please check the console for details.";
  }
};

export const completeArticle = async (partialArticle: string, topic: string) => {
  try {
    const prompt = `You are a blog writer. Complete the following article about "${topic}". Continue from where the text leaves off, maintaining a consistent tone and style. The final article should be well-structured and at least 500 words in total. Here is the beginning of the article:\n\n${partialArticle}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: generationConfig,
    });
    return response.text;
  } catch (error) {
    console.error("Error in completeArticle:", error);
    return `Error: Could not complete the article. ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};


export const generateFeaturedImage = async (prompt: string): Promise<{ base64Image?: string; error?: string }> => {
    if (!prompt) {
        return { error: 'A prompt is required to generate an image.' };
    }
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `A high-quality, professional blog feature image for an article about: "${prompt}". Minimalist, clean style.`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return { base64Image: base64ImageBytes };
        } else {
            return { error: 'Image generation succeeded but returned no images.' };
        }
    } catch (error) {
        console.error("Error in generateFeaturedImage:", error);
        return { error: `Error generating image. Please check the console for details. Message: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
};

export const analyzeKpiData = async (kpiData: string) => {
  try {
    const prompt = `You are a business intelligence analyst. Analyze the following CRM data: \n\n${kpiData}\n\nCalculate the following KPIs and provide a brief analysis for each:
- Lead Conversion Rate (percentage of leads that became 'Won' opportunities)
- Opportunity Win Rate (percentage of non-lost opportunities that were 'Won')
- Funnel Drop-offs (where are leads/opportunities being lost?)
- Average Deal Size (for 'Won' opportunities)
Present the results clearly in a summary format.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: generationConfig,
    });
    return response.text;
  } catch (error) {
    console.error("Error in analyzeKpiData:", error);
    return "Error: Could not analyze KPIs. Please check the console for details.";
  }
};

export const summarizeCrmData = async (crmData: string) => {
  try {
    const prompt = `Using this CRM record: \n\n${crmData}\n\nWrite a short, professional summary to present to a management team. Highlight key activities, status, and next steps.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: generationConfig,
    });
    return response.text;
  } catch (error) {
    console.error("Error in summarizeCrmData:", error);
    return "Error: Could not generate CRM summary. Please check the console for details.";
  }
};

export const planCampaign = async (goal: string) => {
  try {
    const prompt = `Generate a 4-week content marketing campaign plan based on the business goal: '${goal}'. 
For each week, provide a theme and suggest 2-3 content ideas with titles, formats (e.g., Blog Post, Video, Social Media), and suggested platforms (e.g., LinkedIn, Company Blog, YouTube).
Present the output in a well-structured, easy-to-read format.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: generationConfig,
    });
    return response.text;
  } catch (error) {
    console.error("Error in planCampaign:", error);
    return "Error: Could not generate campaign plan. Please check the console for details.";
  }
};

export const writeEmailTemplate = async (emailScenario: string) => {
  try {
    const prompt = `Write a professional customer email for this use case: '${emailScenario}'. 
Keep the tone friendly, clear, and action-oriented. Include a subject line.
Structure the response with "Subject:" followed by the subject, and then the email body.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: generationConfig,
    });
    return response.text;
  } catch (error) {
    console.error("Error in writeEmailTemplate:", error);
    return "Error: Could not generate email template. Please check the console for details.";
  }
};

export const scrapeContacts = async (query: string): Promise<{ data?: Contact[]; error?: string }> => {
  try {
    const prompt = `Based on a Google search for "${query}", find websites for grant-making organizations or directories.
From the content of these websites, extract key contacts (e.g., grant managers, foundation officers, program directors).
For each contact, provide their name, title/role, organization, and available contact details (email or phone).
Format the output as a JSON array of objects. Each object must have the following keys: "name", "title", "organization", "contactInfo", "sourceUrl".
The "sourceUrl" should be the direct URL where the information was found.
If you cannot find specific people, you can list general contact information for the organization.
Return ONLY the raw JSON array string. Do not include markdown formatting like \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });
    
    const text = response.text;
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      if (text.toLowerCase().includes("i can't") || text.toLowerCase().includes("i am unable")) {
         return { error: `The AI was unable to fulfill this request. It might be due to content policy restrictions. Response: "${text}"` };
      }
      return { error: "Error: Could not find a JSON array in the response from the AI." };
    }
    
    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    const data = JSON.parse(jsonString);
    return { data };

  } catch (error) {
    console.error("Error in scrapeContacts:", error);
    if (error instanceof SyntaxError) {
        return { error: "Error: Failed to parse the contact data from the AI. The response was not valid JSON." };
    }
    if (error instanceof Error) {
        return { error: `Error: Could not perform scraping. ${error.message}` };
    }
    return { error: "Error: An unknown error occurred during contact scraping." };
  }
};

export const generateDerivativeContent = async (article: string, type: 'shorts' | 'podcast' | 'video') => {
    let prompt = '';
    switch (type) {
        case 'shorts':
            prompt = `Based on the following article, write 3 short-form posts (e.g., for Twitter or LinkedIn) to promote it. Use emojis and hashtags appropriately. \n\n${article}`;
            break;
        case 'podcast':
            prompt = `Based on the following article, write a 2-minute podcast script. Include an intro with music cues, main points, and an outro. Format it clearly with speaker labels. \n\n${article}`;
            break;
        case 'video':
            prompt = `Based on the following article, write a script for a short YouTube video (2-3 minutes). Structure it with a strong hook, main content with visual cues suggestions in parenthesis (e.g., [B-roll of scientists in a lab]), and a clear call to action. \n\n${article}`;
            break;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: generationConfig,
        });
        return response.text;
    } catch (error) {
        console.error(`Error in generateDerivativeContent (${type}):`, error);
        return `Error: Could not generate ${type}. Please check the console for details.`;
    }
};
