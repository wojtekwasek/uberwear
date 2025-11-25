import React from 'react';

export function AboutPage() {
  return (
    <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--base)]">
      <div className="page-container py-12">
        <div className="card p-8">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--dark-yellow)]">
              About Uberwear
            </div>
            <h1 className="text-3xl font-semibold">We connect convenience, style, and speed</h1>
            <p className="text-[var(--muted)] leading-relaxed">
              Welcome to UberWear — your trusted partner for clothing delivery. Our mission is to blend comfort, style,
              and speed into one experience that changes how you shop for clothes.
            </p>
            <p className="text-[var(--muted)] leading-relaxed">
              With smart logistics and partnerships with top brands, your order gets to you faster than ever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
