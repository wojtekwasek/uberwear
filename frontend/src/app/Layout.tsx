import { Outlet, useNavigation } from 'react-router-dom';
import ScrollToTop from 'react-scroll-to-top';
import Navbar from './components/Navbar';

export function Layout() {
    const navigation = useNavigation();

    return (
        <>
            <div className="min-h-screen bg-[var(--soft-surface)] text-[var(--text)]">
                <Navbar />

                <main className="flex-1">
                    {navigation.state === 'loading' && (
                        <div className="flex items-center justify-center py-6 text-sm text-[var(--muted)]">
                            Loading...
                        </div>
                    )}
                    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
                        <Outlet />
                    </div>
                </main>
            </div>
            <ScrollToTop
                smooth
                className="flex items-center justify-center border border-[var(--dark-yellow)] bg-white text-[var(--base)] shadow-sm"
                viewBox="0 0 256 256"
            />
        </>
    );
}

