import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { UserData } from '../../redux/userSlice';
import { AdminSidebar } from './Sidebar';
import { RootState } from '../../store/mainStore';
import { Order } from '../../models/Order';
import { getOrderDetails, requestCancelOrder, requestDeleteOrder } from './adminRequests';
import { translateStatus } from './AdminOrders';
import { CancelIcon, DeleteIcon } from '../../components/SVG';

export const translatePaymentStatus = (status: string) => {
    switch (status) {
        case 'Done':
            return 'Paid';
        case 'Awaits':
            return 'Awaiting payment';
        case 'Canceled':
            return 'Cancelled';
        default:
            return status;
    }
};

export const getTotalPrice = (order: Order) => {
    return order.products.reduce((acc, product) => acc + product.product.price * product.ordered_amount, 0);
};

function OrderDetails({ userData }: { userData: UserData }) {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);

    const fetchOrder = async () => {
        try {
            if (orderId !== undefined) {
                const fetched = await getOrderDetails(userData.access, orderId);
                setOrder(fetched);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const cancelOrder = async () => {
        if (!orderId) return;
        try {
            await requestCancelOrder(userData.access, orderId);
            enqueueSnackbar('Order cancelled', { variant: 'success' });
            fetchOrder();
        } catch (error) {
            console.error('Failed to cancel order:', error);
        }
    };

    const deleteOrder = async () => {
        if (!orderId) return;
        try {
            await requestDeleteOrder(userData.access, orderId);
            enqueueSnackbar('Order removed', { variant: 'success' });
            navigate('/admin/orders');
        } catch (error) {
            console.error('Failed to delete order:', error);
        }
    };

    return (
        <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--base)]">
            <div className="page-container py-10 space-y-6">
                <AdminSidebar />
                <h1 className="mb-6 text-3xl font-semibold">Order #{orderId}</h1>

                {order && (
                    <div className="card space-y-4 p-6">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="text-sm text-[var(--muted)]">
                                <div className="text-xs uppercase tracking-[0.12em] text-[var(--dark-yellow)]">Status</div>
                                <div className="text-base font-semibold text-[var(--base)]">{translateStatus(order.status)}</div>
                            </div>
                            <div className="text-sm text-[var(--muted)]">
                                <div className="text-xs uppercase tracking-[0.12em] text-[var(--dark-yellow)]">Date</div>
                                <div className="text-base font-semibold text-[var(--base)]">{order.date}</div>
                            </div>
                            <div className="text-sm text-[var(--muted)]">
                                <div className="text-xs uppercase tracking-[0.12em] text-[var(--dark-yellow)]">Client</div>
                                <button
                                    className="ghost-button mt-1"
                                    onClick={() => navigate(`/admin/clients/${order.client.id}`)}
                                >
                                    {order.client.name} {order.client.surname}
                                </button>
                            </div>
                            <div className="text-sm text-[var(--muted)]">
                                <div className="text-xs uppercase tracking-[0.12em] text-[var(--dark-yellow)]">Payment</div>
                                <div className="text-base font-semibold text-[var(--base)]">
                                    {translatePaymentStatus(order.payment.status)} ({order.payment.method})
                                </div>
                            </div>
                            <div className="text-sm text-[var(--muted)]">
                                <div className="text-xs uppercase tracking-[0.12em] text-[var(--dark-yellow)]">Courier</div>
                                <button
                                    className="ghost-button mt-1"
                                    onClick={() => navigate(`/admin/couriers/${order.courier.id}`)}
                                >
                                    {order.courier.name} {order.courier.surname}{' '}
                                    {order.courier.license_plate ? `(${order.courier.license_plate})` : ''}
                                </button>
                            </div>
                            <div className="text-sm text-[var(--muted)]">
                                <div className="text-xs uppercase tracking-[0.12em] text-[var(--dark-yellow)]">Address</div>
                                <div className="text-base font-semibold text-[var(--base)]">
                                    {order.address.street}, {order.address.city} {order.address.postcode}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4">
                            <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--dark-yellow)]">
                                Products
                            </div>
                            <div className="mt-2 space-y-2 text-sm text-[var(--muted)]">
                                {order.products.map((product) => (
                                    <div key={product.product.id} className="flex items-center justify-between">
                                        <span>{product.product.name} ({product.ordered_amount} pcs)</span>
                                        <span>{product.product.price} PLN</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 flex justify-end text-base font-semibold text-[var(--base)]">
                                Total {getTotalPrice(order)} PLN
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {order.status !== 'Canceled' && order.status !== 'Delivered' && (
                                <button
                                    className="ghost-button bg-orange-100 text-orange-800"
                                    onClick={cancelOrder}
                                >
                                    <CancelIcon width={20} height={20} color="text-orange-600" />
                                    Cancel order
                                </button>
                            )}
                            <button
                                className="ghost-button bg-red-100 text-red-800"
                                onClick={deleteOrder}
                            >
                                <DeleteIcon width={20} height={20} color="text-red-600" />
                                Delete order
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({ userData: state.user.user });

export default connect(mapStateToProps)(OrderDetails);
