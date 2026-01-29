import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface ProjectFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSuccess: () => void;
}

const ProjectFormSheet: React.FC<ProjectFormSheetProps> = ({
  open,
  onOpenChange,
  project,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Reset form when sheet opens/closes or project changes
  useEffect(() => {
    if (open) {
      if (project) {
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
      } else {
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
      }
    }
  }, [open, project]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate remaining amount
  const calculateRemaining = () => {
    const total = parseFloat(formData.total_amount) || 0;
    const advance = parseFloat(formData.advance_amount) || 0;
    return Math.max(0, total - advance);
  };

  const handleSubmit = async () => {
    // Validate required fields
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

      if (project) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);

        if (error) throw error;
        toast.success('Project updated successfully');
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        toast.success('Project created successfully');
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error saving project:', err);
      toast.error(err.message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>{project ? 'Edit Project' : 'Add New Project'}</SheetTitle>
          <SheetDescription>
            {project ? 'Update the project details below.' : 'Fill in the details to create a new project.'}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)] px-6">
          <div className="space-y-6 py-4">
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Client Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Client Name *</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => handleChange('client_name', e.target.value)}
                    placeholder="Enter client name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_phone">Mobile Number</Label>
                  <Input
                    id="client_phone"
                    value={formData.client_phone}
                    onChange={(e) => handleChange('client_phone', e.target.value)}
                    placeholder="Enter mobile number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_email">Email</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => handleChange('client_email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Project Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_name">Project Name *</Label>
                  <Input
                    id="project_name"
                    value={formData.project_name}
                    onChange={(e) => handleChange('project_name', e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_status">Status</Label>
                  <Select
                    value={formData.project_status}
                    onValueChange={(value) => handleChange('project_status', value)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-[100]">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_description">Project Description</Label>
                  <Textarea
                    id="project_description"
                    value={formData.project_description}
                    onChange={(e) => handleChange('project_description', e.target.value)}
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_file_url">Project File URL</Label>
                  <Input
                    id="project_file_url"
                    value={formData.project_file_url}
                    onChange={(e) => handleChange('project_file_url', e.target.value)}
                    placeholder="Enter file URL (Google Drive, etc.)"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Payment Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_amount">Total Amount (₹)</Label>
                  <Input
                    id="total_amount"
                    type="number"
                    value={formData.total_amount}
                    onChange={(e) => handleChange('total_amount', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advance_amount">Advance Amount (₹)</Label>
                  <Input
                    id="advance_amount"
                    type="number"
                    value={formData.advance_amount}
                    onChange={(e) => handleChange('advance_amount', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Remaining Amount (₹)</Label>
                  <Input
                    value={calculateRemaining().toLocaleString('en-IN')}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Input
                    id="payment_method"
                    value={formData.payment_method}
                    onChange={(e) => handleChange('payment_method', e.target.value)}
                    placeholder="e.g., UPI, Bank Transfer, Cash"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Timeline
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleChange('start_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleChange('end_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer with buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              project ? 'Update Project' : 'Add Project'
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProjectFormSheet;
