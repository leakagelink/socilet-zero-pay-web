import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, GripVertical, Calendar, Tag, User, MoreHorizontal, Edit, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Task {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_name: string | null;
  due_date: string | null;
  labels: string[];
  position: number;
  created_at: string;
}

interface Project {
  id: string;
  project_name: string;
}

const statusColumns: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'backlog', label: 'Backlog', color: 'bg-slate-500' },
  { key: 'todo', label: 'To Do', color: 'bg-blue-500' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-amber-500' },
  { key: 'review', label: 'Review', color: 'bg-purple-500' },
  { key: 'done', label: 'Done', color: 'bg-emerald-500' },
];

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  urgent: 'bg-red-100 text-red-700',
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [mobileColumnIndex, setMobileColumnIndex] = useState(1); // default to 'todo'
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    assignee_name: '',
    due_date: '',
    labels: [] as string[],
  });
  const [labelInput, setLabelInput] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      
      const typedData = (data || []).map(task => ({
        ...task,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        labels: (task.labels as string[]) || [],
      }));
      
      setTasks(typedData);
    } catch (error: any) {
      toast.error('Failed to fetch tasks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, project_name')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      const taskData = {
        project_id: formData.project_id || null,
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        priority: formData.priority,
        assignee_name: formData.assignee_name || null,
        due_date: formData.due_date || null,
        labels: formData.labels,
        position: tasks.filter(t => t.status === formData.status).length,
      };

      if (selectedTask) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', selectedTask.id);
        if (error) throw error;
        toast.success('Task updated');
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert([taskData]);
        if (error) throw error;
        toast.success('Task created');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTasks();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save task');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', draggedTask.id);
      
      if (error) throw error;
      
      setTasks(prev => prev.map(t => 
        t.id === draggedTask.id ? { ...t, status: newStatus } : t
      ));
      
      toast.success(`Moved to ${statusColumns.find(c => c.key === newStatus)?.label}`);
    } catch (error) {
      toast.error('Failed to move task');
    } finally {
      setDraggedTask(null);
    }
  };

  const resetForm = () => {
    setFormData({
      project_id: '',
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignee_name: '',
      due_date: '',
      labels: [],
    });
    setLabelInput('');
    setSelectedTask(null);
  };

  const openEdit = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      project_id: task.project_id || '',
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assignee_name: task.assignee_name || '',
      due_date: task.due_date || '',
      labels: task.labels,
    });
    setIsDialogOpen(true);
  };

  const addLabel = () => {
    if (labelInput.trim() && !formData.labels.includes(labelInput.trim())) {
      setFormData({ ...formData, labels: [...formData.labels, labelInput.trim()] });
      setLabelInput('');
    }
  };

  const removeLabel = (label: string) => {
    setFormData({ ...formData, labels: formData.labels.filter(l => l !== label) });
  };

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return null;
    return projects.find(p => p.id === projectId)?.project_name;
  };

  const filteredTasks = projectFilter === 'all' 
    ? tasks 
    : tasks.filter(t => t.project_id === projectFilter);

  const getTasksByStatus = (status: TaskStatus) => 
    filteredTasks.filter(t => t.status === status);

  const renderTaskCard = (task: Task) => (
    <div
      key={task.id}
      draggable={!isMobile}
      onDragStart={(e) => handleDragStart(e, task)}
      className={`bg-card rounded-lg p-3 shadow-sm border cursor-grab hover:shadow-md transition-all ${
        draggedTask?.id === task.id ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(task)}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
            {isMobile && (
              <>
                {statusColumns.filter(c => c.key !== task.status).map(col => (
                  <DropdownMenuItem key={col.key} onClick={async () => {
                    try {
                      const { error } = await supabase.from('tasks').update({ status: col.key }).eq('id', task.id);
                      if (error) throw error;
                      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: col.key } : t));
                      toast.success(`Moved to ${col.label}`);
                    } catch { toast.error('Failed to move task'); }
                  }}>
                    <div className={`w-2 h-2 rounded-full ${col.color} mr-2`} /> Move to {col.label}
                  </DropdownMenuItem>
                ))}
              </>
            )}
            <DropdownMenuItem 
              onClick={() => handleDelete(task.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mb-2">
        <Badge className={`text-xs ${priorityColors[task.priority]}`}>
          {task.priority}
        </Badge>
        {task.labels.slice(0, 2).map(label => (
          <Badge key={label} variant="outline" className="text-xs">
            {label}
          </Badge>
        ))}
        {task.labels.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{task.labels.length - 2}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {task.assignee_name && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate max-w-[80px]">{task.assignee_name}</span>
          </div>
        )}
        {task.due_date && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
        )}
      </div>

      {getProjectName(task.project_id) && (
        <div className="mt-2 pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            📁 {getProjectName(task.project_id)}
          </span>
        </div>
      )}
    </div>
  );

  const renderColumn = (column: typeof statusColumns[0]) => (
    <div
      key={column.key}
      className={isMobile ? 'w-full' : 'flex-shrink-0 w-72'}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, column.key)}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
        <h3 className="font-semibold text-sm">{column.label}</h3>
        <Badge variant="secondary" className="ml-auto text-xs">
          {getTasksByStatus(column.key).length}
        </Badge>
      </div>

      <div className="space-y-3 min-h-[200px] sm:min-h-[300px] bg-muted/30 rounded-xl p-3">
        {getTasksByStatus(column.key).map(task => renderTaskCard(task))}

        {getTasksByStatus(column.key).length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-t-xl px-3 sm:px-6 py-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <GripVertical className="h-5 w-5" />
              Task Board
            </CardTitle>
            <Button variant="secondary" size={isMobile ? 'sm' : 'default'} onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Add </span>Task
            </Button>
          </div>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white/10 border-white/20 text-white text-sm">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.project_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-6">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
        ) : isMobile ? (
          /* Mobile: swipeable single column view */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" size="icon" className="h-8 w-8"
                disabled={mobileColumnIndex === 0}
                onClick={() => setMobileColumnIndex(i => Math.max(0, i - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-1.5">
                {statusColumns.map((col, i) => (
                  <button
                    key={col.key}
                    onClick={() => setMobileColumnIndex(i)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      i === mobileColumnIndex 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {col.label}
                    {getTasksByStatus(col.key).length > 0 && (
                      <span className="ml-1">({getTasksByStatus(col.key).length})</span>
                    )}
                  </button>
                ))}
              </div>
              <Button 
                variant="ghost" size="icon" className="h-8 w-8"
                disabled={mobileColumnIndex === statusColumns.length - 1}
                onClick={() => setMobileColumnIndex(i => Math.min(statusColumns.length - 1, i + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {renderColumn(statusColumns[mobileColumnIndex])}
          </div>
        ) : (
          /* Desktop: horizontal kanban */
          <div className="flex gap-4 overflow-x-auto pb-4">
            {statusColumns.map(column => renderColumn(column))}
          </div>
        )}
      </CardContent>

      {/* Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg w-[95vw] sm:w-full max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task title"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v: TaskStatus) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusColumns.map(col => (
                      <SelectItem key={col.key} value={col.key}>{col.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(v: TaskPriority) => setFormData({ ...formData, priority: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project</Label>
                <Select value={formData.project_id} onValueChange={(v) => setFormData({ ...formData, project_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Project</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.project_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Input
                value={formData.assignee_name}
                onChange={(e) => setFormData({ ...formData, assignee_name: e.target.value })}
                placeholder="Assignee name"
              />
            </div>

            <div className="space-y-2">
              <Label>Labels</Label>
              <div className="flex gap-2">
                <Input
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  placeholder="Add label"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                />
                <Button type="button" variant="outline" onClick={addLabel}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.labels.map(label => (
                    <Badge key={label} variant="secondary" className="gap-1">
                      {label}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeLabel(label)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{selectedTask ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default KanbanBoard;
