"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLearningRoadmap } from "./actions";
import { Loader2 } from "lucide-react";

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

export function LearningRoadmap() {
  const [target, setTarget] = useState("");
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await getLearningRoadmap(target);
      setRoadmap(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      <header className="bg-white shadow-sm p-4 text-center">
        <h1 className="text-2xl font-semibold">Learning Roadmap Generator</h1>
      </header>

      <main className="flex-grow p-8">
        <Card className="max-w-2xl mx-auto bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              Generate Your Learning Roadmap
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter a technology to get a customized learning path
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="E.g., NextJS, React, Python"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Generate"
                  )}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 text-red-600 text-center">{error}</div>
            )}

            {roadmap && (
              <div className="mt-8 space-y-6">
                <h2 className="text-xl font-semibold text-center mb-4">
                  Learning Roadmap for {target}
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Prerequisites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {roadmap.prerequisites.map((step, index) => (
                        <li key={index}>
                          <strong>{step.title}:</strong> {step.description}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Learning Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal pl-5 space-y-2">
                      {roadmap.mainSteps.map((step, index) => (
                        <li key={index}>
                          <strong>{step.title}:</strong> {step.description}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {roadmap.resources.map((resource, index) => (
                        <li key={index}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white shadow-sm p-4 text-center text-gray-600">
        <p>&copy; 2024 Learning Roadmap Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}
