import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
      const { user, logout } = useAuth();
      const navigate = useNavigate();

      const handleLogout = () => {
            logout();
            navigate('/login');
      };

      return (
            <nav className="bg-pink-600 text-white shadow-md">
                  <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                        <Link to="/" className="text-2xl font-bold">Sweet Shop</Link>
                        <div className="flex items-center gap-4">
                              {user ? (
                                    <>
                                          <span className="hidden md:inline">Welcome, {user.username}</span>
                                          {user.role === 'admin' && (
                                                <Link to="/admin" className="hover:text-pink-200 transition-colors">Admin Panel</Link>
                                          )}
                                          <button
                                                onClick={handleLogout}
                                                className="bg-white text-pink-600 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                                          >
                                                Logout
                                          </button>
                                    </>
                              ) : (
                                    <>
                                          <Link to="/login" className="hover:text-pink-200 transition-colors">Login</Link>
                                          <Link to="/register" className="bg-white text-pink-600 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">Register</Link>
                                    </>
                              )}
                        </div>
                  </div>
            </nav>
      );
};

export default Navbar;
