import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { AdminSidebar } from './Sidebar';
import { UserData } from '../../redux/userSlice';
import { RootState } from '../../store/mainStore';
import { PhoneIcon, MailIcon } from '../../components/SVG';
import { Courier } from '../../models/Courier';
import { getCouriers } from './adminRequests';

const AdminCouriers = ({ userData }: { userData: UserData }) => {
    const [couriersList, setCouriersList] = useState<Courier[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const [pageSize] = useState(10);

    const fetchCouriers = async (start: number) => {
        try {
            const couriers = await getCouriers(userData.access, start, pageSize);
            setCouriersList(couriers);
        } catch (error) {
            console.error('Failed to fetch couriers:', error);
        }
    };

    useEffect(() => {
        fetchCouriers(startIndex);
    }, [startIndex]);

    return (
        <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--base)]">
            <div className="page-container py-10 space-y-6">
                <AdminSidebar />
                <h1 className="mb-6 text-3xl font-semibold">Couriers</h1>
                <div className="flex flex-col gap-4">
                    {couriersList.length === 0 && (
                        <p className="text-sm text-[var(--muted)]">No couriers.</p>
                    )}
                    {couriersList.map((courier) => (
                        <Link
                            to={`/admin/couriers/${courier.courier_ID}`}
                            key={courier.courier_ID}
                            className="card flex items-center justify-between p-4 text-left transition hover:-translate-y-1"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {courier.name} {courier.surname} (ID:{courier.courier_ID})
                                </h2>
                                <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                                    {courier.delivery_transport} {courier.license_plate ? `· ${courier.license_plate}` : ''}
                                </p>
                            </div>
                            <div className="flex flex-col items-end text-sm text-[var(--muted)]">
                                <div className="flex items-center gap-2">
                                    <PhoneIcon width={18} height={18} color="text-gray-500" />
                                    <span>{courier.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MailIcon width={18} height={18} color="text-gray-500" />
                                    <span>{courier.email}</span>
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
                        disabled={couriersList.length < pageSize}
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

export default connect(mapStateToProps)(AdminCouriers);
