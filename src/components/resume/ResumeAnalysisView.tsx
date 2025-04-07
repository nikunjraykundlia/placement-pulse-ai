
import { ResumeAnalysisResult } from "@/services/resumeAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDashed, AlertTriangle, LightbulbIcon, FileText } from "lucide-react";
import SkillCard from "./SkillCard";
import EducationCard from "./EducationCard";
import ExperienceCard from "./ExperienceCard";
import KeywordCloud from "./KeywordCloud";
import JobRecommendations from "./JobRecommendations";
import ResumeSuggestions from "./ResumeSuggestions";

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
          
          <div className="mt-6 text-center max-w-md mx-auto">
            <p className="text-sm text-gray-600">
              {analysis.overallScore >= 80 ? 
                "Excellent! Your resume is well-structured and contains key information that will appeal to recruiters." :
                analysis.overallScore >= 60 ?
                "Good start! Your resume has some strong points, but check the suggestions tab for ways to improve." :
                "Your resume needs some work. Visit the suggestions tab for specific improvements to boost your chances."
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="skills">
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="skills">
          <div className="grid gap-4 md:grid-cols-2">
            {analysis.topSkills.length > 0 && analysis.topSkills[0].skill !== "undefined" ? (
              analysis.topSkills.map((skill, index) => (
                <SkillCard 
                  key={index} 
                  skill={skill.skill} 
                  level={skill.level} 
                  relevance={skill.relevance} 
                />
              ))
            ) : (
              <div className="col-span-2 flex items-center justify-center p-8 border rounded-md">
                <div className="flex flex-col items-center text-center">
                  <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                  <p>No skills detected in your resume. Consider adding relevant technical and soft skills.</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="education" className="space-y-4">
          {analysis.education.length > 0 && analysis.education[0].degree !== "Degree not detected" ? (
            analysis.education.map((edu, index) => (
              <EducationCard
                key={index}
                degree={edu.degree}
                institution={edu.institution}
                year={edu.year}
                score={edu.score}
              />
            ))
          ) : (
            <div className="flex items-center justify-center p-8 border rounded-md">
              <div className="flex flex-col items-center text-center">
                <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                <p>No education details detected in your resume. Make sure to include your academic background.</p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="experience" className="space-y-4">
          {analysis.experience.length > 0 && analysis.experience[0].role !== "Role not detected" ? (
            analysis.experience.map((exp, index) => (
              <ExperienceCard
                key={index}
                role={exp.role}
                company={exp.company}
                duration={exp.duration}
                highlights={exp.highlights}
              />
            ))
          ) : (
            <div className="flex items-center justify-center p-8 border rounded-md">
              <div className="flex flex-col items-center text-center">
                <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                <p>No work experience detected in your resume. Add relevant work history or projects.</p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="keywords">
          <KeywordCloud keywords={analysis.keywordMatches} />
        </TabsContent>
        
        <TabsContent value="jobs">
          <JobRecommendations analysis={analysis} />
        </TabsContent>
        
        <TabsContent value="suggestions">
          <ResumeSuggestions suggestions={analysis.improvementSuggestions || []} />
        </TabsContent>
        
        {/* Add a debug tab to show raw text when in development mode */}
        {process.env.NODE_ENV === 'development' && analysis.rawText && (
          <>
            <TabsTrigger value="debug" className="ml-2">Debug</TabsTrigger>
            <TabsContent value="debug">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    Raw Extracted Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                    {analysis.rawText}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default ResumeAnalysisView;
