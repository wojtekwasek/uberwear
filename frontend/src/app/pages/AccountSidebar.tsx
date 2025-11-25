import { Link } from 'react-router-dom';

export function AccountSidebar() {
    const links = [
        { label: 'Profile', to: '/account/data' },
        { label: 'Orders', to: '/account/orders' },
        { label: 'Points', to: '/account/points' },
        { label: 'Favorite brands', to: '/account/favbrands' },
    ];

    return (
        <nav className="w-full">
            <ul className="m-0 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                {links.map((link) => (
                    <li key={link.to} className="list-none">
                        <Link
                            to={link.to}
                            className="ghost-button text-sm"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
