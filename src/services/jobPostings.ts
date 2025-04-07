
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

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuaWt1bmpyb2NrczEyOThAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIiwiY3JlYXRlZF9hdCI6IjIwMjUtMDQtMDdUMDk6MDA6NTcuODY1NzgxKzAwOjAwIn0.G9fAAR_CMY1jIhXE9zozaWgzm_ju8CM1IlMaiavxfU4";

/**
 * Fetches job postings based on search parameters
 */
export async function fetchJobPostings(params: JobSearchParams): Promise<JobPosting[]> {
  try {
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
    
    // Mock API response for now as we don't have the actual API endpoint
    // In a real implementation, this would be a fetch call to the API
    // const response = await fetch(`https://api.theirstack.com/jobs?${queryParams}`, {
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
    
    // For now, return mock data based on the search params
    return getMockJobPostings(params);
  } catch (error) {
    console.error('Error fetching job postings:', error);
    return [];
  }
}

/**
 * Get mock job postings based on search parameters
 * This is used as a fallback when the API is not available
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
      datePosted: '2025-03-15'
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
      datePosted: '2025-03-28'
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
      datePosted: '2025-03-20'
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
      datePosted: '2025-03-25'
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
      datePosted: '2025-03-18'
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
      datePosted: '2025-03-22'
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
      datePosted: '2025-03-19'
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
      datePosted: '2025-03-21'
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
