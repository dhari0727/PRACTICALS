import React, { useEffect, useState } from 'react';
import API_ADMIN from './apiAdmin';
import { Link } from 'react-router-dom';

const Card = ({ title, value }) => (
  <div style={{ flex: 1, minWidth: 200, background: 'white', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
    <div style={{ color: '#6c757d', fontSize: 12 }}>{title}</div>
    <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
  </div>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState({ ordersToday: 0, revenueToday: 0, statusBreakdown: {}, orders7dTrend: [] });

  const fetchMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API_ADMIN.get('/metrics');
      setMetrics(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMetrics(); }, []);

  const container = { padding: 20, maxWidth: 1200, margin: '20px auto' };
  const grid = { display: 'flex', gap: 12, flexWrap: 'wrap' };
  const section = { background: 'white', border: '1px solid #eee', borderRadius: 8, padding: 16, marginTop: 16 };

  return (
    <div style={container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h2>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/admin/orders" style={{ background: '#0d6efd', color: 'white', padding: '8px 12px', borderRadius: 4, textDecoration: 'none' }}>View Orders</Link>
        </div>
      </div>

      {error && <div style={{ color: 'white', background: '#dc3545', padding: 8, borderRadius: 4, marginBottom: 12 }}>{error}</div>}

      <div style={grid}>
        <Card title="Orders Today" value={metrics.ordersToday} />
        <Card title="Revenue Today" value={`₹${Number(metrics.revenueToday).toFixed(2)}`} />
        <Card title="Pending" value={metrics.statusBreakdown?.pending || 0} />
        <Card title="Shipped" value={metrics.statusBreakdown?.shipped || 0} />
      </div>

      <div style={section}>
        <h3>Status Breakdown</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {Object.entries(metrics.statusBreakdown || {}).map(([k, v]) => (
            <div key={k} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, minWidth: 120 }}>
              <div style={{ color: '#6c757d', fontSize: 12 }}>{k}</div>
              <div style={{ fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={section}>
        <h3>Last 7 Days</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Date</th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #eee', padding: 8 }}>Orders</th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #eee', padding: 8 }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(metrics.orders7dTrend || []).map((d) => (
                <tr key={d.date}>
                  <td style={{ padding: 8 }}>{d.date}</td>
                  <td style={{ padding: 8, textAlign: 'right' }}>{d.count}</td>
                  <td style={{ padding: 8, textAlign: 'right' }}>₹{Number(d.revenue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
