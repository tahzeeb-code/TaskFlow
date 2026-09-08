import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { CheckSquare, Calendar, FolderKanban } from 'lucide-react';
import { format } from 'date-fns';

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await apiClient.get('/tasks');
      setTasks(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-pulse w-8 h-8 rounded-full bg-taskflow-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-taskflow-ink hidden md:block">My Tasks</h2>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-taskflow-surface rounded-full flex items-center justify-center mx-auto mb-4 text-taskflow-textSecondary">
            <CheckSquare size={32} />
          </div>
          <h3 className="text-xl font-medium text-taskflow-ink mb-2">You have no tasks</h3>
          <p className="text-taskflow-textSecondary mb-6 max-w-sm mx-auto">Tasks assigned to you will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-taskflow-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-taskflow-surface text-taskflow-textSecondary">
                <tr>
                  <th className="px-6 py-4 font-medium">Task</th>
                  <th className="px-6 py-4 font-medium">Project</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-taskflow-border">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/projects/${task.project?._id}`} className="block">
                        <span className="font-medium text-taskflow-ink hover:text-black">{task.title}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {task.project && (
                        <div className="flex items-center gap-2 text-taskflow-textSecondary">
                          <FolderKanban size={14} />
                          {task.project.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {task.status === 'todo' && <Badge variant="outline">To Do</Badge>}
                      {task.status === 'in_progress' && <Badge variant="warning">In Progress</Badge>}
                      {task.status === 'done' && <Badge variant="success">Done</Badge>}
                    </td>
                    <td className="px-6 py-4">
                      {task.priority === 'high' && <Badge variant="danger">High</Badge>}
                      {task.priority === 'medium' && <Badge variant="warning">Medium</Badge>}
                      {task.priority === 'low' && <Badge variant="success">Low</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasksPage;
