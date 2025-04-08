
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
  debugInfo?: any; // Additional debug info
}

// Debug flag - set to true to see more detailed logs and raw text
const DEBUG_MODE = true;

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
    
    if (DEBUG_MODE) {
      console.log('PDF text extraction successful. Sample text:', fullText.substring(0, 200));
    }
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
      
      // Fix the Tesseract worker creation
      const worker = await createWorker({
        logger: DEBUG_MODE ? m => console.log(m) : undefined,
      });
      
      // Convert file to data URL for Tesseract to process
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data } = await worker.recognize(dataUrl);
      const text = data.text;
      
      await worker.terminate();
      if (DEBUG_MODE) {
        console.log('Tesseract OCR processing complete. Sample text:', text.substring(0, 200));
      }
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

// Improved function to parse text and extract structured information
const parseResumeText = (text: string): ResumeAnalysisResult => {
  console.log('Parsing extracted text...');
  if (DEBUG_MODE) {
    console.log('Sample of extracted text:', text.substring(0, 500) + '...');
  }
  
  // Extract skills (keywords frequently found in tech resumes)
  const skillKeywords = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 
    'SQL', 'Java', 'C++', 'C#', 'HTML', 'CSS', 'AWS', 'Azure',
    'Docker', 'Kubernetes', 'Git', 'GitHub', 'REST API', 'GraphQL',
    'MongoDB', 'Express', 'Django', 'Flask', 'Spring Boot', 'TensorFlow',
    'PyTorch', 'Machine Learning', 'AI', 'Data Science', 'DevOps',
    'CI/CD', 'Jenkins', 'Agile', 'Scrum', 'Project Management',
    // Add more skills
    'Ruby', 'PHP', 'Go', 'Swift', 'Kotlin', 'R', 'Scala', 'Rust',
    'Vue.js', 'Angular', 'Next.js', 'Redux', 'jQuery', 'Bootstrap',
    'Tailwind CSS', 'SASS', 'LESS', 'PostgreSQL', 'MySQL', 'Oracle',
    'Firebase', 'GraphQL', 'RESTful API', 'Microservices', 'Linux',
    'Windows', 'macOS', 'Bash', 'PowerShell', 'Networking', 'Security'
  ];
  
  const extractedSkills: SkillAnalysis[] = [];
  let textLower = text.toLowerCase();
  
  // Skills score - out of 25 points
  let skillsScore = 0;
  
  skillKeywords.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      // Enhanced scoring based on frequency, position in text, and proximity to keywords like "expert", "proficient", etc.
      const count = (textLower.match(new RegExp(skill.toLowerCase(), 'g')) || []).length;
      const position = textLower.indexOf(skill.toLowerCase());
      
      // Check for skill level indicators
      let skillLevelBoost = 0;
      const expertiseTerms = ['expert', 'advanced', 'proficient', 'experienced', 'senior', 'lead'];
      const intermediateTerms = ['intermediate', 'familiar', 'knowledgeable', 'competent'];
      const beginnerTerms = ['beginner', 'basic', 'novice', 'learning', 'familiar'];
      
      // Search for expertise terms near the skill (within 50 chars)
      const surroundingText = textLower.substring(
        Math.max(0, position - 50), 
        Math.min(textLower.length, position + skill.length + 50)
      );
      
      if (expertiseTerms.some(term => surroundingText.includes(term))) {
        skillLevelBoost = 20;
      } else if (intermediateTerms.some(term => surroundingText.includes(term))) {
        skillLevelBoost = 10;
      } else if (beginnerTerms.some(term => surroundingText.includes(term))) {
        skillLevelBoost = 0;
      }
      
      const relevance = Math.min(100, 50 + count * 10 + (position < 500 ? 10 : 0) + skillLevelBoost);
      
      let level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      if (relevance > 90) {
        level = 'expert';
        skillsScore += 1.5;
      }
      else if (relevance > 75) {
        level = 'advanced'; 
        skillsScore += 1;
      }
      else if (relevance > 60) {
        level = 'intermediate';
        skillsScore += 0.75;
      }
      else {
        level = 'beginner';
        skillsScore += 0.5;
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
  
  // Enhanced education extraction with better regex patterns
  // This regex looks for education keywords followed by institution names and dates
  const educationSections = extractEducationSections(text);
  
  // Extract education with improved patterns
  const educationDetails = extractEducationDetails(text, educationSections);
  
  // Education score - out of 20 points
  const educationScore = calculateEducationScore(educationDetails);
  
  // Enhanced experience extraction
  const experienceSections = extractExperienceSections(text);
  const experienceDetails = extractExperienceDetails(text, experienceSections);
  
  // Experience score - out of 25 points
  const experienceScore = calculateExperienceScore(experienceDetails);
  
  // Extract keyword matches for general keywords
  const keywordMatches: { [key: string]: number } = {};
  const commonKeywords = [
    'project', 'team', 'management', 'development', 'design', 
    'implementation', 'analysis', 'research', 'client', 'customer',
    'leadership', 'communication', 'problem-solving', 'innovation',
    'achievement', 'success', 'certification', 'award', 'publication',
    'optimization', 'efficiency', 'collaboration', 'teamwork', 'agile',
    'scrum', 'presentation', 'documentation', 'testing', 'debugging',
    'mentoring', 'coaching', 'stakeholder', 'requirement', 'specification',
    'workflow', 'process', 'strategy', 'planning', 'execution'
  ];
  
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
  
  // Generate improvement suggestions based on the parsed content
  const improvementSuggestions = generateImprovementSuggestions(
    extractedSkills, 
    educationDetails,
    experienceDetails, 
    keywordMatches,
    text
  );
  
  // Extract potential job titles and locations for job matching
  const preferredJobTitles = deriveJobTitles(extractedSkills, experienceDetails);
  
  // Debug information
  const debugInfo = DEBUG_MODE ? {
    skillsScore,
    educationScore,
    experienceScore,
    keywordsScore,
    extraScore,
    certCount,
    projectCount
  } : undefined;
  
  // Return the structured result
  return {
    topSkills: extractedSkills.slice(0, 10), // Top 10 skills
    education: educationDetails,
    experience: experienceDetails,
    keywordMatches,
    overallScore,
    preferredJobTitles,
    preferredLocations: ['Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Chennai'],
    improvementSuggestions,
    rawText: DEBUG_MODE ? text.substring(0, 2000) : undefined, // Store more text in debug mode
    debugInfo
  };
};

