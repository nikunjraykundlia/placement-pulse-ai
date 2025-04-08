
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ResumeAnalysisResult } from '@/services/resumeAnalysis';

interface DebugPanelProps {
  data: ResumeAnalysisResult;
}

const DebugPanel = ({ data }: DebugPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!data.rawText && !data.debugInfo) return null;
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mt-4 border rounded-lg p-4 bg-amber-50"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-amber-800">Debug Information</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? "Hide" : "Show"} debug info
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="mt-4">
        {data.debugInfo && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Score Breakdown:</h4>
            <ul className="text-xs space-y-1 font-mono bg-white p-2 rounded border">
              <li>Skills Score: {data.debugInfo.skillsScore}</li>
              <li>Education Score: {data.debugInfo.educationScore}</li>
              <li>Experience Score: {data.debugInfo.experienceScore}</li>
              <li>Keywords Score: {data.debugInfo.keywordsScore}</li>
              <li>Extra Score: {data.debugInfo.extraScore}</li>
              <li>Certification Count: {data.debugInfo.certCount}</li>
              <li>Project Count: {data.debugInfo.projectCount}</li>
            </ul>
          </div>
        )}
        
        {data.rawText && (
          <div>
            <h4 className="font-medium mb-2">Extracted Text (first 2000 chars):</h4>
            <pre className="text-xs whitespace-pre-wrap bg-white p-2 rounded border max-h-96 overflow-y-auto">
              {data.rawText}
            </pre>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DebugPanel;
