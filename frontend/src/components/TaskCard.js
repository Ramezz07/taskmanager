import React from 'react';

const priorityColors = {
  low: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  medium: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  high: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

const statusColors = {
  'todo': { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  'in-progress': { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'done': { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
};

const statusLabel = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' },
  title: { fontWeight: '600', fontSize: '0.95rem', color: '#1e293b', flex: 1 },
  desc: { fontSize: '0.83rem', color: '#64748b', marginBottom: '12px', lineHeight: '1.5' },
  tags: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' },
  tag: (colors) => ({
    padding: '2px 8px',
    borderRadius: '20px',
    fontSize: '0.72rem',
    fontWeight: '600',
    background: colors.bg,
    color: colors.color,
    border: `1px solid ${colors.border}`,
    textTransform: 'capitalize',
  }),
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' },
  date: { fontSize: '0.75rem', color: '#94a3b8' },
  actions: { display: 'flex', gap: '6px' },
  btn: (variant) => ({
    padding: '4px 12px',
    borderRadius: '7px',
    fontSize: '0.78rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    background: variant === 'edit' ? '#eef2ff' : '#fef2f2',
    color: variant === 'edit' ? '#4f46e5' : '#ef4444',
    transition: 'opacity 0.15s',
  }),
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const p = priorityColors[task.priority] || priorityColors.medium;
  const s = statusColors[task.status] || statusColors.todo;

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <span style={styles.title}>{task.title}</span>
      </div>
      {task.description && <p style={styles.desc}>{task.description}</p>}
      <div style={styles.tags}>
        <span style={styles.tag(s)}>{statusLabel[task.status]}</span>
        <span style={styles.tag(p)}>{task.priority} priority</span>
      </div>
      <div style={styles.footer}>
        <div>
          {task.dueDate && (
            <span style={styles.date}>
              📅 {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        <div style={styles.actions}>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            style={{
              padding: '4px 8px', borderRadius: '7px', border: '1px solid #e2e8f0',
              fontSize: '0.75rem', fontWeight: '600', color: '#475569', background: '#fff', cursor: 'pointer',
            }}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button style={styles.btn('edit')} onClick={() => onEdit(task)}>Edit</button>
          <button style={styles.btn('delete')} onClick={() => onDelete(task._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
