import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    const fetchBlogs = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/blogs`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        if (res.ok) {
            setBlogs(data);
        } else {
            alert('Failed to fetch blogs');
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
        if (!confirmDelete) return;

        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/blogs/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            alert('Blog deleted');
            fetchBlogs();
        } else {
            alert('Error deleting blog');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>All Blogs</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
                <button onClick={() => navigate('/blogs/new')}>+ Add New Blog</button>
            </div>
            {blogs.length === 0 ? (
                <p>No blogs available.</p>
            ) : (
                <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Image</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog) => (
                            <tr key={blog._id}>
                                <td>{blog.title}</td>
                                <td>
                                    {blog.image && (
                                        <img
                                            src={`${import.meta.env.VITE_SERVER_URL}${blog.image}`}
                                            alt="Blog"
                                            style={{ width: '80px' }}
                                        />
                                    )}
                                </td>
                                <td>{blog.description.slice(0, 80)}...</td>
                                <td>
                                    <button onClick={() => navigate(`/blogs/view/${blog._id}`)}>View</button>
                                    <button onClick={() => navigate(`/blogs/edit/${blog._id}`)}>Edit</button>
                                    <button onClick={() => handleDelete(blog._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
