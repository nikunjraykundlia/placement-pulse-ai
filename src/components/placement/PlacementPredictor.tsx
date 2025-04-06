
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { CircleDashed, Brain, BadgeCheck, TrendingUp, BookOpen, Award, Briefcase } from "lucide-react";
import { 
  trainPlacementModel, 
  isModelReady, 
  isModelTraining,
  getModelError,
  predictPackage
} from "@/services/placementPrediction";

const PlacementPredictor = () => {
  // Model training state
  const [trainingInProgress, setTrainingInProgress] = useState(false);
  const [modelTrained, setModelTrained] = useState(false);
  const [trainingError, setTrainingError] = useState<string | null>(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  
  // Student input fields
  const [cgpa, setCgpa] = useState(8.5);
  const [highSchoolScore, setHighSchoolScore] = useState(85);
  const [sscScore, setSscScore] = useState(88);
  const [webDev, setWebDev] = useState(3);
  const [machineLearning, setMachineLearning] = useState(2);
  const [cloudComputing, setCloudComputing] = useState(1);
  const [database, setDatabase] = useState(2);
  const [otherSkills, setOtherSkills] = useState(3);
  const [dsaCP, setDsaCP] = useState(4);
  const [techInternships, setTechInternships] = useState(1);
  const [hackathons, setHackathons] = useState(2);
  const [projects, setProjects] = useState(3);
  
  // Prediction result
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  
  // Career recommendations based on prediction
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Train model on component mount if not already trained
  useEffect(() => {
    // Check if model is already trained or in progress
    if (!isModelReady() && !isModelTraining() && !trainingInProgress) {
      handleTrainModel();
    } else if (isModelReady()) {
      setModelTrained(true);
    }
    
    // Simulate training progress for better UX
    let interval: number | null = null;
    if (trainingInProgress) {
      interval = window.setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 95) return prev;
          return prev + 5;
        });
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [trainingInProgress]);

  // Handle training the model
  const handleTrainModel = async () => {
    setTrainingInProgress(true);
    setTrainingError(null);
    setPrediction(null);
    setTrainingProgress(0);
    
    try {
      await trainPlacementModel();
      setModelTrained(true);
      setTrainingProgress(100);
      toast({
        title: "Model Training Complete",
        description: "The placement prediction model has been successfully trained.",
      });
    } catch (error) {
      console.error("Model training failed:", error);
      setTrainingError(getModelError() || "Failed to train model");
      toast({
        title: "Model Training Failed",
        description: getModelError() || "There was an error training the prediction model.",
        variant: "destructive",
      });
    } finally {
      setTrainingInProgress(false);
    }
  };

  // Generate job recommendations based on predicted package
  const generateRecommendations = (salary: number) => {
    if (salary >= 15) {
      return [
        "Software Engineer at top-tier tech companies",
        "Machine Learning Engineer",
        "Data Scientist",
        "DevOps Engineer",
        "Full Stack Developer"
      ];
    } else if (salary >= 10) {
      return [
        "Backend Developer",
        "Frontend Developer",
        "Mobile App Developer",
        "Cloud Engineer",
        "Database Administrator"
      ];
    } else {
      return [
        "Junior Developer",
        "QA Engineer",
        "Technical Support Engineer",
        "IT Analyst",
        "Web Developer"
      ];
    }
  };

  // Make prediction based on current inputs
  const handlePredict = async () => {
    if (!modelTrained) {
      toast({
        title: "Model Not Ready",
        description: "Please wait for the model to finish training.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPredicting(true);
    setPrediction(null);
    
    try {
      const predictedPackage = await predictPackage({
        cgpa,
        highSchoolScore,
        sscScore,
        webDev,
        machineLearning,
        cloudComputing,
        database,
        otherSkills,
        dsaCP,
        techInternships,
        hackathons,
        projects,
      });
      
      setPrediction(predictedPackage);
      
      // Generate job recommendations based on prediction
      setRecommendations(generateRecommendations(predictedPackage));
      
      toast({
        title: "Prediction Complete",
        description: `Your estimated placement package is ₹${predictedPackage.toFixed(2)} LPA`,
      });
    } catch (error) {
      console.error("Prediction failed:", error);
      toast({
        title: "Prediction Failed",
        description: "There was an error making the prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  // Helper function to render skill level selection
  const renderSkillLevel = (
    label: string, 
    value: number, 
    onChange: (value: number) => void,
    icon?: React.ReactNode
  ) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {icon && <span className="text-blue-600">{icon}</span>}
            <Label>{label}</Label>
          </div>
          <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {value}/5
          </span>
        </div>
        <Slider 
          value={[value]} 
          min={0} 
          max={5} 
          step={1}
          onValueChange={(vals) => onChange(vals[0])}
          className="py-2"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Model training status */}
      <Card className={modelTrained ? "bg-gradient-to-r from-green-50 to-blue-50 border-green-200" : "bg-gradient-to-r from-blue-50 to-indigo-50"}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-2xl">
            {modelTrained ? (
              <BadgeCheck className="h-6 w-6 text-green-600" />
            ) : (
              <Brain className="h-6 w-6 text-blue-600" />
            )}
            AI Placement Prediction Model
          </CardTitle>
          <CardDescription className="text-base">
            {trainingInProgress 
              ? "Our AI is analyzing placement data for accurate predictions..." 
              : modelTrained 
                ? "Our AI model has been trained on placement data and is ready to make predictions" 
                : "Our AI needs to be trained before making placement predictions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trainingInProgress ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-4">
                <CircleDashed className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                <span className="text-lg font-medium">Training in progress...</span>
              </div>
              <Progress value={trainingProgress} className="h-2" />
              <p className="text-center text-sm text-gray-600">
                {trainingProgress < 100 ? "Processing placement data..." : "Finalizing model..."}
              </p>
            </div>
          ) : trainingError ? (
            <div className="text-red-600 py-4 space-y-4">
              <p className="font-medium">Error: {trainingError}</p>
              <Button 
                onClick={handleTrainModel} 
                className="w-full"
                variant="outline"
              >
                Retry Training
              </Button>
            </div>
          ) : !modelTrained ? (
            <Button 
              onClick={handleTrainModel} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Brain className="mr-2 h-4 w-4" />
              Train Placement AI Model Now
            </Button>
          ) : (
            <div className="text-center text-green-600 font-medium py-2 space-y-1">
              <p>AI model trained successfully!</p>
              <p className="text-sm text-gray-600">Ready to predict your placement package</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student information inputs */}
      <Card className="border border-gray-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Your Academic & Skills Profile
          </CardTitle>
          <CardDescription>
            Provide your academic and skills information for an accurate placement prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic details */}
            <div className="space-y-5 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="font-medium text-lg flex items-center gap-2 mb-3 text-gray-800">
                <Award className="h-5 w-5 text-blue-600" />
                Academic Performance
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="cgpa" className="text-gray-700">CGPA/GPA (out of 10)</Label>
                <Input
                  id="cgpa"
                  type="number"
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  min={0}
                  max={10}
                  step={0.1}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="highSchool" className="text-gray-700">12th Grade/Diploma Score (%)</Label>
                <Input
                  id="highSchool"
                  type="number"
                  value={highSchoolScore}
                  onChange={(e) => setHighSchoolScore(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ssc" className="text-gray-700">10th Grade/SSC Score (%)</Label>
                <Input
                  id="ssc"
                  type="number"
                  value={sscScore}
                  onChange={(e) => setSscScore(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="border-gray-300"
                />
              </div>

              <h3 className="font-medium text-lg flex items-center gap-2 mb-3 mt-6 text-gray-800">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Experience
              </h3>

              <div className="space-y-2">
                <Label htmlFor="internships" className="text-gray-700">Number of Tech Internships</Label>
                <Input
                  id="internships"
                  type="number"
                  value={techInternships}
                  onChange={(e) => setTechInternships(Number(e.target.value))}
                  min={0}
                  max={10}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hackathons" className="text-gray-700">Hackathons Participated</Label>
                <Input
                  id="hackathons"
                  type="number"
                  value={hackathons}
                  onChange={(e) => setHackathons(Number(e.target.value))}
                  min={0}
                  max={20}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projects" className="text-gray-700">Projects Completed</Label>
                <Input
                  id="projects"
                  type="number"
                  value={projects}
                  onChange={(e) => setProjects(Number(e.target.value))}
                  min={0}
                  max={20}
                  className="border-gray-300"
                />
              </div>
            </div>
            
            {/* Skills ratings */}
            <div className="space-y-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-medium text-lg flex items-center gap-2 mb-3 text-gray-800">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Technical Skills
              </h3>
              
              {renderSkillLevel("Web Development", webDev, setWebDev)}
              {renderSkillLevel("Machine Learning", machineLearning, setMachineLearning)}
              {renderSkillLevel("Cloud Computing", cloudComputing, setCloudComputing)}
              {renderSkillLevel("Database Knowledge", database, setDatabase)}
              {renderSkillLevel("DSA/Competitive Programming", dsaCP, setDsaCP)}
              {renderSkillLevel("Other Personal Skills", otherSkills, setOtherSkills)}
            </div>
          </div>

          <Button 
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
            onClick={handlePredict}
            disabled={!modelTrained || isPredicting || trainingInProgress}
          >
            {isPredicting ? (
              <>
                <CircleDashed className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Your Profile...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-5 w-5" />
                Predict My Placement Package
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Prediction results */}
      {prediction !== null && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">Your Placement Prediction</CardTitle>
            <CardDescription className="text-blue-100">
              Based on your profile and our AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <div className="text-5xl font-bold mb-4">
              ₹{prediction.toFixed(2)} LPA
            </div>
            <p className="text-blue-100 max-w-xl mx-auto">
              This is your expected placement package based on current market trends and your qualifications
            </p>
            
            {/* Recommendation section */}
            <div className="mt-8 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h4 className="text-xl font-medium mb-3">Recommended Job Roles</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                {recommendations.map((job, index) => (
                  <li key={index} className="flex items-center gap-2 text-blue-50">
                    <BadgeCheck className="h-4 w-4 flex-shrink-0" />
                    <span>{job}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="bg-indigo-700/30 text-center px-6 py-4">
            <p className="text-sm text-blue-100 w-full">
              Based on analysis of similar profiles from top engineering colleges in India
            </p>
          </CardFooter>
        </Card>
      )}
      
      {/* Job Recommendations - Milestone 4 */}
      {prediction !== null && (
        <Card className="border border-gray-200 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Recommended Job Opportunities
            </CardTitle>
            <CardDescription className="text-green-100">
              Based on your skills and predicted package
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {[
                {
                  role: "Software Developer",
                  company: "TechCorp India",
                  location: "Bengaluru, India",
                  salary: "₹8-12 LPA",
                  match: "92% Match",
                  skills: ["Web Development", "Database", "DSA"]
                },
                {
                  role: "Machine Learning Engineer",
                  company: "AI Solutions Ltd",
                  location: "Hyderabad, India",
                  salary: "₹10-15 LPA",
                  match: "85% Match",
                  skills: ["Python", "Machine Learning", "Data Analysis"]
                },
                {
                  role: "Full Stack Developer",
                  company: "WebTech Solutions",
                  location: "Pune, India",
                  salary: "₹9-14 LPA",
                  match: "78% Match",
                  skills: ["React", "Node.js", "MongoDB"]
                }
              ].map((job, i) => (
                <div key={i} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-lg">{job.role}</h4>
                      <p className="text-gray-600">{job.company} • {job.location}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      {job.match}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium">{job.salary}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {job.skills.map((skill, j) => (
                      <span key={j} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-3">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <p className="text-sm text-gray-500">3 jobs matching your profile</p>
            <Button variant="outline" size="sm">View All Jobs</Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Resume Feedback - Milestone 5 */}
      {prediction !== null && (
        <Card className="border border-gray-200 shadow-md overflow-hidden mb-8">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
            <CardTitle>Resume Improvement Suggestions</CardTitle>
            <CardDescription className="text-purple-100">
              Actionable feedback to enhance your placement prospects
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                <h4 className="font-medium text-purple-800">Highlight Technical Projects</h4>
                <p className="text-gray-700 text-sm">Add more details about your technical projects, especially those using {webDev > 3 ? "web technologies" : machineLearning > 3 ? "machine learning" : "cloud technologies"}.</p>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <h4 className="font-medium text-blue-800">Add Quantifiable Achievements</h4>
                <p className="text-gray-700 text-sm">Include metrics and outcomes for your projects and internships to demonstrate impact.</p>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <h4 className="font-medium text-green-800">Enhance Your Skills Section</h4>
                <p className="text-gray-700 text-sm">
                  {dsaCP < 3 ? "Focus on improving your DSA skills, as they're often tested in technical interviews." : 
                   webDev < 3 ? "Consider adding more web development skills to your resume." : 
                   "Your skills profile is strong - keep it updated with the latest technologies."}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg mt-6">
                <h3 className="font-medium mb-2">Suggested Skills to Add</h3>
                <div className="flex flex-wrap gap-2">
                  {["React.js", "Node.js", "Docker", "Kubernetes", "AWS", "Data Structures", "System Design"].map((skill, i) => (
                    <span key={i} className="bg-white border border-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-6">
              Get Detailed Resume Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlacementPredictor;
