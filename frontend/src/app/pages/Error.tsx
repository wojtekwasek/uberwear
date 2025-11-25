import { useNavigate, useRouteError } from 'react-router-dom';

const defaultError = 503;

const routeErrors: Record<number, { title: string; description: string }> = {
    400: { title: 'Missing data', description: 'There is nothing to show right now.' },
    401: { title: 'No access', description: 'You need to be signed in to view this page.' },
    404: { title: 'Page not found', description: 'The page does not exist. Check the URL.' },
    422: { title: 'Page not found', description: 'The page does not exist. Check the URL.' },
    500: { title: 'Server error', description: 'No response from the server.' },
    503: { title: 'Server error', description: 'No response from the server.' },
};

interface ErrorProps {
    status: number;
}

export function RouteError() {
    let routeError: any = useRouteError();

    if (!routeError || !routeError.status) {
        routeError = { status: defaultError };
    }

    return (
        <div className="box-border min-h-full flex flex-col">
            <main className="w-full flex-grow page-container">
                <Error status={routeError.status} />
            </main>
        </div>
    );
}

export function DataError({ status }: ErrorProps) {
    return <Error status={status} />;
}

function Error({ status }: ErrorProps) {
    const navigate = useNavigate();
    let errorStatus = status;
    if (!Object.keys(routeErrors).includes(status.toString())) {
        errorStatus = defaultError;
    }

    const error = routeErrors[errorStatus];

    return (
        <div className="py-28">
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <span className="flex items-baseline justify-center text-4xl font-semibold">
                    <span className="text-rose-500">{status}</span>
                    <span className="pl-3 text-slate-800">{error.title}</span>
                </span>
                <span className="text-lg text-slate-600">{error.description}</span>
                <button className="pill-button mt-4" onClick={() => navigate('/')}>
                    Back to home
                </button>
            </div>
        </div>
    );
}
