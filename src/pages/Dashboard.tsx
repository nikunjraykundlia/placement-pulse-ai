
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import { ResumeAnalysisResult, analyzeResume } from "@/services/resumeAnalysis"
import ResumeAnalysisView from "@/components/resume/ResumeAnalysisView"
import PlacementPredictor from "@/components/placement/PlacementPredictor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

const Dashboard = () => {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null)
  const [hasUploadedResume, setHasUploadedResume] = useState(false)

  // Function to handle resume upload and analysis
  const handleResumeUpload = async (file: File) => {
    setLoading(true)
    try {
      // Call the analysis service
      const result = await analyzeResume(file)
      setAnalysis(result)
      setHasUploadedResume(true)
      toast({
        title: "Resume analyzed successfully",
        description: "View your detailed analysis below"
      })
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // For demo purposes, we'll simulate an uploaded resume if none exists
  useEffect(() => {
    const hasExistingUpload = localStorage.getItem('hasUploadedResume') === 'true'
    if (hasExistingUpload && !analysis) {
      // Simulate analyzing an already uploaded resume
      setLoading(true)
      analyzeResume(new File([], "resume.pdf"))
        .then(result => {
          setAnalysis(result)
          setHasUploadedResume(true)
          setLoading(false)
        })
    }
  }, [])

  // Save upload state in localStorage when it changes
  useEffect(() => {
    if (hasUploadedResume) {
      localStorage.setItem('hasUploadedResume', 'true')
    }
  }, [hasUploadedResume])

  // Handle file input change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if file is a supported format
    const fileType = selectedFile.type
    const validTypes = [
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp"
    ];

    if (!validTypes.includes(fileType)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF, DOCX, or image resume file.",
        variant: "destructive"
      })
      return
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive"
      })
      return
    }

    handleResumeUpload(selectedFile)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header with navigation back */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft size={16} /> Back to Home
            </Button>
          </Link>
        </div>

        {/* Dashboard header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Career Dashboard</h1>
          <p className="text-gray-600">
            {hasUploadedResume 
              ? "Here's your personalized career analysis." 
              : "Upload your resume to get personalized insights."}
          </p>
        </div>

        {/* Resume upload section if no resume uploaded yet */}
        {!hasUploadedResume && !loading && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Your Resume</CardTitle>
              <CardDescription>
                Get a detailed analysis of your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                onClick={() => document.getElementById("dashboard-resume-upload")?.click()}
              >
                <input
                  type="file"
                  id="dashboard-resume-upload"
                  className="hidden"
                  accept=".pdf,.docx,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleFileInput}
                />
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-lg font-medium">Drag & Drop your resume here</p>
                  <p className="text-sm text-gray-500">
                    or click to browse (PDF, DOCX, or images, max 5MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main content tabs: Resume Analysis and Placement Prediction */}
        <Tabs defaultValue="resume" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resume">Resume Analysis</TabsTrigger>
            <TabsTrigger value="prediction">Placement Prediction</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resume">
            <ResumeAnalysisView analysis={analysis} isLoading={loading} />
          </TabsContent>
          
          <TabsContent value="prediction">
            <PlacementPredictor />
          </TabsContent>
        </Tabs>

        {/* Coming Soon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Job Recommendations</CardTitle>
              <CardDescription>
                Now available in Milestone 4
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                We connect with job market APIs to display relevant, 
                real-time job openings that match your qualifications and skills.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume Feedback</CardTitle>
              <CardDescription>
                Now available in Milestone 5
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                We provide actionable suggestions to improve your resume 
                and enhance your chances of securing your desired role.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Milestone 5: Resume improvement suggestions based on detailed analysis
          </p>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
