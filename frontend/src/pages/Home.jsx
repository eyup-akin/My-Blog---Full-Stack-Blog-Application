import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
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
    }, []);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Latest Posts</h1>
            <div className="grid gap-6 lg:grid-cols-2">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                <Link to={`/posts/${post.id}`} className="hover:text-indigo-600">
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="text-gray-500 text-sm mb-4">
                                By {post.username} on {new Date(post.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 line-clamp-3">
                                {post.content}
                            </p>
                            <div className="mt-4">
                                <Link to={`/posts/${post.id}`} className="text-indigo-600 hover:text-indigo-500 font-medium">
                                    Read more &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
