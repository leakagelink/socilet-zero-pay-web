import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Search, Calendar, ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface Project {
  id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  project_name: string;
  project_description: string | null;
  project_status: string;
  advance_amount: number | null;
  total_amount: number | null;
  remaining_amount: number | null;
  payment_method: string | null;
  project_file_url: string | null;
  start_date: string | null;
  end_date: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

type ViewMode = 'list' | 'form';

const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [deleteProjectName, setDeleteProjectName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    project_name: '',
    project_description: '',
    project_status: 'pending',
    advance_amount: '',
    total_amount: '',
    payment_method: '',
    project_file_url: '',
    start_date: '',
    end_date: '',
    deadline: '',
  });

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      client_name: '',
      client_email: '',
      client_phone: '',
      project_name: '',
      project_description: '',
      project_status: 'pending',
      advance_amount: '',
      total_amount: '',
      payment_method: '',
      project_file_url: '',
      start_date: '',
      end_date: '',
      deadline: '',
    });
  };

  // Open add form
  const openAddForm = () => {
    console.log('Opening add form');
    resetForm();
    setEditingProject(null);
    setViewMode('form');
  };

  // Open edit form
  const openEditForm = (project: Project) => {
    setFormData({
      client_name: project.client_name || '',
      client_email: project.client_email || '',
      client_phone: project.client_phone || '',
      project_name: project.project_name || '',
      project_description: project.project_description || '',
      project_status: project.project_status || 'pending',
      advance_amount: project.advance_amount?.toString() || '',
      total_amount: project.total_amount?.toString() || '',
      payment_method: project.payment_method || '',
      project_file_url: project.project_file_url || '',
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      deadline: project.deadline || '',
    });
    setEditingProject(project);
    setViewMode('form');
  };

  // Go back to list
  const goBack = () => {
    setViewMode('list');
    setEditingProject(null);
    resetForm();
  };

  // Handle form change
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate remaining amount
  const calculateRemaining = () => {
    const total = parseFloat(formData.total_amount) || 0;
    const advance = parseFloat(formData.advance_amount) || 0;
    return Math.max(0, total - advance);
  };

  // Submit form
  const handleSubmit = async () => {
    if (!formData.client_name.trim()) {
      toast.error('Client name is required');
      return;
    }
    if (!formData.project_name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const projectData = {
        client_name: formData.client_name.trim(),
        client_email: formData.client_email.trim() || null,
        client_phone: formData.client_phone.trim() || null,
        project_name: formData.project_name.trim(),
        project_description: formData.project_description.trim() || null,
        project_status: formData.project_status,
        advance_amount: formData.advance_amount ? parseFloat(formData.advance_amount) : 0,
        total_amount: formData.total_amount ? parseFloat(formData.total_amount) : 0,
        remaining_amount: calculateRemaining(),
        payment_method: formData.payment_method.trim() || null,
        project_file_url: formData.project_file_url.trim() || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        deadline: formData.deadline || null,
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
        toast.success('Project updated successfully');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        toast.success('Project created successfully');
      }

      goBack();
      fetchProjects();
    } catch (err: any) {
      console.error('Error saving project:', err);
      toast.error(err.message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete project
  const handleDelete = async () => {
    if (!deleteProjectId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', deleteProjectId);

      if (error) throw error;
      
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (err: any) {
      console.error('Error deleting project:', err);
      toast.error('Failed to delete project');
    } finally {
      setIsDeleting(false);
      setDeleteProjectId(null);
      setDeleteProjectName('');
    }
  };

  const confirmDelete = (project: Project) => {
    setDeleteProjectId(project.id);
    setDeleteProjectName(project.project_name);
  };

  const cancelDelete = () => {
    setDeleteProjectId(null);
    setDeleteProjectName('');
  };

  // Filter projects
  const filteredProjects = projects.filter(project => 
    project.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.client_email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (project.client_phone?.includes(searchQuery))
  );

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '—';
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // FORM VIEW
  if (viewMode === 'form') {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="sm" onClick={goBack} className="h-8 px-2 sm:px-3">
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h2 className="text-lg sm:text-xl font-semibold">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h2>
        </div>

        <Card>
          <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6 px-3 sm:px-6">
            {/* Client Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                Client Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="client_name" className="text-sm">Client Name *</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => handleChange('client_name', e.target.value)}
                    placeholder="Enter client name"
                    className="h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="client_phone" className="text-sm">Mobile Number</Label>
                  <Input
                    id="client_phone"
                    value={formData.client_phone}
                    onChange={(e) => handleChange('client_phone', e.target.value)}
                    placeholder="Enter mobile number"
                    className="h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                  <Label htmlFor="client_email" className="text-sm">Email</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => handleChange('client_email', e.target.value)}
                    placeholder="Enter email address"
                    className="h-9 sm:h-10"
                  />
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                Project Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="project_name" className="text-sm">Project Name *</Label>
                  <Input
                    id="project_name"
                    value={formData.project_name}
                    onChange={(e) => handleChange('project_name', e.target.value)}
                    placeholder="Enter project name"
                    className="h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="project_status" className="text-sm">Status</Label>
                  <select
                    id="project_status"
                    value={formData.project_status}
                    onChange={(e) => handleChange('project_status', e.target.value)}
                    className="flex h-9 sm:h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                  <Label htmlFor="project_description" className="text-sm">Project Description</Label>
                  <Textarea
                    id="project_description"
                    value={formData.project_description}
                    onChange={(e) => handleChange('project_description', e.target.value)}
                    placeholder="Enter project description"
                    rows={3}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                  <Label htmlFor="project_file_url" className="text-sm">Project File URL</Label>
                  <Input
                    id="project_file_url"
                    value={formData.project_file_url}
                    onChange={(e) => handleChange('project_file_url', e.target.value)}
                    placeholder="Enter file URL (Google Drive, etc.)"
                    className="h-9 sm:h-10"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                Payment Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="total_amount" className="text-sm">Total Amount (₹)</Label>
                  <Input
                    id="total_amount"
                    type="number"
                    value={formData.total_amount}
                    onChange={(e) => handleChange('total_amount', e.target.value)}
                    placeholder="0"
                    min="0"
                    className="h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="advance_amount" className="text-sm">Advance Amount (₹)</Label>
                  <Input
                    id="advance_amount"
                    type="number"
                    value={formData.advance_amount}
                    onChange={(e) => handleChange('advance_amount', e.target.value)}
                    placeholder="0"
                    min="0"
                    className="h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm">Remaining Amount (₹)</Label>
                  <Input
                    value={calculateRemaining().toLocaleString('en-IN')}
                    disabled
                    className="bg-muted h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2 sm:col-span-3">
                  <Label htmlFor="payment_method" className="text-sm">Payment Method</Label>
                  <Input
                    id="payment_method"
                    value={formData.payment_method}
                    onChange={(e) => handleChange('payment_method', e.target.value)}
                    placeholder="e.g., UPI, Bank Transfer, Cash"
                    className="h-9 sm:h-10"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                Timeline
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="start_date" className="text-sm">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleChange('start_date', e.target.value)}
                    className="h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="end_date" className="text-sm">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleChange('end_date', e.target.value)}
                    className="h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="deadline" className="text-sm">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                    className="h-9 sm:h-10"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
              <Button variant="outline" onClick={goBack} disabled={isSubmitting} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingProject ? 'Update Project' : 'Save Project'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Delete Confirmation Inline */}
      {deleteProjectId && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="py-3 sm:py-4 px-3 sm:px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="font-medium text-sm sm:text-base">Delete "{deleteProjectName}"?</p>
                <p className="text-xs sm:text-sm text-muted-foreground">This action cannot be undone.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={cancelDelete} disabled={isDeleting} className="flex-1 sm:flex-none h-8">
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDelete} 
                  disabled={isDeleting}
                  className="flex-1 sm:flex-none h-8"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search client or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 sm:h-10"
          />
        </div>
        <Button onClick={openAddForm} className="h-9 sm:h-10 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <p className="text-xl sm:text-2xl font-bold">{projects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
              {projects.filter(p => p.project_status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Running</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {projects.filter(p => p.project_status === 'running').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {projects.filter(p => p.project_status === 'completed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects - Mobile Cards / Desktop Table */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? 'No projects found matching your search.' : 'No projects yet. Add your first project!'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{project.client_name}</p>
                          {project.client_phone && (
                            <p className="text-sm text-muted-foreground">{project.client_phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{project.project_name}</p>
                          {project.project_description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {project.project_description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(project.project_status)}>
                          {project.project_status.charAt(0).toUpperCase() + project.project_status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">
                          <p className="font-medium">{formatCurrency(project.total_amount)}</p>
                          {project.remaining_amount !== null && project.remaining_amount > 0 && (
                            <p className="text-muted-foreground">
                              Due: {formatCurrency(project.remaining_amount)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(project.deadline)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditForm(project)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => confirmDelete(project)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground px-4">
                {searchQuery ? 'No projects found.' : 'No projects yet. Add your first project!'}
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div key={project.id} className="p-3 sm:p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{project.project_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{project.client_name}</p>
                    </div>
                    <Badge variant="outline" className={`${getStatusColor(project.project_status)} text-[10px] px-1.5 py-0.5`}>
                      {project.project_status.charAt(0).toUpperCase() + project.project_status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{formatCurrency(project.total_amount)}</span>
                      {project.remaining_amount !== null && project.remaining_amount > 0 && (
                        <span className="text-amber-600">Due: {formatCurrency(project.remaining_amount)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(project.deadline)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditForm(project)}
                      className="flex-1 h-8 text-xs"
                    >
                      <Pencil className="h-3 w-3 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive h-8"
                      onClick={() => confirmDelete(project)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectManager;
