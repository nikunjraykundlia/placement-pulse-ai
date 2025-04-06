
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase } from "lucide-react"

interface ExperienceCardProps {
  role: string;
  company: string;
  duration: string;
  highlights: string[];
}

const ExperienceCard = ({ role, company, duration, highlights }: ExperienceCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-amber-50 p-3 border-b flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-amber-500" />
        <h3 className="font-medium text-sm">{role}</h3>
      </div>
      <CardContent className="p-4">
        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{company}</span>
            <span className="text-xs text-gray-500">{duration}</span>
          </div>
          
          {highlights.length > 0 && (
            <div className="mt-2">
              <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Highlights</h4>
              <ul className="text-xs space-y-1 list-disc pl-4">
                {highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
