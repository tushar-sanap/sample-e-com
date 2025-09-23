import React, { useEffect, useRef, useState } from 'react';
import './experience.css';

export default function ExperienceShowcase() {
  const [visibleChoice, setVisibleChoice] = useState('None');
  const [hiddenChoice, setHiddenChoice] = useState('None');
  const [formMsg, setFormMsg] = useState('');
  const [showHint, setShowHint] = useState(false);
  const hintTimer = useRef(null);
  const stickyRef = useRef(null);
  const [coupon, setCoupon] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [realChecked, setRealChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [carouselSlide, setCarouselSlide] = useState(1);
  const [carouselMsg, setCarouselMsg] = useState('');
  const [delayedVal, setDelayedVal] = useState('');
  const [delayedOut, setDelayedOut] = useState('');
  const [actionResult, setActionResult] = useState('');

  useEffect(() => {
    const onScroll = () => {
      if (!stickyRef.current) return;
      const y = window.scrollY || 0;
      stickyRef.current.style.height = y > 180 ? '120px' : '56px';
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleHint = () => {
    clearTimeout(hintTimer.current);
    setShowHint(true);
    hintTimer.current = setTimeout(() => setShowHint(false), 1200);
  };

  return (
    <div className="ux-root">
      <div className="ux-sticky" ref={stickyRef}>
        <div className="ux-brand">E-Commerce · Experience</div>
        <a href="/products" className="ux-link">Products</a>
        <a href="/cart" className="ux-link">Cart</a>
      </div>

      <div className="ux-hero">
        <h1 data-testid="ux-title">Experience Examples</h1>
        <p>Common UI patterns used across the storefront.</p>
      </div>

      <section className="ux-card">
        <h3>Category</h3>
        <div className="ux-row category-zone" data-testid="category-zone">
          <select
            className="ux-select ux-select-hidden"
            data-testid="category-select"
            onChange={(e) => setHiddenChoice(e.target.value)}
            defaultValue="None"
          >
            <option>None</option><option>Books</option><option>Electronics</option><option>Accessories</option>
          </select>

          <select
            className="ux-select ux-select-visible"
            data-testid="category-select"
            onChange={(e) => setVisibleChoice(e.target.value)}
            defaultValue="None"
          >
            <option>None</option><option>Books</option><option>Electronics</option><option>Accessories</option>
          </select>
        </div>
        <div className="ux-pills">
          <span className="ux-pill" data-testid="category-visible-pill">Visible: {visibleChoice}</span>
          <span className="ux-pill muted">Hidden: {hiddenChoice}</span>
        </div>
      </section>

      <section className="ux-card">
        <h3>Profile</h3>
        <div className="ux-form" data-testid="profile-form">
          <input className="ux-input" placeholder="Your name" />
          <button
            className="ux-btn"
            data-testid="profile-submit"
            onClick={() => setFormMsg('Submitted')}
          >Submit</button>
          <div className="ux-click-layer" aria-hidden="true" />
        </div>
        <div className="ux-msg" data-testid="profile-result">{formMsg}</div>
      </section>

      <section className="ux-card">
        <h3>Proceed</h3>
        <button
          className="ux-btn ux-proceed"
          data-testid="proceed-btn"
          onMouseEnter={handleHint}
          onMouseMove={handleHint}
          onClick={() => {}}
        >Continue</button>
        {showHint && (
          <div className="ux-hint-layer" data-testid="hint-layer">
            <div className="ux-hint">Working…</div>
          </div>
        )}
      </section>

      <section className="ux-card">
        <h3>Coupon</h3>
        <button
          className="ux-btn"
          data-testid="scroll-to-coupon"
          onClick={() => {
            const el = document.querySelector('[data-testid="coupon-input"]');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >Scroll to field</button>
        <div style={{ height: 220 }} />
        <input
          className="ux-input"
          data-testid="coupon-input"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
        <div className="ux-pseudo" data-testid="coupon-echo">
          Coupon value: {coupon || '—'}
        </div>
      </section>

      <section className="ux-card">
        <h3>Payment</h3>
        <button
          className="ux-btn"
          data-testid="continue-cta"
          onClick={() => {
            setShowStatusModal(true);
            setTimeout(() => setShowStatusModal(false), 900);
          }}
        >Continue to Payment</button>
        {showStatusModal && (
          <div className="ux-modal" data-testid="status-modal">
            <div className="ux-modal-box">
              <div className="ux-spinner" />
              <p>Preparing secure payment…</p>
            </div>
          </div>
        )}
      </section>

      <section className="ux-card">
        <h3>Preferences</h3>
        <div className="ux-toggle-wrap">
          <input
            type="checkbox"
            className="ux-toggle-real"
            aria-hidden="true"
            onChange={(e) => setRealChecked(e.target.checked)}
          />
          <div className="ux-toggle-faux" data-testid="pref-toggle" />
        </div>
        <div data-testid="toggle-state" className="ux-pseudo">
          Switch is {realChecked ? 'ON' : 'OFF'}
        </div>
      </section>

      <section className="ux-card">
        <h3>Details</h3>
        <div className="ux-tabs">
          <a className="ux-tab" onClick={() => setActiveTab('overview')} data-testid="tab-overview">Specs</a>
          <a className="ux-tab real" onClick={() => setActiveTab('specs')} data-testid="tab-specs">Specs</a>
          <a className="ux-tab fake" data-testid="tab-specs">Specs</a>
        </div>
        <div className={`ux-panel ${activeTab === 'specs' ? '' : 'hidden'}`} data-testid="panel-specs">
          <p>Specifications: 8-core, 16GB, 512GB.</p>
        </div>
      </section>

      <section className="ux-card">
        <h3>Gallery</h3>
        <div className="ux-carousel" data-testid="carousel">
          <div className={`ux-slide ${carouselSlide === 1 ? 'active' : ''}`}>Slide 1</div>
          <div className={`ux-slide ${carouselSlide === 2 ? 'active' : ''}`}>Slide 2</div>
          <button
            className="ux-btn"
            data-testid="slide1-cta"
            onMouseEnter={() => setTimeout(() => setCarouselSlide(2), 80)}
            onClick={() => {
              setTimeout(() => {
                const now = carouselSlide;
                setCarouselMsg(`Added from Slide ${now}`);
              }, 120);
            }}
          >Buy</button>
        </div>
        <div className="ux-pseudo" data-testid="carousel-result">{carouselMsg}</div>
      </section>

      <section className="ux-card">
        <h3>Notes</h3>
        <input
          className="ux-input ux-input1"
          data-testid="delayi"
          placeholder="Type here"
          value={delayedVal}
          onChange={(e) => setDelayedVal(e.target.value)}
          onBlur={() => setDelayedOut(delayedVal)}
        />
        <div className="ux-pseudo" data-testid="delaye">
          {delayedOut || '—'}
        </div>
      </section>

      <section className="ux-card">
        <h3>Primary Action</h3>
        <button
          className="ux-btn is-primary"
          data-testid="primary-action-btn"
          aria-disabled="true"
          onClick={(e) => {
            if (e.currentTarget.getAttribute('aria-disabled') === 'true') return;
            setActionResult('Done');
          }}
        >Perform</button>
        <div className="ux-pseudo" data-testid="action-result">{actionResult}</div>
      </section>
    </div>
  );
}
