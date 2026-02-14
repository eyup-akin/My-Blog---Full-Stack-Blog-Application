import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LandingPage from './LandingPage';

const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return; // Don't fetch posts if not logged in

        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts');
                // Backend response structure: { data: { posts: [], pagination: {} } }
                // Based on controller: success(res, { posts: postsResult.rows, ... });
                // So response.data.data.posts
                setPosts(response.data.data.posts);
            } catch (err) {
                setError('Failed to fetch posts');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user]);

    // If user is not logged in, show Landing Page
    if (!user) {
        return <LandingPage />;
    }

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (

        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-serif font-bold text-slate-800 mb-10 border-b border-slate-200 pb-4">
                    Latest <span className="text-sky-600">Perspectives</span>
                </h1>
                <div className="grid gap-8 lg:grid-cols-2">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-sky-100 transition-all duration-300 overflow-hidden group">
                            <div className="p-8">
                                <div className="flex items-center space-x-2 text-sm text-slate-500 mb-4">
                                    <span className="font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">{post.username}</span>
                                    <span>•</span>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-sky-700 transition-colors">
                                    <Link to={`/posts/${post.id}`} className="block">
                                        {post.title}
                                    </Link>
                                </h2>
                                <p className="text-slate-600 leading-relaxed line-clamp-3 mb-6">
                                    {post.content}
                                </p>
                                <div className="flex items-center justify-between mt-4 border-t border-slate-50 pt-4">
                                    <Link to={`/posts/${post.id}`} className="text-sky-600 font-semibold text-sm hover:text-sky-800 flex items-center group/link">
                                        Read Article
                                        <svg className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                    </Link>
                                    <span className="text-xs text-slate-400 font-medium tracking-wide">5 MIN READ</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
