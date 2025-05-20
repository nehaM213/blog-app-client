import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please enter email and password.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (profileImage && profileImage.size > 2 * 1024 * 1024) {
            setError('Profile image must be less than 2MB.');
            return;
        }

        const allowed = /jpeg|jpg|png|gif/;

        if (profileImage) {
            if (!allowed.test(profileImage.type)) {
                setError('Only JPEG, JPG, PNG, and GIF image types are allowed.');
                return;
            }
            if (profileImage.size > 2 * 1024 * 1024) {
                setError('Profile image must be less than 2MB.');
                return;
            }
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profileImage', profileImage);

        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/signup`, {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        if (res.ok) {
            alert('Signup successful!');
            navigate('/login');
        } else {
            setError(data.message);
        }
    };

    return (
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', gap: '10px' }}>
                <h2>Signup</h2>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                <label>
                    Profile Image
                    <input type="file" onChange={e => setProfileImage(e.target.files[0])} accept="image/*" />
                </label>
                <button type="submit">Signup</button>
                <p style={{ textAlign: 'center' }}>
                    Already have an account?{' '}
                    <a href="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>
                        Login
                    </a>
                </p>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            </form>
        </div>
    );
}
