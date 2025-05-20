import { useState, useEffect, use } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function BlogForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const validate = () => {
        const newErrors = [];

        if (!title.trim()) {
            newErrors.push('Title is required');
        } else if (title.trim().length < 3) {
            newErrors.push('Title must be atleast 3 characters');
        }

        if (!description.trim()) {
            newErrors.push('Description is required');
        } else if (description.trim().length < 10) {
            newErrors.push('Description must be atleast 10 characters');
        }

        const allowed = /jpeg|jpg|png|gif/;

        if (image instanceof File) {
            console.log(image);
            if (!allowed.test(image.type)) {
                newErrors.push('Only JPEG, JPG, PNG, and GIF image types are allowed.');
            }
            if (image.size > 2 * 1024 * 1024) {
                newErrors.push('Profile image must be less than 2MB.');
            }
        }

        setError(newErrors);

        // Return true if no errors
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
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
                    navigate('/blogs');
                }
            };
            fetchBlog();
        }
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        const formData = new FormData();
        formData.append('image', image);
        formData.append('title', title);
        formData.append('description', description);
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
            navigate('/blogs');
        } else {
            setError(prevErrors => [...prevErrors, data.message]);
        }
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
                    <button type="submit">
                        {id ? 'Update Blog' : 'Create Blog'}
                    </button>
                </div>
                {error && (
                    <p style={{ color: 'red', textAlign: 'center' }}>
                        {error.map((err, index) => (
                            <span key={index}>{err}<br /></span>
                        ))}
                    </p>
                )}
            </form>
        </div>
    );
}
