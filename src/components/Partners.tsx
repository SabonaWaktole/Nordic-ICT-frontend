import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Globe,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Modal from './Modal';
import { useActivity } from '../contexts/ActivityContext';
import { useData } from '../contexts/DataContext';

interface Partner {
  id: string;
  name: string;
  description: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  partnershipType: 'Strategic' | 'Technology' | 'Reseller' | 'Vendor';
  status: 'Active' | 'Inactive' | 'Pending';
  logo: string;
  joinDate: string;
}

const Partners: React.FC = () => {
  const { addActivity } = useActivity();
  const { partners, setPartners } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || partner.status === statusFilter;
    const matchesType = typeFilter === 'All' || partner.partnershipType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPartners = filteredPartners.slice(startIndex, startIndex + itemsPerPage);

  const handleAddPartner = () => {
    setEditingPartner(null);
    setShowModal(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setShowModal(true);
  };

const handleDeletePartner = async (email: string) => {
  const partner = partners.find(p => p.email === email);
  if (!partner) return;

  const confirmed = confirm('Are you sure you want to delete this partner?');
  if (!confirmed) return;

  try {
    const response = await fetch(`http://localhost:5000/api/partners/${partner.email}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete partner');
    }

    const updatedPartners = partners.filter(p => p.email !== partner.email);
    setPartners(updatedPartners);

    addActivity({
      type: 'partner',
      action: 'deleted',
      title: partner.name,
      description: `Partner "${partner.name}" has been deleted`,
      icon: 'trash',
      color: 'text-red-500',
    });
  } catch (err) {
    console.error(err);
    alert('Error deleting partner');
  }
};

  

  const handleSavePartner = (partnerData: Partial<Partner>) => {
    if (editingPartner) {
      const updatedPartners = partners.map(p => 
        p.email === editingPartner.email ? { ...p, ...partnerData, id:p.id } : p
      );
      setPartners(updatedPartners);
      
      addActivity({
        type: 'partner',
        action: 'updated',
        title: partnerData.name || editingPartner.name,
        description: `Partner "${partnerData.name || editingPartner.name}" has been updated`,
        icon: 'edit',
        color: 'text-blue-500'
      });
    } else {
      const newPartner: Partner = {
        id: Date.now().toString(),
        name: partnerData.name || '',
        description: partnerData.description || '',
        industry: partnerData.industry || '',
        website: partnerData.website || '',
        email: partnerData.email || '',
        phone: partnerData.phone || '',
        location: partnerData.location || '',
        partnershipType: partnerData.partnershipType || 'Vendor',
        status: partnerData.status || 'Pending',
        logo: partnerData.logo || 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=150',
        joinDate: partnerData.joinDate || new Date().toISOString().split('T')[0]
      };
      setPartners([...partners, newPartner]);
      
      addActivity({
        type: 'partner',
        action: 'created',
        title: newPartner.name,
        description: `New partner "${newPartner.name}" has been added`,
        icon: 'plus',
        color: 'text-green-500'
      });
    }
    setShowModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Strategic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Technology': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Reseller': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Vendor': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Partners</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your business partnerships and relationships</p>
        </div>
        <button
          onClick={handleAddPartner}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Partner</span>
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
                placeholder="Search partners..."
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
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="All">All Types</option>
              <option value="Strategic">Strategic</option>
              <option value="Technology">Technology</option>
              <option value="Reseller">Reseller</option>
              <option value="Vendor">Vendor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {paginatedPartners.map((partner) => (
          <div key={partner.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {partner.industry}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(partner.status)}`}>
                  {partner.status}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(partner.partnershipType)}`}>
                  {partner.partnershipType}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {partner.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{partner.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Globe className="w-4 h-4 mr-2" />
                  <a href={partner.website} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                    {partner.website}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${partner.email}`} className="hover:text-orange-500 transition-colors">
                    {partner.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditPartner(partner)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePartner(partner.email)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  Since {new Date(partner.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination  */}
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
              key={`page-${page}`}
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

      {/* Partner Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPartner ? 'Edit Partner' : 'Add New Partner'}
        size="large"
      >
        <PartnerForm
          partner={editingPartner}
          onSave={handleSavePartner}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

const PartnerForm: React.FC<{
  partner: Partner | null;
  onSave: (data: Partial<Partner>) => void;
  onCancel: () => void;
}> = ({ partner, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: partner?.name || '',
    description: partner?.description || '',
    industry: partner?.industry || '',
    website: partner?.website || '',
    email: partner?.email || '',
    phone: partner?.phone || '',
    location: partner?.location || '',
    partnershipType: partner?.partnershipType || 'Vendor',
    status: partner?.status || 'Pending',
    logo: partner?.logo || '',
    joinDate: partner?.joinDate || new Date().toISOString().split('T')[0]
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('industry', formData.industry);
    data.append('website', formData.website);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('location', formData.location);
    data.append('partnershipType', formData.partnershipType);
    data.append('status', formData.status);
    data.append('joinDate', formData.joinDate);

    if (logoFile) {
      data.append('logo', logoFile);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/partners/${partner?.email ?? ''}`, {
        method: partner ? 'PUT' : 'POST',
        body: data,
        // No Content-Type header! Browser sets multipart/form-data automatically
      });

      if (!response.ok) {
        throw new Error('Failed to save partner');
      }

      const savedPartner = await response.json();
      onSave(savedPartner);
    } catch (error) {
      console.log('Error saving partner:', error);
      alert(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form inputs (same as before) */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Partner Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Industry
          </label>
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
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
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Partnership Type
          </label>
          <select
            value={formData.partnershipType}
            onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value as Partner['partnershipType'] })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="Strategic">Strategic</option>
            <option value="Technology">Technology</option>
            <option value="Reseller">Reseller</option>
            <option value="Vendor">Vendor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Partner['status'] })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Partner Logo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setLogoFile(e.target.files[0]);
            }
          }}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-orange-50 file:text-orange-700
            hover:file:bg-orange-100"
        />
        {/* Preview */}
        {logoFile && (
          <img
            src={URL.createObjectURL(logoFile)}
            alt="Preview"
            className="mt-4 w-32 h-32 rounded-lg object-cover"
          />
        )}
        {!logoFile && formData.logo && (
          <img
            src={formData.logo}
            alt="Current Logo"
            className="mt-4 w-32 h-32 rounded-lg object-cover"
          />
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
        >
          {partner ? 'Update Partner' : 'Add Partner'}
        </button>
      </div>
    </form>
  );
};

export default Partners;
