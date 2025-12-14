import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
      const { user } = useAuth();
      const [sweets, setSweets] = useState([]);
      const [search, setSearch] = useState('');
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [showModal, setShowModal] = useState(false);
      const [editingSweet, setEditingSweet] = useState(null);
      const [formData, setFormData] = useState({
            name: '',
            price: '',
            description: '',
            imageUrl: '',
            quantity: ''
      });

      useEffect(() => {
            fetchSweets();
      }, []);

      const fetchSweets = async () => {
            try {
                  const { data } = await api.get('/sweets');
                  setSweets(data);
            } catch (err) {
                  setError('Failed to fetch sweets');
            } finally {
                  setLoading(false);
            }
      };

      const handlePurchase = async (id) => {
            try {
                  const { data } = await api.post(`/sweets/${id}/purchase`);
                  setSweets(sweets.map((sweet) => (sweet._id === id ? data : sweet)));
            } catch (err) {
                  alert(err.response?.data?.message || 'Purchase failed');
            }
      };

      const handleDelete = async (id) => {
            if (!window.confirm('Are you sure you want to remove this delight?')) return;
            try {
                  await api.delete(`/sweets/${id}`);
                  setSweets(sweets.filter(s => s._id !== id));
            } catch (err) {
                  alert(err.response?.data?.message || 'Delete failed');
            }
      };

      const openEditModal = (sweet) => {
            setEditingSweet(sweet);
            setFormData({
                  name: sweet.name,
                  price: sweet.price,
                  description: sweet.description,
                  imageUrl: sweet.imageUrl,
                  quantity: sweet.quantity
            });
            setShowModal(true);
      };

      const openAddModal = () => {
            setEditingSweet(null);
            setFormData({
                  name: '',
                  price: '',
                  description: '',
                  imageUrl: '',
                  quantity: ''
            });
            setShowModal(true);
      };

      const handleFormChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                  if (editingSweet) {
                        const { data } = await api.put(`/sweets/${editingSweet._id}`, formData);
                        setSweets(sweets.map(s => s._id === editingSweet._id ? data : s));
                  } else {
                        const { data } = await api.post('/sweets', formData);
                        setSweets([...sweets, data]);
                  }
                  setShowModal(false);
            } catch (err) {
                  alert(err.response?.data?.message || 'Operation failed');
            }
      };

      const filteredSweets = sweets.filter((sweet) =>
            sweet.name.toLowerCase().includes(search.toLowerCase())
      );

      if (loading) return <div className="min-h-screen flex justify-center items-center text-brand-600 text-xl font-bold animate-pulse">Baking the goods...</div>;
      if (error) return <div className="min-h-screen flex justify-center items-center text-red-500 font-bold">{error}</div>;

      return (
            <div className="container mx-auto px-4 py-12">
                  <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                              <h1 className="text-4xl font-extrabold text-brand-900">Our Collection</h1>
                              <p className="text-brand-700 mt-2">Handcrafted delights made with love.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                              <input
                                    type="text"
                                    placeholder="Find your craving..."
                                    className="w-full md:w-64 p-3 border-2 border-brand-200 rounded-full focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                              />
                              {user?.role === 'admin' && (
                                    <button
                                          onClick={openAddModal}
                                          className="whitespace-nowrap px-6 py-3 bg-brand-600 text-white rounded-full hover:bg-brand-700 shadow-lg transition-all font-bold"
                                    >
                                          + Add Delight
                                    </button>
                              )}
                        </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredSweets.map((sweet) => (
                              <div key={sweet._id} className="group bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-brand-100">
                                    <div className="relative h-56 overflow-hidden">
                                          <img
                                                src={sweet.imageUrl}
                                                alt={sweet.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                          />
                                          {sweet.quantity === 0 && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                      <span className="bg-red-500 text-white px-4 py-1 rounded-full font-bold transform -rotate-12">SOLD OUT</span>
                                                </div>
                                          )}
                                    </div>
                                    <div className="p-6">
                                          <div className="flex justify-between items-start mb-2">
                                                <h2 className="text-xl font-bold text-brand-900 leading-tight">{sweet.name}</h2>
                                                <span className="text-lg font-extrabold text-brand-600">${Number(sweet.price).toFixed(2)}</span>
                                          </div>
                                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed h-10">{sweet.description}</p>
                                          
                                          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-6">
                                                <span className={sweet.quantity < 5 && sweet.quantity > 0 ? 'text-orange-500' : ''}>
                                                      {sweet.quantity > 0 ? `${sweet.quantity} left in jar` : 'Empty jar'}
                                                </span>
                                          </div>

                                          <div className="flex gap-3">
                                                <button
                                                      onClick={() => handlePurchase(sweet._id)}
                                                      disabled={sweet.quantity === 0}
                                                      className={`flex-1 py-2.5 px-4 rounded-xl text-white font-bold tracking-wide transition-all shadow-md ${sweet.quantity > 0
                                                            ? 'bg-brand-500 hover:bg-brand-600 hover:shadow-brand-200'
                                                            : 'bg-gray-300 cursor-not-allowed shadow-none'
                                                            }`}
                                                >
                                                      {sweet.quantity > 0 ? 'Add to Box' : 'Gone'}
                                                </button>

                                                {user?.role === 'admin' && (
                                                      <div className="flex gap-2">
                                                            <button
                                                                  onClick={() => openEditModal(sweet)}
                                                                  className="p-2.5 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
                                                            >
                                                                  ✎
                                                            </button>
                                                            <button
                                                                  onClick={() => handleDelete(sweet._id)}
                                                                  className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                                            >
                                                                  ✕
                                                            </button>
                                                      </div>
                                                )}
                                          </div>
                                    </div>
                              </div>
                        ))}
                  </div>

                  {showModal && (
                        <div className="fixed inset-0 bg-brand-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                              <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border-4 border-brand-100 animate-fade-in-up">
                                    <h2 className="text-3xl font-bold mb-6 text-brand-800 text-center">
                                          {editingSweet ? 'Refine Recipe' : 'New Creation'}
                                    </h2>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                          <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Name</label>
                                                <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400 transition-all" required />
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                      <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Price</label>
                                                      <input type="number" name="price" value={formData.price} onChange={handleFormChange} step="0.01" className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400 transition-all" required />
                                                </div>
                                                <div>
                                                      <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Quantity</label>
                                                      <input type="number" name="quantity" value={formData.quantity} onChange={handleFormChange} className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400 transition-all" required />
                                                </div>
                                          </div>
                                          <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Description</label>
                                                <textarea name="description" value={formData.description} onChange={handleFormChange} className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400 transition-all" rows="3" required></textarea>
                                          </div>
                                          <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Image URL</label>
                                                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleFormChange} className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400 transition-all" required />
                                          </div>
                                          <div className="flex gap-3 pt-4">
                                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                                                <button type="submit" className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg transition-all">{editingSweet ? 'Save Changes' : 'Create'}</button>
                                          </div>
                                    </form>
                              </div>
                        </div>
                  )}
            </div>
      );
};

export default Dashboard;