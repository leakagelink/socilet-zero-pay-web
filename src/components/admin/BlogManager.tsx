
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
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';

// Mock blog posts
const initialBlogPosts = [
  {
    id: 1,
    title: 'The Benefits of Zero Advance Payment Model',
    excerpt: 'Discover how our zero advance payment model benefits clients and ensures quality work.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    content: 'Full article content goes here...',
    published: '2024-06-01'
  },
  {
    id: 2,
    title: 'Website Development Best Practices for SEO',
    excerpt: 'Learn the best practices for developing websites that rank well in search engines.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    content: 'Full article content goes here...',
    published: '2024-05-15'
  },
  {
    id: 3,
    title: 'Mobile App Development Guide',
    excerpt: 'Everything you need to know about developing a successful mobile application.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    content: 'Full article content goes here...',
    published: '2024-04-20'
  }
];

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  content: string;
  published: string;
};

const BlogManager = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    excerpt: '',
    image: '',
    content: '',
    published: new Date().toISOString().split('T')[0]
  });

  const handleAddPost = () => {
    const id = Math.max(0, ...blogPosts.map(post => post.id)) + 1;
    setBlogPosts([...blogPosts, { id, ...newPost }]);
    setIsAddDialogOpen(false);
    setNewPost({
      title: '',
      excerpt: '',
      image: '',
      content: '',
      published: new Date().toISOString().split('T')[0]
    });
    toast.success('Blog post added successfully');
  };

  const handleEditPost = () => {
    if (!currentPost) return;
    
    setBlogPosts(blogPosts.map(post => 
      post.id === currentPost.id ? currentPost : post
    ));
    setIsEditDialogOpen(false);
    setCurrentPost(null);
    toast.success('Blog post updated successfully');
  };

  const handleDeletePost = (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setBlogPosts(blogPosts.filter(post => post.id !== id));
      toast.success('Blog post deleted successfully');
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setCurrentPost({ ...post });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (post: BlogPost) => {
    setCurrentPost({ ...post });
    setIsViewDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id}>
            <div className="relative h-40 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => openEditDialog(post)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
              <p className="text-gray-400 text-xs mt-2">Published: {post.published}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => openViewDialog(post)}
              >
                <Eye className="w-4 h-4 mr-2" /> View Full Content
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Blog Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="Enter blog title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">Featured Image URL</Label>
              <Input
                id="image"
                value={newPost.image}
                onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={newPost.excerpt}
                onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                placeholder="Enter short excerpt"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="Enter full blog content"
                rows={10}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="published">Publish Date</Label>
              <Input
                id="published"
                type="date"
                value={newPost.published}
                onChange={(e) => setNewPost({...newPost, published: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPost}>Add Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          {currentPost && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={currentPost.title}
                  onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Featured Image URL</Label>
                <Input
                  id="edit-image"
                  value={currentPost.image}
                  onChange={(e) => setCurrentPost({...currentPost, image: e.target.value})}
                />
                {currentPost.image && (
                  <div className="mt-2 rounded overflow-hidden h-20 w-40">
                    <img 
                      src={currentPost.image} 
                      alt={currentPost.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-excerpt">Excerpt</Label>
                <Textarea
                  id="edit-excerpt"
                  value={currentPost.excerpt}
                  onChange={(e) => setCurrentPost({...currentPost, excerpt: e.target.value})}
                  rows={2}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={currentPost.content}
                  onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
                  rows={10}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-published">Publish Date</Label>
                <Input
                  id="edit-published"
                  type="date"
                  value={currentPost.published}
                  onChange={(e) => setCurrentPost({...currentPost, published: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditPost}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{currentPost?.title}</DialogTitle>
          </DialogHeader>
          {currentPost && (
            <div className="py-4">
              <div className="rounded overflow-hidden h-40 mb-4">
                <img 
                  src={currentPost.image} 
                  alt={currentPost.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Excerpt:</h3>
                <p className="mt-1">{currentPost.excerpt}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Published:</h3>
                <p className="mt-1">{currentPost.published}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Content:</h3>
                <div className="mt-1 prose max-w-none">
                  {currentPost.content}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManager;
