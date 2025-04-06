
import { Card, CardContent } from "@/components/ui/card"

interface KeywordCloudProps {
  keywords: { [key: string]: number };
}

const KeywordCloud = ({ keywords }: KeywordCloudProps) => {
  const entries = Object.entries(keywords);
  
  // Find the max count to normalize sizes
  const maxCount = Math.max(...entries.map(([_, count]) => count));
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {entries.map(([keyword, count]) => {
            const size = (count / maxCount) * 1.5;
            // Calculate a size between 0.8 and 1.8em based on count
            const fontSize = 0.8 + size;
            
            // Calculate a color intensity based on count
            const intensity = Math.min(90, 30 + (count / maxCount) * 60);
            
            return (
              <span
                key={keyword}
                className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-800"
                style={{
                  fontSize: `${fontSize}em`,
                  backgroundColor: `hsl(215, 20%, ${intensity}%)`,
                  color: intensity > 60 ? 'white' : 'black',
                }}
              >
                {keyword} ({count})
              </span>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordCloud;
