import { useState, useEffect, use } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function BlogForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                setLoading(true);
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/blogs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setTitle(data.title);
                    setDescription(data.description);
                    setImage(data.image || '');
                } else {
                    alert('Failed to load blog');
                    navigate('/blogs');
                }
                setLoading(false);
            };
            fetchBlog();
        }
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);
        formData.append('title', title);
        formData.append('description', description);
        setLoading(true);
        const token = localStorage.getItem('token');

        const url = id ? `${import.meta.env.VITE_SERVER_URL}/api/blogs/${id}` : `${import.meta.env.VITE_SERVER_URL}/api/blogs`;
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await res.json();

        if (res.ok) {
            alert(id ? 'Blog updated successfully!' : 'Blog created successfully!');
            navigate('/blogs');
        } else {
            alert(data.message || 'Something went wrong!');
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>{id ? 'Edit Blog' : 'Add New Blog'}</h2>
            <form onSubmit={handleSubmit} style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Blog Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Blog Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={5}
                />

                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={() => navigate('/blogs')}>
                        ← Back to Blogs
                    </button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : id ? 'Update Blog' : 'Create Blog'}
                    </button>
                </div>

            </form>
        </div>
    );
}
