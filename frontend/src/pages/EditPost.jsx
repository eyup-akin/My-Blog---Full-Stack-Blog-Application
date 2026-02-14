import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${id}`);
                const post = response.data.data.post;
                setTitle(post.title);
                setContent(post.content);
            } catch (err) {
                setError('Failed to load post');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/posts/${id}`, { title, content });
            navigate(`/posts/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update post');
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        id="title"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        id="content"
                        required
                        rows={10}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Update Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPost;
