import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_ADMIN from './apiAdmin';

const statusOptions = ['pending','confirmed','paid','shipped','delivered','cancelled','canceled','refunded'];

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const fetchOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API_ADMIN.get(`/orders/${id}`);
      setOrder(data.order);
      setNewStatus(data.order.status);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); /* eslint-disable-next-line */ }, [id]);

  const updateStatus = async () => {
    try {
      setUpdating(true);
      await API_ADMIN.patch(`/orders/${id}/status`, { status: newStatus });
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const cancelOrder = async () => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      setUpdating(true);
      await API_ADMIN.post(`/orders/${id}/cancel`, { reason: cancelReason });
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setUpdating(false);
    }
  };

  const refundOrder = async () => {
    if (!refundAmount) return alert('Enter refund amount');
    try {
      setUpdating(true);
      await API_ADMIN.post(`/orders/${id}/refund`, { amount: Number(refundAmount), reason: refundReason });
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to refund');
    } finally {
      setUpdating(false);
    }
  };

  const container = { padding: 20, maxWidth: 1000, margin: '20px auto' };
  const section = { background: 'white', border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 16 };
  const label = { color: '#6c757d', fontSize: 12 };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: 'white', background: '#dc3545' }}>{error}</div>;
  if (!order) return null;

  return (
    <div style={container}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>← Back</button>
      <h2>Order {order.orderNumber}</h2>

      <div style={section}>
        <h3>Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <div style={label}>Status</div>
            <div style={{ fontWeight: 600 }}>{order.status}</div>
          </div>
          <div>
            <div style={label}>Total</div>
            <div>₹{Number(order.totalPrice).toFixed(2)}</div>
          </div>
          <div>
            <div style={label}>Created</div>
            <div>{new Date(order.createdAt).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div style={section}>
        <h3>Customer</h3>
        <div>{order.user?.name}</div>
        <div style={{ color: '#6c757d' }}>{order.user?.email}</div>
        <div style={{ marginTop: 8 }}>
          <div style={label}>Shipping</div>
          <div>{order.shippingAddress?.fullName}</div>
          <div>{order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</div>
          <div>{order.shippingAddress?.phone}</div>
        </div>
      </div>

      <div style={section}>
        <h3>Items</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Product</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #eee', padding: 8 }}>Price</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #eee', padding: 8 }}>Qty</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #eee', padding: 8 }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(order.products || []).map((p) => (
              <tr key={p._id}>
                <td style={{ padding: 8 }}>{p.product?.name || p.product}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>₹{Number(p.price).toFixed(2)}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{p.quantity}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>₹{Number(p.price * p.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={section}>
        <h3>Timeline</h3>
        <ul>
          {(order.timeline || []).map((e, idx) => (
            <li key={idx}>{new Date(e.at).toLocaleString()} - {e.message}</li>
          ))}
        </ul>
      </div>

      <div style={section}>
        <h3>Actions</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={newStatus} onChange={e=>setNewStatus(e.target.value)}>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={updateStatus} disabled={updating} style={{ background: '#0d6efd', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4 }}>Update Status</button>

          <input placeholder="Cancel reason (optional)" value={cancelReason} onChange={e=>setCancelReason(e.target.value)} style={{ padding: 8, minWidth: 200 }}/>
          <button onClick={cancelOrder} disabled={updating} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4 }}>Cancel Order</button>

          <input placeholder="Refund amount" type="number" value={refundAmount} onChange={e=>setRefundAmount(e.target.value)} style={{ padding: 8, width: 140 }}/>
          <input placeholder="Refund reason (optional)" value={refundReason} onChange={e=>setRefundReason(e.target.value)} style={{ padding: 8, minWidth: 200 }}/>
          <button onClick={refundOrder} disabled={updating} style={{ background: '#fd7e14', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4 }}>Refund</button>
        </div>
      </div>
    </div>
  );
}
;

export default AdminOrderDetail;
