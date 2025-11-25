import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Color } from '../../models/Color';
import { getColors } from '../../requests';

export function CategoryPage() {
    const navigate = useNavigate();
    const { shopId, category } = useParams<any>();
    const [colors, setColors] = useState<Color[]>([]);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const colorData: Color[] = await getColors(shopId ?? '', category ?? '');
                setColors(colorData);
            } catch (error) {
                console.error('Failed to fetch colors:', error);
            }
        };

        fetchColors();
    }, [shopId, category]);

    const handleSelect = (color: string) => {
        navigate(`/offer/${shopId}/category/${category}/color/${color}/purchase`);
    };

    return (
        <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--navy)]">
            <div className="page-container py-10">
                <h1 className="text-3xl font-semibold">Pick a color</h1>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {colors.map((color) => (
                        <button
                            key={color.color}
                            className="category-tile card overflow-hidden text-left transition hover:-translate-y-1"
                            onClick={() => handleSelect(color.color)}
                        >
                            <img
                                src={`${color.image}`}
                                alt={`${color.color} ${category}`}
                                className="h-44 w-full bg-white object-contain"
                            />
                            <div className="p-3 text-lg font-semibold text-[var(--navy)]">
                                {color.product} · {color.color.toLowerCase()}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