// Helper function to extract education sections
const extractEducationSections = (text: string): string[] => {
  // First try to find sections that look like education sections
  const educationRegex = /(?:EDUCATION|Education|ACADEMIC|Academic|QUALIFICATION|Qualification|ACADEMICS)(?:.{0,1000}?)(?=EXPERIENCE|Experience|WORK|Work|PROJECT|Project|SKILL|Skill|CERTIFICATION|Certification|ACHIEVEMENT|Achievement|REFERENCE|Reference|$)/gs;
  const educationMatches = text.match(educationRegex) || [];
  
  if (educationMatches.length > 0) {
    return educationMatches;
  }
  
  // Fallback to scanning for degree mentions
  const degreeRegex = /(?:B\.?(?:Tech|Sc|A|E|S)|M\.?(?:Tech|Sc|A|BA|S)|Ph\.?D|MBA|Bachelor|Master|Diploma)(?:.{0,200}?)(?:19|20)\d{2}/gi;
  const degreeMatches = text.match(degreeRegex) || [];
  
  return degreeMatches;
};

// Helper function to extract experience sections
const extractExperienceSections = (text: string): string[] => {
  // First try to find sections that look like experience sections
  const experienceRegex = /(?:EXPERIENCE|Experience|EMPLOYMENT|Employment|WORK HISTORY|Work History|PROFESSIONAL|Professional)(?:.{0,3000}?)(?=EDUCATION|Education|SKILL|Skill|PROJECT|Project|CERTIFICATION|Certification|ACHIEVEMENT|Achievement|REFERENCE|Reference|$)/gs;
  const experienceMatches = text.match(experienceRegex) || [];
  
  if (experienceMatches.length > 0) {
    return experienceMatches;
  }
  
  // Fallback to scanning for job title mentions
  const roleRegex = /(?:[A-Z][a-z]+ )?(?:Engineer|Developer|Manager|Analyst|Designer|Consultant|Director|Lead|Architect)(?:.{0,100}?)(?:19|20)\d{2}(?:\s*-\s*(?:(?:19|20)\d{2}|present|current))?/gi;
  const roleMatches = text.match(roleRegex) || [];
  
  return roleMatches;
};

