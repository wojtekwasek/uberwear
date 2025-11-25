import React from 'react';

export function ContactPage() {
  return (
    <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--navy)]">
      <div className="page-container py-12">
        <div className="card p-8">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--dark-yellow)]">
              Contact
            </div>
            <h1 className="text-3xl font-semibold">Need a quick answer?</h1>
            <p className="text-[var(--muted)] leading-relaxed">
              Drop us a line if you want to onboard your shop, report an issue, or ask about the project. We keep replies
              short and practical.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--dark-yellow)]/30 bg-white px-4 py-3">
                <div className="text-sm font-semibold text-[var(--navy)]">Email</div>
                <div className="text-sm text-[var(--muted)]">contact@uberwear.app</div>
              </div>
              <div className="rounded-2xl border border-[var(--dark-yellow)]/30 bg-white px-4 py-3">
                <div className="text-sm font-semibold text-[var(--navy)]">Phone</div>
                <div className="text-sm text-[var(--muted)]">+48 123 456 789</div>
              </div>
              <div className="rounded-2xl border border-[var(--dark-yellow)]/30 bg-white px-4 py-3 sm:col-span-2">
                <div className="text-sm font-semibold text-[var(--navy)]">Join as a shop owner</div>
                <div className="text-sm text-[var(--muted)]">
                  Tell us about your store and we will plug you into the Uberwear catalog. Minimal paperwork, quick setup,
                  and clear status updates.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
