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
            if (!window.confirm('Are you sure?')) return;
            try {
                  await api.delete(`/sweets/${id}`);
                  setSweets(sweets.filter(s => s._id !== id));
                  alert('Sweet deleted successfully');
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
                        // Update sweet
                        const { data } = await api.put(`/sweets/${editingSweet._id}`, formData);
                        setSweets(sweets.map(s => s._id === editingSweet._id ? data : s));
                        alert('Sweet updated successfully');
                  } else {
                        // Create new sweet
                        const { data } = await api.post('/sweets', formData);
                        setSweets([...sweets, data]);
                        alert('Sweet added successfully');
                  }
                  setShowModal(false);
            } catch (err) {
                  alert(err.response?.data?.message || 'Operation failed');
            }
      };

      const filteredSweets = sweets.filter((sweet) =>
            sweet.name.toLowerCase().includes(search.toLowerCase())
      );

      if (loading) return <div className="text-center mt-10">Loading...</div>;
      if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

      return (
            <div className="container mx-auto px-4 py-8">
                  <div className="mb-8 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800">Sweet Shop</h1>
                        <div className="flex gap-4 items-center">
                              <input
                                    type="text"
                                    placeholder="Search sweets..."
                                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                              />
                              {user?.role === 'admin' && (
                                    <button
                                          onClick={openAddModal}
                                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                                    >
                                          + Add Sweet
                                    </button>
                              )}
                        </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredSweets.map((sweet) => (
                              <div key={sweet._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <img
                                          src={sweet.imageUrl}
                                          alt={sweet.name}
                                          className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                          <h2 className="text-xl font-semibold text-gray-800 mb-2">{sweet.name}</h2>
                                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sweet.description}</p>
                                          <div className="flex justify-between items-center mb-4">
                                                <span className="text-lg font-bold text-pink-600">${sweet.price}</span>
                                                <span className={`text-sm ${sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                      {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
                                                </span>
                                          </div>

                                          <div className="flex gap-2">
                                                <button
                                                      onClick={() => handlePurchase(sweet._id)}
                                                      disabled={sweet.quantity === 0}
                                                      className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors ${sweet.quantity > 0
                                                            ? 'bg-pink-500 hover:bg-pink-600'
                                                            : 'bg-gray-400 cursor-not-allowed'
                                                            }`}
                                                >
                                                      {sweet.quantity > 0 ? 'Purchase' : 'Sold Out'}
                                                </button>

                                                {user?.role === 'admin' && (
                                                      <>
                                                            <button
                                                                  onClick={() => openEditModal(sweet)}
                                                                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-md"
                                                            >
                                                                  Edit
                                                            </button>
                                                            <button
                                                                  onClick={() => handleDelete(sweet._id)}
                                                                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                                            >
                                                                  Delete
                                                            </button>
                                                      </>
                                                )}
                                          </div>
                                    </div>
                              </div>
                        ))}
                  </div>

                  {/* Modal */}
                  {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                    <h2 className="text-2xl font-bold mb-4">
                                          {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
                                    </h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                      Name
                                                </label>
                                                <input
                                                      type="text"
                                                      name="name"
                                                      value={formData.name}
                                                      onChange={handleFormChange}
                                                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                      required
                                                />
                                          </div>
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                      Price
                                                </label>
                                                <input
                                                      type="number"
                                                      name="price"
                                                      value={formData.price}
                                                      onChange={handleFormChange}
                                                      step="0.01"
                                                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                      required
                                                />
                                          </div>
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                      Description
                                                </label>
                                                <textarea
                                                      name="description"
                                                      value={formData.description}
                                                      onChange={handleFormChange}
                                                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                      rows="3"
                                                      required
                                                ></textarea>
                                          </div>
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                      Image URL
                                                </label>
                                                <input
                                                      type="text"
                                                      name="imageUrl"
                                                      value={formData.imageUrl}
                                                      onChange={handleFormChange}
                                                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                      required
                                                />
                                          </div>
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                      Quantity
                                                </label>
                                                <input
                                                      type="number"
                                                      name="quantity"
                                                      value={formData.quantity}
                                                      onChange={handleFormChange}
                                                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                      required
                                                />
                                          </div>
                                          <div className="flex gap-2 justify-end">
                                                <button
                                                      type="button"
                                                      onClick={() => setShowModal(false)}
                                                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                                >
                                                      Cancel
                                                </button>
                                                <button
                                                      type="submit"
                                                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                                                >
                                                      {editingSweet ? 'Update' : 'Add'}
                                                </button>
                                          </div>
                                    </form>
                              </div>
                        </div>
                  )}
            </div>
      );
};

export default Dashboard;
