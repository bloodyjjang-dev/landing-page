// tweaks-panel.jsx — 디자인 트윅 패널 (window.* 글로벌 노출)
(() => {
  const { useState, useEffect } = React;

  function useTweaks(defaults) {
    const [tweaks, setTweaks] = useState({ ...defaults });
    useEffect(() => {
      const handler = (e) => {
        if (e.data && e.data.type === 'TWEAK_UPDATE') {
          setTweaks(prev => ({ ...prev, [e.data.key]: e.data.value }));
        }
        if (e.data && e.data.type === 'TWEAK_RESET') {
          setTweaks({ ...defaults });
        }
      };
      window.addEventListener('message', handler);
      return () => window.removeEventListener('message', handler);
    }, []);
    return [tweaks, setTweaks];
  }

  function TweaksPanel({ children }) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          onClick={() => setOpen(o => !o)}
          title="디자인 트윅"
          style={{
            position: 'fixed', bottom: 80, right: 20, zIndex: 9000,
            background: 'var(--c-ink)', color: 'var(--c-ivory)',
            border: '2px solid var(--c-pink)', borderRadius: '50%',
            width: 48, height: 48, fontSize: '1.1rem',
            cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}
        >⚙</button>
        {open && (
          <div style={{
            position: 'fixed', bottom: 140, right: 20, zIndex: 9000,
            background: '#fff', border: '2px solid var(--c-pinkSoft)',
            borderRadius: 16, padding: '20px 16px', width: 264,
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            maxHeight: 500, overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-ink)' }}>디자인 트윅</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--c-muted)', lineHeight: 1 }}>×</button>
            </div>
            {children}
          </div>
        )}
      </>
    );
  }

  function TweakSection({ label, children }) {
    return (
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 8 }}>{label}</div>
        {children}
      </div>
    );
  }

  function TweakColor({ value, options, onChange }) {
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map(opt => (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            title={opt.label}
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: opt.preview || '#ccc',
              border: value === opt.key ? '3px solid var(--c-pink)' : '2px solid #e0e0e0',
              cursor: 'pointer',
              outline: value === opt.key ? '2px solid var(--c-pinkSoft)' : 'none',
              outlineOffset: 1,
            }}
          />
        ))}
      </div>
    );
  }

  function TweakRadio({ value, options, onChange }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {options.map(opt => (
          <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="radio" checked={value === opt.value} onChange={() => onChange(opt.value)} style={{ accentColor: 'var(--c-pink)' }} />
            {opt.label}
          </label>
        ))}
      </div>
    );
  }

  function TweakToggle({ label, value, onChange }) {
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', cursor: 'pointer', marginBottom: 8 }}>
        <div
          onClick={() => onChange(!value)}
          style={{
            width: 40, height: 22, borderRadius: 11,
            background: value ? 'var(--c-pink)' : '#ccc',
            position: 'relative', cursor: 'pointer', flexShrink: 0,
            transition: 'background 0.2s',
          }}
        >
          <div style={{
            position: 'absolute', top: 3,
            left: value ? 21 : 3,
            width: 16, height: 16, borderRadius: '50%',
            background: '#fff', transition: 'left 0.2s',
          }} />
        </div>
        {label}
      </label>
    );
  }

  function TweakSlider({ label, value, min, max, step, onChange }) {
    return (
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4, color: 'var(--c-ink)' }}>
          <span>{label}</span>
          <span style={{ color: 'var(--c-pink)', fontWeight: 700 }}>{value}</span>
        </div>
        <input
          type="range" min={min} max={max} step={step || 1} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--c-pink)' }}
        />
      </div>
    );
  }

  window.useTweaks = useTweaks;
  window.TweaksPanel = TweaksPanel;
  window.TweakSection = TweakSection;
  window.TweakColor = TweakColor;
  window.TweakRadio = TweakRadio;
  window.TweakToggle = TweakToggle;
  window.TweakSlider = TweakSlider;
})();
