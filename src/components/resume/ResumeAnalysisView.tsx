
import { ResumeAnalysisResult } from "@/services/resumeAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDashed } from "lucide-react";
import SkillCard from "./SkillCard";
import EducationCard from "./EducationCard";
import ExperienceCard from "./ExperienceCard";
import KeywordCloud from "./KeywordCloud";
import JobRecommendations from "./JobRecommendations";

interface ResumeAnalysisViewProps {
  analysis: ResumeAnalysisResult | null;
  isLoading: boolean;
}

const ResumeAnalysisView = ({ analysis, isLoading }: ResumeAnalysisViewProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <CircleDashed className="h-12 w-12 text-blue-500 animate-spin" />
        <div className="text-center">
          <h2 className="text-xl font-medium mb-1">Analyzing Your Resume</h2>
          <p className="text-gray-500">
            Our AI is extracting key information from your resume using OCR technology...
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <p>Upload your resume to see the analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Resume Analysis Score</CardTitle>
          <CardDescription>Overall assessment of your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-36 flex items-center justify-center">
            <div className="absolute">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-bold text-blue-600">{analysis.overallScore}</span>
                <span className="text-sm text-gray-500">out of 100</span>
              </div>
            </div>
            <div className="w-36 h-36 rounded-full border-8 border-blue-100">
              <div 
                className="w-full h-full rounded-full border-8 border-t-blue-500" 
                style={{ 
                  transform: `rotate(${analysis.overallScore * 3.6}deg)`,
                  transition: 'transform 1.5s ease-in-out'
                }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="skills">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="skills">
          <div className="grid gap-4 md:grid-cols-2">
            {analysis.topSkills.map((skill, index) => (
              <SkillCard 
                key={index} 
                skill={skill.skill} 
                level={skill.level} 
                relevance={skill.relevance} 
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="education" className="space-y-4">
          {analysis.education.map((edu, index) => (
            <EducationCard
              key={index}
              degree={edu.degree}
              institution={edu.institution}
              year={edu.year}
              score={edu.score}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="experience" className="space-y-4">
          {analysis.experience.map((exp, index) => (
            <ExperienceCard
              key={index}
              role={exp.role}
              company={exp.company}
              duration={exp.duration}
              highlights={exp.highlights}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="keywords">
          <KeywordCloud keywords={analysis.keywordMatches} />
        </TabsContent>
        
        <TabsContent value="jobs">
          <JobRecommendations analysis={analysis} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeAnalysisView;
