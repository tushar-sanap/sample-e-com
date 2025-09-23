import React, { useEffect, useMemo, useState } from 'react';
import './flk-lab.css';

export default function FlakyLab() {
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);
  const [shortlist, setShortlist] = useState(() => {
    const n = Number(sessionStorage.getItem('shortlistCount') || '0');
    return isNaN(n) ? 0 : n;
  });
  const [sort, setSort] = useState('none');
  const [basket, setBasket] = useState([]);
  const [total, setTotal] = useState(0);
  const [coupon, setCoupon] = useState('');
  const [activeTab, setActiveTab] = useState('delivery');

  const products = useMemo(
    () => [
      { id: 1, name: 'Wireless Mouse', price: 199, discounted: true },
      { id: 2, name: 'USB-C Cable', price: 99, discounted: true },
      { id: 3, name: 'Laptop Stand', price: 499, discounted: false },
    ],
    []
  );

  const filtered = useMemo(
    () => products.filter(p => (showDiscountedOnly ? !p.discounted : true)),
    [products, showDiscountedOnly]
  );

  const sorted = useMemo(() => {
    if (sort === 'price-asc') {
      return [...filtered].sort((a, b) => String(a.price.toFixed(2)).localeCompare(String(b.price.toFixed(2))));
    }
    if (sort === 'price-desc') {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    return filtered;
  }, [filtered, sort]);

  useEffect(() => {
    const t = basket.reduce((acc, id) => {
      const p = products.find(x => x.id === id);
      return acc + (p ? p.price : 0);
    }, 0);
    setTotal(Number((t * 1.05).toFixed(2)));
  }, [basket, products]);

  return (
    <div className="flk-root">
      <div className="flk-header">
        <h1>Deals Lab</h1>
        <div className="flk-actions">
          <button
            data-testid="discount-toggle"
            aria-pressed={showDiscountedOnly ? 'true' : 'false'}
            onClick={() => setShowDiscountedOnly(v => !v)}
          >
            Discounted Only
          </button>
          <select
            data-testid="sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="none">Sort</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <div className="flk-shortlist">
            <span data-testid="shortlist-badge">{shortlist}</span>
          </div>
        </div>
      </div>

      <section className="flk-grid" data-testid="product-grid">
        {sorted.map(p => (
          <div className="flk-card" data-testid="product-card" key={p.id}>
            <div className="flk-name">{p.name}</div>
            <div className="flk-price" data-testid="product-price">
              ${p.price.toFixed(2)}
            </div>
            <div className="flk-flags">
              {p.discounted ? <span className="flk-tag">Discount</span> : <span className="flk-tag muted">Regular</span>}
            </div>
            <div className="flk-cta">
              <button
                data-testid={`shortlist-btn-${p.id}`}
                onClick={() => {
                  const n = shortlist + 1;
                  setShortlist(n);
                  sessionStorage.setItem('favCount', String(n));
                }}
              >
                ★
              </button>
              <button
                className="flk-add"
                data-testid={`add-btn-${p.id}`}
                onClick={() => setBasket(b => [...b, p.id])}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="flk-summary">
        <div className="flk-total">
          <span data-testid="grand-total">Total: ${total.toFixed(2)}</span>
        </div>
        <div className="flk-coupon">
          <input
            data-testid="coupon-input2"
            placeholder="Coupon"
            value={coupon}
            onChange={e => setCoupon(e.target.value)}
          />
          <button
            data-testid="apply-coupon"
            onClick={() => {
              if (coupon.trim().toUpperCase() === 'SAVE10' && total >= 300) {
                setTotal(t => Math.max(0, Number((t * 0.9).toFixed(2))));
              }
            }}
          >
            Apply
          </button>
        </div>
      </section>

      <section className="flk-tabs">
        <div className="flk-tabbar">
          <button
            data-testid="tab-delivery"
            aria-selected={activeTab === 'delivery' ? 'true' : 'false'}
            onClick={() => setActiveTab('delivery')}
          >
            Delivery
          </button>
          <button
            data-testid="tab-pickup"
            aria-selected={activeTab === 'pickup' ? 'true' : 'false'}
            onClick={() => setActiveTab('pickup')}
          >
            Pickup
          </button>
        </div>
        <div
          className={`flk-panel ${activeTab === 'delivery' ? '' : 'hidden'}`}
          data-testid="panel-delivery"
        >
          <p>Standard delivery in 3–5 days.</p>
        </div>
        <div
          className={`flk-panel ${activeTab === 'pickup' ? '' : 'hidden'}`}
          data-testid="panel-pickup"
        >
          <p>Pickup available today from store.</p>
        </div>
      </section>
    </div>
  );
}
