
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
import { toast } from 'sonner';
import { Edit, Plus, Trash2, Youtube } from 'lucide-react';

// Mock video testimonials
const initialVideoTestimonials = [
  {
    id: 1,
    videoId: 'Rz6PVUtVYks', 
    title: 'Client Testimonial 1',
    thumbnail: 'https://img.youtube.com/vi/Rz6PVUtVYks/hqdefault.jpg',
  },
  {
    id: 2,
    videoId: '4oogYX-_a38',
    title: 'Client Testimonial 2',
    thumbnail: 'https://img.youtube.com/vi/4oogYX-_a38/hqdefault.jpg',
  },
  {
    id: 3,
    videoId: 'g57bSleJEEY', 
    title: 'Client Testimonial 3',
    thumbnail: 'https://img.youtube.com/vi/g57bSleJEEY/hqdefault.jpg',
  },
  {
    id: 4,
    videoId: '_8s-7gSdT5E',
    title: 'Client Testimonial 4',
    thumbnail: 'https://img.youtube.com/vi/_8s-7gSdT5E/hqdefault.jpg',
  },
  {
    id: 5,
    videoId: '_A-NDWDF9aE',
    title: 'Client Testimonial 5',
    thumbnail: 'https://img.youtube.com/vi/_A-NDWDF9aE/hqdefault.jpg',
  },
];

type VideoTestimonial = {
  id: number;
  videoId: string;
  title: string;
  thumbnail: string;
};

const TestimonialManager = () => {
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>(initialVideoTestimonials);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<VideoTestimonial | null>(null);
  const [newTestimonial, setNewTestimonial] = useState<Omit<VideoTestimonial, 'id' | 'thumbnail'>>({
    videoId: '',
    title: '',
  });

  // Function to get YouTube thumbnail from video ID
  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const handleAddTestimonial = () => {
    const id = Math.max(0, ...testimonials.map(item => item.id)) + 1;
    const thumbnail = getYouTubeThumbnail(newTestimonial.videoId);
    
    setTestimonials([...testimonials, { 
      id, 
      ...newTestimonial, 
      thumbnail
    }]);
    
    setIsAddDialogOpen(false);
    setNewTestimonial({
      videoId: '',
      title: '',
    });
    toast.success('Video testimonial added successfully');
  };

  const handleEditTestimonial = () => {
    if (!currentTestimonial) return;
    
    // If videoId changed, update thumbnail
    const updatedTestimonial = { 
      ...currentTestimonial,
      thumbnail: getYouTubeThumbnail(currentTestimonial.videoId)
    };
    
    setTestimonials(testimonials.map(item => 
      item.id === updatedTestimonial.id ? updatedTestimonial : item
    ));
    
    setIsEditDialogOpen(false);
    setCurrentTestimonial(null);
    toast.success('Video testimonial updated successfully');
  };

  const handleDeleteTestimonial = (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(testimonials.filter(item => item.id !== id));
      toast.success('Video testimonial deleted successfully');
    }
  };

  const openEditDialog = (testimonial: VideoTestimonial) => {
    setCurrentTestimonial({ ...testimonial });
    setIsEditDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Video Testimonials</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add New Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <img 
                src={testimonial.thumbnail} 
                alt={testimonial.title}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                  <Youtube className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => openEditDialog(testimonial)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDeleteTestimonial(testimonial.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-base">{testimonial.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                YouTube ID: <span className="font-mono">{testimonial.videoId}</span>
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${testimonial.videoId}`, '_blank')}
              >
                <Youtube className="w-4 h-4 mr-2" /> Watch on YouTube
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Video Testimonial</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="videoId">YouTube Video ID</Label>
              <Input
                id="videoId"
                value={newTestimonial.videoId}
                onChange={(e) => setNewTestimonial({...newTestimonial, videoId: e.target.value})}
                placeholder="e.g. dQw4w9WgXcQ"
              />
              <p className="text-xs text-gray-500">
                The ID is the part after "v=" in a YouTube URL. For example, in https://www.youtube.com/watch?v=dQw4w9WgXcQ, the ID is dQw4w9WgXcQ
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="title">Testimonial Title</Label>
              <Input
                id="title"
                value={newTestimonial.title}
                onChange={(e) => setNewTestimonial({...newTestimonial, title: e.target.value})}
                placeholder="Enter a title for this testimonial"
              />
            </div>

            {newTestimonial.videoId && (
              <div className="mt-2">
                <Label className="mb-2 block">Preview</Label>
                <div className="relative aspect-video overflow-hidden bg-gray-100 rounded-md">
                  <img 
                    src={getYouTubeThumbnail(newTestimonial.videoId)} 
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                      <Youtube className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTestimonial}>Add Testimonial</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Video Testimonial</DialogTitle>
          </DialogHeader>
          {currentTestimonial && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-videoId">YouTube Video ID</Label>
                <Input
                  id="edit-videoId"
                  value={currentTestimonial.videoId}
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, videoId: e.target.value})}
                />
                <p className="text-xs text-gray-500">
                  The ID is the part after "v=" in a YouTube URL.
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Testimonial Title</Label>
                <Input
                  id="edit-title"
                  value={currentTestimonial.title}
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, title: e.target.value})}
                />
              </div>

              <div className="mt-2">
                <Label className="mb-2 block">Current Thumbnail</Label>
                <div className="relative aspect-video overflow-hidden bg-gray-100 rounded-md">
                  <img 
                    src={getYouTubeThumbnail(currentTestimonial.videoId)} 
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                      <Youtube className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTestimonial}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialManager;
