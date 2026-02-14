import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/posts/${id}`);
                navigate('/');
            } catch (err) {
                alert('Failed to delete post');
                console.error(err);
            }
        }
    };

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

        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4">
                <article className="bg-white p-10 md:p-14 rounded-3xl shadow-lg border border-slate-100 mb-10">
                    <header className="mb-10 text-center">
                        <div className="inline-flex items-center space-x-2 bg-sky-50 text-sky-700 px-4 py-1 rounded-full text-sm font-semibold mb-6">
                            <span>Published by {post.username}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">{post.title}</h1>
                        <div className="flex justify-center items-center text-sm text-slate-500 space-x-4 border-t border-b border-slate-50 py-4">
                            <span>{new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            {user && (user.id === post.author_id || user.role === 'admin') && (
                                <div className="flex space-x-3 pl-4 border-l border-slate-100">
                                    <button
                                        onClick={() => navigate(`/edit-post/${id}`)}
                                        className="text-sky-600 hover:text-sky-800 font-medium transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="text-rose-500 hover:text-rose-700 font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>
                    <div className="prose prose-lg prose-slate max-w-none text-slate-700 leading-loose">
                        {post.content.split('\n').map((para, idx) => (
                            <p key={idx} className="mb-6 first:first-letter:text-7xl first:first-letter:font-serif first:first-letter:text-sky-900 first:first-letter:mr-3 first:first-letter:float-left first:first-letter:leading-none">
                                {para}
                            </p>
                        ))}
                    </div>
                </article>

                <section className="bg-white/60 backdrop-blur-sm p-10 rounded-3xl border border-slate-200/60 shadow-sm">
                    <h3 className="text-2xl font-serif font-bold text-slate-800 mb-8 border-b border-slate-200 pb-4">
                        Discussion <span className="text-sky-500 ml-2 text-lg align-top">{comments.length}</span>
                    </h3>

                    {user ? (
                        <form onSubmit={handleCommentSubmit} className="mb-12 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Join the conversation</label>
                            <textarea
                                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all outline-none resize-y min-h-[100px] text-slate-700"
                                placeholder="What are your thoughts?"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                required
                            />
                            <div className="flex justify-end mt-3">
                                <button
                                    type="submit"
                                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-md hover:shadow-lg transform active:scale-95"
                                >
                                    Post Comment
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-12 p-8 bg-sky-50/50 border border-sky-100 rounded-2xl text-center">
                            <h4 className="text-lg font-medium text-slate-800 mb-2">Log in to comment</h4>
                            <p className="text-slate-600 mb-4">Join the community to share your thoughts and ideas.</p>
                            <Link to="/login" className="inline-block bg-white text-sky-700 border border-sky-200 font-semibold px-6 py-2 rounded-full hover:bg-sky-50 transition-colors">
                                Log In
                            </Link>
                        </div>
                    )}

                    <div className="space-y-8">
                        {comments.map((comment) => (
                            <div key={comment.id} className="group">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm">
                                        {comment.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm">{comment.username}</h4>
                                                    <span className="text-xs text-slate-400 font-medium">
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {user && user.id === comment.author_id && (
                                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => startEditing(comment)} className="text-slate-400 hover:text-sky-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                                                        <button onClick={() => handleCommentDelete(comment.id)} className="text-slate-400 hover:text-rose-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                                                    </div>
                                                )}
                                            </div>

                                            {editingComment === comment.id ? (
                                                <div className="mt-3">
                                                    <textarea
                                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-sky-300 outline-none text-sm"
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                    />
                                                    <div className="mt-2 space-x-2 flex justify-end">
                                                        <button onClick={() => setEditingComment(null)} className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1">Cancel</button>
                                                        <button onClick={() => handleCommentUpdate(comment.id, editContent)} className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded-md hover:bg-sky-700">Display Save</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-slate-700 text-sm leading-relaxed">{comment.content}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {comments.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-slate-400 italic">No thoughts shared yet. Be the first.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PostDetail;
