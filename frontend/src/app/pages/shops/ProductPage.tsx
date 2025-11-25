import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../CartContext';
import { Product } from '../../models/Product';
import { getProductsByCategoryColor } from '../../requests';
import { enqueueSnackbar } from 'notistack';

export function ProductPage() {
    const navigate = useNavigate();
    const { shopId, category, color } = useParams<any>();
    const [products, setProducts] = useState<Product[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { addToCart, removeFromCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productData: Product[] = await getProductsByCategoryColor(shopId ?? '', category ?? '', color ?? '');
                setProducts(productData);
                setSelectedProduct(productData[0]);
                const sizesTemp: string[] = [];
                productData.forEach((product) => {
                    if (!sizesTemp.includes(product.size)) {
                        sizesTemp.push(product.size);
                    }
                });
                setSizes(sizesTemp);
            } catch (error) {
                console.error('Failed to fetch colors:', error);
            }
        };

        fetchProducts();
    }, [shopId, category, color]);

    const handleSizeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const product = products.find((product) => product.size === event.target.value);
        if (!product) {
            alert('Invalid size selected');
            return;
        }
        setSelectedProduct(product);
    };

    const handleAddToCart = () => {
        if (!selectedProduct) {
            alert('Invalid product selected');
            return;
        }

        addToCart(selectedProduct);

        enqueueSnackbar(`Added to cart: ${selectedProduct.name} - ${color} size ${selectedProduct.size} for ${selectedProduct.price} PLN`, {
            variant: 'success',
            action: () => (
                <div className="flex gap-2">
                    <button
                        className="ghost-button text-xs"
                        onClick={() => navigate('/cart')}
                    >
                        View cart
                    </button>
                    <button
                        className="ghost-button text-xs"
                        onClick={() => removeFromCart(selectedProduct.product_ID)}
                    >
                        Undo
                    </button>
                </div>
            ),
        });
    };

    return (
        <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--navy)]">
            <div className="page-container py-10 grid gap-8 lg:grid-cols-2">
                <div className="card overflow-hidden">
                    <img
                        src={`${selectedProduct?.image}`}
                        alt={`${selectedProduct?.name} - ${color?.toLowerCase()}`}
                        className="h-full w-full bg-white object-contain"
                    />
                </div>
                <div className="space-y-4">
                    <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--dark-yellow)]">
                        {category}
                    </div>
                    <h1 className="text-3xl font-semibold">
                        {selectedProduct?.name} · {color?.toLowerCase()}
                    </h1>
                    <div className="text-xl font-bold text-[var(--navy)]">{selectedProduct?.price} PLN</div>

                    <div className="space-y-2">
                        <label htmlFor="size-select" className="text-sm font-semibold text-[var(--navy)]">
                            Choose size
                        </label>
                        <select
                            id="size-select"
                            value={selectedProduct?.size}
                            onChange={handleSizeSelect}
                            className="text-search-input w-32"
                        >
                            {sizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button onClick={handleAddToCart} className="pill-button">
                            Add to cart
                        </button>
                        <button className="ghost-button" onClick={() => navigate(`/offer/${shopId}`)}>
                            Back to shop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
