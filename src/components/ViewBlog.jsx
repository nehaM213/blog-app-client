import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function BlogView() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/blogs/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setBlog(data);
            } else {
                alert('Blog not found or unauthorized');
                navigate('/blogs');
            }
        };

        fetchBlog();
    }, [id, navigate]);

    return blog ? (
        <div style={{ padding: '20px' }}>
            <button onClick={() => navigate('/blogs')}>← Back to Blogs</button>
            <h2>{blog.title}</h2>
            <div style={{ display: 'flex', justifyContent: "flex-start", alignItems: 'flex-start', gap: '20px' }}>
                {blog.image && (
                    <img
                        src={`${import.meta.env.VITE_SERVER_URL}${blog.image}`}
                        alt={blog.title}
                        style={{ maxWidth: '20%', margin: '20px 0' }}
                    />
                )}
                <p>{blog.description}</p>
            </div>

        </div>
    ) : (
        <p>Blog not found.</p>
    );
}
