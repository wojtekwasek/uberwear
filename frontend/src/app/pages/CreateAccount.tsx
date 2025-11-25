import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../requests';

export function CreateAccountPage() {
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const name = formData.get('name') as string;
    const surname = formData.get('surname') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const city = formData.get('city') as string;
    const district = formData.get('district') as string;
    const postcode = formData.get('postcode') as string;
    const street = formData.get('street') as string;

    if (password !== confirmPassword) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }

    const { status } = await createAccount(
      email,
      password,
      name,
      surname,
      phone,
      street,
      city,
      postcode,
      district
    );

    if (status === 200) {
      enqueueSnackbar('Account created', { variant: 'success' });
      navigate('/login');
    } else {
      enqueueSnackbar('There was an error creating your account', { variant: 'error' });
    }
  };

  return (
    <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--navy)]">
      <div className="page-container py-10">
        <div className="mx-auto max-w-3xl card p-8">
          <h1 className="text-3xl font-semibold text-[var(--navy)]">Create account</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Keep it minimal: a few fields to start using Uberwear.</p>
          <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--navy)]">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="text-search-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--navy)]">Phone number</label>
              <input
                name="phone"
                type="text"
                required
                placeholder="+48 000 000 000"
                className="text-search-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--navy)]">First name</label>
              <input
                name="name"
                type="text"
                required
                placeholder="First name"
                className="text-search-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--navy)]">Last name</label>
              <input
                name="surname"
                type="text"
                required
                placeholder="Last name"
                className="text-search-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--navy)]">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                className="text-search-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--navy)]">Confirm password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="Repeat password"
                className="text-search-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--navy)]">City</label>
              <input
                name="city"
                type="text"
                required
                placeholder="City"
                className="text-search-input w-full"
              />
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-semibold text-[var(--navy)]">Street</label>
              <input
                name="street"
                type="text"
                required
                placeholder="Street and number"
                className="text-search-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--navy)]">Postcode</label>
              <input
                name="postcode"
                type="text"
                required
                placeholder="00-000"
                className="text-search-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--navy)]">District</label>
              <input
                name="district"
                type="text"
                required
                placeholder="District"
                className="text-search-input w-full"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <button type="submit" className="pill-button w-full">
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