// Helper function to extract education details
const extractEducationDetails = (text: string, educationSections: string[]): EducationDetail[] => {
  const education: EducationDetail[] = [];
  
  if (educationSections.length === 0) {
    // If no education sections found, search the full text
    const degreeRegex = /(?:B\.?(?:Tech|Sc|A|E|S)|M\.?(?:Tech|Sc|A|BA|S)|Ph\.?D|MBA|Bachelor|Master|Diploma)(?:[^.\n,]{0,100})(?:(?:19|20)\d{2}|University|College|Institute)/gi;
    const matches = text.match(degreeRegex) || [];
    
    matches.forEach(match => {
      const degreeMatch = match.match(/(?:B\.?(?:Tech|Sc|A|E|S)|M\.?(?:Tech|Sc|A|BA|S)|Ph\.?D|MBA|Bachelor|Master|Diploma)/i);
      const institutionMatch = match.match(/(?:University|College|Institute|School)(?:\s+of\s+)?([A-Za-z\s]+)/i);
      const yearMatch = match.match(/(19|20)\d{2}(?:\s*-\s*(?:(?:19|20)\d{2}|present))?/i);
      const scoreMatch = match.match(/(?:CGPA|GPA|score|percentage)[\s:]+([\d\.]+)(?:%)?/i);
      
      education.push({
        degree: degreeMatch ? degreeMatch[0] : "Degree not detected",
        institution: institutionMatch ? institutionMatch[0] : "Institution not detected",
        year: yearMatch ? yearMatch[0] : "Year not detected",
        score: scoreMatch ? scoreMatch[1] : "Score not detected"
      });
    });
  } else {
    // Process the education sections we found
    educationSections.forEach(section => {
      // Look for degree patterns
      const degreeRegex = /(?:B\.?(?:Tech|Sc|A|E|S)|M\.?(?:Tech|Sc|A|BA|S)|Ph\.?D|MBA|Bachelor|Master|Diploma)/gi;
      const degreeMatches = section.match(degreeRegex) || [];
      
      // Look for institution patterns
      const institutionRegex = /(?:University|College|Institute|School)(?:\s+of\s+)?([A-Za-z\s,]+)/gi;
      const institutionMatches = section.match(institutionRegex) || [];
      
      // Look for year patterns
      const yearRegex = /(19|20)\d{2}(?:\s*-\s*(?:(?:19|20)\d{2}|present))?/gi;
      const yearMatches = section.match(yearRegex) || [];
      
      // Look for score patterns
      const scoreRegex = /(?:CGPA|GPA|score|percentage)[\s:]+([\d\.]+)(?:%)?/gi;
      const scoreMatches = section.match(scoreRegex) || [];
      
      if (degreeMatches.length > 0) {
        education.push({
          degree: degreeMatches[0],
          institution: institutionMatches.length > 0 ? institutionMatches[0] : "Institution not detected",
          year: yearMatches.length > 0 ? yearMatches[0] : "Year not detected",
          score: scoreMatches.length > 0 ? scoreMatches[0].replace(/(?:CGPA|GPA|score|percentage)[\s:]+/, '') : "Score not detected"
        });
      }
    });
  }
  
  // If still no education detected, provide default placeholder
  if (education.length === 0) {
    education.push({
      degree: "Degree not detected",
      institution: "Institution not detected",
      year: "Year not detected",
      score: "Score not detected"
    });
  }
  
  return education;
};

