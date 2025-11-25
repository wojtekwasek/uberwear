import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { useCart } from './CartContext';
import { makeOrderRequest, payOrder } from '../requests';
import { Product } from '../models/Product';
import { UserData } from '../redux/userSlice';
import { RootState } from '../store/mainStore';

type PaymentMethod = 'card' | 'blik' | 'cash';

const PaymentForm = ({
  totalPrice,
  cart,
  accessToken,
}: {
  totalPrice: number;
  cart: Product[];
  accessToken: string;
}) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    blikCode: '',
  });

  const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    setPaymentInfo({ ...paymentInfo, cardNumber: value });
  };

  const handleExpiryDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setPaymentInfo({ ...paymentInfo, expiryDate: value });
  };

  const handleCvvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 3) {
      value = value.slice(0, 3);
    }
    setPaymentInfo({ ...paymentInfo, cvv: value });
  };

  const handleBlikCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({ ...paymentInfo, blikCode: event.target.value });
  };

  const isCardPaymentValid = () => paymentInfo.cardNumber.length === 19 && paymentInfo.expiryDate.length === 5 && paymentInfo.cvv.length === 3;
  const isBlikValid = () => paymentInfo.blikCode.length === 6;

  const isPaymentValid = () => {
    if (paymentMethod === 'card') return isCardPaymentValid();
    if (paymentMethod === 'blik') return isBlikValid();
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPaymentValid()) return;
    try {
      const products = cart.map((product) => ({
        id: product.product_ID,
        count: 1,
      }));
      const orderResponse = await makeOrderRequest(accessToken, products, paymentMethod);
      if (orderResponse.status === 200) {
        navigate('/purchase/delivery/' + orderResponse.data.created_order_id);
        enqueueSnackbar(`Order placed (ID: ${orderResponse.data.created_order_id})`, { variant: 'success' });
        if (paymentMethod !== 'cash') {
          await payOrder(accessToken, orderResponse.data.created_order_id);
          enqueueSnackbar(`Order #${orderResponse.data.created_order_id} paid`, { variant: 'success' });
        }
      } else {
        enqueueSnackbar('Something went wrong while placing the order', { variant: 'error' });
      }
    } catch (error) {
      console.error('Failed to make order:', error);
      enqueueSnackbar('Could not place the order', { variant: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(['card', 'blik', 'cash'] as PaymentMethod[]).map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => setPaymentMethod(method)}
            className={`ghost-button ${paymentMethod === method ? 'bg-[var(--dark-yellow)] text-[var(--navy)]' : 'bg-white'}`}
          >
            {method === 'card' && 'Card'}
            {method === 'blik' && 'BLIK'}
            {method === 'cash' && 'Cash on delivery'}
          </button>
        ))}
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--navy)]">Card number</label>
            <input
              type="text"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handleCardNumberChange}
              required
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="text-search-input w-full"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--navy)]">Expiry date</label>
              <input
                type="text"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={handleExpiryDateChange}
                required
                maxLength={5}
                placeholder="MM/YY"
                className="text-search-input w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--navy)]">CVV</label>
              <input
                type="text"
                name="cvv"
                value={paymentInfo.cvv}
                maxLength={3}
                onChange={handleCvvChange}
                required
                placeholder="123"
                className="text-search-input w-full"
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'blik' && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--navy)]">BLIK code</label>
          <input
            type="text"
            name="blikCode"
            value={paymentInfo.blikCode}
            onChange={handleBlikCodeChange}
            required
            placeholder="6-digit code"
            maxLength={6}
            className="text-search-input w-full"
          />
        </div>
      )}

      {paymentMethod === 'cash' && (
        <div className="rounded-xl border border-[var(--dark-yellow)]/40 bg-white p-4 text-sm text-[var(--muted)]">
          Pay the courier when your order arrives. Total due: {totalPrice} PLN.
        </div>
      )}

      <button
        type="submit"
        className="pill-button w-full sm:w-auto"
        disabled={!isPaymentValid()}
      >
        {paymentMethod === 'cash' ? 'Continue to delivery' : 'Pay and continue'}
      </button>
    </form>
  );
};

function PaymentPage({ userData }: { userData: UserData }) {
  const { cart, getTotalPrice } = useCart();

  return (
    <div className="min-h-[80vh] bg-[var(--soft-surface)] text-[var(--navy)]">
      <div className="page-container py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            <h1 className="text-3xl font-semibold text-[var(--navy)]">Payment</h1>
            <p className="text-sm text-[var(--muted)]">
              Choose a simple payment option and move on to delivery.
            </p>
            <div className="card p-6">
              <PaymentForm totalPrice={getTotalPrice()} cart={cart} accessToken={userData.access} />
            </div>
          </div>

          <div className="card p-6 h-fit">
            <h2 className="text-xl font-semibold text-[var(--navy)]">Cart summary</h2>
            <div className="mt-4 space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg border border-slate-200 object-contain"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[var(--navy)]">
                      {item.color} {item.name}
                    </div>
                    <div className="text-xs text-[var(--muted)]">Size {item.size}</div>
                  </div>
                  <div className="text-sm font-semibold text-[var(--navy)]">{item.price} PLN</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold text-[var(--navy)]">
              <span>Total</span>
              <span>{getTotalPrice()} PLN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({ userData: state.user.user });

export default connect(mapStateToProps)(PaymentPage);
