import React from 'react';
import { 
  FolderOpen, 
  Newspaper, 
  Users, 
  TrendingUp,
  Clock,
  Plus,
  Edit,
  Trash2,
  Pin,
  PinOff
} from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';
import { useData } from '../contexts/DataContext';

const Dashboard: React.FC = () => {
  const { activities } = useActivity();
  const { getStats } = useData();
  
  const stats = getStats();
  
  // Calculate growth percentage based on recent activity
  const recentActivities = activities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return activityDate >= thirtyDaysAgo;
  });
  
  const growthPercentage = recentActivities.length > 0 ? `+${Math.min(recentActivities.length * 2, 50)}%` : '+0%';

  const dashboardStats = [
    { 
      id: 'projects', 
      label: 'Total Projects', 
      value: stats.projectsCount, 
      icon: FolderOpen, 
      color: 'bg-blue-500',
      subtitle: `${stats.completedProjectsCount} completed`
    },
    { 
      id: 'news', 
      label: 'News Posts', 
      value: stats.newsCount, 
      icon: Newspaper, 
      color: 'bg-green-500',
      subtitle: `${stats.publishedNewsCount} published`
    },
    { 
      id: 'partners', 
      label: 'Partners', 
      value: stats.partnersCount, 
      icon: Users, 
      color: 'bg-purple-500',
      subtitle: `${stats.activePartnersCount} active`
    },
    { 
      id: 'growth', 
      label: 'Recent Activity', 
      value: growthPercentage, 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      subtitle: 'Last 30 days'
    },
  ];

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'created': return Plus;
      case 'updated': return Edit;
      case 'deleted': return Trash2;
      case 'pinned': return Pin;
      case 'unpinned': return PinOff;
      default: return Edit;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'created': return 'text-green-500';
      case 'updated': return 'text-blue-500';
      case 'deleted': return 'text-red-500';
      case 'pinned': return 'text-orange-500';
      case 'unpinned': return 'text-gray-500';
      default: return 'text-blue-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with Nordic ICT.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat) => (
          <div key={stat.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.subtitle}</p>
                )}
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Start managing your content to see activities here</p>
              </div>
            ) : (
              activities.slice(0, 10).map((activity) => {
                const IconComponent = getActivityIcon(activity.action);
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className={`p-2 rounded-lg bg-white dark:bg-gray-700 ${getActivityColor(activity.action)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <button className="w-full flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors group">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Add New Project</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create a new project entry</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Newspaper className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Publish News</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Share company updates</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors group">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Add Partner</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Register new business partner</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;