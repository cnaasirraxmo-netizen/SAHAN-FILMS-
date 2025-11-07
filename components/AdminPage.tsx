import React, { useState } from 'react';
import { AnalyticsIcon, ContentMgmtIcon, UserMgmtIcon, MonetizationIcon, CustomizationIcon, RIYOBOXLogo } from './Icons';
import AnalyticsDashboard from './admin/AnalyticsDashboard';
import ContentManagement from './admin/ContentManagement';
import UserManagement from './admin/UserManagement';
import Monetization from './admin/Monetization';
import PlatformCustomization from './admin/PlatformCustomization';

type AdminSection = 'analytics' | 'content' | 'users' | 'monetization' | 'customization';

const adminNavItems = [
    { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon },
    { id: 'content', label: 'Content', icon: ContentMgmtIcon },
    { id: 'users', label: 'Users', icon: UserMgmtIcon },
    { id: 'monetization', label: 'Monetization', icon: MonetizationIcon },
    { id: 'customization', label: 'Customization', icon: CustomizationIcon },
];

const AdminPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<AdminSection>('analytics');

    const renderSection = () => {
        switch (activeSection) {
            case 'analytics': return <AnalyticsDashboard />;
            case 'content': return <ContentManagement />;
            case 'users': return <UserManagement />;
            case 'monetization': return <Monetization />;
            case 'customization': return <PlatformCustomization />;
            default: return <AnalyticsDashboard />;
        }
    }

    const NavItem: React.FC<{
        id: AdminSection;
        label: string;
        icon: React.FC<{className?: string}>;
        isActive: boolean;
        onClick: (id: AdminSection) => void;
    }> = ({ id, label, icon: Icon, isActive, onClick }) => (
        <button 
            onClick={() => onClick(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                ? 'bg-sky-500 text-white shadow-lg' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
        >
            <Icon className="h-6 w-6" />
            <span className="font-semibold">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-[#101010] text-gray-200 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#181818] p-4 flex flex-col space-y-4 border-r border-gray-800">
                <div className="flex items-center justify-center py-4">
                    <RIYOBOXLogo className="h-8" />
                </div>
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        {adminNavItems.map(item => (
                            <li key={item.id}>
                                <NavItem 
                                    id={item.id as AdminSection}
                                    label={item.label}
                                    icon={item.icon}
                                    isActive={activeSection === item.id}
                                    onClick={setActiveSection}
                                />
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="text-center text-xs text-gray-600">
                    <p>&copy; 2024 RIYOBOX</p>
                    <p>Admin Panel v1.0</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-[#181818] border-b border-gray-800 p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white capitalize">{activeSection} Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm">Welcome, Admin</span>
                        <img src="https://picsum.photos/seed/admin/40" alt="Admin Avatar" className="w-10 h-10 rounded-full border-2 border-sky-500" />
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-6 bg-[#101010]">
                    {renderSection()}
                </div>
            </main>
        </div>
    );
};

export default AdminPage;