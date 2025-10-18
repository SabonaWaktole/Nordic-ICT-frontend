
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboardPage from './pages/admin-dashboard/Dashboard';
import Home from './pages/Home/Home';
import NewsPage from './pages/News/NewsPage';
import NewsDetailPage from './pages/News/NewsDetailPage';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ProjectDetailPage from './pages/Projects/ProjectDetailPage';

const App: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<Home /> }/>
			<Route path="/admin" element={<AdminDashboardPage />} />
			<Route path="/news" element={<NewsPage />} />
			<Route path="/news/:id" element={<NewsDetailPage />} />
			<Route path="/projects" element={<ProjectsPage />} />
			<Route path="/projects/:id" element={<ProjectDetailPage />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

export default App;