// Helper function to extract experience details
const extractExperienceDetails = (text: string, experienceSections: string[]): ExperienceDetail[] => {
  const experience: ExperienceDetail[] = [];
  
  if (experienceSections.length === 0) {
    // If no experience sections found, search full text for role/date patterns
    const jobTitles = ['Engineer', 'Developer', 'Manager', 'Analyst', 'Designer', 'Consultant', 'Intern', 'Director', 'Lead', 'Architect'];
    
    jobTitles.forEach(title => {
      const regex = new RegExp(`((?:\\w+\\s){0,2}${title}(?:\\s\\w+){0,2})(?:.{0,100}?)(?:19|20)\\d{2}(?:\\s*-\\s*(?:(?:19|20)\\d{2}|present))?`, 'gi');
      const matches = Array.from(text.matchAll(regex));
      
      matches.forEach(match => {
        const fullMatch = match[0];
        const role = match[1] || "Role not specified";
        const durationMatch = fullMatch.match(/(19|20)\d{2}(?:\s*-\s*(?:(?:19|20)\d{2}|present))?/i);
        
        // Look for company name pattern near the role
        const companyRegex = new RegExp(`${role}(?:.{0,50}?)at\\s+([A-Za-z0-9\\s&.,]+?)(?:\\.|,|\\n|$)`, 'i');
        const companyMatch = text.match(companyRegex);
        
        // Look for highlights as bullet points or numbered lists
        const highlightRegex = new RegExp(`(?:${role}.*?)((?:•|\\*|\\-|\\d+\\.)[^•\\*\\d]+)`, 'gi');
        const highlightMatches = text.match(highlightRegex) || [];
        
        const highlights = highlightMatches.length > 0 
          ? highlightMatches[0].split(/[•\*\-]|\d+\./).filter(h => h.trim().length > 0).map(h => h.trim())
          : ["Responsibilities not specified"];
        
        if (durationMatch) {
          experience.push({
            role: role,
            company: companyMatch ? companyMatch[1].trim() : "Company not detected",
            duration: durationMatch[0],
            highlights: highlights
          });
        }
      });
    });
  } else {
    // Process the experience sections we found
    experienceSections.forEach(section => {
      // Look for role patterns
      const roleRegex = /(?:[A-Z][a-z]+ )?(?:Engineer|Developer|Manager|Analyst|Designer|Consultant|Director|Lead|Architect)(?:\s+[A-Za-z]+)?/gi;
      const roleMatches = section.match(roleRegex) || [];
      
      // Look for company patterns
      const companyRegex = /at\s+([A-Za-z0-9\s&.,]+?)(?:\.|,|\n|$)/gi;
      const companyMatches = section.match(companyRegex) || [];
      
      // Look for duration patterns
      const durationRegex = /(19|20)\d{2}(?:\s*-\s*(?:(?:19|20)\d{2}|present))?/gi;
      const durationMatches = section.match(durationRegex) || [];
      
      // Look for bullet points as highlights
      const bulletRegex = /(?:•|\*|\-|\d+\.)\s+([^\n•\*\d]+)/gi;
      const bulletMatches = Array.from(section.matchAll(bulletRegex)) || [];
      
      const highlights = bulletMatches.map(match => match[1].trim());
      
      if (roleMatches.length > 0) {
        experience.push({
          role: roleMatches[0],
          company: companyMatches.length > 0 ? companyMatches[0].replace(/at\s+/, '').trim() : "Company not detected",
          duration: durationMatches.length > 0 ? durationMatches[0] : "Duration not detected",
          highlights: highlights.length > 0 ? highlights : ["Responsibilities not specified"]
        });
      }
    });
  }
  
  // If no experience detected, provide default placeholder
  if (experience.length === 0) {
    experience.push({
      role: "Role not detected",
      company: "Company not detected",
      duration: "Duration not detected",
      highlights: ["Experience details not detected"]
    });
  }
  
  return experience;
};

// Helper function to calculate education score
const calculateEducationScore = (education: EducationDetail[]): number => {
  let score = 0;
  
  education.forEach(edu => {
    // Points for having degree information
    if (edu.degree !== "Degree not detected") {
      score += 5;
      
      // Additional points for higher degrees
      if (/Ph\.?D|Doctorate/i.test(edu.degree)) {
        score += 5;
      } else if (/M\.?(?:Tech|Sc|A|BA|S)|Master/i.test(edu.degree)) {
        score += 3;
      } else if (/B\.?(?:Tech|Sc|A|E|S)|Bachelor/i.test(edu.degree)) {
        score += 2;
      }
    }
    
    // Points for having institution information
    if (edu.institution !== "Institution not detected") {
      score += 3;
    }
    
    // Points for having year information
    if (edu.year !== "Year not detected") {
      score += 2;
    }
    
    // Points for having score information
    if (edu.score !== "Score not detected") {
      score += 2;
    }
  });
  
  return Math.min(20, score); // Cap at 20 points
};

