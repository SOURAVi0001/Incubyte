import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const { login } = useAuth();
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                  await login(email, password);
                  navigate('/');
            } catch (err) {
                  setError(err.response?.data?.message || 'Login failed');
            }
      };

      return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-brand-50 px-4">
                  <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border-t-8 border-brand-500">
                        <div className="text-center mb-8">
                              <h2 className="text-3xl font-extrabold text-brand-900">Welcome Back</h2>
                              <p className="text-brand-600 mt-2">Ready for something sweet?</p>
                        </div>
                        
                        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-100 text-center">{error}</div>}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                              <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                                    <input
                                          type="email"
                                          required
                                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-400 focus:bg-white transition-all"
                                          placeholder="you@example.com"
                                          value={email}
                                          onChange={(e) => setEmail(e.target.value)}
                                    />
                              </div>
                              <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                                    <input
                                          type="password"
                                          required
                                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-400 focus:bg-white transition-all"
                                          placeholder="••••••••"
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                    />
                              </div>
                              <button
                                    type="submit"
                                    className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-brand-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                              >
                                    Sign In
                              </button>
                        </form>
                        <p className="mt-8 text-center text-gray-500">
                              New to The Sweet Spot? <Link to="/register" className="text-brand-600 font-bold hover:underline">Create Account</Link>
                        </p>
                  </div>
            </div>
      );
};

export default Login;