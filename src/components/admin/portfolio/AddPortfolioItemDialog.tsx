
import React, { useState } from 'react';
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
import { PortfolioItem } from '../portfolioData';
import { PORTFOLIO_CATEGORIES } from './portfolioConstants';

interface AddPortfolioItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: Omit<PortfolioItem, 'id'>) => void;
}

const AddPortfolioItemDialog: React.FC<AddPortfolioItemDialogProps> = ({
  open,
  onOpenChange,
  onAdd
}) => {
  const [newItem, setNewItem] = useState<Omit<PortfolioItem, 'id'>>({
    title: '',
    category: 'websites',
    image: '',
    description: '',
    url: ''
  });

  const handleAdd = () => {
    onAdd(newItem);
    setNewItem({
      title: '',
      category: 'websites',
      image: '',
      description: '',
      url: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Portfolio Item</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              placeholder="Enter project title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newItem.category}
              onValueChange={(value) => setNewItem({...newItem, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
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
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={newItem.image}
              onChange={(e) => setNewItem({...newItem, image: e.target.value})}
              placeholder="Enter image URL"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              placeholder="Enter project description"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="url">Website URL (optional)</Label>
            <Input
              id="url"
              value={newItem.url}
              onChange={(e) => setNewItem({...newItem, url: e.target.value})}
              placeholder="Enter website URL"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPortfolioItemDialog;
