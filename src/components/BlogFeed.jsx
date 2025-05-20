import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BlogFeed() {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    const fetchBlogs = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/blogs/feed`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        if (res.ok) {
            setBlogs(data);
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
                            }}>
                                <h3>{blog.title}</h3>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: "flex-start",
                                    alignItems: "flex-start",
                                    gap: '10px',
                                }}>
                                    {blog.image && (
                                        <img
                                            src={`${import.meta.env.VITE_SERVER_URL}${blog.image}`}
                                            alt={blog.title}
                                            style={{ width: '200%', maxWidth: '70px' }}
                                        />
                                    )}
                                    <p style={{ margin: "0px" }}>{blog.description.slice(0, 150)}...</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );

}