
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

const Dashboard = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

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
            We're analyzing your resume to provide personalized career insights.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <h2 className="text-xl font-medium mb-1">Analyzing Your Resume</h2>
            <p className="text-gray-600">
              Please wait while our AI processes your information...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resume Analysis</CardTitle>
                <CardDescription>
                  Coming in Milestone 2
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Your resume has been uploaded successfully. 
                  In the next milestone, we'll extract and analyze key skills, 
                  education details, and experiences from your resume.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Placement Prediction</CardTitle>
                <CardDescription>
                  Coming in Milestone 3
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  We'll predict your placement opportunities including expected 
                  salary package (LPA), suitable job roles, and companies 
                  that might be interested in your profile.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Recommendations</CardTitle>
                <CardDescription>
                  Coming in Milestone 4
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  We'll connect with job market APIs to display relevant, 
                  real-time job openings that match your qualifications and skills.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resume Feedback</CardTitle>
                <CardDescription>
                  Coming in Milestone 5
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  We'll provide actionable suggestions to improve your resume 
                  and enhance your chances of securing your desired role.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            This is a preview of the dashboard. Future milestones will implement 
            the actual resume analysis, placement prediction, job matching, and feedback features.
          </p>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
