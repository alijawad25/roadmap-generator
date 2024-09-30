"use server";

import axios from "axios";

type RoadmapStep = {
  title: string;
  description: string;
};

type Resource = {
  title: string;
  url: string;
};

type LearningRoadmap = {
  prerequisites: RoadmapStep[];
  mainSteps: RoadmapStep[];
  resources: Resource[];
};

async function generateRoadmap(target: string): Promise<string> {
  const prompt = `
Generate a concise learning roadmap for ${target}. Include exactly 5 prerequisites, 5 main steps, and 3 resources.
Respond ONLY with a JSON object in the following exact format, with no additional text, explanation, or markdown formatting:

{
  "prerequisites": [
    {"title": "Prerequisite 1", "description": "Brief description of prerequisite 1"},
    {"title": "Prerequisite 2", "description": "Brief description of prerequisite 2"},
    {"title": "Prerequisite 3", "description": "Brief description of prerequisite 3"}
    {"title": "Prerequisite 4", "description": "Brief description of prerequisite 4"}
    {"title": "Prerequisite 5", "description": "Brief description of prerequisite 5"}
  ],
  "mainSteps": [
    {"title": "Step 1", "description": "Brief description of step 1"},
    {"title": "Step 2", "description": "Brief description of step 2"},
    {"title": "Step 3", "description": "Brief description of step 3"},
    {"title": "Step 4", "description": "Brief description of step 4"},
    {"title": "Step 5", "description": "Brief description of step 5"}
  ],
  "resources": [
    {"title": "Resource 1", "url": "https://example.com/resource1"},
    {"title": "Resource 2", "url": "https://example.com/resource2"},
    {"title": "Resource 3", "url": "https://example.com/resource3"}
  ]
}

Ensure all descriptions are under 100 characters. Provide real, relevant URLs for resources. Do not use markdown code blocks or any formatting.
`;

  try {
    const response = await axios.post(
      "https://phi.us.gaianet.network/v1/chat/completions",
      {
        model: "llama",
        messages: [
          {
            role: "system",
            content:
              "You are a JSON-only output assistant. You must only return valid, properly formatted JSON without any additional text, explanation, or markdown formatting. Do not use code blocks.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }
    );

    let content = response.data.choices[0].message.content.trim();
    console.log("Raw API response:", content);

    // Remove markdown code block if present
    content = content.replace(/^```json\s?/, "").replace(/\s?```$/, "");

    // Attempt to parse the JSON
    JSON.parse(content);

    return content;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw new Error("Failed to generate roadmap: " + (error as Error).message);
  }
}

export async function getLearningRoadmap(
  target: string
): Promise<LearningRoadmap> {
  try {
    const roadmapJson = await generateRoadmap(target);
    const roadmap: LearningRoadmap = JSON.parse(roadmapJson);

    if (
      !roadmap.prerequisites ||
      !roadmap.mainSteps ||
      !roadmap.resources ||
      roadmap.prerequisites.length !== 5 ||
      roadmap.mainSteps.length !== 5 ||
      roadmap.resources.length !== 3
    ) {
      console.error("Invalid roadmap structure:", roadmap);
      throw new Error(
        "Invalid roadmap format: incorrect number of prerequisites, mainSteps, or resources"
      );
    }

    return roadmap;
  } catch (error) {
    console.error("Error in getLearningRoadmap:", error);
    throw error;
  }
}
