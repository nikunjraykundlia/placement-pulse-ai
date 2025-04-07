
import { createWorker } from 'tesseract.js';
import { pdfjs } from 'react-pdf';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
  improvementSuggestions?: string[]; // Added for milestone 5
  rawText?: string; // Store raw text for debugging
}

// Function to extract text from a PDF using PDF.js
const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    console.log("Starting PDF text extraction...");
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + ' ';
    }
    
    console.log('PDF text extraction successful. Sample text:', fullText.substring(0, 200));
    return fullText;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return "Error processing PDF. Using mock data instead.";
  }
};

// Function to extract text from a file using Tesseract OCR
const extractTextFromFile = async (file: File): Promise<string> => {
  try {
    console.log('Processing file:', file.name, 'of type:', file.type);
    
    // Handle PDFs
    if (file.type === 'application/pdf') {
      return await extractTextFromPDF(file);
    }
    
    // Handle images (JPEG, PNG, etc.)
    if (file.type.startsWith('image/')) {
      console.log('Processing image with Tesseract OCR...');
      const worker = await createWorker('eng');
      
      // Convert file to data URL for Tesseract to process
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      const { data } = await worker.recognize(dataUrl);
      const text = data.text;
      
      await worker.terminate();
      console.log('Tesseract OCR processing complete. Sample text:', text.substring(0, 200));
      return text;
    } 
    // Handle DOCX files using a simulated approach for now
    else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('DOCX detected. In a real implementation, a DOCX parser would be used');
      return "This is extracted text from a DOCX file using a simulated approach. In a real implementation, a proper DOCX parser would be used.";
    } 
    // Fallback for other file types
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
  
  // Extract skills (keywords frequently found in tech resumes)
  const skillKeywords = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 
    'SQL', 'Java', 'C++', 'C#', 'HTML', 'CSS', 'AWS', 'Azure',
    'Docker', 'Kubernetes', 'Git', 'GitHub', 'REST API', 'GraphQL',
    'MongoDB', 'Express', 'Django', 'Flask', 'Spring Boot', 'TensorFlow',
    'PyTorch', 'Machine Learning', 'AI', 'Data Science', 'DevOps',
    'CI/CD', 'Jenkins', 'Agile', 'Scrum', 'Project Management'
  ];
  
  const extractedSkills: SkillAnalysis[] = [];
  let textLower = text.toLowerCase();
  
  // Skills score - out of 25 points
  let skillsScore = 0;
  
  skillKeywords.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      // Simple scoring based on frequency and position in text
      const count = (textLower.match(new RegExp(skill.toLowerCase(), 'g')) || []).length;
      const position = textLower.indexOf(skill.toLowerCase());
      const relevance = Math.min(100, 60 + count * 10 + (position < 500 ? 10 : 0));
      
      let level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      if (relevance > 90) {
        level = 'expert';
        skillsScore += 1;
      }
      else if (relevance > 80) {
        level = 'advanced'; 
        skillsScore += 0.75;
      }
      else if (relevance > 70) {
        level = 'intermediate';
        skillsScore += 0.5;
      }
      else {
        level = 'beginner';
        skillsScore += 0.25;
      }
      
      extractedSkills.push({ 
        skill, 
        level, 
        relevance
      });
    }
  });
  
  // Sort skills by relevance
  extractedSkills.sort((a, b) => b.relevance - a.relevance);
  
  // Cap skills score at 25
  skillsScore = Math.min(25, skillsScore);
  
  // Extract education (look for common degree abbreviations and education keywords)
  const educationRegex = /(?:B\.?(?:Tech|Sc|A|E|S)|M\.?(?:Tech|Sc|A|BA|S)|Ph\.?D|MBA)(?:.{0,100}?)(?:19|20)\d{2}(?:\s*-\s*(?:19|20)\d{2}|present)?/gi;
  const educationMatches = text.match(educationRegex) || [];
  
  const education: EducationDetail[] = educationMatches.map(match => {
    const degreeMatch = match.match(/B\.?(?:Tech|Sc|A|E|S)|M\.?(?:Tech|Sc|A|BA|S)|Ph\.?D|MBA/i);
    const institutionMatch = match.match(/(?:university|college|institute|school)\s+(?:of\s+)?([A-Za-z\s]+)/i);
    const yearMatch = match.match(/(19|20)\d{2}(?:\s*-\s*(?:(?:19|20)\d{2}|present))?/i);
    const scoreMatch = match.match(/(?:CGPA|GPA|score)[\s:]+([\d\.]+)/i);
    
    return {
      degree: degreeMatch ? degreeMatch[0] : "Degree not detected",
      institution: institutionMatch ? institutionMatch[1] : "Institution not detected",
      year: yearMatch ? yearMatch[0] : "Year not detected",
      score: scoreMatch ? scoreMatch[1] : "Score not detected"
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
  
  // Education score - out of 20 points
  const educationScore = Math.min(20, education.length * 10);
  
  // Extract experience (look for job titles followed by company names)
  const jobTitles = ['Engineer', 'Developer', 'Manager', 'Analyst', 'Designer', 
                     'Consultant', 'Intern', 'Director', 'Lead', 'Architect'];
  
  const experience: ExperienceDetail[] = [];
  
  let experienceScore = 0;
  
  jobTitles.forEach(title => {
    const regex = new RegExp(`((?:\\w+\\s){0,2}${title}(?:\\s\\w+){0,2})(?:.{0,100}?)(?:19|20)\\d{2}(?:\\s*-\\s*(?:(?:19|20)\\d{2}|present))?`, 'gi');
    const matches = text.matchAll(regex);
    
    for (const match of matches) {
      const fullMatch = match[0];
      const role = match[1] || "Role not specified";
      const durationMatch = fullMatch.match(/(19|20)\d{2}(?:\s*-\s*(?:(?:19|20)\d{2}|present))?/i);
      
      // Look for highlights as bullet points or numbered lists
      const highlightRegex = new RegExp(`(?:${role}.*?)((?:•|\\*|\\d+\\.)[^•\\*\\d]+)`, 'gi');
      const highlightMatches = text.match(highlightRegex) || [];
      
      const highlights = highlightMatches.length > 0 
        ? highlightMatches[0].split(/[•\*]|\d+\./).filter(h => h.trim().length > 0).map(h => h.trim())
        : ["Responsibilities not specified"];
      
      if (durationMatch) {
        // Calculate duration in months
        const durationText = durationMatch[0];
        let durationMonths = 0;
        
        const yearRangeMatch = durationText.match(/(20|19)\d{2}[^\d]+(20|19)\d{2}/);
        if (yearRangeMatch) {
          const startYear = parseInt(yearRangeMatch[0].substring(0, 4));
          const endYear = parseInt(yearRangeMatch[0].substring(yearRangeMatch[0].length - 4));
          durationMonths = (endYear - startYear) * 12;
        }
        
        // Score based on duration
        const durationScore = Math.min(5, durationMonths / 12);
        
        // Score based on highlights
        const highlightScore = Math.min(5, highlights.length);
        
        experienceScore += durationScore + highlightScore;
        
        experience.push({
          role: role,
          company: "Company extracted from context", // Would be better extracted in a real implementation
          duration: durationMatch[0],
          highlights: highlights
        });
      }
    }
  });
  
  // Cap experience score at 25 points
  experienceScore = Math.min(25, experienceScore);
  
  // If no experience detected, provide default placeholder
  if (experience.length === 0) {
    experience.push({
      role: "Role not detected",
      company: "Company not detected",
      duration: "Duration not detected",
      highlights: ["Experience details not detected"]
    });
  }
  
  // Extract keyword matches for general keywords
  const keywordMatches: { [key: string]: number } = {};
  const commonKeywords = ['project', 'team', 'management', 'development', 'design', 
                         'implementation', 'analysis', 'research', 'client', 'customer',
                         'leadership', 'communication', 'problem-solving', 'innovation',
                         'achievement', 'success', 'certification', 'award', 'publication'];
  
  let keywordsScore = 0;
  commonKeywords.forEach(keyword => {
    const count = (textLower.match(new RegExp(keyword, 'gi')) || []).length;
    if (count > 0) {
      keywordMatches[keyword] = count;
      keywordsScore += count * 0.5;
    }
  });
  
  // Cap keywords score at 10 points
  keywordsScore = Math.min(10, keywordsScore);
  
  // Look for certifications, projects, and publications
  const certificationRegex = /(?:certification|certified|certificate)(?:.{0,50}?)([A-Za-z\s]+)/gi;
  const certMatches = text.matchAll(certificationRegex);
  let certCount = 0;
  for (const match of certMatches) {
    certCount++;
  }
  
  const projectRegex = /project(?:.{0,50}?)([A-Za-z\s]+)/gi;
  const projectMatches = text.matchAll(projectRegex);
  let projectCount = 0;
  for (const match of projectMatches) {
    projectCount++;
  }
  
  // Extra score for certifications (up to 10 points) and projects (up to 10 points)
  const extraScore = Math.min(20, (certCount * 5) + (projectCount * 2));
  
  // Calculate overall score based on all components
  // Total: 25 (skills) + 20 (education) + 25 (experience) + 10 (keywords) + 20 (extra) = 100
  const overallScore = Math.round(skillsScore + educationScore + experienceScore + keywordsScore + extraScore);
  
  // Generate improvement suggestions
  const improvementSuggestions: string[] = [];
  
  // Suggestions based on skills
  if (extractedSkills.length < 5) {
    improvementSuggestions.push("Add more relevant technical skills to your resume to better match job requirements.");
  }
  
  // Suggestions based on experience
  if (experience.length < 2 || (experience.length > 0 && experience[0].highlights.length < 3)) {
    improvementSuggestions.push("Quantify your achievements in your experience section with metrics (e.g., 'Increased sales by 20%').");
    improvementSuggestions.push("Add more detailed bullet points to your experience section highlighting your responsibilities and accomplishments.");
  }
  
  // Suggestions based on education
  if (education.length === 0 || education[0].degree === "Degree not detected") {
    improvementSuggestions.push("Clearly format your education section with degree, institution, year, and academic achievements.");
  }
  
  // Suggestions based on keywords
  if (Object.keys(keywordMatches).length < 6) {
    improvementSuggestions.push("Include more industry-specific keywords throughout your resume to improve ATS compatibility.");
  }
  
  // Suggestions for general improvements
  improvementSuggestions.push("Consider adding a professional summary at the beginning of your resume.");
  improvementSuggestions.push("Ensure consistent formatting and appropriate use of white space for improved readability.");
  improvementSuggestions.push("Tailor your resume for each specific job application to highlight relevant skills and experience.");
  
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
    preferredLocations: ['Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Chennai'],
    improvementSuggestions,
    rawText: text.substring(0, 1000) // Store first 1000 chars of raw text for debugging
  };
};

// Parser function to extract structured data from resume
const parseResumeContent = async (file: File): Promise<ResumeAnalysisResult> => {
  try {
    console.log('Starting OCR processing for file:', file.name);
    
    // Extract text using OCR or appropriate parser
    const extractedText = await extractTextFromFile(file);
    
    if (!extractedText || extractedText.trim().length === 0) {
      console.log('No text extracted or empty result, using mock data');
      return getMockAnalysisResult();
    }
    
    // Parse the extracted text to get structured information
    return parseResumeText(extractedText);
  } catch (error) {
    console.error('Error parsing resume content:', error);
    return getMockAnalysisResult();
  }
};

// Mock data for fallback
const getMockAnalysisResult = (): ResumeAnalysisResult => {
  return {
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
    overallScore: 78,
    improvementSuggestions: [
      "Quantify your achievements with metrics (e.g., 'Increased efficiency by X%')",
      "Add more technical skills relevant to your target roles",
      "Include a professional summary highlighting your strengths",
      "Ensure consistent formatting throughout your resume"
    ],
    rawText: "This is sample mock text that would be replaced by actual extracted content."
  };
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
        resolve(getMockAnalysisResult());
      }
    }, 2000); // Simulate some processing time
  });
};
