import React from 'react';
// FIX: The 'FilmIcon' is not an exported member of '../Icons'. Using 'ContentMgmtIcon' as an alias since it represents a filmstrip and is suitable for "Content Library".
import { UserIcon, MonetizationIcon, ContentMgmtIcon as FilmIcon, HistoryIcon } from '../Icons';

const StatCard: React.FC<{ title: string; value: string; icon: React.FC<{className?: string}>; trend?: string; }> = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-[#181818] p-5 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="bg-gray-700 p-3 rounded-full">
            <Icon className="h-7 w-7 text-sky-400" />
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {trend && <p className={`text-xs ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{trend}</p>}
        </div>
    </div>
);

const Chart: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="bg-[#181818] p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        {children}
    </div>
);

const BarChart: React.FC<{ data: { label: string; value: number }[]; color: string }> = ({ data, color }) => (
    <div className="flex items-end justify-around h-64 space-x-2">
        {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full h-full flex items-end">
                    <div
                        className={`w-full rounded-t-md ${color}`}
                        style={{ height: `${item.value}%` }}
                        title={`${item.label}: ${item.value}`}
                    ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{item.label}</p>
            </div>
        ))}
    </div>
);

const popularContent = [
    { title: 'The Idea of You', views: '2.1M' },
    { title: 'Road House', views: '1.8M' },
    { title: 'Fallout', views: '1.5M' },
    { title: 'Invincible', views: '1.2M' },
    { title: 'Reacher', views: '980K' },
];

const geoData = [
    { country: 'USA', percentage: '45%' },
    { country: 'Canada', percentage: '15%' },
    { country: 'UK', percentage: '10%' },
    { country: 'Germany', percentage: '8%' },
    { country: 'Australia', percentage: '7%' },
];

const engagementData = [
    { label: 'Jan', value: 30 }, { label: 'Feb', value: 45 }, { label: 'Mar', value: 60 },
    { label: 'Apr', value: 50 }, { label: 'May', value: 75 }, { label: 'Jun', value: 85 },
    { label: 'Jul', value: 95 }
];

const AnalyticsDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value="1,250,435" icon={UserIcon} trend="+2.5% this month" />
                <StatCard title="Active Subscriptions" value="890,123" icon={MonetizationIcon} trend="+1.8% this month" />
                <StatCard title="Content Library" value="5,789" icon={FilmIcon} trend="+50 new titles" />
                <StatCard title="Avg. Watch Time" value="48 min" icon={HistoryIcon} trend="-3.2% this month" />
            </div>

            {/* Charts and Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Chart title="User Engagement (Last 6 Months)">
                        <BarChart data={engagementData} color="bg-sky-500" />
                    </Chart>
                </div>
                <div>
                    <Chart title="Popular Content">
                        <ul className="space-y-3">
                            {popularContent.map(item => (
                                <li key={item.title} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{item.title}</span>
                                    <span className="font-semibold text-white">{item.views} views</span>
                                </li>
                            ))}
                        </ul>
                    </Chart>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Chart title="Geographic Viewership">
                    <ul className="space-y-3">
                        {geoData.map(item => (
                            <li key={item.country} className="flex justify-between items-center text-sm">
                                <span className="text-gray-300">{item.country}</span>
                                <div className="w-1/2 bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: item.percentage }}></div>
                                </div>
                                <span className="font-semibold text-white">{item.percentage}</span>
                            </li>
                        ))}
                    </ul>
                 </Chart>
                 <div className="lg:col-span-2">
                     <Chart title="Revenue Report (Placeholder)">
                        <div className="h-64 flex items-center justify-center text-gray-500">
                           Revenue chart coming soon.
                        </div>
                    </Chart>
                 </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;