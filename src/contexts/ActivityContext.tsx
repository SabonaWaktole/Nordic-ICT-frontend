import { createContext, useContext, useState, type ReactNode } from 'react';

interface Activity {
  id: string;
  type: 'project' | 'news' | 'partner';
  action: 'created' | 'updated' | 'deleted' | 'pinned' | 'unpinned';
  title: string;
  description: string;
  timestamp: string;
  icon?: string; // Optional icon for the activity
  color?: string; // Optional color for the activity
}

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  clearActivities: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    setActivities(prev => [
      {
        ...activity,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      },
      ...prev.slice(0, 49) // Keep recent 50 activities
    ]);
  };

  const clearActivities = () => {
    setActivities([]);
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity, clearActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};