// Helper function to calculate experience score
const calculateExperienceScore = (experience: ExperienceDetail[]): number => {
  let score = 0;
  
  experience.forEach(exp => {
    // Points for having role information
    if (exp.role !== "Role not detected") {
      score += 4;
      
      // Additional points for senior roles
      if (/senior|lead|manager|director|head|chief/i.test(exp.role)) {
        score += 3;
      }
    }
    
    // Points for having company information
    if (exp.company !== "Company not detected") {
      score += 3;
    }
    
    // Points for having duration information
    if (exp.duration !== "Duration not detected") {
      score += 2;
      
      // Calculate duration in years (approximate)
      const durationMatch = exp.duration.match(/(19|20)\d{2}(?:\s*-\s*(?:(19|20)\d{2}|present))?/i);
      if (durationMatch) {
        const startYear = parseInt(durationMatch[0].substring(0, 4));
        const endYearMatch = durationMatch[0].match(/-\s*((?:19|20)\d{2}|present)/i);
        let endYear;
        
        if (endYearMatch) {
          endYear = endYearMatch[1].toLowerCase() === 'present' 
            ? new Date().getFullYear() 
            : parseInt(endYearMatch[1]);
          
          // Additional points based on years of experience
          const years = endYear - startYear;
          score += Math.min(5, years); // Up to 5 additional points
        }
      }
    }
    
    // Points for having highlights
    if (exp.highlights.length > 0 && exp.highlights[0] !== "Responsibilities not specified") {
      // Points for each highlight (up to 5)
      score += Math.min(5, exp.highlights.length);
      
      // Additional points for achievements with metrics
      let achievementCount = 0;
      exp.highlights.forEach(highlight => {
        if (/increased|improved|reduced|achieved|delivered|led|managed|created|developed|implemented/i.test(highlight)) {
          achievementCount++;
        }
        // Extra points for quantifiable achievements
        if (/\d+%|\d+ percent|\d+ times/i.test(highlight)) {
          achievementCount++;
        }
      });
      
      score += Math.min(3, achievementCount);
    }
  });
  
  return Math.min(25, score); // Cap at 25 points
};

// Helper function to generate improvement suggestions
const generateImprovementSuggestions = (
  skills: SkillAnalysis[],
  education: EducationDetail[],
  experience: ExperienceDetail[],
  keywords: { [key: string]: number },
  rawText: string
): string[] => {
  const suggestions: string[] = [];
  
  // Suggestions based on skills
  if (skills.length < 5) {
    suggestions.push("Add more relevant technical skills to your resume to better match job requirements.");
  }
  
  // Suggestions based on experience
  if (experience.length < 2 || (experience.length > 0 && experience[0].highlights.length < 3)) {
    suggestions.push("Quantify your achievements in your experience section with metrics (e.g., 'Increased sales by 20%').");
    suggestions.push("Add more detailed bullet points to your experience section highlighting your responsibilities and accomplishments.");
  }
  
  // Check if experience contains quantifiable metrics
  let hasQuantifiableMetrics = false;
  experience.forEach(exp => {
    exp.highlights.forEach(highlight => {
      if (/\d+%|\d+ percent|\$\d+|\d+ times|\d+ customers|\d+ users|\d+ clients/i.test(highlight)) {
        hasQuantifiableMetrics = true;
      }
    });
  });
  
  if (!hasQuantifiableMetrics) {
    suggestions.push("Include specific metrics and numbers in your experience section (e.g., 'Reduced costs by 15%' or 'Managed a team of 8 developers').");
  }
  
  // Suggestions based on education
  if (education.length === 0 || education[0].degree === "Degree not detected") {
    suggestions.push("Clearly format your education section with degree, institution, year, and academic achievements.");
  }
  
  // Suggestions based on keywords
  if (Object.keys(keywords).length < 6) {
    suggestions.push("Include more industry-specific keywords throughout your resume to improve ATS compatibility.");
  }
  
  // Check for summary/objective
  if (!rawText.toLowerCase().includes('summary') && !rawText.toLowerCase().includes('objective')) {
    suggestions.push("Consider adding a professional summary at the beginning of your resume.");
  }
  
  // Check for projects section
  if (!rawText.toLowerCase().includes('project')) {
    suggestions.push("Add a projects section to showcase practical applications of your skills.");
  }
  
  // Check for certifications
  if (!rawText.toLowerCase().includes('certif')) {
    suggestions.push("Include relevant certifications to validate your skills and knowledge.");
  }
  
  // Check for contact information
  if (!rawText.toLowerCase().includes('@') || !(/\d{3}[-\.\s]?\d{3}[-\.\s]?\d{4}/.test(rawText))) {
    suggestions.push("Ensure your contact information (email and phone) is clearly visible at the top of your resume.");
  }
  
  // Suggestions for general improvements
  suggestions.push("Ensure consistent formatting and appropriate use of white space for improved readability.");
  suggestions.push("Tailor your resume for each specific job application to highlight relevant skills and experience.");
  
  return suggestions;
};

