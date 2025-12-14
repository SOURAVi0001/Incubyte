import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
      const [username, setUsername] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const { register } = useAuth();
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                  await register(username, email, password);
                  navigate('/');
            } catch (err) {
                  setError(err.response?.data?.message || 'Registration failed');
            }
      };

      return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                  <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>
                        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                              <div>
                                    <label className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                          type="text"
                                          required
                                          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-pink-500 focus:border-pink-500"
                                          value={username}
                                          onChange={(e) => setUsername(e.target.value)}
                                    />
                              </div>
                              <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                          type="email"
                                          required
                                          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-pink-500 focus:border-pink-500"
                                          value={email}
                                          onChange={(e) => setEmail(e.target.value)}
                                    />
                              </div>
                              <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                          type="password"
                                          required
                                          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-pink-500 focus:border-pink-500"
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                    />
                              </div>
                              <button
                                    type="submit"
                                    className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
                              >
                                    Register
                              </button>
                        </form>
                        <p className="mt-4 text-center text-sm text-gray-600">
                              Already have an account? <Link to="/login" className="text-pink-600 hover:underline">Login</Link>
                        </p>
                  </div>
            </div>
      );
};

export default Register;
