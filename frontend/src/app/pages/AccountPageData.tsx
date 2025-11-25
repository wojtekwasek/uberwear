import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { enqueueSnackbar } from 'notistack';
import { AccountSidebar } from './AccountSidebar';
import { getUserInfo, updateUserInfo } from '../requests';
import { UserData } from '../redux/userSlice';
import { RootState } from '../store/mainStore';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

function AccountPageData({ userData }: { userData: UserData }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentField, setCurrentField] = useState<keyof FormData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '********',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo(userData.access);
        setFormData({
          firstName: userInfo.user.name,
          lastName: userInfo.user.surname,
          email: userInfo.user.email,
          phone: userInfo.user.phone,
          password: '********',
        });
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, [userData.access]);

  const handleEditClick = (field: keyof FormData) => {
    setCurrentField(field);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setCurrentField(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentField) {
      setFormData({
        ...formData,
        [currentField]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserInfo(userData.access, formData);
      enqueueSnackbar('Profile updated', { variant: 'success' });
      closePopup();
    } catch (error) {
      console.error('Failed to update user info:', error);
      enqueueSnackbar('Could not update profile', { variant: 'error' });
    }
  };

  return (
    <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--base)]">
      <div className="page-container py-10 space-y-6">
        <AccountSidebar />
        <h1 className="text-3xl font-semibold">Your profile</h1>
        <div className="space-y-4">
          {Object.entries(formData).map(([field, value]) => (
            <div
              key={field}
              className="card flex items-center justify-between gap-4 p-4"
            >
              <div className="text-sm text-[var(--muted)]">
                <span className="font-semibold text-[var(--base)] capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>
                <span className="ml-2 text-[var(--base)]">{value}</span>
              </div>
              <button
                className="pill-button"
                onClick={() => handleEditClick(field as keyof FormData)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        {isPopupOpen && currentField && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-semibold text-[var(--base)]">
                Update {currentField.replace(/([A-Z])/g, ' $1')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--muted)]">
                    New value
                  </label>
                  <input
                    type={currentField === 'password' ? 'password' : 'text'}
                    value={formData[currentField]}
                    onChange={handleChange}
                    className="text-search-input w-full"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closePopup}
                    className="ghost-button"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="pill-button">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({ userData: state.user.user });

export default connect(mapStateToProps)(AccountPageData);
