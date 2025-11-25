import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AccountSidebar } from './AccountSidebar';
import { getLoyaltyPoints } from '../requests';
import { RootState } from '../store/mainStore';
import { UserData } from '../redux/userSlice';

export function AccountPagePoints({ userData }: { userData: UserData }) {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const data = await getLoyaltyPoints(userData.access);
        setPoints(data);
      } catch (error) {
        console.error('Failed to fetch points:', error);
      }
    };

    fetchPoints();
  }, [userData.access]);

  return (
    <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--base)]">
      <div className="page-container py-10 space-y-6">
        <AccountSidebar />
        <h1 className="text-3xl font-semibold">Loyalty points</h1>
        <div className="card p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--dark-yellow)]">
            Current balance
          </div>
          <div className="mt-3 text-4xl font-bold text-[var(--base)]">{points}</div>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Points are added for paid and delivered orders. Keep shopping to unlock perks.
          </p>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({ userData: state.user.user });

export default connect(mapStateToProps)(AccountPagePoints);
