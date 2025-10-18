import React, { useState } from 'react';// add useEffect if needed
import { 
  Plus, 
  Search, 
  // Filter, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Pin,
  PinOff
} from 'lucide-react';
import Modal from './Modal';
import { useActivity } from '../contexts/ActivityContext';
import { useData } from '../contexts/DataContext';
//image
interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isPinned: boolean;
  startDate: Date;
  endDate?: Date;
  status?: string;
  projectLink?: string;
  imageFile?: File | null; // For file upload
}

const Projects: React.FC = () => {
  const { addActivity } = useActivity();
  const { projects, setProjects } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredProjects = projects.filter((project) => {
  return (
    project &&
    typeof project.title === 'string' &&
    typeof project.description === 'string' &&
    (
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
});

const getProjectStatus = (project: Project) => {
  if (project.endDate) {
    const now = new Date();
    const end = new Date(project.endDate);
    return end < now ? 'Finished' : 'Ongoing';
  }
  return 'Pending';
};



  // Sort projects: pinned first, then by creation date
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = sortedProjects.slice(startIndex, startIndex + itemsPerPage);

  const handleAddProject = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

 const handleDeleteProject = async (id: string) => {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  if (confirm('Are you sure you want to delete this project?')) {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const updatedProjects = projects.filter(p => p.id !== id);
        setProjects(updatedProjects);

        addActivity({
          type: 'project',
          action: 'deleted',
          title: project.title,
          description: `Project "${project.title}" has been deleted`,
          icon: 'trash',
        });
      } else {
        console.error('Failed to delete project from server');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  }
};

const handleTogglePin = async (id: string) => {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const url = `http://localhost:5000/api/projects/${project.isPinned ? 'unpin' : 'pin'}/${id}`;

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isPinned: !project.isPinned }),
    });

    if (res.ok) {
      const updated = await res.json();
      const updatedProjects = projects.map(p => p.id === id ? updated : p);
      setProjects(updatedProjects);

      addActivity({
        type: 'project',
        action: project.isPinned ? 'unpinned' : 'pinned',
        title: updated.title,
        description: `Project "${updated.title}" has been ${project.isPinned ? 'unpinned' : 'pinned'}`,
        icon: project.isPinned ? 'pin-off' : 'pin',
      });
    } else {
      console.error('Failed to toggle pin status');
    }
  } catch (err) {
    console.error('Error toggling pin:', err);
  }
};


const handleSaveProject = async (projectData: Partial<Project>) => {
  const formData = new FormData();

  console.log('Saving project data:', projectData);

  formData.append('title', projectData.title || '');
  formData.append('description', projectData.description || '');

  // Handle startDate safely
  const startDate = projectData.startDate instanceof Date
    ? projectData.startDate
    : new Date(projectData.startDate || new Date());

  formData.append('startDate', startDate.toISOString().split('T')[0]);

  if (projectData.endDate === undefined || projectData.endDate === null) {
  formData.append('endDate', '');
} else {
  formData.append('endDate', new Date(projectData.endDate).toISOString().split('T')[0]);
}

formData.append('projectLink', projectData.projectLink || '');


  if (projectData.imageFile) {
    formData.append('image', projectData.imageFile);
  }

  try {
    let res;
    if (projectData.id) {
      res = await fetch(`http://localhost:5000/api/projects/${projectData.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update project');

      const updatedProject = await res.json();

      setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)));

      addActivity({
        type: 'project',
        action: 'updated',
        title: updatedProject.title,
        description: `Project "${updatedProject.title}" has been updated`,
        icon: 'edit',
      });
    } else {
      res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to create project');

      const newProject = await res.json();
      setProjects((prev) => [...prev, newProject]);

      addActivity({
        type: 'project',
        action: 'created',
        title: newProject.title,
        description: `New project "${newProject.title}" has been created`,
        icon: 'plus',
      });
    }
  } catch (err) {
    console.error('Failed to save project:', err);
  }

  setShowModal(false);
};




  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your project portfolio</p>
        </div>
        <button
          onClick={handleAddProject}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {paginatedProjects.map((project) => (
          <div key={project.id} className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow ${project.isPinned ? 'ring-2 ring-orange-500/20' : ''}`}>
            <div className="relative">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              {project.isPinned && (
                <div className="absolute top-3 right-3 bg-orange-500 text-white p-2 rounded-full">
                  <Pin className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 mb-3">
                {project.title}
              </h3>
              
              <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                Status: <span className={`font-semibold ${getProjectStatus(project) === 'Finished' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {getProjectStatus(project)}
                </span>
              </p>


              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              

              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                </div>
                {project.endDate && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleTogglePin(project.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      project.isPinned 
                        ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' 
                        : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {project.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEditProject(project)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                page === currentPage
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Project Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
      >
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

const ProjectForm: React.FC<{
  project: Project | null;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
      id: project?.id ?? '',  // <-- Add this
      title: project?.title || '',
      description: project?.description || '',
      startDate: project?.startDate ? new Date(project.startDate) : new Date(),
      endDate: project?.endDate ? new Date(project.endDate) : undefined,
      imageFile: null as File | null,
      projectLink: project?.projectLink || '',
    });




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate.toISOString().split('T')[0]}
            onChange={(e) =>
              setFormData({
                ...formData,
                startDate: new Date(e.target.value)
              })
            }
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date (optional)
          </label>
          <input
            type="date"
            value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                endDate: e.target.value ? new Date(e.target.value) : undefined
              })
            }
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />

        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({
              ...formData,
              imageFile: e.target.files?.[0] || null,
            })
          }
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project Link (optional)
        </label>
        <input
          type="url"
          value={formData.projectLink}
          onChange={(e) => setFormData({ ...formData, projectLink: e.target.value })}
          placeholder="https://example.com"
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>




      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          {project ? 'Update' : 'Create'} Project
        </button>
      </div>
    </form>
  );
};

export default Projects;