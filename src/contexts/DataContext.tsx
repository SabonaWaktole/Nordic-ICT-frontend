import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Project } from '../domain/entities/Project';
import type { NewsPost } from '../domain/entities/NewsPost';
import type { Partner } from '../domain/entities/Partner';
import { AxiosProjectRepository } from '../infrastructure/repositories/AxiosProjectRepository';
import { AxiosNewsRepository } from '../infrastructure/repositories/AxiosNewsRepository';
import { AxiosPartnerRepository } from '../infrastructure/repositories/AxiosPartnerRepository';
import { getProjects } from '../application/usecases/GetProjects';
import { getNews } from '../application/usecases/GetNews';
import { getPartners } from '../application/usecases/GetPartners';

// Types now come from domain entities

interface DataContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  newsItems: NewsPost[];
  setNewsItems: React.Dispatch<React.SetStateAction<NewsPost[]>>;
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
  loading: boolean;
  error: string | null;
  getStats: () => {
    projectsCount: number;
    newsCount: number;
    partnersCount: number;
    activePartnersCount: number;
    publishedNewsCount: number;
    completedProjectsCount: number;
  };
}


const DataContext = createContext<DataContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newsItems, setNewsItems] = useState<NewsPost[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectRepo = new AxiosProjectRepository();
        const newsRepo = new AxiosNewsRepository();
        const partnerRepo = new AxiosPartnerRepository();

        const [proj, news, part] = await Promise.all([
          getProjects(projectRepo),
          getNews(newsRepo),
          getPartners(partnerRepo),
        ]);

        setProjects(proj);
        setNewsItems(news);
        setPartners(part);
      } catch (err) {
        console.error('Failed to fetch backend data:', err);
        setError('Failed to fetch backend data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStats = () => {
    const projectsCount = projects.length;
    const newsCount = newsItems.length;
    const partnersCount = partners.length;
    const activePartnersCount = partners.filter(p => p.status === 'Active').length;
    const publishedNewsCount = newsItems.filter(n => n.status === 'published').length;
    const completedProjectsCount = projects.filter(p => p.endDate && new Date(p.endDate) < new Date()).length;

    return {
      projectsCount,
      newsCount,
      partnersCount,
      activePartnersCount,
      publishedNewsCount,
      completedProjectsCount
    };
  };

  return (
    <DataContext.Provider value={{
      projects,
      setProjects,
      newsItems,
      setNewsItems,
      partners,
      setPartners,
      loading,
      error,
      getStats
    }}>
      {children}
    </DataContext.Provider>
  );
};
