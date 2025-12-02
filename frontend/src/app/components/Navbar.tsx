import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import mainLogo from '../../images/main-logo.png';
import { setUserDataThunk, UserData } from '../redux/userSlice';
import { AppDispatch, RootState } from '../store/mainStore';

interface Props {
    userData: UserData;
    setUserData(data: UserData): void;
}

function Navbar({ userData, setUserData }: Props) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        setUserData({
            access: '',
            type: '',
            name: '',
            lastname: '',
            email: '',
            clid: '',
            loyalty_points: '',
            coid: '',
        });
        navigate('/');
        enqueueSnackbar('Signed out successfully', { variant: 'success' });
    };

    const navLinks = [
        { label: 'Home', onClick: () => navigate('/') },
        { label: 'Stores', onClick: () => navigate('/offer') },
        { label: 'About', onClick: () => navigate('/about') },
        { label: 'Contact', onClick: () => navigate('/contact') },
    ];

    if (userData.type === 'Admin') {
        navLinks.push({ label: 'Admin', onClick: () => navigate('/admin') });
    }
    if (userData.type === 'Courier') {
        navLinks.push({ label: 'Courier', onClick: () => navigate('/courier') });
    }

    const MenuButton = () => (
        <button
            type="button"
            aria-label="Toggle navigation"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white sm:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
        >
            <div className="relative h-6 w-6">
                <span
                    className={`absolute left-0 block h-0.5 w-6 bg-white transition-all duration-200 ${
                        menuOpen ? 'top-3 rotate-45' : 'top-1'
                    }`}
                />
                <span
                    className={`absolute left-0 block h-0.5 w-6 bg-white transition-all duration-200 ${
                        menuOpen ? 'opacity-0' : 'top-3'
                    }`}
                />
                <span
                    className={`absolute left-0 block h-0.5 w-6 bg-white transition-all duration-200 ${
                        menuOpen ? 'top-3 -rotate-45' : 'top-5'
                    }`}
                />
            </div>
        </button>
    );

    const LinkButtons = () => (
        <>
            {navLinks.map((link) => (
                <button
                    key={link.label}
                    type="button"
                    className="ghost-button text-white sm:text-[var(--base)]"
                    onClick={() => {
                        link.onClick();
                        setMenuOpen(false);
                    }}
                >
                    {link.label}
                </button>
            ))}
            <button
                type="button"
                className="ghost-button text-white sm:text-[var(--base)]"
                onClick={() => {
                    navigate('/cart');
                    setMenuOpen(false);
                }}
            >
                Cart
            </button>
            {userData.type && userData.name ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                    <button
                        type="button"
                        className="ghost-button text-white sm:text-[var(--base)]"
                        onClick={() => {
                            if (userData.type === 'Admin') navigate('/admin');
                            else if (userData.type === 'Courier') navigate('/courier');
                            else navigate('/account/data');
                            setMenuOpen(false);
                        }}
                    >
                        Hi, {userData.name}
                    </button>
                    <button
                        type="button"
                        className="pill-button bg-[var(--dark-yellow)] text-[var(--base)] border-[var(--dark-yellow)]"
                        onClick={() => {
                            handleLogout();
                            setMenuOpen(false);
                        }}
                    >
                        Sign out
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                    <button
                        type="button"
                        className="ghost-button text-white sm:text-[var(--base)]"
                        onClick={() => {
                            navigate('/login');
                            setMenuOpen(false);
                        }}
                    >
                        Sign in
                    </button>
                    <button
                        type="button"
                        className="pill-button"
                        onClick={() => {
                            navigate('/create-account');
                            setMenuOpen(false);
                        }}
                    >
                        Create account
                    </button>
                </div>
            )}
        </>
    );

    return (
        <nav
            className="sticky top-0 z-50 border-b border-slate-200 text-[var(--base)] shadow-sm backdrop-blur"
            style={{
                background: 'linear-gradient(90deg, #0C2E83 41%, rgba(0,0,0,0.83) 100%)',
            }}
        >
            <div className="page-container flex items-center justify-between py-3">
                <div
                    className="flex cursor-pointer items-center gap-3 rounded-full px-2 py-1 transition hover:-translate-y-0.5"
                    onClick={() => navigate('/')}
                >
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[var(--dark-yellow)] shadow-sm">
                        <img src={mainLogo} alt="Uberwear logo" className="h-7 w-7 object-contain" />
                    </div>
                    <div className="leading-tight">
                        <div className="text-lg font-semibold text-white">Uberwear</div>
                        <div className="text-xs text-white/80">clothing delivery</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden flex-wrap items-center justify-end gap-2 sm:flex sm:gap-3">
                        <LinkButtons />
                    </div>
                    <MenuButton />
                </div>
            </div>

            {menuOpen && (
                <div className="sm:hidden">
                    <div className="flex flex-col gap-3 border-t border-white/20 bg-[rgba(0,0,0,0.65)] px-4 py-4 text-white">
                        <LinkButtons />
                    </div>
                </div>
            )}
        </nav>
    );
}

const mapStateToProps = (state: RootState) => ({ userData: state.user.user });

function mapDispatchToProps(dispatch: AppDispatch) {
    return {
        setUserData: (data: UserData) => dispatch(setUserDataThunk(data)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
