import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                const [postRes, commentsRes] = await Promise.all([
                    api.get(`/posts/${id}`),
                    api.get(`/posts/${id}/comments`)
                ]);

                // Backend: success(res, { post: result.rows[0] });
                setPost(postRes.data.data.post);

                // Backend: success(res, commentResult.rows); -> commentResult.rows is array.
                // Wrapped: { data: [array] }
                setComments(commentsRes.data.data);
            } catch (err) {
                setError('Failed to load post');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPostAndComments();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/comments', {
                content: newComment,
                post_id: id
            });
            // Refresh comments
            const res = await api.get(`/posts/${id}/comments`);
            setComments(res.data.data);
            setNewComment('');
        } catch (err) {
            alert('Failed to add comment');
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await api.delete(`/comments/${commentId}`);
                // Refresh comments
                const res = await api.get(`/posts/${id}/comments`);
                setComments(res.data.data);
            } catch (err) {
                alert('Failed to delete comment');
            }
        }
    };

    const handleCommentUpdate = async (commentId, newContent) => {
        try {
            await api.put(`/comments/${commentId}`, { content: newContent });
            // Refresh comments
            const res = await api.get(`/posts/${id}/comments`);
            setComments(res.data.data);
            setEditingComment(null);
        } catch (err) {
            alert('Failed to update comment');
        }
    };

    // State for editing comment
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');

    const startEditing = (comment) => {
        setEditingComment(comment.id);
        setEditContent(comment.content);
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (!post) return <div className="text-center">Post not found</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <article className="bg-white p-8 rounded-lg shadow mb-8">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>By {post.username} on {new Date(post.created_at).toLocaleDateString()}</span>
                        {user && (user.id === post.author_id || user.role === 'admin') && (
                            <div className="space-x-2">
                                <button
                                    onClick={() => navigate(`/edit-post/${id}`)}
                                    className="text-indigo-600 hover:text-indigo-800"
                                >
                                    Edit Post
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                <div className="prose max-w-none text-gray-800">
                    {post.content.split('\n').map((para, idx) => (
                        <p key={idx} className="mb-4">{para}</p>
                    ))}
                </div>
            </article>

            <section className="bg-white p-8 rounded-lg shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h3>

                {user ? (
                    <form onSubmit={handleCommentSubmit} className="mb-8">
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            rows="3"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="mt-2 text-white bg-indigo-600 active:bg-indigo-700 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        >
                            Post Comment
                        </button>
                    </form>
                ) : (
                    <div className="mb-8 p-4 bg-gray-50 rounded-md text-center">
                        <Link to="/login" className="text-indigo-600 font-medium">Log in</Link> to leave a comment.
                    </div>
                )}

                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                            <div className="flex justify-between items-baseline mb-2">
                                <h4 className="font-semibold text-gray-900">{comment.username}</h4>
                                <span className="text-xs text-gray-500">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            {editingComment === comment.id ? (
                                <div className="mt-2">
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                    />
                                    <div className="mt-2 space-x-2">
                                        <button
                                            onClick={() => handleCommentUpdate(comment.id, editContent)}
                                            className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingComment(null)}
                                            className="text-xs bg-gray-400 text-white px-2 py-1 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-700">{comment.content}</p>
                                    {user && (user.id === comment.author_id /* || user.role === 'admin' - comment data returns username not role, check backend if author_id is enough */) && (
                                        <div className="mt-2 space-x-2 text-xs">
                                            <button
                                                onClick={() => startEditing(comment)}
                                                className="text-indigo-600 hover:text-indigo-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleCommentDelete(comment.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                    {comments.length === 0 && (
                        <p className="text-gray-500 text-center">No comments yet. Be the first to share your thoughts!</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PostDetail;
