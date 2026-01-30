import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerSHG } from '../services/shgService';
import { toast } from 'react-toastify';
import { FiHome, FiFileText, FiCreditCard, FiMapPin, FiUsers } from 'react-icons/fi';

const SHGOnboarding = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        shgName: '',
        description: '',
        registrationNumber: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
        },
        bankDetails: {
            accountHolderName: '',
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: '',
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            setFormData({
                ...formData,
                [section]: { ...formData[section], [field]: value },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare data for multipart (though we are not uploading files here yet for simplicity)
        const data = new FormData();
        data.append('shgName', formData.shgName);
        data.append('description', formData.description);
        data.append('registrationNumber', formData.registrationNumber);
        data.append('address', JSON.stringify(formData.address));
        data.append('bankDetails', JSON.stringify(formData.bankDetails));
        data.append('members', JSON.stringify([]));

        try {
            await registerSHG(data);
            toast.success('SHG Registered successfully! Awaiting approval.');
            navigate('/shg/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-primary-600 px-8 py-10 text-white text-center">
                        <h1 className="text-3xl font-bold mb-2">Welcome to SHG-Mart</h1>
                        <p className="text-primary-100">Let's set up your group profile to start selling and receiving orders.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-10">
                        {/* Basic Info */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FiHome className="text-primary-600" /> Group Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label-text">SHG Name *</label>
                                    <input
                                        type="text"
                                        name="shgName"
                                        required
                                        className="input-field"
                                        value={formData.shgName}
                                        onChange={handleChange}
                                        placeholder="Enter Group Name"
                                    />
                                </div>
                                <div>
                                    <label className="label-text">Registration Number *</label>
                                    <input
                                        type="text"
                                        name="registrationNumber"
                                        required
                                        className="input-field"
                                        value={formData.registrationNumber}
                                        onChange={handleChange}
                                        placeholder="Govt. Reg. No."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="label-text">About the Group *</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows="3"
                                        className="input-field"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe what your group makes and your mission..."
                                    />
                                </div>
                            </div>
                        </section>

                        <hr />

                        {/* Address */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FiMapPin className="text-primary-600" /> Location Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="label-text">Street Address</label>
                                    <input
                                        type="text"
                                        name="address.street"
                                        className="input-field"
                                        value={formData.address.street}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="label-text">City</label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        className="input-field"
                                        value={formData.address.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="label-text">Pincode</label>
                                    <input
                                        type="text"
                                        name="address.pincode"
                                        className="input-field"
                                        value={formData.address.pincode}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </section>

                        <hr />

                        {/* Bank Details */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FiCreditCard className="text-primary-600" /> Bank Details (For Payments)
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">These details will be used to transfer your earnings.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label-text">Account Holder Name</label>
                                    <input
                                        type="text"
                                        name="bankDetails.accountHolderName"
                                        className="input-field"
                                        value={formData.bankDetails.accountHolderName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="label-text">Bank Name</label>
                                    <input
                                        type="text"
                                        name="bankDetails.bankName"
                                        className="input-field"
                                        value={formData.bankDetails.bankName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="label-text">Account Number</label>
                                    <input
                                        type="text"
                                        name="bankDetails.accountNumber"
                                        className="input-field"
                                        value={formData.bankDetails.accountNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="label-text">IFSC Code</label>
                                    <input
                                        type="text"
                                        name="bankDetails.ifscCode"
                                        className="input-field"
                                        value={formData.bankDetails.ifscCode}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 text-xl shadow-lg shadow-primary-600/30"
                        >
                            {loading ? 'Submitting...' : 'Complete Registration'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SHGOnboarding;
