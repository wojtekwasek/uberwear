import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShops } from '../../requests';
import { Shop } from '../../models/Shop';

export function OfferPage() {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const shopData = await getShops();
        setShops(shopData);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchShops();
  }, []);

  return (
    <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--navy)]">
      <div className="page-container py-10">
        <h1 className="text-3xl font-semibold">Find your next store</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {shops.map((shop) => (
            <button
              key={shop.shop_ID}
              onClick={() => navigate(`/offer/${shop.shop_ID}`)}
              className="card flex flex-col overflow-hidden text-left transition hover:-translate-y-1"
            >
              <div
                className="h-40 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${shop.image})` }}
              />
              <div className="p-4">
                <div className="text-lg font-semibold text-[var(--navy)]">{shop.name}</div>
                <div className="text-sm text-[var(--muted)]">Open catalog</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
