import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Eye, FileUp, Calendar, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

interface Project {
  id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  project_name: string;
  project_description: string | null;
  project_status: 'pending' | 'running' | 'completed';
  advance_amount: number;
  total_amount: number;
  remaining_amount: number;
  payment_method: string | null;
  project_file_url: string | null;
  start_date: string | null;
  end_date: string | null;
  deadline: string | null;
  created_at: string;
}

const initialFormState = {
  client_name: '',
  client_email: '',
  client_phone: '',
  project_name: '',
  project_description: '',
  project_status: 'pending' as 'pending' | 'running' | 'completed',
  advance_amount: 0,
  total_amount: 0,
  remaining_amount: 0,
  payment_method: '',
  project_file_url: '',
  start_date: '',
  end_date: '',
  deadline: '',
};

const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to handle the project_status string type
      const typedProjects = (data || []).map(p => ({
        ...p,
        project_status: p.project_status as 'pending' | 'running' | 'completed'
      }));
      
      setProjects(typedProjects);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleStatusChange = (value: 'pending' | 'running' | 'completed') => {
    setFormData(prev => ({ ...prev, project_status: value }));
  };

  // Auto-calculate remaining amount
  useEffect(() => {
    const remaining = formData.total_amount - formData.advance_amount;
    setFormData(prev => ({ ...prev, remaining_amount: remaining >= 0 ? remaining : 0 }));
  }, [formData.total_amount, formData.advance_amount]);

  const handleAddProject = async () => {
    if (!formData.client_name.trim() || !formData.project_name.trim()) {
      toast.error('Client name and Project name are required');
      return;
    }

    try {
      setSubmitting(true);
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('projects').insert({
        client_name: formData.client_name,
        client_email: formData.client_email || null,
        client_phone: formData.client_phone || null,
        project_name: formData.project_name,
        project_description: formData.project_description || null,
        project_status: formData.project_status,
        advance_amount: formData.advance_amount,
        total_amount: formData.total_amount,
        remaining_amount: formData.remaining_amount,
        payment_method: formData.payment_method || null,
        project_file_url: formData.project_file_url || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        deadline: formData.deadline || null,
        created_by: userData.user?.id
      });

      if (error) throw error;

      toast.success('Project added successfully!');
      setIsAddDialogOpen(false);
      setFormData(initialFormState);
      fetchProjects();
    } catch (error: any) {
      console.error('Error adding project:', error);
      toast.error(error.message || 'Failed to add project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProject = async () => {
    if (!selectedProject) return;
    if (!formData.client_name.trim() || !formData.project_name.trim()) {
      toast.error('Client name and Project name are required');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('projects')
        .update({
          client_name: formData.client_name,
          client_email: formData.client_email || null,
          client_phone: formData.client_phone || null,
          project_name: formData.project_name,
          project_description: formData.project_description || null,
          project_status: formData.project_status,
          advance_amount: formData.advance_amount,
          total_amount: formData.total_amount,
          remaining_amount: formData.remaining_amount,
          payment_method: formData.payment_method || null,
          project_file_url: formData.project_file_url || null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          deadline: formData.deadline || null,
        })
        .eq('id', selectedProject.id);

      if (error) throw error;

      toast.success('Project updated successfully!');
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      setFormData(initialFormState);
      fetchProjects();
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error(error.message || 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;

      toast.success('Project deleted successfully!');
      fetchProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error(error.message || 'Failed to delete project');
    }
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      client_name: project.client_name,
      client_email: project.client_email || '',
      client_phone: project.client_phone || '',
      project_name: project.project_name,
      project_description: project.project_description || '',
      project_status: project.project_status,
      advance_amount: project.advance_amount || 0,
      total_amount: project.total_amount || 0,
      remaining_amount: project.remaining_amount || 0,
      payment_method: project.payment_method || '',
      project_file_url: project.project_file_url || '',
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      deadline: project.deadline || '',
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (project: Project) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'running':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const ProjectForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client_name">Client Name *</Label>
          <Input
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleInputChange}
            placeholder="Enter client name"
            required
          />
        </div>
        <div>
          <Label htmlFor="project_name">Project Name *</Label>
          <Input
            id="project_name"
            name="project_name"
            value={formData.project_name}
            onChange={handleInputChange}
            placeholder="Enter project name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client_email">Client Email (Optional)</Label>
          <Input
            id="client_email"
            name="client_email"
            type="email"
            value={formData.client_email}
            onChange={handleInputChange}
            placeholder="client@email.com"
          />
        </div>
        <div>
          <Label htmlFor="client_phone">Client Phone (Optional)</Label>
          <Input
            id="client_phone"
            name="client_phone"
            value={formData.client_phone}
            onChange={handleInputChange}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="project_description">Project Description (Optional)</Label>
        <Textarea
          id="project_description"
          name="project_description"
          value={formData.project_description}
          onChange={handleInputChange}
          placeholder="Enter project description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="project_status">Project Status</Label>
          <Select value={formData.project_status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="payment_method">Payment Method (Optional)</Label>
          <Input
            id="payment_method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleInputChange}
            placeholder="UPI / Cash / Bank Transfer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="total_amount">Total Amount (₹)</Label>
          <Input
            id="total_amount"
            name="total_amount"
            type="number"
            value={formData.total_amount}
            onChange={handleInputChange}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="advance_amount">Advance Amount (₹)</Label>
          <Input
            id="advance_amount"
            name="advance_amount"
            type="number"
            value={formData.advance_amount}
            onChange={handleInputChange}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="remaining_amount">Remaining Amount (₹)</Label>
          <Input
            id="remaining_amount"
            name="remaining_amount"
            type="number"
            value={formData.remaining_amount}
            readOnly
            className="bg-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="project_file_url">Project File URL (Optional)</Label>
        <Input
          id="project_file_url"
          name="project_file_url"
          value={formData.project_file_url}
          onChange={handleInputChange}
          placeholder="https://drive.google.com/..."
        />
      </div>

      <Button 
        onClick={isEdit ? handleEditProject : handleAddProject} 
        disabled={submitting}
        className="w-full mt-4"
      >
        {submitting ? 'Saving...' : isEdit ? 'Update Project' : 'Add Project'}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Client Projects ({projects.length})</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(initialFormState)}>
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <ProjectForm />
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No projects found. Add your first project!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total (₹)</TableHead>
                <TableHead>Advance (₹)</TableHead>
                <TableHead>Remaining (₹)</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.client_name}</TableCell>
                  <TableCell>{project.project_name}</TableCell>
                  <TableCell>{getStatusBadge(project.project_status)}</TableCell>
                  <TableCell>₹{project.total_amount?.toLocaleString() || 0}</TableCell>
                  <TableCell>₹{project.advance_amount?.toLocaleString() || 0}</TableCell>
                  <TableCell>₹{project.remaining_amount?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    {project.deadline ? format(new Date(project.deadline), 'dd MMM yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openViewDialog(project)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <ProjectForm isEdit />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Client Name</p>
                  <p className="font-medium">{selectedProject.client_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Project Name</p>
                  <p className="font-medium">{selectedProject.project_name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedProject.client_email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedProject.client_phone || '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                {getStatusBadge(selectedProject.project_status)}
              </div>

              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p>{selectedProject.project_description || 'No description'}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-semibold text-lg">₹{selectedProject.total_amount?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Advance</p>
                  <p className="font-semibold text-lg text-green-600">₹{selectedProject.advance_amount?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="font-semibold text-lg text-red-600">₹{selectedProject.remaining_amount?.toLocaleString() || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p>{selectedProject.start_date ? format(new Date(selectedProject.start_date), 'dd MMM yyyy') : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p>{selectedProject.end_date ? format(new Date(selectedProject.end_date), 'dd MMM yyyy') : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p>{selectedProject.deadline ? format(new Date(selectedProject.deadline), 'dd MMM yyyy') : '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p>{selectedProject.payment_method || '-'}</p>
              </div>

              {selectedProject.project_file_url && (
                <div>
                  <p className="text-sm text-gray-500">Project File</p>
                  <a 
                    href={selectedProject.project_file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FileUp className="w-4 h-4" /> View File
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManager;
