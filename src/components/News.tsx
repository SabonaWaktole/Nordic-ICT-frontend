import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pin,
  PinOff
} from 'lucide-react';
import Modal from './Modal';
import { useActivity } from '../contexts/ActivityContext';
import { useData } from '../contexts/DataContext';
import { AxiosNewsRepository } from '../infrastructure/repositories/AxiosNewsRepository';
import { createNews as createNewsUseCase } from '../application/usecases/CreateNews';
import type { CreateNewsInput } from '../domain/entities/NewsPost';

interface NewsPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  status: 'published' | 'draft' | 'archived';
  category: string;
  image: string;
  excerpt: string;
  isPinned: boolean;
}

const News: React.FC = () => {
  const { addActivity } = useActivity();
  const { newsItems, setNewsItems } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [...new Set(newsItems.map(item => item.category))];

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sort news: pinned first, then by publish date
  const sortedNews = [...filteredNews].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });

  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = sortedNews.slice(startIndex, startIndex + itemsPerPage);

  const handleAddNews = () => {
    setEditingNews(null);
    setShowModal(true);
  };

  const handleEditNews = (newsItem: NewsPost) => {
    setEditingNews(newsItem);
    setShowModal(true);
  };

  const handleDeleteNews = (id: string) => {
    const newsItem = newsItems.find(item => item.id === id);
    if (newsItem && confirm('Are you sure you want to delete this news post?')) {
      const updatedNews = newsItems.filter(item => item.id !== id);
      setNewsItems(updatedNews);
      addActivity({
        type: 'news',
        action: 'deleted',
        title: newsItem.title,
        description: `News post "${newsItem.title}" has been deleted`,
        icon: 'trash',
        color: 'text-red-500'
      });
    }
  };

  const handleTogglePin = (id: string) => {
    const newsItem = newsItems.find(item => item.id === id);
    if (newsItem) {
      const updatedNews = newsItems.map(item => 
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      );
      setNewsItems(updatedNews);
      
      addActivity({
        type: 'news',
        action: newsItem.isPinned ? 'unpinned' : 'pinned',
        title: newsItem.title,
        description: `News post "${newsItem.title}" has been ${newsItem.isPinned ? 'unpinned' : 'pinned'}`,
        icon: newsItem.isPinned ? 'pin-off' : 'pin',
        color: newsItem.isPinned ? 'text-gray-500' : 'text-orange-500'
      });
    }
  };

  const handleSaveNews = async (newsData: Partial<NewsPost> & { imageFile?: File | null }) => {
    if (editingNews) {
      let updatedList = newsItems.map(item => 
        item.id === editingNews.id ? { ...item, ...newsData } : item
      );

      // If a new image file is provided, upload it and update image URL
      if (newsData.imageFile) {
        try {
          const repo = new AxiosNewsRepository();
          const publicUrl = await repo.uploadPhoto(newsData.imageFile, editingNews.id);
          // Optionally persist image URL via update endpoint
          try {
            await repo.update(editingNews.id, { image: publicUrl });
          } catch (e) {
            console.warn('Failed to persist image URL after upload (edit)', e);
          }
          updatedList = updatedList.map(item => item.id === editingNews.id ? { ...item, image: publicUrl } : item);
        } catch (e) {
          console.error('Image upload failed', e);
        }
      }

      setNewsItems(updatedList);

      addActivity({
        type: 'news',
        action: 'updated',
        title: newsData.title || editingNews.title,
        description: `News post "${newsData.title || editingNews.title}" has been updated`,
        icon: 'edit',
        color: 'text-blue-500'
      });
    } else {
      try {
        const repo = new AxiosNewsRepository();
        const payload: CreateNewsInput = {
          title: newsData.title || '',
          content: newsData.content || '',
          author: newsData.author || '',
          publishDate: newsData.publishDate || new Date().toISOString(),
          status: (newsData.status as CreateNewsInput['status']) || 'draft',
          category: newsData.category || '',
          image: newsData.image || 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=300',
          excerpt: newsData.excerpt || '',
          isPinned: false,
        };
        const create = createNewsUseCase(repo);
        let created = await create(payload);

        // If an image file was selected, upload and update the created item
        if (newsData.imageFile) {
          try {
            const publicUrl = await repo.uploadPhoto(newsData.imageFile, created.id);
            // Optionally persist image URL via update endpoint
            try {
              await repo.update(created.id, { image: publicUrl });
            } catch (e) {
              console.warn('Failed to persist image URL after upload (create)', e);
            }
            created = { ...created, image: publicUrl };
          } catch (e) {
            console.error('Image upload failed', e);
          }
        }

        setNewsItems([...newsItems, created]);

        addActivity({
          type: 'news',
          action: 'created',
          title: created.title,
          description: `New news post "${created.title}" has been created`,
          icon: 'plus',
          color: 'text-green-500'
        });
      } catch (err) {
        console.error('Failed to create news', err);
        alert('Failed to create news. Please try again.');
        return;
      }
    }
    setShowModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">News Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage company news and updates</p>
        </div>
        <button
          onClick={handleAddNews}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add News</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {paginatedNews.map((newsItem) => (
          <div key={newsItem.id} className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow ${newsItem.isPinned ? 'ring-2 ring-orange-500/20' : ''}`}>
            <div className="relative">
              <img
                src={newsItem.image}
                alt={newsItem.title}
                className="w-full h-48 object-cover"
              />
              {newsItem.isPinned && (
                <div className="absolute top-3 right-3 bg-orange-500 text-white p-2 rounded-full">
                  <Pin className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(newsItem.status)}`}>
                  {newsItem.status}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {newsItem.category}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {newsItem.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {newsItem.excerpt}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4 mr-2" />
                  <span>{newsItem.author}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(newsItem.publishDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleTogglePin(newsItem.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      newsItem.isPinned 
                        ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' 
                        : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    aria-label={newsItem.isPinned ? 'Unpin news' : 'Pin news'}
                    title={newsItem.isPinned ? 'Unpin' : 'Pin'}
                  >
                    {newsItem.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEditNews(newsItem)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    aria-label="Edit news"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNews(newsItem.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label="Delete news"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </button>
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
            aria-label="Previous page"
            title="Previous page"
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
            aria-label="Next page"
            title="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* News Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingNews ? 'Edit News Post' : 'Add New News Post'}
        size="large"
      >
        <NewsForm
          newsItem={editingNews}
          onSave={handleSaveNews}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

const NewsForm: React.FC<{
  newsItem: NewsPost | null;
  onSave: (data: Partial<NewsPost> & { imageFile?: File | null }) => void;
  onCancel: () => void;
}> = ({ newsItem, onSave, onCancel }) => {
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    author: string;
    publishDate: string;
    status: NewsPost['status'];
    category: string;
    image: string;
    excerpt: string;
    imageFile?: File | null;
  }>({
    title: newsItem?.title || '',
    content: newsItem?.content || '',
    author: newsItem?.author || '',
    publishDate: newsItem?.publishDate || new Date().toISOString().split('T')[0],
    status: newsItem?.status || 'draft',
    category: newsItem?.category || '',
    image: newsItem?.image || '',
    excerpt: newsItem?.excerpt || '',
    imageFile: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          News Title
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
          Excerpt
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Brief description of the news article"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Author
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., Company News, Case Study, Events"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Publish Date
          </label>
          <input
            type="date"
            value={formData.publishDate}
            onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as NewsPost['status'] })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Image URL
        </label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="https://example.com/image.jpg"
        />
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Or upload image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] ?? null })}
            className="block w-full text-sm text-gray-900 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
        </div>
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
          {newsItem ? 'Update' : 'Create'} News Post
        </button>
      </div>
    </form>
  );
};

export default News;