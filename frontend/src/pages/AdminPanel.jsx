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
                  alert('Restock successful!');
            } catch (err) {
                  alert(err.response?.data?.message || 'Restock failed');
            }
      };

      if (loading) return <div className="text-center mt-10">Loading...</div>;

      return (
            <div className="container mx-auto px-4 py-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Panel</h1>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Add New Sweet Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                              <h2 className="text-xl font-semibold mb-4">Add New Sweet</h2>
                              <form onSubmit={handleCreateSweet} className="space-y-4">
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700">Name</label>
                                          <input
                                                type="text"
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                value={newSweet.name}
                                                onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })}
                                          />
                                    </div>
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700">Price</label>
                                          <input
                                                type="number"
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                value={newSweet.price}
                                                onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })}
                                          />
                                    </div>
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700">Description</label>
                                          <textarea
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                value={newSweet.description}
                                                onChange={(e) => setNewSweet({ ...newSweet, description: e.target.value })}
                                          />
                                    </div>
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                          <input
                                                type="text"
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                value={newSweet.imageUrl}
                                                onChange={(e) => setNewSweet({ ...newSweet, imageUrl: e.target.value })}
                                          />
                                    </div>
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700">Initial Quantity</label>
                                          <input
                                                type="number"
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                value={newSweet.quantity}
                                                onChange={(e) => setNewSweet({ ...newSweet, quantity: e.target.value })}
                                          />
                                    </div>
                                    <button
                                          type="submit"
                                          className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
                                    >
                                          Add Sweet
                                    </button>
                              </form>
                        </div>

                        {/* Inventory Management Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                              <h2 className="text-xl font-semibold mb-4">Inventory Management</h2>
                              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                    {sweets.map((sweet) => (
                                          <div key={sweet._id} className="border-b pb-4 last:border-b-0">
                                                <div className="flex justify-between items-start mb-2">
                                                      <div>
                                                            <h3 className="font-medium">{sweet.name}</h3>
                                                            <p className="text-sm text-gray-500">Current Stock: {sweet.quantity}</p>
                                                      </div>
                                                      <span className="text-pink-600 font-bold">${sweet.price}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                      <input
                                                            type="number"
                                                            placeholder="Amount"
                                                            className="w-24 border border-gray-300 rounded-md p-1"
                                                            value={restockAmounts[sweet._id] || ''}
                                                            onChange={(e) =>
                                                                  setRestockAmounts({ ...restockAmounts, [sweet._id]: e.target.value })
                                                            }
                                                      />
                                                      <button
                                                            onClick={() => handleRestock(sweet._id)}
                                                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
                                                      >
                                                            Restock
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
