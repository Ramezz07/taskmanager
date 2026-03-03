import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const page = { padding: '32px 24px', maxWidth: '1000px', margin: '0 auto' };

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      const { data } = await api.get(`/tasks?${params}`);
      setTasks(data.tasks);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSave = async (form) => {
    try {
      if (editTask) {
        const { data } = await api.put(`/tasks/${editTask._id}`, form);
        setTasks((prev) => prev.map((t) => (t._id === editTask._id ? data.task : t)));
        toast.success('Task updated!');
      } else {
        const { data } = await api.post('/tasks', form);
        setTasks((prev) => [data.task, ...prev]);
        toast.success('Task created!');
      }
      setModalOpen(false);
      setEditTask(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, { status });
      setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const openCreate = () => { setEditTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };

  const selectStyle = {
    padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
    fontSize: '0.85rem', color: '#475569', background: '#fff', cursor: 'pointer',
  };

  return (
    <div style={page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontWeight: '800', fontSize: '1.6rem', color: '#1e293b', letterSpacing: '-0.02em' }}>My Tasks</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '2px' }}>
            {loading ? '...' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            padding: '10px 20px', borderRadius: '10px', border: 'none',
            background: '#6366f1', color: '#fff', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer',
          }}
        >
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <select style={selectStyle} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select style={selectStyle} value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {(filters.status || filters.priority) && (
          <button
            onClick={() => setFilters({ status: '', priority: '' })}
            style={{ ...selectStyle, color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Task Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
          <p style={{ color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>No tasks found</p>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            {filters.status || filters.priority ? 'Try clearing your filters' : 'Click "+ New Task" to get started'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={openEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <TaskModal
          task={editTask}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditTask(null); }}
        />
      )}
    </div>
  );
}
