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

                <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                    {navLinks.map((link) => (
                        <button
                            key={link.label}
                            type="button"
                            className="ghost-button"
                            onClick={link.onClick}
                        >
                            {link.label}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="ghost-button"
                        onClick={() => navigate('/cart')}
                    >
                        Cart
                    </button>
                    {userData.type && userData.name ? (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="ghost-button"
                                onClick={() => {
                                    if (userData.type === 'Admin') navigate('/admin');
                                    else if (userData.type === 'Courier') navigate('/courier');
                                    else navigate('/account/data');
                                }}
                            >
                                Hi, {userData.name}
                            </button>
                            <button
                                type="button"
                                className="pill-button bg-[var(--dark-yellow)] text-[var(--base)] border-[var(--dark-yellow)]"
                                onClick={handleLogout}
                            >
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="ghost-button"
                                onClick={() => navigate('/login')}
                            >
                                Sign in
                            </button>
                            <button
                                type="button"
                                className="pill-button"
                                onClick={() => navigate('/create-account')}
                            >
                                Create account
                            </button>
                        </div>
                    )}
                </div>
            </div>
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
