import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const page = {
  minHeight: '100vh', display: 'flex', alignItems: 'center',
  justifyContent: 'center', background: 'linear-gradient(135deg, #eef2ff 0%, #f1f5f9 100%)',
  padding: '20px',
};
const card = {
  background: '#fff', borderRadius: '20px', padding: '40px',
  width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(99,102,241,0.12)',
  border: '1px solid #e2e8f0',
};
const label = { display: 'block', fontSize: '0.83rem', fontWeight: '600', color: '#475569', marginBottom: '6px' };
const inputStyle = (focused) => ({
  width: '100%', padding: '11px 14px', border: `1.5px solid ${focused ? '#6366f1' : '#e2e8f0'}`,
  borderRadius: '9px', fontSize: '0.93rem', color: '#1e293b', outline: 'none',
  marginBottom: '16px', transition: 'border 0.2s', background: '#fafafa',
});
const btn = (loading) => ({
  width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
  background: loading ? '#a5b4fc' : '#6366f1', color: '#fff',
  fontWeight: '700', fontSize: '0.95rem', cursor: loading ? 'default' : 'pointer',
  marginTop: '4px',
});

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [focused, setFocused] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    const result = await register(form.name, form.email, form.password);
    if (!result.success) toast.error(result.message);
    else toast.success('Account created!');
  };

  return (
    <div style={page}>
      <div style={card}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✅</div>
          <h1 style={{ fontWeight: '800', fontSize: '1.6rem', color: '#1e293b', letterSpacing: '-0.03em' }}>TaskManager</h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '0.9rem' }}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={label}>Full Name</label>
          <input
            style={inputStyle(focused === 'name')}
            type="text" name="name" value={form.name}
            onChange={handleChange} placeholder="John Doe"
            onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
            required
          />

          <label style={label}>Email</label>
          <input
            style={inputStyle(focused === 'email')}
            type="email" name="email" value={form.email}
            onChange={handleChange} placeholder="you@example.com"
            onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
            required
          />

          <label style={label}>Password</label>
          <input
            style={inputStyle(focused === 'password')}
            type="password" name="password" value={form.password}
            onChange={handleChange} placeholder="Min 6 characters"
            onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
            required
          />

          <button style={btn(loading)} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
