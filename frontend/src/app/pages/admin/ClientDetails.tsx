import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { UserData } from '../../redux/userSlice';
import { AdminSidebar } from './Sidebar';
import { RootState } from '../../store/mainStore';
import { Order } from '../../models/Order';
import {
    getClientDetails,
    getClientOrders,
    requestActivateUser,
    requestCancelOrder,
    requestDeactivateUser,
    requestDeleteOrder,
} from './adminRequests';
import { translateStatus } from './AdminOrders';
import { CancelIcon, DeleteIcon, LockIcon, UnlockIcon } from '../../components/SVG';
import { Client } from '../../models/Client';

function ClientDetails({ userData }: { userData: UserData }) {
    const { clientId } = useParams<{ clientId: string }>();
    const navigate = useNavigate();
    const [client, setClient] = useState<Client | null>(null);
    const [clientOrders, setClientOrders] = useState<Order[]>([]);

    const fetchClient = async () => {
        try {
            if (clientId !== undefined) {
                const data = await getClientDetails(userData.access, clientId);
                setClient(data);
            }
        } catch (error) {
            console.error('Failed to fetch client:', error);
        }
    };

    const fetchClientOrders = async () => {
        try {
            if (clientId !== undefined) {
                const orders = await getClientOrders(userData.access, clientId);
                setClientOrders(orders);
            }
        } catch (error) {
            console.error('Failed to fetch client orders:', error);
        }
    };

    useEffect(() => {
        fetchClient();
        fetchClientOrders();
    }, [clientId]);

    const deactivateClient = async () => {
        if (!client) return;
        try {
            await requestDeactivateUser(userData.access, client.user_ID.toString());
            enqueueSnackbar('Client deactivated', { variant: 'success' });
            fetchClient();
        } catch (error) {
            console.error('Failed to deactivate client:', error);
        }
    };

    const activateClient = async () => {
        if (!client) return;
        try {
            await requestActivateUser(userData.access, client.user_ID.toString());
            enqueueSnackbar('Client activated', { variant: 'success' });
            fetchClient();
        } catch (error) {
            console.error('Failed to activate client:', error);
        }
    };

    const cancelOrder = async (orderId: number) => {
        try {
            await requestCancelOrder(userData.access, orderId.toString());
            enqueueSnackbar('Order cancelled', { variant: 'success' });
            fetchClientOrders();
        } catch (error) {
            console.error('Failed to cancel order:', error);
        }
    };

    const deleteOrder = async (orderId: number) => {
        try {
            await requestDeleteOrder(userData.access, orderId.toString());
            enqueueSnackbar('Order deleted', { variant: 'success' });
            fetchClientOrders();
        } catch (error) {
            console.error('Failed to delete order:', error);
        }
    };

    return (
        <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--base)]">
            <div className="page-container py-10 space-y-6">
                <AdminSidebar />
                <div className="space-y-6">
                    <h1 className="text-3xl font-semibold">Client details</h1>

                    {client && (
                        <div className="card p-6 space-y-3">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <div className="text-lg font-semibold">
                                        {client.name} {client.surname}
                                    </div>
                                    <div className="text-sm text-[var(--muted)]">ID: {client.client_ID}</div>
                                </div>
                                <div className="flex gap-2">
                                    {client.status === 'Active' ? (
                                        <button className="ghost-button bg-red-100 text-red-800" onClick={deactivateClient}>
                                            <LockIcon width={18} height={18} color="text-red-700" />
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button className="ghost-button bg-emerald-100 text-emerald-800" onClick={activateClient}>
                                            <UnlockIcon width={18} height={18} color="text-emerald-700" />
                                            Activate
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="text-sm text-[var(--muted)]">Email: {client.email}</div>
                                <div className="text-sm text-[var(--muted)]">Phone: {client.phone}</div>
                                <div className="text-sm text-[var(--muted)]">Loyalty points: {client.loyalty_points}</div>
                                <div className="text-sm text-[var(--muted)]">Status: {client.status}</div>
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 className="text-2xl font-semibold mb-3">Orders</h2>
                        <div className="flex flex-col gap-4">
                            {clientOrders.length === 0 && (
                                <p className="text-sm text-[var(--muted)]">No orders for this client.</p>
                            )}
                            {clientOrders.map((order) => (
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

export default connect(mapStateToProps)(ClientDetails);
