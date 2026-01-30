import { useEffect, useState } from 'react';
import { getMyProducts } from '../services/shgService';
import { deleteProduct } from '../services/productService';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiPackage } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const SHGInventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getMyProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                toast.success('Product deleted successfully');
                setProducts(products.filter(p => p._id !== id));
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    if (loading) return <div className="py-20"><Loader /></div>;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 border-none">My Inventory</h1>
                        <p className="text-gray-600">Manage all products launched by your group.</p>
                    </div>
                    <Link to="/shg/products/add" className="btn-primary flex items-center gap-2">
                        <FiPlus /> Add New Product
                    </Link>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                        <FiPackage className="mx-auto text-gray-300 mb-4" size={64} />
                        <h2 className="text-xl font-bold mb-2">No products found</h2>
                        <p className="text-gray-500 mb-6">You haven't listed any products yet. Start selling now!</p>
                        <Link to="/shg/products/add" className="btn-primary inline-flex">
                            List Your First Product
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                                                    <img src={product.images[0]?.url || '/placeholder.jpg'} alt="" className="h-full w-full object-cover" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">{product.category}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            ₹{product.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.stock} units
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.isApproved ? (
                                                <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">Live</span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-700 rounded-full">Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-3 text-gray-400">
                                                <Link to={`/products/${product._id}`} className="hover:text-primary-600" title="View">
                                                    <FiEye size={18} />
                                                </Link>
                                                <button className="hover:text-blue-600" title="Edit">
                                                    <FiEdit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="hover:text-red-600" title="Delete">
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SHGInventory;
