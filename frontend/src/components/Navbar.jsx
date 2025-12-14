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
            <nav className="sticky top-0 z-50 bg-brand-700/95 backdrop-blur-sm text-white shadow-lg border-b border-brand-500">
                  <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                              <img src="/vite.svg" alt="Logo" className="h-8 w-8 transition-transform group-hover:rotate-12" />
                              <span className="text-2xl font-extrabold tracking-tight">The Sweet Spot</span>
                        </Link>
                        <div className="flex items-center gap-6 font-semibold">
                              {user ? (
                                    <>
                                          <span className="hidden md:inline text-brand-100">Hello, {user.username}</span>
                                          {user.role === 'admin' && (
                                                <Link to="/admin" className="hover:text-brand-200 transition-colors">Admin Panel</Link>
                                          )}
                                          <button
                                                onClick={handleLogout}
                                                className="bg-brand-900 text-white px-5 py-2 rounded-full shadow-md hover:bg-brand-800 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                          >
                                                Logout
                                          </button>
                                    </>
                              ) : (
                                    <>
                                          <Link to="/login" className="hover:text-brand-200 transition-colors">Login</Link>
                                          <Link to="/register" className="bg-white text-brand-700 px-5 py-2 rounded-full shadow-md hover:bg-brand-50 transition-all transform hover:-translate-y-0.5">
                                                Get Started
                                          </Link>
                                    </>
                              )}
                        </div>
                  </div>
            </nav>
      );
};

export default Navbar;