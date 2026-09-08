import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { Card, CardContent } from '../components/ui/Card';
import { FolderKanban, CheckSquare, Clock } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          apiClient.get('/projects'),
          apiClient.get('/tasks')
        ]);
        
        const projects = projectsRes.data.data;
        const tasks = tasksRes.data.data;
        
        setStats({
          totalProjects: projects.length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'done').length
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const completionPercentage = stats.totalTasks === 0 ? 0 : Math.round((stats.completedTasks / stats.totalTasks) * 100);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-pulse w-10 h-10 rounded-full bg-taskflow-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-taskflow-ink">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-taskflow-textSecondary mt-1">Here's what's happening in your workspace today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FolderKanban size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-taskflow-textSecondary mb-1">Total Projects</p>
              <p className="text-2xl font-bold text-taskflow-ink">{stats.totalProjects}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <CheckSquare size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-taskflow-textSecondary mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-taskflow-ink">{stats.totalTasks}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-taskflow-ink text-white border-none">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 mb-1">Task Completion</p>
              <p className="text-3xl font-bold">{completionPercentage}%</p>
            </div>
            {/* CSS Circular Progress */}
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-gray-800" style={{
              background: `conic-gradient(#FFD6E0 ${completionPercentage * 3.6}deg, #374151 0deg)`
            }}>
              <div className="absolute w-12 h-12 bg-taskflow-ink rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
