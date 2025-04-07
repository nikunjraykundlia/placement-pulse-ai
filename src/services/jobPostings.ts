
/**
 * Service to interact with TheirStack Job Postings API
 */

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  url?: string;
  description?: string;
  skills?: string[];
  datePosted?: string;
}

interface JobSearchParams {
  skills?: string[];
  location?: string;
  title?: string;
  limit?: number;
}

// API key for TheirStack Job Postings API
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuaWt1bmpyb2NrczEyOThAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIiwiY3JlYXRlZF9hdCI6IjIwMjUtMDQtMDdUMDk6MDA6NTcuODY1NzgxKzAwOjAwIn0.G9fAAR_CMY1jIhXE9zozaWgzm_ju8CM1IlMaiavxfU4";

// Base URL for the API - would be replaced with actual endpoint in production
const API_BASE_URL = "https://api.theirstack.com/v1";

/**
 * Fetches job postings based on search parameters
 */
export async function fetchJobPostings(params: JobSearchParams): Promise<JobPosting[]> {
  try {
    console.log('Fetching job postings with params:', params);
    
    // Construct query parameters
    const queryParams = new URLSearchParams();
    
    if (params.skills && params.skills.length > 0) {
      // Add skills as comma-separated list
      queryParams.append('skills', params.skills.join(','));
    }
    
    if (params.location) {
      queryParams.append('location', params.location);
    }
    
    if (params.title) {
      queryParams.append('title', params.title);
    }
    
    // Set default limit if not provided
    queryParams.append('limit', String(params.limit || 5));
    
    // In a production environment, this would be an actual API call
    // const response = await fetch(`${API_BASE_URL}/jobs?${queryParams}`, {
    //   headers: {
    //     'Authorization': `Bearer ${API_KEY}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // 
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status}`);
    // }
    // 
    // return await response.json();
    
    // For development, return mock data based on search parameters
    return getMockJobPostings(params);
  } catch (error) {
    console.error('Error fetching job postings:', error);
    return [];
  }
}

/**
 * Get mock job postings based on search parameters
 * This is used when the API is not available or for development purposes
 */
function getMockJobPostings(params: JobSearchParams): JobPosting[] {
  const allJobs: JobPosting[] = [
    {
      id: '1',
      title: 'Software Developer',
      company: 'TechCorp India',
      location: 'Bengaluru, India',
      salaryMin: 800000,
      salaryMax: 1200000,
      salaryCurrency: 'INR',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      datePosted: '2025-03-15',
      description: 'We are seeking a skilled Software Developer to join our innovative team. You will be responsible for developing high-quality applications, collaborating with cross-functional teams, and ensuring the performance and quality of applications.'
    },
    {
      id: '2',
      title: 'Machine Learning Engineer',
      company: 'AI Solutions Ltd',
      location: 'Hyderabad, India',
      salaryMin: 1000000,
      salaryMax: 1500000,
      salaryCurrency: 'INR',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Analysis'],
      datePosted: '2025-03-28',
      description: 'Join our AI team to design and implement machine learning models, collaborate with data scientists, and optimize existing systems for maximum efficiency and accuracy.'
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      company: 'WebTech Solutions',
      location: 'Pune, India',
      salaryMin: 900000,
      salaryMax: 1400000,
      salaryCurrency: 'INR',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      datePosted: '2025-03-20',
      description: 'Looking for an experienced Full Stack Developer who can work on both front-end and back-end development, create responsive user interfaces, and implement RESTful APIs.'
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'CloudOps Tech',
      location: 'Mumbai, India',
      salaryMin: 1100000,
      salaryMax: 1600000,
      salaryCurrency: 'INR',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      datePosted: '2025-03-25',
      description: 'As a DevOps Engineer, you will be responsible for building and maintaining our cloud infrastructure, implementing CI/CD pipelines, and ensuring system reliability and performance.'
    },
    {
      id: '5',
      title: 'Data Scientist',
      company: 'DataMinds Analytics',
      location: 'Bengaluru, India',
      salaryMin: 1200000,
      salaryMax: 1800000,
      salaryCurrency: 'INR',
      skills: ['Python', 'R', 'Machine Learning', 'SQL', 'Data Visualization'],
      datePosted: '2025-03-18',
      description: 'We are looking for a Data Scientist to analyze complex datasets, develop predictive models, and translate data insights into actionable business recommendations.'
    },
    {
      id: '6',
      title: 'Frontend Developer',
      company: 'UX Innovations',
      location: 'Delhi, India',
      salaryMin: 700000,
      salaryMax: 1200000,
      salaryCurrency: 'INR',
      skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Tailwind'],
      datePosted: '2025-03-22',
      description: 'Join our team to design and implement responsive user interfaces, collaborate with designers, and optimize frontend performance for our web applications.'
    },
    {
      id: '7',
      title: 'Backend Developer',
      company: 'ServerSide Solutions',
      location: 'Chennai, India',
      salaryMin: 800000,
      salaryMax: 1300000,
      salaryCurrency: 'INR',
      skills: ['Java', 'Spring Boot', 'SQL', 'Microservices'],
      datePosted: '2025-03-19',
      description: 'We are seeking a Backend Developer to design and implement scalable server-side solutions, integrate with databases, and ensure high-performance and responsiveness to front-end requests.'
    },
    {
      id: '8',
      title: 'Cloud Solutions Architect',
      company: 'CloudNative Inc',
      location: 'Hyderabad, India',
      salaryMin: 1500000,
      salaryMax: 2200000,
      salaryCurrency: 'INR',
      skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Infrastructure as Code'],
      datePosted: '2025-03-21',
      description: 'As a Cloud Solutions Architect, you will design and implement cloud-native applications, migrate existing systems to the cloud, and optimize costs, performance, and security.'
    },
    {
      id: '9',
      title: 'UI/UX Designer',
      company: 'DesignWorks Digital',
      location: 'Bengaluru, India',
      salaryMin: 850000,
      salaryMax: 1300000,
      salaryCurrency: 'INR',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'UI Design'],
      datePosted: '2025-03-24',
      description: 'Join our creative team to design intuitive user interfaces, conduct user research, and create wireframes and prototypes for web and mobile applications.'
    },
    {
      id: '10',
      title: 'Product Manager',
      company: 'InnovateTech',
      location: 'Mumbai, India',
      salaryMin: 1400000,
      salaryMax: 2000000,
      salaryCurrency: 'INR',
      skills: ['Product Strategy', 'Agile', 'Market Research', 'User Stories', 'Roadmapping'],
      datePosted: '2025-03-17',
      description: 'We are looking for a Product Manager to define product vision, create roadmaps, prioritize features, and work with development teams to deliver high-quality products.'
    }
  ];
  
  // Filter jobs based on parameters
  let filteredJobs = [...allJobs];
  
  if (params.skills && params.skills.length > 0) {
    filteredJobs = filteredJobs.filter(job => {
      return params.skills!.some(skill => 
        job.skills?.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
    });
  }
  
  if (params.location) {
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(params.location!.toLowerCase())
    );
  }
  
  if (params.title) {
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(params.title!.toLowerCase())
    );
  }
  
  // Sort by relevance (more skills matches = higher relevance)
  if (params.skills && params.skills.length > 0) {
    filteredJobs.sort((a, b) => {
      const aMatches = params.skills!.filter(skill => 
        a.skills?.some(jobSkill => jobSkill.toLowerCase().includes(skill.toLowerCase()))
      ).length;
      
      const bMatches = params.skills!.filter(skill => 
        b.skills?.some(jobSkill => jobSkill.toLowerCase().includes(skill.toLowerCase()))
      ).length;
      
      return bMatches - aMatches;
    });
  }
  
  // Limit results
  return filteredJobs.slice(0, params.limit || 5);
}

export type { JobPosting, JobSearchParams };
