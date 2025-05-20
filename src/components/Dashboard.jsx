import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogFeed from './BlogFeed';

export default function Dashboard() {
    const [user, setUser] = useState({ email: '', profileImage: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/dashboard`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                alert('Unauthorized or session expired');
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchDashboard();
    }, [navigate]);

    return (
        <div style={{
            width: '95%',
            padding: '20px',
        }}>
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: "space-between",
                }}>
                    <h2>Welcome to your Dashboard</h2>
                    {user.profileImage && (
                        <img
                            src={`${import.meta.env.VITE_SERVER_URL}${user.profileImage}`}
                            alt="Profile"
                            style={{ width: '70px', height: '70px', borderRadius: '50%' }}
                        />
                    )}
                </div>
                <hr style={{ width: '100%' }} />
                <p></p>

                <div style={{ marginBottom: '20px' }}>
                    <a
                        href="/blogs"
                        style={{
                            textDecoration: 'none',
                            color: '#1976d2',
                            fontWeight: 'bold',
                            fontSize: '16px',
                        }}
                    >
                        Go to My Blogs
                    </a>
                </div>
                <BlogFeed />
            </div>
        </div>
    );

}
