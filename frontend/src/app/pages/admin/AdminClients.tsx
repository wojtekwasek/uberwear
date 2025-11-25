import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { AdminSidebar } from './Sidebar';
import { UserData } from '../../redux/userSlice';
import { RootState } from '../../store/mainStore';
import { PhoneIcon, MailIcon } from '../../components/SVG';
import { getClients } from './adminRequests';
import { Client } from '../../models/Client';

const AdminClients = ({ userData }: { userData: UserData }) => {
    const [clientList, setClientList] = useState<Client[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const [pageSize] = useState(10);

    const fetchClients = async (start: number) => {
        try {
            const clients = await getClients(userData.access, start, pageSize);
            setClientList(clients);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        }
    };

    useEffect(() => {
        fetchClients(startIndex);
    }, [startIndex]);

    return (
        <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--base)]">
            <div className="page-container py-10 space-y-6">
                <AdminSidebar />
                <h1 className="text-3xl font-semibold mb-6">All clients</h1>
                <div className="flex flex-col gap-4">
                    {clientList.length === 0 && (
                        <p className="text-sm text-[var(--muted)]">No clients found.</p>
                    )}
                    {clientList.map((client) => (
                        <Link
                            to={`/admin/clients/${client.client_ID}`}
                            key={client.client_ID}
                            className="card flex items-center justify-between p-4 text-left transition hover:-translate-y-1"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {client.name} {client.surname} (ID:{client.client_ID})
                                </h2>
                                <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                                    {client.status === 'Active' ? 'Active' : 'Inactive'}, {client.loyalty_points} points
                                </p>
                            </div>
                            <div className="flex flex-col items-end text-sm text-[var(--muted)]">
                                <div className="flex items-center gap-2">
                                    <PhoneIcon width={18} height={18} color="text-gray-500" />
                                    <span>{client.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MailIcon width={18} height={18} color="text-gray-500" />
                                    <span>{client.email}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="flex justify-between">
                    <button
                        onClick={() => setStartIndex(Math.max(0, startIndex - pageSize))}
                        disabled={startIndex === 0}
                        className="ghost-button disabled:opacity-50"
                    >
                        Previous page
                    </button>
                    <button
                        onClick={() => setStartIndex(startIndex + pageSize)}
                        disabled={clientList.length < pageSize}
                        className="ghost-button disabled:opacity-50"
                    >
                        Next page
                    </button>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({ userData: state.user.user });

export default connect(mapStateToProps)(AdminClients);
