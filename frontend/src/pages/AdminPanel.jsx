import { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminPanel = () => {
      const [sweets, setSweets] = useState([]);
      const [loading, setLoading] = useState(true);
      const [newSweet, setNewSweet] = useState({
            name: '',
            price: '',
            description: '',
            imageUrl: '',
            quantity: 0
      });
      const [restockAmounts, setRestockAmounts] = useState({});

      useEffect(() => {
            fetchSweets();
      }, []);

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

      const handleCreateSweet = async (e) => {
            e.preventDefault();
            try {
                  const { data } = await api.post('/sweets', newSweet);
                  setSweets([...sweets, data]);
                  setNewSweet({ name: '', price: '', description: '', imageUrl: '', quantity: 0 });
                  alert('Sweet created successfully!');
            } catch (err) {
                  alert(err.response?.data?.message || 'Failed to create sweet');
            }
      };

      const handleRestock = async (id) => {
            const amount = restockAmounts[id];
            if (!amount || amount <= 0) return;

            try {
                  const { data } = await api.post(`/sweets/${id}/restock`, { quantity: amount });
                  setSweets(sweets.map((s) => (s._id === id ? data : s)));
                  setRestockAmounts({ ...restockAmounts, [id]: '' });
            } catch (err) {
                  alert(err.response?.data?.message || 'Restock failed');
            }
      };

      if (loading) return <div className="text-center mt-10 text-brand-600 font-bold text-xl">Accessing secure recipe vault...</div>;

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
                                          <input type="text" required className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400" value={newSweet.name} onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                          <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Price</label>
                                                <input type="number" required className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400" value={newSweet.price} onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })} />
                                          </div>
                                          <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Stock</label>
                                                <input type="number" required className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400" value={newSweet.quantity} onChange={(e) => setNewSweet({ ...newSweet, quantity: e.target.value })} />
                                          </div>
                                    </div>
                                    <div>
                                          <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Description</label>
                                          <textarea required className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400" rows="3" value={newSweet.description} onChange={(e) => setNewSweet({ ...newSweet, description: e.target.value })} />
                                    </div>
                                    <div>
                                          <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Image URL</label>
                                          <input type="text" required className="w-full p-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-brand-400" value={newSweet.imageUrl} onChange={(e) => setNewSweet({ ...newSweet, imageUrl: e.target.value })} />
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
                                                                  setRestockAmounts({ ...restockAmounts, [sweet._id]: e.target.value })
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