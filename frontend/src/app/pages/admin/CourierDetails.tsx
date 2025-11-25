import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { UserData } from '../../redux/userSlice';
import { AdminSidebar } from './Sidebar';
import { RootState } from '../../store/mainStore';
import { Order } from '../../models/Order';
import {
    getCourierDetails,
    getCourierOrders,
    requestActivateUser,
    requestCancelOrder,
    requestDeactivateUser,
    requestDeleteOrder,
} from './adminRequests';
import { translateStatus } from './AdminOrders';
import { CancelIcon, DeleteIcon, LockIcon, UnlockIcon } from '../../components/SVG';
import { Courier } from '../../models/Courier';

function CourierDetails({ userData }: { userData: UserData }) {
    const { courierId } = useParams<{ courierId: string }>();
    const navigate = useNavigate();

    const [courier, setCourier] = useState<Courier | null>(null);
    const [courierOrders, setCourierOrders] = useState<Order[]>([]);

    const fetchCourier = async () => {
        try {
            if (courierId !== undefined) {
                const data = await getCourierDetails(userData.access, courierId);
                setCourier(data);
            }
        } catch (error) {
            console.error('Failed to fetch courier:', error);
        }
    };

    const fetchCourierOrders = async () => {
        try {
            if (courierId !== undefined) {
                const orders = await getCourierOrders(userData.access, courierId);
                setCourierOrders(orders);
            }
        } catch (error) {
            console.error('Failed to fetch courier orders:', error);
        }
    };

    useEffect(() => {
        fetchCourier();
        fetchCourierOrders();
    }, [courierId]);

    const deactivateCourier = async () => {
        if (!courier) return;
        try {
            await requestDeactivateUser(userData.access, courier.user_ID.toString());
            enqueueSnackbar('Courier deactivated', { variant: 'success' });
            fetchCourier();
        } catch (error) {
            console.error('Failed to deactivate courier:', error);
        }
    };

    const activateCourier = async () => {
        if (!courier) return;
        try {
            await requestActivateUser(userData.access, courier.user_ID.toString());
            enqueueSnackbar('Courier activated', { variant: 'success' });
            fetchCourier();
        } catch (error) {
            console.error('Failed to activate courier:', error);
        }
    };

    const cancelOrder = async (orderId: number) => {
        try {
            await requestCancelOrder(userData.access, orderId.toString());
            enqueueSnackbar('Order cancelled', { variant: 'success' });
            fetchCourierOrders();
        } catch (error) {
            console.error('Failed to cancel order:', error);
        }
    };

    const deleteOrder = async (orderId: number) => {
        try {
            await requestDeleteOrder(userData.access, orderId.toString());
            enqueueSnackbar('Order deleted', { variant: 'success' });
            fetchCourierOrders();
        } catch (error) {
            console.error('Failed to delete order:', error);
        }
    };

    return (
        <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--base)]">
            <div className="page-container py-10 space-y-6">
                <AdminSidebar />
                <div className="space-y-6">
                    <h1 className="text-3xl font-semibold">Courier details</h1>

                    {courier && (
                        <div className="card p-6 space-y-3">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <div className="text-lg font-semibold">
                                        {courier.name} {courier.surname}
                                    </div>
                                    <div className="text-sm text-[var(--muted)]">ID: {courier.courier_ID}</div>
                                </div>
                                <div className="flex gap-2">
                                    {courier.status === 'Active' ? (
                                        <button className="ghost-button bg-red-100 text-red-800" onClick={deactivateCourier}>
                                            <LockIcon width={18} height={18} color="text-red-700" />
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button className="ghost-button bg-emerald-100 text-emerald-800" onClick={activateCourier}>
                                            <UnlockIcon width={18} height={18} color="text-emerald-700" />
                                            Activate
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="text-sm text-[var(--muted)]">Email: {courier.email}</div>
                                <div className="text-sm text-[var(--muted)]">Phone: {courier.phone}</div>
                                <div className="text-sm text-[var(--muted)]">Transport: {courier.delivery_transport}</div>
                                <div className="text-sm text-[var(--muted)]">
                                    Plate: {courier.license_plate || 'n/a'}
                                </div>
                                <div className="text-sm text-[var(--muted)]">Status: {courier.status}</div>
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 className="text-2xl font-semibold mb-3">Orders</h2>
                        <div className="flex flex-col gap-4">
                            {courierOrders.length === 0 && (
                                <p className="text-sm text-[var(--muted)]">No orders for this courier.</p>
                            )}
                            {courierOrders.map((order) => (
                                <div key={order.id} className="card p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="text-base font-semibold">Order #{order.id}</div>
                                        <div className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                                            {translateStatus(order.status)}
                                        </div>
                                    </div>
                                    <div className="text-sm text-[var(--muted)]">Date: {order.date}</div>
                                    <div className="flex flex-wrap gap-2">
                                        <button className="ghost-button text-xs" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                                            Open
                                        </button>
                                        {order.status !== 'Canceled' && (
                                            <button className="ghost-button bg-orange-100 text-orange-800 text-xs" onClick={() => cancelOrder(order.id)}>
                                                <CancelIcon width={16} height={16} color="text-orange-700" />
                                                Cancel
                                            </button>
                                        )}
                                        <button className="ghost-button bg-red-100 text-red-800 text-xs" onClick={() => deleteOrder(order.id)}>
                                            <DeleteIcon width={16} height={16} color="text-red-700" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({ userData: state.user.user });

export default connect(mapStateToProps)(CourierDetails);
