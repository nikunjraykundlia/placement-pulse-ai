
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { CircleDashed, Brain, BadgeCheck } from "lucide-react";
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

  // Train model on component mount if not already trained
  useEffect(() => {
    // Check if model is already trained or in progress
    if (!isModelReady() && !isModelTraining() && !trainingInProgress) {
      handleTrainModel();
    } else if (isModelReady()) {
      setModelTrained(true);
    }
  }, []);

  // Handle training the model
  const handleTrainModel = async () => {
    setTrainingInProgress(true);
    setTrainingError(null);
    setPrediction(null);
    
    try {
      await trainPlacementModel();
      setModelTrained(true);
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
    onChange: (value: number) => void
  ) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>{label}</Label>
          <span className="text-sm text-gray-500">{value}/5</span>
        </div>
        <Slider 
          value={[value]} 
          min={0} 
          max={5} 
          step={1}
          onValueChange={(vals) => onChange(vals[0])}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Model training status */}
      <Card className={modelTrained ? "bg-green-50 border-green-200" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            {modelTrained ? (
              <BadgeCheck className="h-5 w-5 text-green-600" />
            ) : (
              <Brain className="h-5 w-5 text-blue-600" />
            )}
            Model Status
          </CardTitle>
          <CardDescription>
            {trainingInProgress 
              ? "Training placement prediction model..." 
              : modelTrained 
                ? "Model is trained and ready to make predictions" 
                : "Model needs to be trained before making predictions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trainingInProgress ? (
            <div className="flex items-center justify-center py-4">
              <CircleDashed className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3">Training in progress...</span>
            </div>
          ) : trainingError ? (
            <div className="text-red-500 py-2">
              <p>Error: {trainingError}</p>
              <Button 
                onClick={handleTrainModel} 
                className="mt-3"
              >
                Retry Training
              </Button>
            </div>
          ) : !modelTrained ? (
            <Button 
              onClick={handleTrainModel} 
              className="w-full"
            >
              Train Model Now
            </Button>
          ) : (
            <div className="text-center text-green-600 font-medium py-2">
              Ready to make placement predictions
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student information inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Information</CardTitle>
          <CardDescription>
            Provide your academic and skills information for an accurate prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cgpa">CGPA/GPA (out of 10)</Label>
                <Input
                  id="cgpa"
                  type="number"
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  min={0}
                  max={10}
                  step={0.1}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="highSchool">12th Grade/Diploma Score (%)</Label>
                <Input
                  id="highSchool"
                  type="number"
                  value={highSchoolScore}
                  onChange={(e) => setHighSchoolScore(Number(e.target.value))}
                  min={0}
                  max={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ssc">10th Grade/SSC Score (%)</Label>
                <Input
                  id="ssc"
                  type="number"
                  value={sscScore}
                  onChange={(e) => setSscScore(Number(e.target.value))}
                  min={0}
                  max={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="internships">Number of Tech Internships</Label>
                <Input
                  id="internships"
                  type="number"
                  value={techInternships}
                  onChange={(e) => setTechInternships(Number(e.target.value))}
                  min={0}
                  max={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hackathons">Hackathons Participated</Label>
                <Input
                  id="hackathons"
                  type="number"
                  value={hackathons}
                  onChange={(e) => setHackathons(Number(e.target.value))}
                  min={0}
                  max={20}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projects">Projects Completed</Label>
                <Input
                  id="projects"
                  type="number"
                  value={projects}
                  onChange={(e) => setProjects(Number(e.target.value))}
                  min={0}
                  max={20}
                />
              </div>
            </div>
            
            {/* Skills ratings */}
            <div className="space-y-4">
              {renderSkillLevel("Web Development", webDev, setWebDev)}
              {renderSkillLevel("Machine Learning", machineLearning, setMachineLearning)}
              {renderSkillLevel("Cloud Computing", cloudComputing, setCloudComputing)}
              {renderSkillLevel("Database Knowledge", database, setDatabase)}
              {renderSkillLevel("DSA/Competitive Programming", dsaCP, setDsaCP)}
              {renderSkillLevel("Other Personal Skills", otherSkills, setOtherSkills)}
            </div>
          </div>

          <Button 
            className="w-full mt-6" 
            onClick={handlePredict}
            disabled={!modelTrained || isPredicting || trainingInProgress}
          >
            {isPredicting ? (
              <>
                <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              "Predict Placement Package"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Prediction results */}
      {prediction !== null && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Your Placement Prediction</CardTitle>
            <CardDescription>
              Based on your profile, here's your expected package
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              ₹{prediction.toFixed(2)} LPA
            </div>
            <p className="text-gray-600">
              Expected placement package based on your qualifications
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlacementPredictor;
