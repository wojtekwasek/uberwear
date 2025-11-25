import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { loginRequest, getUserInfo, getClientID, getLoyaltyPoints, getCourierID } from '../requests';
import { AppDispatch, RootState } from '../store/mainStore';
import { setUserDataThunk, UserData } from '../redux/userSlice';
import { useCart } from './CartContext';

interface Props {
  userData: UserData;
  setUserData: (data: UserData) => void;
}

function LogInPage({ setUserData }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { clearCart } = useCart();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { status, data } = await loginRequest(email, password);
      if (status === 400) {
        enqueueSnackbar('Login failed - wrong credentials', { variant: 'error' });
        return;
      }
      if (data.access_token) {
        const userInfo = await getUserInfo(data.access_token);
        const clientID = await getClientID(data.access_token);
        const loyaltyPoints = await getLoyaltyPoints(data.access_token);
        const courierID = await getCourierID(data.access_token);

        setUserData({
          type: userInfo.user.user_type,
          name: userInfo.user.name,
          lastname: userInfo.user.surname,
          email: userInfo.user.email,
          access: data.access_token,
          clid: clientID,
          loyalty_points: loyaltyPoints,
          coid: courierID,
        });
        clearCart();

        if (userInfo.user.user_type === 'Admin') {
          navigate('/admin');
          enqueueSnackbar(`Signed in as admin, welcome ${userInfo.user.name}!`, { variant: 'success' });
        } else if (userInfo.user.user_type === 'Courier') {
          navigate('/courier');
          enqueueSnackbar(`Signed in as courier, welcome ${userInfo.user.name}!`, { variant: 'success' });
        } else if (userInfo.user.user_type === 'Client') {
          navigate('/account/data');
          enqueueSnackbar(`Signed in, welcome ${userInfo.user.name}!`, { variant: 'success' });
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      enqueueSnackbar('Login failed - server not available', { variant: 'error' });
    }
  };

  return (
    <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--navy)]">
      <div className="page-container py-10">
        <div className="mx-auto max-w-lg card p-8">
          <h1 className="text-3xl font-semibold text-[var(--navy)]">Sign in</h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--navy)]">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-search-input w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--navy)]">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-search-input w-full"
                required
              />
            </div>
            <button type="submit" className="pill-button w-full">
              Sign in
            </button>
            <button
              type="button"
              className="ghost-button w-full"
              onClick={() => navigate('/create-account')}
            >
              Need an account? Join Uberwear
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({ userData: state.user.user });

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    setUserData: (data: UserData) => dispatch(setUserDataThunk(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogInPage);
