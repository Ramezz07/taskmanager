import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const page = { padding: '32px 24px', maxWidth: '1000px', margin: '0 auto' };
const heading = { fontWeight: '800', fontSize: '1.6rem', color: '#1e293b', marginBottom: '4px', letterSpacing: '-0.02em' };
const sub = { color: '#64748b', fontSize: '0.9rem', marginBottom: '28px' };

const statCard = (color) => ({
  background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px',
  padding: '20px 24px', flex: 1, minWidth: '140px',
  borderTop: `4px solid ${color}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
});

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ todo: 0, inProgress: 0, done: 0, total: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get('/tasks/stats/summary'),
          api.get('/tasks?sort=-createdAt'),
        ]);
        setStats(statsRes.data.stats);
        setRecentTasks(tasksRes.data.tasks.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusLabel = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };
  const statusColors = { 'todo': '#64748b', 'in-progress': '#2563eb', 'done': '#16a34a' };

  return (
    <div style={page}>
      <h1 style={heading}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
      <p style={sub}>Here's your task overview</p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
        <div style={statCard('#6366f1')}>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#6366f1' }}>{loading ? '—' : stats.total}</div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>Total Tasks</div>
        </div>
        <div style={statCard('#f59e0b')}>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}>{loading ? '—' : stats.todo}</div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>To Do</div>
        </div>
        <div style={statCard('#3b82f6')}>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6' }}>{loading ? '—' : stats.inProgress}</div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>In Progress</div>
        </div>
        <div style={statCard('#22c55e')}>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#22c55e' }}>{loading ? '—' : stats.done}</div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>Done</div>
        </div>
      </div>

      {/* Progress bar */}
      {stats.total > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px 24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>Overall Progress</span>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#6366f1' }}>
              {Math.round((stats.done / stats.total) * 100)}%
            </span>
          </div>
          <div style={{ background: '#f1f5f9', borderRadius: '99px', height: '10px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '99px',
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              width: `${Math.round((stats.done / stats.total) * 100)}%`,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontWeight: '700', fontSize: '1rem', color: '#1e293b' }}>Recent Tasks</h2>
          <Link to="/tasks" style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '600' }}>View all →</Link>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Loading...</p>
        ) : recentTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📝</div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No tasks yet.</p>
            <Link to="/tasks" style={{ color: '#6366f1', fontWeight: '600', fontSize: '0.88rem' }}>Create your first task →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {recentTasks.map((task, i) => (
              <div key={task._id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 0',
                borderBottom: i < recentTasks.length - 1 ? '1px solid #f1f5f9' : 'none',
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                  background: statusColors[task.status],
                }} />
                <span style={{ flex: 1, fontWeight: '500', fontSize: '0.88rem', color: '#1e293b' }}>{task.title}</span>
                <span style={{
                  fontSize: '0.72rem', fontWeight: '600', padding: '2px 8px',
                  borderRadius: '20px', background: '#f8fafc', color: '#64748b',
                }}>
                  {statusLabel[task.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
