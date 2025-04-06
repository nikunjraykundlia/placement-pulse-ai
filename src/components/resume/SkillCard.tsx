
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface SkillCardProps {
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  relevance: number;
}

const SkillCard = ({ skill, level, relevance }: SkillCardProps) => {
  // Map level to a color
  const getLevelColor = () => {
    switch(level) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-md hover:shadow-sm transition-shadow">
      <div className="flex flex-col gap-1">
        <span className="font-medium">{skill}</span>
        <Badge variant="outline" className={`${getLevelColor()} border-none`}>
          {level}
        </Badge>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-gray-500">Relevance</span>
        <div className="w-32 flex items-center gap-2">
          <Progress value={relevance} className="h-2" />
          <span className="text-xs font-medium">{relevance}%</span>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
