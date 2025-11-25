import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { AccountSidebar } from './AccountSidebar';
import { requestCancelOrder } from './admin/adminRequests';
import { translateStatus } from './admin/AdminOrders';
import { getOrdersByClient } from '../requests';
import { RootState } from '../store/mainStore';
import { UserData } from '../redux/userSlice';

interface Order {
  id: number;
  date: string;
  status: string;
  products: {
    product: {
      name: string;
      price: number;
      shop: {
        name: string;
      };
    };
    ordered_amount: number;
  }[];
}

export function AccountPageOrders({ userData }: { userData: UserData }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const data = await getOrdersByClient(userData.access, userData.clid);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userData.access]);

  const handleCancel = async (orderId: number) => {
    try {
      await requestCancelOrder(userData.access, orderId.toString());
      enqueueSnackbar(`Order #${orderId} cancelled`, { variant: 'success' });
      fetchOrders();
    } catch (error) {
      enqueueSnackbar('Could not cancel the order', { variant: 'error' });
    }
  };

  return (
    <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--base)]">
      <div className="page-container py-10 space-y-6">
        <AccountSidebar />
        <h1 className="text-3xl font-semibold">Your orders</h1>
        <div className="space-y-4">
          {orders.length === 0 && (
            <p className="text-sm text-[var(--muted)]">No orders yet.</p>
          )}
          {orders.map((order) => (
            <div key={order.id} className="card space-y-2 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-[var(--base)]">
                    Order #{order.id}
                  </div>
                  <div className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                    {translateStatus(order.status)}
                  </div>
                </div>
                <div className="text-sm text-[var(--muted)]">Placed {order.date}</div>
              </div>
              <ul className="text-sm text-[var(--muted)]">
                {order.products.map((product, idx) => (
                  <li key={idx}>
                    {product.product.name} · {product.ordered_amount} pcs · {product.product.price} PLN
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <button
                  className="ghost-button text-sm"
                  onClick={() => navigate(`/purchase/delivery/${order.id}`)}
                >
                  Track delivery
                </button>
                {order.status !== 'Canceled' && (
                  <button className="ghost-button text-sm" onClick={() => handleCancel(order.id)}>
                    Cancel order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({ userData: state.user.user });

export default connect(mapStateToProps)(AccountPageOrders);
