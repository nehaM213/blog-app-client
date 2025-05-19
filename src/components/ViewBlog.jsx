import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function BlogView() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.SERVER_URL}/api/blogs/${id}`, {
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

            setLoading(false);
        };

        fetchBlog();
    }, [id, navigate]);

    if (loading) return <p>Loading blog...</p>;

    return blog ? (
        <div style={{ padding: '20px' }}>
            <button onClick={() => navigate('/blogs')}>← Back to Blogs</button>
            <h2>{blog.title}</h2>
            <div style={{ display: 'flex', justifyContent: "flex-start", alignItems: 'flex-start', gap: '20px' }}>
                {blog.image && (
                    <img
                        src={`${process.env.SERVER_URL}${blog.image}`}
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
