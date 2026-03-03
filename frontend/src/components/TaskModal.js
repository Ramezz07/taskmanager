import React, { useState, useEffect } from 'react';

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, padding: '16px',
};
const modal = {
  background: '#fff', borderRadius: '16px', padding: '28px',
  width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
};
const label = { display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#475569', marginBottom: '6px' };
const input = {
  width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0',
  borderRadius: '8px', fontSize: '0.9rem', color: '#1e293b',
  outline: 'none', marginBottom: '16px', transition: 'border 0.2s',
};
const row = { display: 'flex', gap: '12px' };
const btnPrimary = {
  flex: 1, padding: '11px', borderRadius: '9px', border: 'none',
  background: '#6366f1', color: '#fff', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer',
};
const btnSecondary = {
  flex: 1, padding: '11px', borderRadius: '9px', border: '1px solid #e2e8f0',
  background: '#fff', color: '#64748b', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer',
};

const defaultForm = { title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' };

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [task]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <h2 style={{ fontWeight: '700', fontSize: '1.15rem', marginBottom: '20px', color: '#1e293b' }}>
          {task ? '✏️ Edit Task' : '➕ New Task'}
        </h2>

        <label style={label}>Title *</label>
        <input style={input} name="title" value={form.title} onChange={handleChange} placeholder="Task title..." />

        <label style={label}>Description</label>
        <textarea
          style={{ ...input, minHeight: '80px', resize: 'vertical' }}
          name="description" value={form.description} onChange={handleChange}
          placeholder="Optional description..."
        />

        <div style={row}>
          <div style={{ flex: 1 }}>
            <label style={label}>Status</label>
            <select style={input} name="status" value={form.status} onChange={handleChange}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={label}>Priority</label>
            <select style={input} name="priority" value={form.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <label style={label}>Due Date</label>
        <input style={input} type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />

        <div style={row}>
          <button style={btnSecondary} onClick={onClose}>Cancel</button>
          <button style={btnPrimary} onClick={handleSubmit} disabled={loading || !form.title.trim()}>
            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
