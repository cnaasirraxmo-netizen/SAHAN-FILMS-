import React, { useState } from 'react';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '../Icons';

const mockUsers = [
    { id: 1, name: 'Sahan Liyanage', email: 'sahan@example.com', joined: '2023-01-15', plan: 'Premium', status: 'Active' },
    { id: 2, name: 'Jessica Smith', email: 'jessica@example.com', joined: '2023-02-20', plan: 'Standard', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joined: '2023-03-10', plan: 'Basic', status: 'Cancelled' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', joined: '2023-04-05', plan: 'Premium', status: 'Active' },
    { id: 5, name: 'Chris Brown', email: 'chris@example.com', joined: '2023-05-21', plan: 'Standard', status: 'Active' },
    { id: 6, name: 'Amanda Wilson', email: 'amanda@example.com', joined: '2023-06-18', plan: 'Premium', status: 'Active' },
    { id: 7, name: 'David Martinez', email: 'david@example.com', joined: '2023-07-02', plan: 'Basic', status: 'Active' },
    { id: 8, name: 'Sarah Taylor', email: 'sarah@example.com', joined: '2023-08-30', plan: 'Standard', status: 'Cancelled' },
];

const UserManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 6;

    const totalPages = Math.ceil(mockUsers.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = mockUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    return (
        <div className="bg-[#181818] p-6 rounded-lg shadow-lg">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">User Management</h2>
                    <p className="text-sm text-gray-400">{mockUsers.length} registered users.</p>
                </div>
                 <div className="relative">
                    <input type="text" placeholder="Search by name or email..." className="bg-gray-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 w-64" />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </header>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Subscription</th>
                            <th scope="col" className="px-6 py-3">Date Joined</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{user.name}</div>
                                    <div className="text-gray-400">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">{user.plan}</td>
                                <td className="px-6 py-4">{user.joined}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-sky-400 hover:text-sky-300 font-medium">Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <footer className="pt-4 flex justify-between items-center text-sm text-gray-400">
                <p>Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, mockUsers.length)} of {mockUsers.length} users</p>
                <div className="flex items-center space-x-2">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                     <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default UserManagement;
