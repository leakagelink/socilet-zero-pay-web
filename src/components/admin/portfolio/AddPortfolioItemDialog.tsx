
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
import { Switch } from '@/components/ui/switch';
import { PORTFOLIO_CATEGORIES } from './portfolioConstants';

interface AddPortfolioItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: {
    title: string;
    category: string;
    image: string;
    description: string;
    url?: string;
    isReactProject?: boolean;
  }) => void;
}

const initialState = {
  title: '',
  category: 'websites',
  image: '',
  description: '',
  url: '',
  isReactProject: false
};

const AddPortfolioItemDialog: React.FC<AddPortfolioItemDialogProps> = ({
  open,
  onOpenChange,
  onAdd
}) => {
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData(initialState); // Reset form
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Portfolio Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
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
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                required
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-2 rounded overflow-hidden h-20 w-40">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/400x300?text=Invalid+Image';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="url">Website URL (optional)</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                placeholder="Enter website URL"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is-react-project"
                checked={formData.isReactProject}
                onCheckedChange={(checked) => setFormData({...formData, isReactProject: checked})}
              />
              <Label htmlFor="is-react-project" className="font-medium cursor-pointer">
                React Project
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setFormData(initialState);
              onOpenChange(false);
            }}>Cancel</Button>
            <Button type="submit" disabled={!formData.title || !formData.image || !formData.description}>Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPortfolioItemDialog;
