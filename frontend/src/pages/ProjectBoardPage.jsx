import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { ArrowLeft, Plus, MoreVertical, Edit2, Trash2, Calendar, GripVertical } from 'lucide-react';
import { format } from 'date-fns';

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-taskflow-surface border-taskflow-border' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-[#FFF4E5] border-[#F4D7A1]' },
  { id: 'done', title: 'Done', color: 'bg-[#E6F4EA] border-[#B9D9C3]' },
];

const ProjectBoardPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState({ todo: [], in_progress: [], done: [] });
  const [loading, setLoading] = useState(true);
  
  // Task modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium' });

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        apiClient.get(`/projects/${projectId}`),
        apiClient.get(`/projects/${projectId}/tasks`)
      ]);
      
      setProject(projectRes.data.data);
      
      const groupedTasks = { todo: [], in_progress: [], done: [] };
      tasksRes.data.data.forEach(task => {
        if (groupedTasks[task.status]) {
          groupedTasks[task.status].push(task);
        }
      });
      setTasks(groupedTasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    
    // Optimistic UI update
    const sourceTasks = Array.from(tasks[sourceColumn]);
    const destTasks = sourceColumn === destColumn ? sourceTasks : Array.from(tasks[destColumn]);
    
    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destColumn;
    destTasks.splice(destination.index, 0, movedTask);
    
    setTasks({
      ...tasks,
      [sourceColumn]: sourceTasks,
      [destColumn]: destTasks,
    });

    // API Call
    try {
      await apiClient.patch(`/tasks/${draggableId}`, { status: destColumn });
    } catch (err) {
      // Revert if failed
      fetchProjectAndTasks();
      alert('Failed to update task status');
    }
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    try {
      if (editingTask) {
        const { data } = await apiClient.patch(`/tasks/${editingTask._id}`, taskForm);
        // We just refetch for simplicity in MVP, could update local state for better perf
        fetchProjectAndTasks();
      } else {
        const { data } = await apiClient.post(`/projects/${projectId}/tasks`, taskForm);
        const newTask = data.data;
        setTasks(prev => ({
          ...prev,
          [newTask.status]: [newTask, ...prev[newTask.status]]
        }));
      }
      closeModal();
    } catch (err) {
      alert('Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId, status) => {
    if (window.confirm('Delete this task?')) {
      try {
        await apiClient.delete(`/tasks/${taskId}`);
        setTasks(prev => ({
          ...prev,
          [status]: prev[status].filter(t => t._id !== taskId)
        }));
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  const openModal = (status = 'todo', task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({ title: task.title, description: task.description || '', status: task.status, priority: task.priority || 'medium' });
    } else {
      setEditingTask(null);
      setTaskForm({ title: '', description: '', status, priority: 'medium' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-pulse w-8 h-8 rounded-full bg-taskflow-primary"></div></div>;
  if (!project) return <div className="p-8">Project not found</div>;

  return (
    <div className="flex flex-col h-full -m-4 md:-m-8">
      {/* Header */}
      <div className="p-4 md:p-8 border-b border-taskflow-border bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10">
        <div>
          <Link to="/projects" className="inline-flex items-center text-sm font-medium text-taskflow-textSecondary hover:text-taskflow-ink mb-2 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Projects
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-taskflow-ink">{project.name}</h1>
          {project.description && <p className="text-taskflow-textSecondary mt-1">{project.description}</p>}
        </div>
        <div>
          <Button onClick={() => openModal()}>
            <Plus size={18} className="mr-2" /> Add Task
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-4 md:p-8 bg-taskflow-bg">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-h-[500px]">
            {columns.map(column => (
              <div key={column.id} className="flex-shrink-0 w-80 flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-semibold text-taskflow-ink flex items-center">
                    {column.title}
                    <span className="ml-2 bg-gray-200 text-gray-700 text-xs py-0.5 px-2 rounded-full font-medium">
                      {tasks[column.id].length}
                    </span>
                  </h3>
                  <button onClick={() => openModal(column.id)} className="text-taskflow-textSecondary hover:text-taskflow-ink p-1">
                    <Plus size={18} />
                  </button>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 rounded-2xl border ${column.color} p-3 transition-colors ${snapshot.isDraggingOver ? 'bg-taskflow-primary/10 border-taskflow-primary' : ''}`}
                    >
                      <div className="space-y-3">
                        {tasks[column.id].map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{ ...provided.draggableProps.style }}
                                className={`group bg-white rounded-xl p-4 shadow-sm border border-taskflow-border hover:border-taskflow-primary/50 transition-all ${snapshot.isDragging ? 'shadow-lg ring-2 ring-taskflow-primary ring-opacity-50 rotate-2' : ''}`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex gap-2 items-center text-taskflow-textSecondary">
                                    <GripVertical size={14} className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                                    {task.priority === 'high' && <Badge variant="danger">High</Badge>}
                                    {task.priority === 'medium' && <Badge variant="warning">Med</Badge>}
                                    {task.priority === 'low' && <Badge variant="success">Low</Badge>}
                                  </div>
                                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(column.id, task)} className="p-1 text-gray-400 hover:text-taskflow-ink"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDeleteTask(task._id, column.id)} className="p-1 text-gray-400 hover:text-taskflow-danger"><Trash2 size={14} /></button>
                                  </div>
                                </div>
                                <h4 className="font-semibold text-taskflow-ink mb-1">{task.title}</h4>
                                {task.description && (
                                  <p className="text-xs text-taskflow-textSecondary line-clamp-2 mb-3">{task.description}</p>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                      
                      {tasks[column.id].length === 0 && !snapshot.isDraggingOver && (
                        <div className="h-24 flex items-center justify-center text-sm text-taskflow-textSecondary border-2 border-dashed border-gray-300 rounded-xl mt-2">
                          Drop tasks here
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-lg bg-white">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">{editingTask ? 'Edit Task' : 'New Task'}</h3>
              <form onSubmit={handleSaveTask} className="space-y-4">
                <Input
                  label="Task Title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  autoFocus
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-taskflow-ink mb-1.5">Description</label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-xl border border-taskflow-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-taskflow-primary focus-visible:border-transparent"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-taskflow-ink mb-1.5">Status</label>
                    <select 
                      className="flex h-11 w-full rounded-xl border border-taskflow-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-taskflow-primary focus-visible:border-transparent"
                      value={taskForm.status}
                      onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-taskflow-ink mb-1.5">Priority</label>
                    <select 
                      className="flex h-11 w-full rounded-xl border border-taskflow-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-taskflow-primary focus-visible:border-transparent"
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
                  <Button type="submit" disabled={!taskForm.title.trim()}>Save Task</Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProjectBoardPage;
