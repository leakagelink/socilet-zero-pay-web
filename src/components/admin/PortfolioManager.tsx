
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Edit, Plus, Trash2, ExternalLink } from 'lucide-react';

// Import initial portfolio data from the Portfolio component
// In a real app, this would be fetched from a database
const initialPortfolioItems = [
  {
    id: 1,
    title: 'E-commerce Website',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&h=400',
    description: 'A full-featured e-commerce platform with payment integration and inventory management.',
    url: ''
  },
  {
    id: 2,
    title: 'Restaurant App',
    category: 'apps',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&h=400',
    description: 'Mobile application for a restaurant chain with online ordering and table reservation.',
    url: ''
  },
  // ... (more items would be included here)
];

type PortfolioItem = {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  url?: string;
};

const PortfolioManager = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(initialPortfolioItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<PortfolioItem, 'id'>>({
    title: '',
    category: 'websites',
    image: '',
    description: '',
    url: ''
  });

  // Categories
  const categories = [
    { id: 'websites', label: 'Websites' },
    { id: 'apps', label: 'Mobile Apps' },
    { id: 'ai', label: 'AI Spokespersons' },
    { id: 'business', label: 'Business Listings' }
  ];

  const handleAddItem = () => {
    const id = Math.max(0, ...portfolioItems.map(item => item.id)) + 1;
    setPortfolioItems([...portfolioItems, { id, ...newItem }]);
    setIsAddDialogOpen(false);
    setNewItem({
      title: '',
      category: 'websites',
      image: '',
      description: '',
      url: ''
    });
    toast.success('Portfolio item added successfully');
  };

  const handleEditItem = () => {
    if (!currentItem) return;
    
    setPortfolioItems(portfolioItems.map(item => 
      item.id === currentItem.id ? currentItem : item
    ));
    setIsEditDialogOpen(false);
    setCurrentItem(null);
    toast.success('Portfolio item updated successfully');
  };

  const handleDeleteItem = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setPortfolioItems(portfolioItems.filter(item => item.id !== id));
      toast.success('Portfolio item deleted successfully');
    }
  };

  const openEditDialog = (item: PortfolioItem) => {
    setCurrentItem({ ...item });
    setIsEditDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Portfolio Items</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
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
                  onClick={() => openEditDialog(item)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{item.title}</span>
                <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                  {categories.find(c => c.id === item.category)?.label}
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
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                  {categories.map((category) => (
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Portfolio Item</DialogTitle>
          </DialogHeader>
          {currentItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={currentItem.title}
                  onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={currentItem.category}
                  onValueChange={(value) => setCurrentItem({...currentItem, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
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
                  onChange={(e) => setCurrentItem({...currentItem, image: e.target.value})}
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
                  onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-url">Website URL (optional)</Label>
                <Input
                  id="edit-url"
                  value={currentItem.url || ''}
                  onChange={(e) => setCurrentItem({...currentItem, url: e.target.value})}
                  placeholder="Enter website URL"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioManager;
