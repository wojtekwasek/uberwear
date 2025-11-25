import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { connect } from 'react-redux';
import { getOrdersByCourier, deliverOrder } from '../requests';
import { UserData } from '../redux/userSlice';
import { Order } from '../models/Order';
import { RootState } from '../store/mainStore';

export function CourierPanelPage({ userData }: { userData: UserData }) {
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            const data = await getOrdersByCourier(userData.access, userData.coid);
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [userData.access]);

    const handleDeliverOrder = async (orderId: number) => {
        await deliverOrder(userData.access, orderId);
        fetchOrders();
    };

    return (
        <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--navy)]">
            <div className="page-container py-10 space-y-6">
                <div>
                    <h1 className="text-3xl font-semibold">Courier panel</h1>
                    <p className="text-sm text-[var(--muted)]">Mark deliveries and keep an eye on assigned orders.</p>
                </div>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="card p-5 space-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-semibold">Order #{order.id}</div>
                                    <div className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                                        {order.status}
                                    </div>
                                </div>
                                <div className="text-sm text-[var(--muted)]">Placed {order.date}</div>
                            </div>
                            <div className="text-sm text-[var(--muted)]">
                                Address: {order.address.city}, {order.address.street} {order.address.postcode}
                            </div>
                            <div className="text-sm text-[var(--muted)]">
                                Products:
                                <ul className="ml-4 list-disc">
                                    {order.products.map((product, idx) => (
                                        <li key={idx}>
                                            {product.product.name} - {product.ordered_amount} pcs - {product.product.price} PLN
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                className="pill-button w-fit"
                                onClick={() => order.status !== 'Finalized' && handleDeliverOrder(order.id)}
                                disabled={order.status === 'Finalized'}
                            >
                                {order.status === 'Finalized' ? 'Delivered' : 'Mark as delivered'}
                            </button>
                        </div>
                    ))}
                    {orders.length === 0 && (
                        <p className="text-sm text-[var(--muted)]">No orders assigned.</p>
                    )}
                </div>
                <Outlet />
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({ userData: state.user.user });

export default connect(mapStateToProps)(CourierPanelPage);
