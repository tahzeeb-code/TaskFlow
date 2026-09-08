import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await apiClient.get('/projects');
      setProjects(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectForm.name.trim()) return;

    try {
      const { data } = await apiClient.post('/projects', newProjectForm);
      setProjects([data.data, ...projects]);
      setIsModalOpen(false);
      setNewProjectForm({ name: '', description: '' });
    } catch (err) {
      alert('Failed to create project');
    }
  };

  const handleDeleteProject = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this project? All tasks will be deleted.')) {
      try {
        await apiClient.delete(`/projects/${id}`);
        setProjects(projects.filter(p => p._id !== id));
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-pulse w-8 h-8 rounded-full bg-taskflow-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-taskflow-ink hidden md:block">Projects</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" /> New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-taskflow-border border-dashed">
          <div className="w-16 h-16 bg-taskflow-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-taskflow-ink">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-medium text-taskflow-ink mb-2">No projects yet</h3>
          <p className="text-taskflow-textSecondary mb-6 max-w-sm mx-auto">Get started by creating a new project to organize your tasks.</p>
          <Button onClick={() => setIsModalOpen(true)}>Create First Project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project._id} to={`/projects/${project._id}`} className="block group">
              <Card className="h-full hover:border-taskflow-primary transition-colors hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-taskflow-primary/20 text-taskflow-ink flex items-center justify-center font-bold text-lg">
                      {project.name.charAt(0)}
                    </div>
                    <button 
                      onClick={(e) => handleDeleteProject(e, project._id)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-taskflow-ink mb-2 truncate">{project.name}</h3>
                  <p className="text-taskflow-textSecondary text-sm line-clamp-2 mb-4 h-10">
                    {project.description || 'No description provided.'}
                  </p>
                  <div className="text-xs font-medium text-gray-400 mt-auto">
                    Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-md bg-white">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Create New Project</h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <Input
                  label="Project Name"
                  value={newProjectForm.name}
                  onChange={(e) => setNewProjectForm({...newProjectForm, name: e.target.value})}
                  autoFocus
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-taskflow-ink mb-1.5">Description (Optional)</label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-xl border border-taskflow-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-taskflow-primary focus-visible:border-transparent"
                    value={newProjectForm.description}
                    onChange={(e) => setNewProjectForm({...newProjectForm, description: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={!newProjectForm.name.trim()}>Create Project</Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
