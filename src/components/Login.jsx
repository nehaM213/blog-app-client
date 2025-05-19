import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('${process.env.SERVER_URL}/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            alert('Login successful!');
            navigate('/dashboard');
        } else {
            setError(data.message);
        }
    };

    return (
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', gap: '10px' }}>
                <h2>Login</h2>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
                <p style={{ textAlign: 'center' }}>
                    Don't have an account?{' '}
                    <a href="/signup" style={{ color: '#007bff', textDecoration: 'underline' }}>
                        Signup
                    </a>
                </p>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            </form>
        </div>
    );
}
