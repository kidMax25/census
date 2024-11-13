import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    "AIzaSyAtd24ltZdZfZp6w9Cbnz2jewZmY0ZcdKA"
);

export interface GeminiCountyInfo {
  description: {
    overview: string;
    mainIncomeSources: string[];
    tribes: string[];
    landmarks: string[];
  };
  statistics: {
    leader: {
      name: string;
      position: string;
      period: string;
    };
    constituencies: string[];
    gdpContribution: number;
  };
}

export async function getCountyInfo(
  countyName: string
): Promise<GeminiCountyInfo> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Return ONLY valid JSON data without markdown formatting or code blocks about ${countyName} County in Kenya with this exact structure:
{
  "description": {
    "overview": "brief overview",
    "mainIncomeSources": ["source1", "source2"],
    "tribes": ["tribe1", "tribe2"],
    "landmarks": ["landmark1", "landmark2"]
  },
  "statistics": {
    "leader": {
      "name": "current governor name",
      "position": "Governor",
      "period": "current term period"
    },
    "constituencies": ["constituency1", "constituency2"],
    "gdpContribution": 5
  }
}

Important: Return ONLY the JSON, no additional text, no markdown formatting, no code blocks.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up any markdown or code block markers
    const cleanJson = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsedData = JSON.parse(cleanJson);

      // Validate the structure
      if (!parsedData.description || !parsedData.statistics) {
        throw new Error("Invalid data structure");
      }

      // Ensure gdpContribution is a number
      parsedData.statistics.gdpContribution = Number(
        parsedData.statistics.gdpContribution
      );

      return parsedData as GeminiCountyInfo;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw Text:", text);

      // Return fallback data
      return {
        description: {
          overview: `Information about ${countyName} County`,
          mainIncomeSources: ["Agriculture", "Trade"],
          tribes: ["Various ethnic groups"],
          landmarks: ["Notable locations"],
        },
        statistics: {
          leader: {
            name: "Current Governor",
            position: "Governor",
            period: "Current Term",
          },
          constituencies: ["Main Constituencies"],
          gdpContribution: 0,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching county info:", error);
    throw error;
  }
}
