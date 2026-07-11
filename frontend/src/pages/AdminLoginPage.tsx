import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosClient';
import { setToken } from '../auth/token';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password) {
      setError('Please enter both your username and password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { data } = await apiClient.post<{ accessToken: string }>('/auth/login', {
        username: username.trim(),
        password,
      });
      setToken(data.accessToken);
      navigate('/admin', { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('Unable to sign in right now. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-shell__main admin-login-page">
      <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
        <p className="admin-login-form__eyebrow">Administration</p>
        <h1>Admin Sign In</h1>

        <div className="admin-login-form__field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>

        <div className="admin-login-form__field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && (
          <p className="admin-login-form__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      </main>
      <SiteFooter />
    </div>
  );
}
