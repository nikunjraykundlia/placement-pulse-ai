
import { createWorker } from 'tesseract.js';
import { JobSearchParams } from './jobPostings';

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
  preferredJobTitles?: string[];
  preferredLocations?: string[];
}

// Function to extract text from a PDF or image using Tesseract OCR
const extractTextFromFile = async (file: File): Promise<string> => {
  try {
    // For PDFs, we'd need PDF.js to convert to images first
    // For simplicity in this demo, we'll focus on image processing

    // If the file is an image, process directly with Tesseract
    if (file.type.startsWith('image/')) {
      const worker = await createWorker();
      
      // Convert file to data URL for Tesseract to process
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      console.log('Processing image with Tesseract OCR...');
      const { data: { text } } = await worker.recognize(dataUrl);
      
      await worker.terminate();
      console.log('Tesseract OCR processing complete');
      return text;
    } 
    // For demonstration purposes, return mock text for PDFs
    // In a real implementation, PDF.js would be used to render PDF pages as images
    else if (file.type === 'application/pdf') {
      console.log('PDF detected. In a real implementation, PDF.js would render pages as images for OCR');
      return "This is mock text for PDF files. In a complete implementation, PDF.js would be used to convert PDF pages to images for OCR processing.";
    } 
    // For DOCX files, a different approach would be needed
    else {
      console.log('Unsupported file type for direct OCR. Mock text will be used.');
      return "This is mock text for unsupported file types. In a complete implementation, converters for different document formats would be implemented.";
    }
  } catch (error) {
    console.error('Error in OCR processing:', error);
    return "Error processing file with OCR. Using mock data instead.";
  }
};

