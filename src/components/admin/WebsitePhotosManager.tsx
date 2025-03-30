
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
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Edit, ExternalLink, Image, Plus, RefreshCw, Trash2 } from 'lucide-react';

// Mock website images
const initialImages = [
  {
    id: 1,
    name: 'Hero Background',
    section: 'hero',
    url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1600',
    description: 'Background image for hero section'
  },
  {
    id: 2,
    name: 'Services Section Background',
    section: 'services',
    url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600',
    description: 'Background image for services section'
  },
  {
    id: 3,
    name: 'Technologies Background',
    section: 'technologies',
    url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600',
    description: 'Background for technologies section'
  },
  {
    id: 4,
    name: 'Founder Profile',
    section: 'founder',
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=400',
    description: 'Founder profile photo'
  },
  {
    id: 5,
    name: 'Contact Section Background',
    section: 'contact',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600',
    description: 'Background for contact section'
  },
  {
    id: 6,
    name: 'Logo',
    section: 'header',
    url: '/logo.png',
    description: 'Company logo'
  },
];

type WebsiteImage = {
  id: number;
  name: string;
  section: string;
  url: string;
  description: string;
};

const WebsitePhotosManager = () => {
  const [images, setImages] = useState<WebsiteImage[]>(initialImages);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<WebsiteImage | null>(null);
  const [newImage, setNewImage] = useState<Omit<WebsiteImage, 'id'>>({
    name: '',
    section: 'hero',
    url: '',
    description: ''
  });

  // Website sections
  const sections = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'header', label: 'Header' },
    { id: 'services', label: 'Services Section' },
    { id: 'technologies', label: 'Technologies Section' },
    { id: 'founder', label: 'Founder Section' },
    { id: 'portfolio', label: 'Portfolio Section' },
    { id: 'testimonials', label: 'Testimonials Section' },
    { id: 'contact', label: 'Contact Section' },
    { id: 'footer', label: 'Footer' },
    { id: 'blog', label: 'Blog Section' },
    { id: 'other', label: 'Other' }
  ];

  const handleAddImage = () => {
    const id = Math.max(0, ...images.map(image => image.id)) + 1;
    setImages([...images, { id, ...newImage }]);
    setIsAddDialogOpen(false);
    setNewImage({
      name: '',
      section: 'hero',
      url: '',
      description: ''
    });
    toast.success('Image added successfully');
  };

  const handleEditImage = () => {
    if (!currentImage) return;
    
    setImages(images.map(image => 
      image.id === currentImage.id ? currentImage : image
    ));
    setIsEditDialogOpen(false);
    setCurrentImage(null);
    toast.success('Image updated successfully');
  };

  const handleDeleteImage = (id: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      setImages(images.filter(image => image.id !== id));
      toast.success('Image deleted successfully');
    }
  };

  const openEditDialog = (image: WebsiteImage) => {
    setCurrentImage({ ...image });
    setIsEditDialogOpen(true);
  };

  const getSectionLabel = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.label : sectionId;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Website Photos</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add New Photo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative h-40 overflow-hidden bg-gray-100">
              <img 
                src={image.url} 
                alt={image.name}
                className="w-full h-full object-cover" 
                onError={(e) => {
                  // If image fails to load, show a placeholder
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Not+Found';
                }}
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => openEditDialog(image)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDeleteImage(image.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-base line-clamp-1">{image.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs mb-2">
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                  {getSectionLabel(image.section)}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => window.open(image.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" /> Open Full Size Image
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Image Name</Label>
              <Input
                id="name"
                value={newImage.name}
                onChange={(e) => setNewImage({...newImage, name: e.target.value})}
                placeholder="Enter a name for this image"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="section">Section</Label>
              <Select
                value={newImage.section}
                onValueChange={(value) => setNewImage({...newImage, section: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="url">Image URL</Label>
              <Input
                id="url"
                value={newImage.url}
                onChange={(e) => setNewImage({...newImage, url: e.target.value})}
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newImage.description}
                onChange={(e) => setNewImage({...newImage, description: e.target.value})}
                placeholder="Enter a short description"
              />
            </div>

            {newImage.url && (
              <div className="mt-2">
                <Label className="mb-2 block">Preview</Label>
                <div className="relative h-40 overflow-hidden bg-gray-100 rounded-md">
                  <img 
                    src={newImage.url} 
                    alt="Preview"
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      // If image fails to load, show a placeholder
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Not+Found';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddImage}>Add Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          {currentImage && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Image Name</Label>
                <Input
                  id="edit-name"
                  value={currentImage.name}
                  onChange={(e) => setCurrentImage({...currentImage, name: e.target.value})}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-section">Section</Label>
                <Select
                  value={currentImage.section}
                  onValueChange={(value) => setCurrentImage({...currentImage, section: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-url">Image URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="edit-url"
                    value={currentImage.url}
                    onChange={(e) => setCurrentImage({...currentImage, url: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={currentImage.description}
                  onChange={(e) => setCurrentImage({...currentImage, description: e.target.value})}
                />
              </div>

              <div className="mt-2">
                <Label className="mb-2 block">Current Image</Label>
                <div className="relative h-40 overflow-hidden bg-gray-100 rounded-md">
                  <img 
                    src={currentImage.url} 
                    alt={currentImage.name}
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      // If image fails to load, show a placeholder
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Not+Found';
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditImage}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsitePhotosManager;
