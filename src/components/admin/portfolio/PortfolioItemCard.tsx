
import React from 'react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink, Code2 } from 'lucide-react';
import { PortfolioItem } from '../portfolioData';

interface PortfolioItemCardProps {
  item: PortfolioItem;
  categoryLabel: string;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: number) => void;
}

const PortfolioItemCard: React.FC<PortfolioItemCardProps> = ({
  item,
  categoryLabel,
  onEdit,
  onDelete
}) => {
  return (
    <Card key={item.id} className="overflow-hidden">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => onEdit(item)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        {item.isReactProject && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
              <Code2 className="w-3 h-3 mr-1" />
              React
            </span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{item.title}</span>
          <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
            {categoryLabel}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
      </CardContent>
      {item.url && (
        <CardFooter>
          <a 
            href={item.url}
            target="_blank"
            rel="noopener noreferrer" 
            className="text-primary-600 hover:text-primary-700 inline-flex items-center text-sm"
          >
            <span>Visit Website</span> 
            <ExternalLink className="ml-2 w-3 h-3" />
          </a>
        </CardFooter>
      )}
    </Card>
  );
};

export default PortfolioItemCard;
