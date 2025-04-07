
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

/**
 * Parse resume content using OCR-like approach
 * This simulates an OCR and NLP pipeline that would extract structured data
 * @param resumeText The extracted text from the resume
 */
const parseResumeContent = (file: File): Promise<ResumeAnalysisResult> => {
  // In a real implementation, we would use OCR to extract text and then NLP to parse
  // Since we're mocking, we'll enhance our mock data to be more comprehensive
  
  const enhancedMockResult: ResumeAnalysisResult = {
    topSkills: [
      { skill: "JavaScript", level: "expert", relevance: 95 },
      { skill: "React", level: "advanced", relevance: 90 },
      { skill: "Node.js", level: "intermediate", relevance: 85 },
      { skill: "TypeScript", level: "advanced", relevance: 88 },
      { skill: "REST API Design", level: "advanced", relevance: 82 },
      { skill: "GraphQL", level: "intermediate", relevance: 75 },
      { skill: "SQL", level: "advanced", relevance: 80 },
      { skill: "Git", level: "advanced", relevance: 85 }
    ],
    keywordMatches: {
      "frontend": 12,
      "backend": 8,
      "full-stack": 6,
      "agile": 4,
      "testing": 5,
      "cloud": 6,
      "architecture": 3,
      "optimization": 4,
      "performance": 5,
      "responsive": 7,
      "component": 9,
      "scaling": 3
    },
    education: [
      {
        degree: "B.Tech in Computer Science and Engineering",
        institution: "Indian Institute of Technology, Bombay",
        year: "2019-2023",
        score: "9.2 CGPA"
      },
      {
        degree: "Higher Secondary Education",
        institution: "Delhi Public School",
        year: "2017-2019",
        score: "95.6%"
      }
    ],
    experience: [
      {
        role: "Software Engineer Intern",
        company: "Microsoft",
        duration: "May 2022 - July 2022",
        highlights: [
          "Developed and implemented new features for Microsoft Teams",
          "Created responsive UI components using React and TypeScript",
          "Worked on performance optimization reducing load time by 40%",
          "Collaborated with a team of 8 engineers using Agile methodology"
        ]
      },
      {
        role: "Web Development Lead",
        company: "College Technical Society",
        duration: "Jan 2021 - Present",
        highlights: [
          "Lead a team of 6 developers for college website redesign",
          "Implemented authentication system and user dashboard",
          "Organized code workshops and hackathons for juniors",
          "Reduced page load time by 60% through code optimization"
        ]
      },
      {
        role: "Open Source Contributor",
        company: "Various GitHub Projects",
        duration: "2020 - Present",
        highlights: [
          "Contributed to React-based open source libraries",
          "Fixed bugs and implemented new features for community projects",
          "Created documentation and examples for beginners"
        ]
      }
    ],
    overallScore: 87
  };

  return Promise.resolve(enhancedMockResult);
};

export const analyzeResume = async (file: File): Promise<ResumeAnalysisResult> => {
  // In a real implementation, this would:
  // 1. Extract text from the PDF/DOCX using OCR or pdf.js/mammoth.js
  // 2. Use NLP to identify sections and parse content
  // 3. Analyze the content for skills, experience, etc.
  
  // For development purposes, use enhanced mock data that simulates parsing
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate resume parsing
      const analysisResult = parseResumeContent(file);
      analysisResult.then(result => resolve(result));
    }, 3000); // Simulate a 3-second processing time
  });
};
