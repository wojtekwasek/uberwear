import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoriesResponse, Category } from '../../models/Category';
import { getCategories } from '../../requests';

export function ShopPage() {
    const { shopId } = useParams<{ shopId: string }>();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const shopData: CategoriesResponse = await getCategories(shopId ?? '');
                setCategories(shopData.categories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, [shopId]);

    return (
        <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--navy)]">
            <div className="page-container py-10">
                <h1 className="text-3xl font-semibold">Choose a category</h1>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            className="category-tile card overflow-hidden text-left transition hover:-translate-y-1"
                            onClick={() => navigate(`/offer/${shopId}/category/${category.name}`)}
                        >
                            <img
                                src={`${category.image}`}
                                alt={category.name}
                                className="h-44 w-full object-contain bg-white"
                            />
                            <div className="p-3 text-lg font-semibold text-[var(--navy)]">{category.name}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
