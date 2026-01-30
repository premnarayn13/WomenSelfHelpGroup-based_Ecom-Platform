import { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/common/Loader';
import { FiMapPin, FiUsers, FiTag, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const SHGDirectory = () => {
    const [shgs, setShgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSHGs = async () => {
            try {
                // Public list of active SHGs (We'll use a new endpoint or existing if open)
                const { data } = await api.get('/shg/public/list');
                setShgs(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSHGs();
    }, []);

    const filteredSHGs = shgs.filter(shg =>
        shg.shgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shg.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="py-20"><Loader /></div>;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 border-none mb-4">Empowering Women Communities</h1>
                    <p className="text-xl text-gray-600">Discover and support local Self-Help Groups providing authentic products.</p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm mb-12 max-w-2xl mx-auto flex items-center gap-4">
                    <FiSearch className="text-gray-400 ml-2" size={24} />
                    <input
                        type="text"
                        placeholder="Search for SHGs by name or area..."
                        className="flex-1 outline-none text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredSHGs.map((shg) => (
                        <div key={shg._id} className="card bg-white p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 font-bold text-2xl">
                                    {shg.shgName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{shg.shgName}</h3>
                                    <p className="text-gray-500 text-sm flex items-center gap-1">
                                        <FiMapPin /> {shg.address?.city}, {shg.address?.state}
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-8 flex-1 line-clamp-3 leading-relaxed">
                                {shg.description}
                            </p>

                            <div className="flex items-center gap-6 mb-8 text-sm text-gray-500 border-y py-4">
                                <div className="flex items-center gap-2">
                                    <FiUsers className="text-secondary-600" />
                                    <span>{shg.members?.length || 5}+ Members</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiTag className="text-green-600" />
                                    <span>Verified Group</span>
                                </div>
                            </div>

                            <Link
                                to={`/products?shg=${shg._id}`}
                                className="btn-primary w-full py-4 text-center text-lg shadow-lg hover:shadow-primary-600/20"
                            >
                                Visit Group Store
                            </Link>
                        </div>
                    ))}
                </div>

                {filteredSHGs.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl">No SHGs found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SHGDirectory;
