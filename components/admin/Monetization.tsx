import React from 'react';

const plans = [
    { name: 'Basic', price: '5.99', features: ['SD Quality', '1 Screen', 'Mobile Only'], popular: false },
    { name: 'Standard', price: '9.99', features: ['HD Quality', '2 Screens', 'All Devices'], popular: true },
    { name: 'Premium', price: '15.99', features: ['4K+HDR Quality', '4 Screens', 'All Devices'], popular: false },
];

const PlanCard: React.FC<{ plan: typeof plans[0] }> = ({ plan }) => (
    <div className={`bg-[#1f1f1f] p-6 rounded-lg border-2 ${plan.popular ? 'border-sky-500' : 'border-gray-700'} relative`}>
        {plan.popular && <div className="absolute top-0 right-6 -mt-3 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>}
        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        <p className="text-4xl font-extrabold text-white my-4">${plan.price}<span className="text-base font-normal text-gray-400">/month</span></p>
        <ul className="space-y-2 text-gray-300 text-sm mb-6">
            {plan.features.map(feature => <li key={feature} className="flex items-center space-x-2"><span className="text-sky-400">&#10003;</span><span>{feature}</span></li>)}
        </ul>
        <button className="w-full py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors">Edit Plan</button>
    </div>
);

const discountCodes = [
    { code: 'SUMMER25', discount: '25%', status: 'Active', uses: '150/1000' },
    { code: 'NEWUSER10', discount: '10%', status: 'Active', uses: '850/2000' },
    { code: 'HOLIDAY50', discount: '50%', status: 'Expired', uses: '500/500' },
];

const Monetization: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Subscription Plans */}
            <div className="bg-[#181818] p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Subscription Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map(plan => <PlanCard key={plan.name} plan={plan} />)}
                </div>
            </div>

            {/* Discount Codes */}
            <div className="bg-[#181818] p-6 rounded-lg shadow-lg">
                 <header className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Discount Codes</h2>
                        <p className="text-sm text-gray-400">Manage promotional campaigns</p>
                    </div>
                     <button className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                        Create New Code
                    </button>
                </header>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Code</th>
                                <th scope="col" className="px-6 py-3">Discount</th>
                                <th scope="col" className="px-6 py-3">Usage</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discountCodes.map(dc => (
                                <tr key={dc.code} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-mono text-white">{dc.code}</td>
                                    <td className="px-6 py-4">{dc.discount}</td>
                                    <td className="px-6 py-4">{dc.uses}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${dc.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {dc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sky-400 hover:text-sky-300 font-medium">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Monetization;
