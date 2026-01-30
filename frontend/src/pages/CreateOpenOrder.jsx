import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOpenOrder } from '../services/openOrderService';
import { toast } from 'react-toastify';
import { FiFileText, FiDollarSign, FiTag, FiHash } from 'react-icons/fi';

const CreateOpenOrder = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        expectedPrice: '',
        quantity: ''
    });

    const categories = [
        'Handicrafts',
        'Textiles',
        'Food Products',
        'Bulk Orders',
        'Custom Request',
        'Other'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createOpenOrder(formData);
            toast.success('Open order request created successfully!');
            navigate('/open-orders/my');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-secondary-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <FiFileText /> Post a Requirement
                        </h1>
                        <p className="text-secondary-100 text-sm mt-1">
                            Cannot find what you need? Post a request and let SHGs bid for it.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Requirement Title *</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g. 50kg Organic Turmeric Powder"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <div className="relative">
                                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="input-field pl-10 appearance-none"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity/Volume *</label>
                                <div className="relative">
                                    <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="quantity"
                                        required
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="e.g. 100 pieces / 50kg"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Budget (₹) *</label>
                            <div className="relative">
                                <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    name="expectedPrice"
                                    required
                                    min="0"
                                    value={formData.expectedPrice}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="Total Budget"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description *</label>
                            <textarea
                                name="description"
                                required
                                rows="5"
                                value={formData.description}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Describe your requirements in detail..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary bg-secondary-600 hover:bg-secondary-700 border-transparent"
                        >
                            {loading ? 'Posting...' : 'Post Requirement'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateOpenOrder;
