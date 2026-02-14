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
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-sky-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-serif font-black bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-cyan-600">
                                Blogs
                            </Link>
                        </div>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            <Link to="/" className="border-transparent text-slate-500 hover:text-sky-600 hover:border-sky-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                Home
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <div className="flex items-center space-x-6">
                                <span className="text-slate-600 text-sm font-medium">Hello, <span className="text-sky-700">{user.username}</span></span>
                                <Link to="/create-post" className="bg-sky-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-sky-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                    New Post
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-slate-500 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link to="/login" className="text-slate-600 hover:text-sky-600 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-all shadow-md">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
