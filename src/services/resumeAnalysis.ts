
// This is a mock service for resume analysis
// In production, this would connect to a backend API using ML/NLP

interface SkillAnalysis {
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  relevance: number; // 0-100 scale
}

interface EducationDetail {
  degree: string;
  institution: string;
  year: string;
  score: string;
}

interface ExperienceDetail {
  role: string;
  company: string;
  duration: string;
  highlights: string[];
}

export interface ResumeAnalysisResult {
  topSkills: SkillAnalysis[];
  keywordMatches: { [key: string]: number }; // keyword: count
  education: EducationDetail[];
  experience: ExperienceDetail[];
  overallScore: number; // 0-100 scale
}

// Mock data for development/demo purposes
const mockAnalysisResult: ResumeAnalysisResult = {
  topSkills: [
    { skill: "Java", level: "advanced", relevance: 90 },
    { skill: "Python", level: "intermediate", relevance: 75 },
    { skill: "React", level: "beginner", relevance: 65 },
    { skill: "Data Structures", level: "advanced", relevance: 85 },
    { skill: "Machine Learning", level: "intermediate", relevance: 70 }
  ],
  keywordMatches: {
    "engineering": 5,
    "project": 8,
    "development": 6,
    "team": 4,
    "algorithms": 3,
    "database": 2
  },
  education: [
    {
      degree: "B.Tech in Computer Science",
      institution: "Indian Institute of Technology",
      year: "2020-2024",
      score: "8.7 CGPA"
    }
  ],
  experience: [
    {
      role: "Software Engineering Intern",
      company: "Tech Solutions Ltd.",
      duration: "May 2023 - July 2023",
      highlights: [
        "Developed and maintained web applications using React",
        "Collaborated with senior developers on database optimization",
        "Implemented responsive UI components"
      ]
    },
    {
      role: "Student Developer",
      company: "College Tech Club",
      duration: "Aug 2022 - Present",
      highlights: [
        "Leading a team of 5 developers",
        "Created a campus event management application"
      ]
    }
  ],
  overallScore: 78
};

export const analyzeResume = async (file: File): Promise<ResumeAnalysisResult> => {
  // In a real implementation, this would send the file to a backend service
  // that uses NLP/ML to analyze the resume
  
  // For now, we'll simulate an API call with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return mock data
      resolve(mockAnalysisResult);
    }, 3000); // Simulate a 3-second processing time
  });
};
