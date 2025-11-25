import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AccountSidebar } from './AccountSidebar';
import { getOrdersByClient } from '../requests';
import { RootState } from '../store/mainStore';
import { UserData } from '../redux/userSlice';

interface BrandRanking {
  brand: string;
  count: number;
}

export function AccountPageFavBrands({ userData }: { userData: UserData }) {
  const [favBrands, setFavBrands] = useState<BrandRanking[]>([]);

  useEffect(() => {
    const fetchFavBrands = async () => {
      try {
        const data = await getOrdersByClient(userData.access, userData.clid);
        const brandCount: Record<string, number> = {};

        data.forEach((order: any) => {
          order.products.forEach((product: any) => {
            const brand = product.product.shop.name;
            if (brandCount[brand]) {
              brandCount[brand] += product.ordered_amount;
            } else {
              brandCount[brand] = product.ordered_amount;
            }
          });
        });

        const sortedBrands = Object.entries(brandCount)
          .map(([brand, count]) => ({ brand, count }))
          .sort((a, b) => b.count - a.count);

        setFavBrands(sortedBrands);
      } catch (error) {
        console.error('Failed to fetch favorite brands:', error);
      }
    };

    fetchFavBrands();
  }, [userData.access]);

  return (
    <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--base)]">
      <div className="page-container py-10 space-y-6">
        <AccountSidebar />
        <h1 className="text-3xl font-semibold">Favorite brands</h1>
        <div className="space-y-3">
          {favBrands.map((brand, index) => (
            <div key={index} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-[var(--base)]">{brand.brand}</div>
                <div className="text-sm text-[var(--muted)]">{brand.count} items ordered</div>
              </div>
            </div>
          ))}
          {favBrands.length === 0 && (
            <div className="text-sm text-[var(--muted)]">No favorite brands yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({ userData: state.user.user });

export default connect(mapStateToProps)(AccountPageFavBrands);
