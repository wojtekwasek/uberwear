import React from 'react';
import { AccountSidebar } from './AccountSidebar';

export function AccountPageReturns() {
  return (
    <div className="min-h-[60vh] bg-[var(--soft-surface)] text-[var(--base)]">
      <div className="page-container py-10 space-y-6">
        <AccountSidebar />
        <h1 className="text-3xl font-semibold">Returns</h1>
        <p className="text-sm text-[var(--muted)]">
          Return handling is optional in this UI. When connected to the backend, partial returns can update stock and
          refund amounts. This space stays minimal until those endpoints are wired.
        </p>
      </div>
    </div>
  );
}

export default AccountPageReturns;