// Function to parse text and extract structured information
const parseResumeText = (text: string): ResumeAnalysisResult => {
  console.log('Parsing extracted text...');
  console.log('Sample of extracted text:', text.substring(0, 200) + '...');
  
  // In a real implementation, this would use NLP to extract structured information
  // For demo purposes, we'll simulate extraction with some simple pattern matching
  
  // Extract skills (keywords frequently found in tech resumes)
  const skillKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 
                        'SQL', 'Java', 'C++', 'C#', 'HTML', 'CSS', 'AWS', 'Azure',
                        'Docker', 'Kubernetes', 'Git', 'GitHub', 'REST API', 'GraphQL',
                        'MongoDB', 'Express', 'Django', 'Flask', 'Spring Boot'];
  
  const extractedSkills: SkillAnalysis[] = [];
  let textLower = text.toLowerCase();
  
  skillKeywords.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      // Simple scoring based on frequency and position in text
      const count = (textLower.match(new RegExp(skill.toLowerCase(), 'g')) || []).length;
      const position = textLower.indexOf(skill.toLowerCase());
      const relevance = Math.min(100, 60 + count * 10 + (position < 500 ? 10 : 0));
      
      let level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      if (relevance > 90) level = 'expert';
      else if (relevance > 80) level = 'advanced';
      else if (relevance > 70) level = 'intermediate';
      else level = 'beginner';
      
      extractedSkills.push({ 
        skill, 
        level, 
        relevance
      });
    }
  });
  
  // Sort skills by relevance
  extractedSkills.sort((a, b) => b.relevance - a.relevance);
  
  // Extract education (look for common degree abbreviations and education keywords)
  const educationRegex = /(?:B\.?(?:Tech|Sc|A|E|S)|M\.?(?:Tech|Sc|A|BA|S)|Ph\.?D|MBA)(?:.{0,100}?)(?:19|20)\d{2}(?:\s*-\s*(?:19|20)\d{2}|present)?/gi;
  const educationMatches = text.match(educationRegex) || [];
  
  const education: EducationDetail[] = educationMatches.map(match => {
    // Simple parsing logic - in real implementation would be more robust
    return {
      degree: match.split(' ')[0] || "Degree",
      institution: "University/College", // Would extract from context in real impl
      year: match.match(/(19|20)\d{2}(?:\s*-\s*(?:(?:19|20)\d{2}|present))?/i)?.[0] || "Unknown",
      score: "Not specified" // Would extract GPA/percentage if available
    };
  });
  
  // If no education detected, provide default placeholder
  if (education.length === 0) {
    education.push({
      degree: "Degree not detected",
      institution: "Institution not detected",
      year: "Year not detected",
      score: "Score not detected"
    });
  }
  
  // Extract experience (look for job titles followed by company names)
  const jobTitles = ['Engineer', 'Developer', 'Manager', 'Analyst', 'Designer', 
                     'Consultant', 'Intern', 'Director', 'Lead'];
  
  const experience: ExperienceDetail[] = [];
  
  jobTitles.forEach(title => {
    const regex = new RegExp(`((?:\\w+\\s){0,2}${title}(?:\\s\\w+){0,2})(?:.{0,100}?)(?:19|20)\\d{2}(?:\\s*-\\s*(?:(?:19|20)\\d{2}|present))?`, 'gi');
    const matches = text.matchAll(regex);
    
    for (const match of matches) {
      const fullMatch = match[0];
      const role = match[1] || "Role not specified";
      const durationMatch = fullMatch.match(/(19|20)\d{2}(?:\s*-\s*(?:(?:19|20)\d{2}|present))?/i);
      
      if (durationMatch) {
        experience.push({
          role: role,
          company: "Company not specified", // Would extract from context
          duration: durationMatch[0],
          highlights: ["Responsibilities not specified"] // Would extract bullet points
        });
      }
    }
  });
  
  // If no experience detected, provide default placeholder
  if (experience.length === 0) {
    experience.push({
      role: "Role not detected",
      company: "Company not detected",
      duration: "Duration not detected",
      highlights: ["Experience details not detected"]
    });
  }
  
  // Extract keyword matches
  const keywordMatches: { [key: string]: number } = {};
  const commonKeywords = ['project', 'team', 'management', 'development', 'design', 
                         'implementation', 'analysis', 'research', 'client', 'customer',
                         'leadership', 'communication', 'problem-solving', 'innovation'];
  
  commonKeywords.forEach(keyword => {
    const count = (textLower.match(new RegExp(keyword, 'gi')) || []).length;
    if (count > 0) {
      keywordMatches[keyword] = count;
    }
  });
  
  // Calculate overall score based on extracted data
  let overallScore = 75; // Base score
  
  // Adjust based on detected skills
  overallScore += Math.min(15, extractedSkills.length * 2); // Up to +15 for skills
  
  // Adjust based on detected education
  overallScore += Math.min(5, education.length * 5); // Up to +5 for education
  
  // Adjust based on detected experience
  overallScore += Math.min(10, experience.length * 2.5); // Up to +10 for experience
  
  // Adjust based on detected keywords
  overallScore += Math.min(5, Object.keys(keywordMatches).length * 0.5); // Up to +5 for keywords
  
  // Ensure score is within 0-100 range
  overallScore = Math.max(0, Math.min(100, Math.round(overallScore)));
  
  // Extract potential job titles and locations for job matching
  const preferredJobTitles = extractedSkills.length > 0 
    ? [extractedSkills[0].skill + ' Developer', extractedSkills[0].skill + ' Engineer'] 
    : ['Software Developer', 'Software Engineer'];
  
  // Return the structured result
  return {
    topSkills: extractedSkills.slice(0, 10), // Top 10 skills
    education,
    experience,
    keywordMatches,
    overallScore,
    preferredJobTitles,
    preferredLocations: ['Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Chennai']
  };
};

// Mock data for fallback
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
 * Parse resume content using OCR
 * @param file The resume file to analyze
 */
const parseResumeContent = async (file: File): Promise<ResumeAnalysisResult> => {
  try {
    console.log('Starting OCR processing for file:', file.name);
    
    // Extract text using OCR
    const extractedText = await extractTextFromFile(file);
    
    if (!extractedText || extractedText.trim().length === 0) {
      console.log('No text extracted or empty result, using mock data');
      return mockAnalysisResult;
    }
    
    // Parse the extracted text to get structured information
    return parseResumeText(extractedText);
  } catch (error) {
    console.error('Error parsing resume content:', error);
    return mockAnalysisResult;
  }
};

export const analyzeResume = async (file: File): Promise<ResumeAnalysisResult> => {
  return new Promise((resolve) => {
    console.log('Starting resume analysis for file:', file.name);
    
    // Show processing indicator
    setTimeout(async () => {
      try {
        // Attempt OCR and parsing
        const analysisResult = await parseResumeContent(file);
        resolve(analysisResult);
      } catch (error) {
        console.error('Error in resume analysis:', error);
        // Fallback to mock data if any error occurs
        resolve(mockAnalysisResult);
      }
    }, 2000); // Simulate some processing time
  });
};
