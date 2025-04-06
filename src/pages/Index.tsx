
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, GraduationCap, Briefcase, BarChart, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import ResumeUploadCard from "@/components/resume/ResumeUploadCard"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 pt-16 pb-12 text-center md:pt-24 md:pb-20">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
          Career Pathfinder
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Empowering Engineering Students with AI-Driven Career Insights and Placement Predictions
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="gap-2 text-base">
            Start Your Journey <ArrowRight size={18} />
          </Button>
          <Button size="lg" variant="outline" className="text-base">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="p-6">
              <div className="mb-2 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
              <CardTitle className="text-xl">Resume Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our AI analyzes your resume to extract key skills, projects, and qualifications.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="p-6">
              <div className="mb-2 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <GraduationCap className="text-purple-600" size={24} />
              </div>
              <CardTitle className="text-xl">Placement Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get accurate predictions about your placement prospects, expected salary, and suitable roles.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="p-6">
              <div className="mb-2 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Briefcase className="text-green-600" size={24} />
              </div>
              <CardTitle className="text-xl">Job Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Discover real job opportunities that match your profile and qualifications.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="p-6">
              <div className="mb-2 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <BarChart className="text-orange-600" size={24} />
              </div>
              <CardTitle className="text-xl">Improvement Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Receive actionable feedback to enhance your resume and improve placement chances.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upload Resume Section */}
      <section className="container max-w-6xl mx-auto px-4 py-16 bg-white rounded-lg shadow-sm my-12">
        <h2 className="text-3xl font-bold text-center mb-8">Upload Your Resume</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Upload your resume to get started with personalized career insights tailored for engineering students in India.
        </p>
        <div className="max-w-xl mx-auto">
          <ResumeUploadCard />
        </div>
      </section>

      {/* Testimonials/Stats Placeholder */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Trusted by Engineering Students</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-600 mb-2">90%</p>
            <p className="text-gray-600">Accuracy in Placement Predictions</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600 mb-2">10,000+</p>
            <p className="text-gray-600">Engineering Students Assisted</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600 mb-2">500+</p>
            <p className="text-gray-600">Partner Companies</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Kickstart Your Career?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of engineering students who have accelerated their career paths with our AI-powered insights.
          </p>
          <Link to="/dashboard">
            <Button size="lg" variant="secondary" className="text-blue-600">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
