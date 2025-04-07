
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Calendar, ExternalLink, Building, ThumbsUp, DollarSign } from "lucide-react";
import { fetchJobPostings, JobPosting } from "@/services/jobPostings";
import { ResumeAnalysisResult } from "@/services/resumeAnalysis";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface JobRecommendationsProps {
  analysis: ResumeAnalysisResult;
  isLoading?: boolean;
}

const formatSalary = (min?: number, max?: number, currency: string = 'INR') => {
  if (!min && !max) return 'Not specified';
  
  const formatValue = (value: number) => {
    // For INR, convert to lakhs
    if (currency === 'INR') {
      return `₹${(value / 100000).toFixed(1)} LPA`;
    }
    return `${currency} ${value.toLocaleString()}`;
  };
  
  if (min && max) {
    return `${formatValue(min)} - ${formatValue(max)}`;
  }
  
  return formatValue(min || max || 0);
};

const calculateMatchPercentage = (jobSkills: string[] = [], userSkills: any[] = []) => {
  if (jobSkills.length === 0 || userSkills.length === 0) return 60;
  
  // Extract just the skill names from user skills objects
  const userSkillNames = userSkills.map(skill => 
    typeof skill === 'string' ? skill : skill.skill
  );
  
  const matchedSkills = userSkillNames.filter(userSkill =>
    jobSkills.some(jobSkill => 
      jobSkill.toLowerCase().includes(userSkill.toLowerCase()) || 
      userSkill.toLowerCase().includes(jobSkill.toLowerCase())
    )
  );
  
  return Math.min(100, Math.max(60, Math.round((matchedSkills.length / jobSkills.length) * 100)));
};

const JobRecommendations = ({ analysis, isLoading = false }: JobRecommendationsProps) => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  
  // Extract user skills from the analysis
  const userSkills = analysis.topSkills.map(skill => skill.skill);
  
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Use preferred job titles from analysis if available
        const searchParams: any = {
          skills: userSkills,
          limit: 8
        };
        
        if (analysis.preferredJobTitles && analysis.preferredJobTitles.length > 0) {
          searchParams.title = analysis.preferredJobTitles[0];
        }
        
        const fetchedJobs = await fetchJobPostings(searchParams);
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching job recommendations:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userSkills.length > 0) {
      fetchJobs();
    }
  }, [analysis]);
  
  const handleViewDetails = (job: JobPosting) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };
  
  if (isLoading || loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-7 bg-gray-200 rounded-md w-3/4 mb-2"></div>
          <div className="h-5 bg-gray-100 rounded-md w-2/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-gray-200 rounded-md w-2/3"></div>
                <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-100 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (jobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            Job Recommendations
          </CardTitle>
          <CardDescription>
            Based on your skills and qualifications
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No job recommendations found. Try updating your resume with more skills.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Recommendations
          </CardTitle>
          <CardDescription className="text-blue-100">
            Based on your skills and qualifications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {jobs.map((job) => {
              const matchPercentage = calculateMatchPercentage(job.skills, userSkills);
              
              return (
                <div key={job.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-lg">{job.title}</h4>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Building className="h-3.5 w-3.5" />
                        <span>{job.company}</span>
                        <span className="mx-1">•</span>
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <Badge variant={matchPercentage >= 80 ? "success" : "default"} className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {matchPercentage}% Match
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 font-medium mt-2">
                    {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                  </p>
                  
                  {job.datePosted && (
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>Posted: {new Date(job.datePosted).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {job.skills?.map((skill, i) => (
                      <Badge key={i} variant="outline" className="bg-blue-50 border-blue-100">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 flex items-center gap-1"
                    onClick={() => handleViewDetails(job)}
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Details
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-500">{jobs.length} jobs matching your profile</p>
          <Button variant="outline" size="sm">View All Jobs</Button>
        </CardFooter>
      </Card>
      
      {/* Job Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedJob.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-1 text-base">
                  <Building className="h-4 w-4" />
                  {selectedJob.company}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-2">
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                    <MapPin className="h-4 w-4" />
                    {selectedJob.location}
                  </div>
                  {selectedJob.salaryMin && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                      <DollarSign className="h-4 w-4" />
                      {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax, selectedJob.salaryCurrency)}
                    </div>
                  )}
                  {selectedJob.datePosted && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                      <Calendar className="h-4 w-4" />
                      Posted: {new Date(selectedJob.datePosted).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Skills Required</h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedJob.skills?.map((skill, i) => (
                      <Badge key={i} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectedJob.description && (
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-700">
                      {selectedJob.description || "No detailed description available for this position."}
                    </p>
                  </div>
                )}
                
                <div className="pt-4">
                  {selectedJob.url ? (
                    <Button className="w-full sm:w-auto" onClick={() => window.open(selectedJob.url, '_blank')}>
                      Apply Now <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button className="w-full sm:w-auto">
                      Apply Now <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobRecommendations;
