import React from 'react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[var(--soft-surface)]">
      <div className="page-container grid gap-10 py-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-[var(--dark-yellow)]/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--base)]">
            Uberwear · clothing hub
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-[var(--base)] sm:text-5xl">
            Browse clothing stores, add to cart, and check out with a clean, minimal interface.
          </h1>
          <p className="text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Explore shops, colors, and sizes, keep a lightweight cart, and finish payment and delivery without extra noise.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="pill-button text-sm sm:text-base" onClick={() => navigate('/offer')}>
              Browse stores
            </button>
            <button className="ghost-button text-sm sm:text-base" onClick={() => navigate('/create-account')}>
              Create account
            </button>
          </div>
        </div>

        <div className="card relative overflow-hidden p-6 shadow-lg">
          <div className="absolute -left-10 -top-16 h-44 w-44 rounded-full bg-[var(--base)]/10 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-[var(--deep-blue)]/10 blur-3xl" />
          <div className="relative space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--base)]">What you can do</h2>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li className="flex items-start gap-2">
                <span className="mt-[2px] inline-block h-2 w-2 rounded-full bg-[var(--dark-yellow)]" />
                Explore stores by category and color, and view product details without signing in.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[2px] inline-block h-2 w-2 rounded-full bg-[var(--deep-blue)]" />
                Build a quick cart and move through payment and delivery steps without clutter.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[2px] inline-block h-2 w-2 rounded-full bg-[var(--dark-yellow)]" />
                Sign in to track orders, view loyalty points, and manage account details.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
