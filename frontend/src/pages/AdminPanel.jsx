import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const initialSweetState = {
      name: '',
      price: '',
      description: '',
      quantity: '0',
      category: '',
      imageFile: null
};

const AdminPanel = () => {
      const { user } = useAuth();
      const [sweets, setSweets] = useState([]);
      const [loading, setLoading] = useState(true);
      const [newSweet, setNewSweet] = useState({ ...initialSweetState });
      const [imagePreview, setImagePreview] = useState('');
      const [restockAmounts, setRestockAmounts] = useState({});
      const fileInputRef = useRef(null);

      useEffect(() => {
            fetchSweets();
      }, []);

      useEffect(() => () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                  URL.revokeObjectURL(imagePreview);
            }
      }, [imagePreview]);

      const getFriendlyMessage = (err, fallback = 'Something went wrong. Please try again.') => {
            const status = err?.response?.status;
            if (status === 400) {
                  return 'Invalid request. Please review your input and try again.';
            }
            return fallback;
      };

      const fetchSweets = async () => {
            try {
                  const { data } = await api.get('/sweets');
                  setSweets(data);
            } catch (err) {
                  console.error('Failed to fetch sweets', err);
            } finally {
                  setLoading(false);
            }
      };

      const handleFieldChange = (field) => (e) => {
            const { value } = e.target;
            setNewSweet((prev) => ({ ...prev, [field]: value }));
      };

      const handleFileChange = (e) => {
            const file = e.target.files && e.target.files[0];
            setNewSweet((prev) => ({ ...prev, imageFile: file || null }));

            setImagePreview((prev) => {
                  if (prev && prev.startsWith('blob:')) {
                        URL.revokeObjectURL(prev);
                  }
                  return file ? URL.createObjectURL(file) : '';
            });
      };

      const handleCreateSweet = async (e) => {
            e.preventDefault();
            const { name, price, description, quantity, category, imageFile } = newSweet;

            if (!name.trim() || !price || !description.trim()) {
                  alert('Please fill in all required fields.');
                  return;
            }

            if (!imageFile) {
                  alert('Please upload an image for this sweet.');
                  return;
            }

            const parsedPrice = Number(price);
            if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
                  alert('Price must be a valid number.');
                  return;
            }

            const parsedQuantity = Number(quantity);
            if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
                  alert('Stock must be zero or greater.');
                  return;
            }

            try {
                  const payload = new FormData();
                  payload.append('name', name.trim());
                  payload.append('price', parsedPrice.toString());
                  payload.append('description', description.trim());
                  payload.append('quantity', parsedQuantity.toString());

                  if (category.trim()) {
                        payload.append('category', category.trim());
                  }

                  payload.append('image', imageFile);

                  const { data } = await api.post('/sweets', payload);
                  setSweets((prev) => [...prev, data]);
                  setNewSweet({ ...initialSweetState });
                  setImagePreview((prev) => {
                        if (prev && prev.startsWith('blob:')) {
                              URL.revokeObjectURL(prev);
                        }
                        return '';
                  });
                  if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                  }
                  alert('Sweet created successfully!');
            } catch (err) {
                  alert(getFriendlyMessage(err));
            }
      };

      const handleRestock = async (id) => {
            const amount = restockAmounts[id];
            if (!amount || amount <= 0) return;

            try {
                  const { data } = await api.post(`/sweets/${id}/restock`, { quantity: amount });
                  setSweets((prev) => prev.map((s) => (s._id === id ? data : s)));
                  setRestockAmounts((prev) => ({ ...prev, [id]: '' }));
            } catch (err) {
                  alert(getFriendlyMessage(err));
            }
      };

      if (loading) return <div className="text-center mt-10 text-brand-600 font-bold text-xl">Accessing secure recipe vault...</div>;

      if (!user || user.role !== 'admin') {
            return (
                  <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
                        <h1 className="text-3xl font-bold text-brand-900">Restricted Area</h1>
                        <p className="text-brand-700 max-w-md">Only admin users can manage the sweet inventory. Please log in with an admin account to continue.</p>
                  </div>
            );
      }

      return (
            <div className="container mx-auto px-4 py-12">
                  <h1 className="text-4xl font-extrabold text-brand-900 mb-8 border-b-4 border-brand-200 pb-4 inline-block">Admin Dashboard</h1>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Add New Sweet Section */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-brand-100">
                              <h2 className="text-2xl font-bold mb-6 text-brand-800 flex items-center gap-2">
                                    <span className="bg-brand-100 text-brand-600 p-2 rounded-lg text-lg">✚</span>
                                    Create New Delight
                              </h2>
                              <form onSubmit={handleCreateSweet} className="space-y-5">
                                    <div>
                                          <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Name</label>
                                          <input type="text" required className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400" value={newSweet.name} onChange={handleFieldChange('name')} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                          <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Price</label>
                                                <input type="number" min="0" step="0.01" required className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400" value={newSweet.price} onChange={handleFieldChange('price')} />
                                          </div>
                                          <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Stock</label>
                                                <input type="number" min="0" required className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400" value={newSweet.quantity} onChange={handleFieldChange('quantity')} />
                                          </div>
                                    </div>
                                    <div>
                                          <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Description</label>
                                          <textarea required className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400" rows="3" value={newSweet.description} onChange={handleFieldChange('description')} />
                                    </div>
                                    <div>
                                          <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Category (optional)</label>
                                          <input type="text" className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400" value={newSweet.category} onChange={handleFieldChange('category')} placeholder="e.g., Cheesecake" />
                                    </div>
                                    <div>
                                          <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Image</label>
                                          <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400"
                                                required
                                          />
                                          {imagePreview && (
                                                <img src={imagePreview} alt="Preview" className="mt-3 w-full h-48 object-cover rounded-xl border border-brand-100" />
                                          )}
                                    </div>
                                    <button type="submit" className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 shadow-md transition-all mt-2">
                                          Add to Menu
                                    </button>
                              </form>
                        </div>

                        {/* Inventory Management Section */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-brand-100">
                              <h2 className="text-2xl font-bold mb-6 text-brand-800 flex items-center gap-2">
                                    <span className="bg-brand-100 text-brand-600 p-2 rounded-lg text-lg">📦</span>
                                    Inventory Control
                              </h2>
                              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {sweets.map((sweet) => (
                                          <div key={sweet._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-brand-200 transition-colors">
                                                <div>
                                                      <h3 className="font-bold text-gray-800">{sweet.name}</h3>
                                                      <p className="text-sm font-medium text-brand-600">Stock: {sweet.quantity}</p>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                      <input
                                                            type="number"
                                                            placeholder="#"
                                                            className="w-16 p-2 text-center border border-gray-300 rounded-lg text-sm"
                                                            value={restockAmounts[sweet._id] || ''}
                                                            onChange={(e) =>
                                                                  setRestockAmounts((prev) => ({ ...prev, [sweet._id]: e.target.value }))
                                                            }
                                                      />
                                                      <button
                                                            onClick={() => handleRestock(sweet._id)}
                                                            className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 text-sm shadow-sm transition-all"
                                                      >
                                                            Add
                                                      </button>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default AdminPanel;