
import { Card, CardContent } from "@/components/ui/card"
import { School } from "lucide-react"

interface EducationCardProps {
  degree: string;
  institution: string;
  year: string;
  score: string;
}

const EducationCard = ({ degree, institution, year, score }: EducationCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-blue-50 p-3 border-b flex items-center gap-2">
        <School className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium text-sm">{degree}</h3>
      </div>
      <CardContent className="p-4">
        <div className="grid gap-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{institution}</span>
            <span className="text-xs text-gray-500">{year}</span>
          </div>
          <div className="mt-1">
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              {score}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationCard;
