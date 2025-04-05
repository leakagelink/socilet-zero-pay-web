
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PortfolioItem } from '../portfolioData';
import { PORTFOLIO_CATEGORIES } from './portfolioConstants';

interface EditPortfolioItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentItem: PortfolioItem | null;
  onCurrentItemChange: (item: PortfolioItem | null) => void;
  onSave: () => void;
}

const EditPortfolioItemDialog: React.FC<EditPortfolioItemDialogProps> = ({
  open,
  onOpenChange,
  currentItem,
  onCurrentItemChange,
  onSave
}) => {
  if (!currentItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Portfolio Item</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={currentItem.title}
              onChange={(e) => onCurrentItemChange({...currentItem, title: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select
              value={currentItem.category}
              onValueChange={(value) => onCurrentItemChange({...currentItem, category: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PORTFOLIO_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-image">Image URL</Label>
            <Input
              id="edit-image"
              value={currentItem.image}
              onChange={(e) => onCurrentItemChange({...currentItem, image: e.target.value})}
            />
            {currentItem.image && (
              <div className="mt-2 rounded overflow-hidden h-20 w-40">
                <img 
                  src={currentItem.image} 
                  alt={currentItem.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={currentItem.description}
              onChange={(e) => onCurrentItemChange({...currentItem, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-url">Website URL (optional)</Label>
            <Input
              id="edit-url"
              value={currentItem.url || ''}
              onChange={(e) => onCurrentItemChange({...currentItem, url: e.target.value})}
              placeholder="Enter website URL"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is-react-project"
              checked={!!currentItem.isReactProject}
              onCheckedChange={(checked) => onCurrentItemChange({...currentItem, isReactProject: checked})}
            />
            <Label htmlFor="is-react-project" className="font-medium cursor-pointer">
              React Project
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPortfolioItemDialog;
