import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BlogFeed() {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    const fetchBlogs = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.SERVER_URL}/api/blogs/feed`, {
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

    return (
        <div>
            {blogs.length === 0 ? (
                <p>No blogs available.</p>
            ) : (
                <div style={{ padding: '20px' }}>
                    <h2>Blog Feed</h2>
                    {blogs.length === 0 ? (
                        <p>No blogs available</p>
                    ) : (
                        blogs.map((blog) => (
                            <div key={blog._id} style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                marginBottom: '20px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            }}>
                                <h3>{blog.title}</h3>
                                {blog.image && (
                                    <img
                                        src={`${process.env.SERVER_URL}/${blog.image}`}
                                        alt={blog.title}
                                        style={{ width: '100%', maxWidth: '400px' }}
                                    />
                                )}
                                <p>{blog.description.slice(0, 150)}...</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );

}