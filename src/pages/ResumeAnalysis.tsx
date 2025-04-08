
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResumeAnalysisView } from '@/components/resume/ResumeAnalysisView';
import { analyzeResume, ResumeAnalysisResult } from '@/services/resumeAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import DebugPanel from '@/components/resume/DebugPanel';

const ResumeAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const processResume = async () => {
      try {
        // Check if we have a file from the state
        if (location.state && location.state.file) {
          const file = location.state.file as File;
          const result = await analyzeResume(file);
          setAnalysisResult(result);
        } else {
          // No file found, redirect to homepage
          navigate('/');
        }
      } catch (error) {
        console.error('Error analyzing resume:', error);
      } finally {
        setLoading(false);
      }
    };
    
    processResume();
  }, [location.state, navigate]);
  
  const handleBackClick = () => {
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-center">Analyzing Your Resume</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Please wait while we process your resume...</p>
            <p className="text-sm text-gray-500 mt-2">
              This may take a moment as we extract and analyze your information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!analysisResult) {
    return (
      <div className="container mx-auto py-12">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Resume Analysis Error</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <p className="text-gray-600 mb-6">We couldn't analyze your resume. Please try uploading it again.</p>
            <Button onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Upload
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Upload
        </Button>
      </div>
      
      <ResumeAnalysisView analysis={analysisResult} />
      
      <DebugPanel data={analysisResult} />
    </div>
  );
};

export default ResumeAnalysis;
