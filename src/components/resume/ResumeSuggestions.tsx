
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LightbulbIcon, Check, PenLine } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ResumeSuggestionsProps {
  suggestions: string[];
}

const ResumeSuggestions = ({ suggestions }: ResumeSuggestionsProps) => {
  const [completedSuggestions, setCompletedSuggestions] = useState<number[]>([]);
  
  const toggleSuggestion = (index: number) => {
    if (completedSuggestions.includes(index)) {
      setCompletedSuggestions(completedSuggestions.filter(i => i !== index));
    } else {
      setCompletedSuggestions([...completedSuggestions, index]);
    }
  };

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LightbulbIcon className="h-5 w-5 text-amber-500" />
            Resume Improvement Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-6 text-center">
          <p className="text-gray-500">No suggestions available for your resume at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5" />
          Resume Improvement Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p className="text-gray-600 mb-6">
            Applying these suggestions could significantly improve your resume's effectiveness and increase your chances of landing interviews.
          </p>
          
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className={`p-4 border rounded-lg transition-all ${
                  completedSuggestions.includes(index) 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white hover:bg-amber-50 hover:border-amber-200'
                }`}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <Button
                      variant={completedSuggestions.includes(index) ? "default" : "outline"}
                      size="icon"
                      className={`h-6 w-6 rounded-full ${
                        completedSuggestions.includes(index) 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'text-gray-400'
                      }`}
                      onClick={() => toggleSuggestion(index)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  </div>
                  <div>
                    <p className={completedSuggestions.includes(index) ? 'line-through text-gray-500' : ''}>
                      {suggestion}
                    </p>
                    
                    {completedSuggestions.includes(index) && (
                      <p className="text-green-600 text-sm mt-1">Completed</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-start gap-3">
              <PenLine className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Why these suggestions matter</h4>
                <p className="text-sm text-blue-700">
                  Recruiters spend an average of just 7 seconds scanning a resume. 
                  These targeted improvements will help your resume stand out, highlight your most relevant skills,
                  and increase your chances of passing through Applicant Tracking Systems (ATS).
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeSuggestions;
