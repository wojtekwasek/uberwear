import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Order } from '../models/Order';
import { getOrderById } from '../requests';
import { UserData } from '../redux/userSlice';
import { RootState } from '../store/mainStore';

function DeliveryPage({ userData }: { userData: UserData }) {
  const { orderId } = useParams<{ orderId: string }>();
  const [progress, setProgress] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const historySteps = [
    'Order received',
    'Courier on the way',
    'Out for delivery',
    'Delivered',
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData: Order = await getOrderById(userData.access, orderId?.toString() ?? '');
        setCurrentOrder(orderData);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      }
    };

    fetchOrder();
  }, [orderId, userData.access]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevTime) => {
        if (prevTime >= 100) {
          clearInterval(interval);
          return prevTime;
        }

        let maxTime = 25;
        if (currentOrder && currentOrder.status === 'Shipped') {
          maxTime = 50;
        } else if (currentOrder && currentOrder.status === 'Delivered') {
          maxTime = 100;
        } else if (currentOrder && currentOrder.status === 'Finalized') {
          maxTime = 100;
        }
        const newTime = Math.min(prevTime + 1, maxTime);

        if (newTime === 25) setHistoryIndex(1);
        if (newTime === 75) setHistoryIndex(2);
        if (newTime === 100) setHistoryIndex(3);

        return newTime;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [currentOrder]);

  return (
    <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--navy)]">
      <div className="page-container py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-3xl font-semibold">Delivery status</h1>
            <p className="text-sm text-[var(--muted)]">Order #{orderId}</p>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--dark-yellow)]">
                  Progress
                </div>
                <div className="text-lg font-semibold text-[var(--navy)]">{progress}%</div>
              </div>
              <div className="mt-3 h-3 w-full rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[var(--deep-blue)] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                {historySteps.map((step, index) => (
                  <li
                    key={step}
                    className={`flex items-center gap-2 ${index <= historyIndex ? 'font-semibold text-[var(--navy)]' : ''}`}
                  >
                    <span className="h-2 w-2 rounded-full bg-[var(--dark-yellow)]" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card p-6 space-y-3">
            <h2 className="text-xl font-semibold text-[var(--navy)]">Order summary</h2>
            {currentOrder ? (
              <>
                <div className="text-sm text-[var(--muted)]">Status: {currentOrder.status}</div>
                <div className="text-sm text-[var(--muted)]">
                  Courier: {currentOrder.courier.name} {currentOrder.courier.surname} {currentOrder.courier.license_plate ? `(${currentOrder.courier.license_plate})` : ''}
                </div>
                <div className="text-sm text-[var(--muted)]">
                  Delivery address: {currentOrder.address.street}, {currentOrder.address.city} {currentOrder.address.postcode}
                </div>
                <div className="text-sm font-semibold text-[var(--navy)]">
                  Payment: {currentOrder.payment.status} ({currentOrder.payment.method})
                </div>
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">Loading order details...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({ userData: state.user.user });

export default connect(mapStateToProps)(DeliveryPage);
