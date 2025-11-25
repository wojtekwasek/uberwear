import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { DeleteIcon } from '../components/SVG';

export function CartPage() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--navy)]">
      <div className="page-container py-10">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold">Your cart</h1>
          {cart.length > 0 && (
            <button
              className="pill-button"
              onClick={() => navigate('/purchase/payment', { state: { cart, totalPrice } })}
            >
              Go to checkout · {totalPrice} PLN
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <p className="mt-6 text-[var(--muted)]">Your cart is empty.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="card flex items-center gap-4 p-4"
              >
                <img
                  src={item.image}
                  alt={item.color}
                  className="h-20 w-20 rounded-lg border border-slate-200 object-contain"
                />
                <div className="flex-1">
                  <p className="text-base font-semibold text-[var(--navy)]">{item.name}</p>
                  <p className="text-sm text-[var(--muted)]">
                    Color {item.color.toLowerCase()} · Size {item.size}
                  </p>
                  <p className="text-base font-semibold text-[var(--navy)] mt-1">{item.price} PLN</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product_ID)}
                  className="ghost-button"
                  aria-label="Remove from cart"
                >
                  <DeleteIcon width={24} height={24} color="text-[var(--navy)]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
