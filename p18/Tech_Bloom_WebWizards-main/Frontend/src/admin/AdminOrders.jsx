import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import API_ADMIN from './apiAdmin';

const statusColors = {
  pending: '#6c757d',
  confirmed: '#0dcaf0',
  paid: '#0d6efd',
  shipped: '#20c997',
  delivered: '#198754',
  cancelled: '#dc3545',
  canceled: '#dc3545',
  refunded: '#fd7e14'
};

const tag = (text) => (
  <span style={{
    background: statusColors[text] || '#6c757d',
    color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: 12
  }}>
    {text}
  </span>
);

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('-createdAt');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit, sort };
      if (q) params.q = q;
      if (status) params.status = status;
      if (from) params.from = from;
      if (to) params.to = to;
      const { data } = await API_ADMIN.get('/orders', { params });
      setOrders(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, sort]);

  const exportCsv = async () => {
    try {
      const params = { sort };
      if (q) params.q = q;
      if (status) params.status = status;
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await API_ADMIN.get('/orders/export', { params, responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'orders.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to export CSV');
    }
  };

  const container = { padding: 20, maxWidth: 1200, margin: '20px auto' };
  const toolbar = { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' };
  const table = { width: '100%', borderCollapse: 'collapse' };
  const thtd = { borderBottom: '1px solid #eee', padding: 8, textAlign: 'left' };

  return (
    <div style={container}>
      <h2>Admin Orders</h2>
      <div style={toolbar}>
        <input placeholder="Search (order no/email)" value={q} onChange={e=>setQ(e.target.value)} style={{ padding: 8, minWidth: 220 }}/>
        <select value={status} onChange={e=>setStatus(e.target.value)} style={{ padding: 8 }}>
          <option value="">All Status</option>
          <option>pending</option>
          <option>confirmed</option>
          <option>paid</option>
          <option>shipped</option>
          <option>delivered</option>
          <option>cancelled</option>
          <option>canceled</option>
          <option>refunded</option>
        </select>
        <input type="date" value={from} onChange={e=>setFrom(e.target.value)} style={{ padding: 8 }}/>
        <input type="date" value={to} onChange={e=>setTo(e.target.value)} style={{ padding: 8 }}/>
        <button onClick={()=>{ setPage(1); fetchOrders(); }} style={{ padding: '8px 12px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: 4 }}>Filter</button>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ padding: 8 }}>
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="-totalPrice">Amount High-Low</option>
          <option value="totalPrice">Amount Low-High</option>
        </select>
        <button onClick={exportCsv} style={{ padding: '8px 12px', background: '#20c997', color: 'white', border: 'none', borderRadius: 4 }}>Export CSV</button>
      </div>

      {error && <div style={{ color: 'white', background: '#dc3545', padding: 8, borderRadius: 4, marginBottom: 12 }}>{error}</div>}

      <div style={{ overflowX: 'auto' }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={thtd}>Order #</th>
              <th style={thtd}>Customer</th>
              <th style={thtd}>Total</th>
              <th style={thtd}>Status</th>
              <th style={thtd}>Created</th>
              <th style={thtd}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: 12 }}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: 12 }}>No orders found</td></tr>
            ) : (
              orders.map(o => (
                <tr key={o._id}>
                  <td style={thtd}>{o.orderNumber}</td>
                  <td style={thtd}>{o.user?.name} <div style={{ color: '#6c757d', fontSize: 12 }}>{o.user?.email}</div></td>
                  <td style={thtd}>₹{Number(o.totalPrice).toFixed(2)}</td>
                  <td style={thtd}>{tag(o.status)}</td>
                  <td style={thtd}>{new Date(o.createdAt).toLocaleString()}</td>
                  <td style={thtd}><Link to={`/admin/orders/${o._id}`}>View</Link></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <span>Page {page} / {pages}</span>
        <button disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>Next</button>
        <select value={limit} onChange={e=>{ setLimit(Number(e.target.value)); setPage(1); }}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
;

export default AdminOrders;