// Helper function to derive job titles
const deriveJobTitles = (skills: SkillAnalysis[], experience: ExperienceDetail[]): string[] => {
  const titles: string[] = [];
  
  // Derive from top skills
  if (skills.length > 0) {
    const topSkills = skills.slice(0, 3).map(s => s.skill);
    
    const techMapping: { [key: string]: string[] } = {
      'JavaScript': ['JavaScript Developer', 'Frontend Developer', 'Full Stack Developer'],
      'React': ['React Developer', 'Frontend Developer', 'UI Developer'],
      'Node.js': ['Node.js Developer', 'Backend Developer', 'Full Stack Developer'],
      'Python': ['Python Developer', 'Data Scientist', 'Backend Developer'],
      'Java': ['Java Developer', 'Software Engineer', 'Backend Developer'],
      'C#': ['C# Developer', '.NET Developer', 'Software Engineer'],
      'SQL': ['Database Developer', 'Data Analyst', 'Backend Developer'],
      'AWS': ['Cloud Engineer', 'DevOps Engineer', 'Solutions Architect'],
      'Docker': ['DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer'],
      'Machine Learning': ['Machine Learning Engineer', 'Data Scientist', 'AI Specialist']
    };
    
    topSkills.forEach(skill => {
      if (techMapping[skill]) {
        titles.push(...techMapping[skill]);
      }
    });
    
    // Add generic titles based on skill categories
    const frontendSkills = ['JavaScript', 'React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'UI', 'UX'];
    const backendSkills = ['Node.js', 'Django', 'Flask', 'Express', 'Java', 'C#', 'PHP', 'Ruby'];
    const dataSkills = ['Python', 'R', 'SQL', 'Machine Learning', 'Data Science', 'Statistics', 'Pandas'];
    const devopsSkills = ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'DevOps'];
    
    const hasFrontend = topSkills.some(skill => frontendSkills.includes(skill));
    const hasBackend = topSkills.some(skill => backendSkills.includes(skill));
    const hasData = topSkills.some(skill => dataSkills.includes(skill));
    const hasDevOps = topSkills.some(skill => devopsSkills.includes(skill));
    
    if (hasFrontend && hasBackend) titles.push('Full Stack Developer');
    else if (hasFrontend) titles.push('Frontend Developer');
    else if (hasBackend) titles.push('Backend Developer');
    
    if (hasData) titles.push('Data Scientist');
    if (hasDevOps) titles.push('DevOps Engineer');
  }
  
  // If we have experience, extract titles from there
  experience.forEach(exp => {
    if (exp.role !== "Role not detected") {
      titles.push(exp.role);
    }
  });
  
  // Deduplicate and return limited list
  return Array.from(new Set(titles)).slice(0, 5);
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

// Enhanced mock data for fallback
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
          "Implemented responsive UI components",
          "Reduced page load time by 40% through code optimization"
        ]
      },
      {
        role: "Student Developer",
        company: "College Tech Club",
        duration: "Aug 2022 - Present",
        highlights: [
          "Leading a team of 5 developers",
          "Created a campus event management application",
          "Increased user engagement by 60% through UI improvements"
        ]
      }
    ],
    overallScore: 78,
    improvementSuggestions: [
      "Quantify your achievements with metrics (e.g., 'Increased efficiency by X%')",
      "Add more technical skills relevant to your target roles",
      "Include a professional summary highlighting your strengths",
      "Ensure consistent formatting throughout your resume",
      "Add links to your GitHub profile or portfolio website",
      "Include relevant certifications to validate your skills"
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
