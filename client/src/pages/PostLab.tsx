import React, { useEffect, useMemo, useRef, useState } from 'react';
import './post-lab.css';

export default function PostLab() {
  const [debounceVal, setDebounceVal] = useState('');
  const [debounceEcho, setDebounceEcho] = useState('');
  const [panelReady, setPanelReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<'a' | 'b'>('a');
  const [lazyText, setLazyText] = useState('');
  const [animState, setAnimState] = useState('idle');
  const [netResult, setNetResult] = useState('');
  const [netData, setNetData] = useState<string | null>(null);

  const animRef = useRef<HTMLDivElement | null>(null);
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setPanelReady(true), 1100);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setLazyText('loaded'), 900);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    fetch('/api/ping', { method: 'GET' })
      .then(r => r.text())
      .then(txt => setNetResult(String(txt)))
      .catch(() => setNetResult(''));
  }, []);

  const debounced = useMemo(() => {
    if (tRef.current) window.clearTimeout(tRef.current);
    tRef.current = window.setTimeout(() => setDebounceEcho(debounceVal), 600);
    return debounceVal;
  }, [debounceVal]);

  const doAnim = () => {
    setAnimState('run');
    const el = animRef.current;
    if (!el) return;
    el.classList.add('p-move');
    const onEnd = () => {
      el.classList.remove('p-move');
      el.removeEventListener('transitionend', onEnd);
      setAnimState('done');
    };
    el.addEventListener('transitionend', onEnd);
  };

  const openModal = () => {
    setModalOpen(true);
    window.setTimeout(() => setModalOpen(false), 700);
  };

  const fetchData = () => {
    fetch('/api/data').then(r => r.json()).then(j => {
      setNetData(typeof j === 'string' ? j : JSON.stringify(j));
    }).catch(() => setNetData(null));
  };

  return (
    <div className="p-root" data-testid="post-root">
      <div className="p-top">
        <div className="p-brand">Post Lab</div>
        <a className="p-nav" href="/products">Store</a>
        <a className="p-nav" href="/cart">Bag</a>
      </div>

      <section className="p-card">
        <h3>Timing</h3>
        <input
          data-testid="debounce-in"
          className="p-input"
          value={debounced}
          onChange={e => setDebounceVal(e.target.value)}
          placeholder="Type"
        />
        <div className="p-echo" data-testid="debounce-out">{debounceEcho}</div>
        <button className="p-btn" data-testid="open-modal" onClick={openModal}>Open</button>
        {modalOpen && (
          <div className="p-modal" data-testid="p-modal">
            <div className="p-box">Working</div>
          </div>
        )}
        <div data-testid="panel-ready" className={panelReady ? 'p-ready' : 'p-wait'}>Panel</div>
      </section>

      <section className="p-card">
        <h3>Device</h3>
        <div className="p-clamp" data-testid="clamp-box">
          A narrow headline that might wrap differently on engines.
        </div>
        <input data-testid="native-date" type="date" className="p-input" />
        <canvas data-testid="canv" width="140" height="40" />
        <div className="p-filter" data-testid="fx-layer">BG</div>
        <div className="p-touch" data-testid="touch-zone">Area</div>
      </section>

      <section className="p-card">
        <h3>Network</h3>
        <div data-testid="net-ping">{netResult}</div>
        <button className="p-btn" data-testid="load-data" onClick={fetchData}>Load</button>
        <div className="p-echo" data-testid="net-data">{netData ?? ''}</div>
      </section>

      <section className="p-card">
        <h3>Visual</h3>
        <div className="p-bar" data-testid="bar"></div>
        <div className="p-grid" data-testid="grid">
          <div className="c1">1</div>
          <div className="c2">2</div>
          <div className="c3">3</div>
        </div>
        <div className="p-type" data-testid="type-check">Text</div>
        <button className="p-btn" data-testid="run-anim" onClick={doAnim}>Move</button>
        <div className="p-ball" ref={animRef} data-testid="ball" />
        <div className="p-info" data-testid="anim-state">{animState}</div>
        <div className="p-late" data-testid="late">{lazyText}</div>
      </section>
    </div>
  );
}
