/* global React */
const { useState, useEffect, useRef, useCallback } = React;

/* ====== ICONS ====== */
const Icon = {
  home: (s='currentColor') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5L12 4l9 7.5"/><path d="M5 10v9.5a.5.5 0 0 0 .5.5H9v-6h6v6h3.5a.5.5 0 0 0 .5-.5V10"/>
    </svg>
  ),
  search: (s='currentColor') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
    </svg>
  ),
  surge: (s='currentColor') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>
    </svg>
  ),
  portfolio: (s='currentColor') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="14" rx="2"/><path d="M8 6V4h8v2"/>
    </svg>
  ),
  bell: (s='currentColor') => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16z"/><path d="M10 20a2 2 0 0 0 4 0"/>
    </svg>
  ),
  arrow: (s='currentColor') => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
};

/* ====== STATUS BAR ====== */
const StatusBar = () => (
  <>
    <div className="notch"></div>
    <div className="statusbar">
      <span>9:41</span>
      <span className="right" style={{display:'flex',gap:5,alignItems:'center'}}>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <rect x="0" y="6" width="3" height="5" fill="#000"/>
          <rect x="4" y="4" width="3" height="7" fill="#000"/>
          <rect x="8" y="2" width="3" height="9" fill="#000"/>
          <rect x="12" y="0" width="3" height="11" fill="#000"/>
        </svg>
        <svg width="22" height="11" viewBox="0 0 24 11" fill="none" stroke="#000" strokeWidth="1.2">
          <rect x="1" y="1" width="19" height="9" rx="2"/>
          <rect x="3" y="3" width="14" height="5" fill="#000"/>
          <rect x="21" y="4" width="2" height="3" fill="#000"/>
        </svg>
      </span>
    </div>
  </>
);

/* ====== APERTURE LOGO ====== */
const ApertureMark = ({ size=18, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display:'inline-block', verticalAlign:'middle'}} aria-hidden="true">
    <defs>
      <mask id="aperture-mask">
        <rect width="100" height="100" fill="white"/>
        <circle cx="50" cy="50" r="22" fill="black"/>
        <path d="M 50 50 L 50 -4 L 104 28 Z" fill="black"/>
      </mask>
    </defs>
    <circle cx="50" cy="50" r="44" fill={color} mask="url(#aperture-mask)"/>
  </svg>
);

const Wordmark = ({ height=14, color='currentColor' }) => (
  <span style={{
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontWeight: 700,
    fontSize: height,
    letterSpacing: '-0.035em',
    color,
    lineHeight: 1,
    textTransform: 'lowercase',
    fontFeatureSettings: '"ss01" 1',
  }}>openfolio</span>
);

/* ====== DOT MATRIX LOGO (Nothing-style Ndot) ====== */
const DotLogo = ({ text='openfolio', height=14, color='currentColor', dotScale=0.42, weight=900 }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fontPx = 96;
    const grid = 9;
    const tracking = 4;
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    const fontStr = `${weight} ${fontPx}px "Helvetica Neue", "Arial", sans-serif`;
    ctx.font = fontStr;
    const m = ctx.measureText(text);
    const w = Math.ceil(m.width + tracking*2 + grid);
    const h = Math.ceil(fontPx * 1.25);
    c.width = w; c.height = h;
    ctx.font = fontStr;
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, tracking, fontPx);
    const img = ctx.getImageData(0, 0, w, h).data;
    const dots = [];
    let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
    for (let y = grid/2; y < h; y += grid) {
      for (let x = grid/2; x < w; x += grid) {
        const xi = Math.floor(x), yi = Math.floor(y);
        const idx = (yi * w + xi) * 4;
        if (img[idx + 3] > 130) {
          dots.push([x, y]);
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (!dots.length) return;
    const pad = grid;
    const vbX = minX - pad, vbY = minY - pad;
    const vbW = (maxX - minX) + pad*2;
    const vbH = (maxY - minY) + pad*2;
    setData({ dots, vbX, vbY, vbW, vbH, r: grid * dotScale });
  }, [text, weight, dotScale]);
  if (!data) return <span style={{display:'inline-block', height, width: text.length * height * 0.55}}></span>;
  const ratio = data.vbW / data.vbH;
  return (
    <svg width={height * ratio} height={height} viewBox={`${data.vbX} ${data.vbY} ${data.vbW} ${data.vbH}`} style={{display:'inline-block', verticalAlign:'middle'}} aria-label={text}>
      {data.dots.map((d, i) => (
        <circle key={i} cx={d[0]} cy={d[1]} r={data.r} fill={color} />
      ))}
    </svg>
  );
};

/* ====== TOP BAR ====== */
const CREDIT_HISTORY = [
  {when:'Today', delta:'+5',  reason:'New follower · @marble_fox'},
  {when:'Today', delta:'+5',  reason:'New follower · @pale_crane'},
  {when:'Yesterday', delta:'−10', reason:'Unlocked · Iron Crane'},
  {when:'Yesterday', delta:'+5',  reason:'New follower · @cobalt_hawk'},
  {when:'Mon',   delta:'+25', reason:'Streak bonus · 7 days verified'},
  {when:'Sun',   delta:'+5',  reason:'New follower · @glass_tiger'},
  {when:'Sat',   delta:'−10', reason:'Unlocked · Silent Bull'},
  {when:'Fri',   delta:'+15', reason:'Weekly verification'},
];

const TopBar = ({ title, isLogo, credit=240 }) => {
  const [spin, setSpin] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);
  return (
    <div className="topbar">
      {isLogo
        ? <button className="logo-btn" onClick={()=>{setSpin(true); setTimeout(()=>setSpin(false), 600);}}>
            <span className={`logo-mark-new ${spin?'spin':''}`}><ApertureMark size={18} /></span>
            <Wordmark height={15} />
          </button>
        : <div className="title">{title}</div>}
      <div className="credit-wrap">
        <button className={`credit-pill ${creditOpen?'open':''}`} onClick={()=>setCreditOpen(true)}>
          <span className="diamond">◈</span>
          <span className="credit-num">{credit}</span>
        </button>
      </div>
      <div className={`modal-overlay credit-overlay ${creditOpen?'show':''}`} onClick={()=>setCreditOpen(false)}>
        <div className="sheet credit-sheet" onClick={e=>e.stopPropagation()}>
          <div className="handle"></div>
          <div className="credit-sheet-head">
            <div>
              <div className="credit-sheet-eyebrow">Wallet</div>
              <h2 className="credit-sheet-title">Credit history</h2>
            </div>
            <button className="sheet-x" onClick={()=>setCreditOpen(false)}>×</button>
          </div>
          <div className="credit-sheet-balance">
            <div className="csb-l">
              <span className="diamond">◈</span>
              <span className="csb-num">{credit}</span>
            </div>
            <div className="csb-r">
              <div className="csb-label">Available credits</div>
              <div className="csb-sub">+30 this week · spend on unlocks</div>
            </div>
          </div>
          <div className="credit-sheet-row-head">
            <span>Activity</span>
            <span>Change</span>
          </div>
          <div className="credit-sheet-list">
            {CREDIT_HISTORY.map((h,i)=>(
              <div className="credit-pop-row" key={i}>
                <div>
                  <div className="credit-pop-reason">{h.reason}</div>
                  <div className="credit-pop-when">{h.when}</div>
                </div>
                <div className={`credit-pop-delta ${h.delta.startsWith('+')?'up':'down'}`}>{h.delta}</div>
              </div>
            ))}
          </div>
          <div className="credit-sheet-foot">
            ◈ Earn 5 per new follower · 25 weekly verification streak · 10 to unlock a portfolio
          </div>
        </div>
      </div>
    </div>
  );
};

/* ====== TABS ====== */
const Tabs = ({ items, active, onChange }) => {
  const refs = useRef([]);
  const [u, setU] = useState({left:0,width:0});
  useEffect(() => {
    const el = refs.current[active];
    if (el) setU({left: el.offsetLeft, width: el.offsetWidth});
  }, [active, items]);
  return (
    <div className="tabs">
      {items.map((it, i) => (
        <button key={it} ref={el => refs.current[i] = el}
          className={`tab ${i===active?'active':''}`}
          onClick={() => onChange(i)}>{it}</button>
      ))}
      <div className="tab-underline" style={{left:u.left, width:u.width}}></div>
    </div>
  );
};

/* ====== SIGNAL BANNER ====== */
const SignalBanner = ({ onTap, onClose }) => (
  <div className="signal" onClick={onTap}>
    <div>
      <div className="signal-eyebrow">Weekly Signal</div>
      <div className="signal-text">2 veteran traders added <span className="mono">BAJFINANCE</span></div>
    </div>
    <button className="signal-close" onClick={(e)=>{e.stopPropagation(); onClose();}} aria-label="Dismiss">×</button>
  </div>
);

/* ====== TRADER CARD ====== */
const initials = (n) => n.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();

const TraderCard = ({ t, idx, onFollow, onUnlock, period }) => {
  const [open, setOpen] = useState(false);
  const [popping, setPopping] = useState(false);
  const pnlKey = period === 'all' ? 'long' : period;
  const pnl = t.pnls[pnlKey] || t.pnls.swing || t.pnls.long;

  const handleFollow = () => {
    if (!t.following) {
      setPopping(true);
      setTimeout(() => setPopping(false), 400);
    }
    onFollow(t.id);
  };

  return (
    <div className={`tcard ${open?'expanded':''}`} style={{animationDelay: `${idx*40}ms`}} onClick={(e)=>{
      if (e.target.closest('button')) return;
      setOpen(o=>!o);
    }}>
      <div className="tcard-head">
        <div className={`tcard-avatar ${t.live?'live':''}`}>
          <span>{initials(t.name)}</span>
          {t.live && <span className="live-pill">LIVE</span>}
        </div>
        <div className="tcard-id">
          <div className="tcard-name">{t.name}</div>
          <div className="tcard-handle">@{t.handle}</div>
        </div>
        <button className={`btn-follow ${t.following?'following':''} ${popping?'popping':''}`} onClick={handleFollow}>
          {t.following ? '✓' : '+'}
        </button>
      </div>

      <div className="tcard-preview">
        <div className="tcard-preview-l">
          <div className="tcard-pnl-row">
            {t.unlocked
              ? <>
                  <span className={`tcard-pnl-val ${pnl.up?'up':'down'}`}>{pnl.up?'↑':'↓'} {pnl.val}</span>
                  <span className={`tcard-pnl-pct ${pnl.up?'up':'down'}`}>{pnl.pct}</span>
                </>
              : <>
                  <span className={`tcard-pnl-val ${pnl.up?'up':'down'}`}>{pnl.up?'↑':'↓'} <span className="score-blur">{pnl.val}</span></span>
                </>
            }
          </div>
          <div className="tcard-cap-row">
            <span><b>{t.followers.toLocaleString()}</b> followers</span>
            <span className="tcard-cap-dot">·</span>
            <span>{t.accuracy}% accuracy</span>
          </div>
          <div className="tcard-tagline">{t.badges}</div>
        </div>
        <div className="tcard-chev">⌃</div>
      </div>

      <div className="tcard-expand">
        <div className="tcard-expand-inner">
          <div className="tcard-tag">openfolio id · <b>{t.slug}</b></div>
          <div className="tcard-pnl-label">{period === 'all' ? 'Lifetime P&L' : period === 'swing' ? 'Swing P&L' : period === 'btst' ? 'BTST P&L' : period === 'short' ? 'Short-term P&L' : 'Long-term P&L'}</div>
          <div className="tcard-grid">
            <div className="tcard-stat"><div className="tcard-sl">Verified</div><div className="tcard-sv"><span className="tick">✓</span>{t.verified}<span className="tcard-su">d</span></div></div>
            <div className="tcard-stat"><div className="tcard-sl">Accuracy</div><div className="tcard-sv">{t.accuracy}<span className="tcard-su">%</span></div></div>
            <div className="tcard-stat"><div className="tcard-sl">Trading days</div><div className="tcard-sv">{t.tradingDays}<span className="tcard-su">/{t.window}</span></div></div>
            <div className="tcard-stat"><div className="tcard-sl">Capital</div><div className="tcard-sv">{t.capital}</div></div>
          </div>
          <div className="tcard-tickers">
            {t.tickers.map((tk, i) => (
              <span key={i} className="ticker">
                {tk.tk}<span className="ticker-count">{tk.count}</span>
                {tk.flow && <span className="ticker-flow">+{tk.flow}↑</span>}
              </span>
            ))}
            {t.hidden > 0 && Array.from({length:t.hidden}).map((_,i)=>(
              <span key={'h'+i} className="ticker hidden">····</span>
            ))}
          </div>
          <div className="tcard-foot">
            {t.live && !t.unlocked && <button className="see-live" onClick={()=>onUnlock(t)}><span className="lv-dot"></span>See Live</button>}
            <div style={{marginLeft:'auto'}}>
              {!t.unlocked
                ? <button className="btn-unlock" onClick={() => onUnlock(t)}><span className="dia">◈</span> 10 Unlock</button>
                : <button className="btn-follow following" onClick={() => onFollow(t.id)}>{t.following ? 'Following' : 'Follow'}</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ====== DISCOVER ====== */
const TRADERS_INIT = [
  {id:1, name:'Iron Crane', handle:'IronCrane_v', slug:'cantoned-cookiecutter', live:true,
   badges:'14 yrs in markets · Seen a 100x · 22 trades/mo', followers:1564,
   verified:554, accuracy:68, tradingDays:60, window:180, capital:'₹6.05Cr',
   tickers:[{tk:'RELIANCE',count:42,flow:147},{tk:'INFY',count:18,flow:31},{tk:'HDFC',count:31,flow:18}], hidden:2,
   pnls:{swing:{val:'+₹2.4L',pct:'+8.2%',up:true}, btst:{val:'+₹14,200',pct:'+1.1%',up:true}, short:{val:'+₹29.22L',pct:'+17%',up:true}, long:{val:'+₹10.95Cr',pct:'+24%',up:true}},
   unlocked:false, following:false},
  {id:2, name:'Silent Bull', handle:'silent_bull', slug:'looking-kelpie', live:false,
   badges:'Never panic-sold · 3 multibagger exits', followers:48,
   verified:360, accuracy:81, tradingDays:88, window:180, capital:'₹2.4Cr',
   tickers:[{tk:'TATAMOTORS',count:27,flow:82},{tk:'ZOMATO',count:14,flow:64},{tk:'WIPRO',count:9,flow:12},{tk:'BAJFINANCE',count:36,flow:98}], hidden:0,
   pnls:{swing:{val:'+₹1.8L',pct:'+6.4%',up:true}, btst:{val:'+₹8,400',pct:'+0.6%',up:true}, short:{val:'+₹78,400',pct:'+3.1%',up:true}, long:{val:'+₹4.2Cr',pct:'+28.4%',up:true}},
   unlocked:true, following:true},
  {id:3, name:'Monsoon Fox', handle:'monsoon.fx', slug:'parqueted-passerine', live:true,
   badges:'19 yrs · Seen 10x & 100x · Never panic-sold', followers:6364,
   verified:524, accuracy:74, tradingDays:142, window:180, capital:'₹18.2Cr',
   tickers:[{tk:'HDFCBANK',count:54,flow:24},{tk:'BAJFINANCE',count:36,flow:98}], hidden:3,
   pnls:{swing:{val:'+₹4.6L',pct:'+12.1%',up:true}, btst:{val:'+₹22,400',pct:'+1.4%',up:true}, short:{val:'+₹1.4L',pct:'+0.8%',up:true}, long:{val:'+₹22.8Cr',pct:'+41.2%',up:true}},
   unlocked:false, following:false},
  {id:4, name:'Velvet Bear', handle:'velvet_bear', slug:'fangled-swan', live:false,
   badges:'8 yrs · 18 trades/mo · Swing specialist', followers:266,
   verified:220, accuracy:52, tradingDays:74, window:180, capital:'₹84L',
   tickers:[{tk:'ADANIENT',count:22,flow:8},{tk:'NIFTY50',count:88,flow:42}], hidden:2,
   pnls:{swing:{val:'-₹12,400',pct:'-2.8%',up:false}, btst:{val:'+₹1,200',pct:'+0.2%',up:true}, short:{val:'-₹4,820',pct:'-0.4%',up:false}, long:{val:'-₹41,343',pct:'-3.2%',up:false}},
   unlocked:false, following:false},
];

const DiscoverScreen = ({ screenClass, onUnlock, traders, setTraders, toast }) => {
  const [tab, setTab] = useState(0);
  const [period, setPeriod] = useState('all');
  const [signalDismissed, setSignalDismissed] = useState(() => { try { return localStorage.getItem('of_signal_dismissed') === '1'; } catch(e) { return false; } });
  const onFollow = (id) => {
    setTraders(prev => prev.map(t => t.id===id ? {...t, following:!t.following} : t));
    const t = traders.find(x => x.id===id);
    if (t && !t.following) toast(`Following ${t.name}`);
  };
  const liveCount = traders.filter(t => t.live).length;
  return (
    <div className={screenClass}>
      <StatusBar />
      <TopBar isLogo />
      <div className="screen-body">
        <div className="section-row">
          <span className="eyebrow">Home</span>
          <span className="meta"><span className="lv-dot"></span> {liveCount * 1428} live now</span>
        </div>
        <div className="period-tabs-row">
          <Tabs items={['All','Swing','BTST','Short','Long']} active={['all','swing','btst','short','long'].indexOf(period)} onChange={(i)=>setPeriod(['all','swing','btst','short','long'][i])} />
          <button className="filter-btn icon-only" onClick={()=>toast('Filters')} aria-label="Filters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
          </button>
        </div>
        {!signalDismissed && <SignalBanner onTap={() => { setSignalDismissed(true); try{localStorage.setItem('of_signal_dismissed','1');}catch(e){} toast('Opened'); }} onClose={() => { setSignalDismissed(true); try{localStorage.setItem('of_signal_dismissed','1');}catch(e){} }} />}
        <div className="flow-strip">
          <span className="flow-strip-l">Today's flow</span>
          {[['RELIANCE',147],['BAJFINANCE',98],['TATAMOTORS',82],['ZOMATO',64],['INFY',-31],['HDFCBANK',24]].map(([tk,n],i)=>(
            <span key={tk} className="flow-item">
              <span className="flow-tk">{tk}</span>
              <span className={`flow-cnt ${n>0?'up':'down'}`}>{n>0?'+':''}{n}{n>0?'↑':'↓'}</span>
              {i<5 && <span className="flow-sep">·</span>}
            </span>
          ))}
        </div>
        <div className="cards-list">
          {traders.map((t,i) => (
            <TraderCard key={t.id} t={t} idx={i} period={period} onFollow={onFollow} onUnlock={onUnlock} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ====== SURGE ====== */
const STOCKS_INIT = [
  {tk:'BAJFINANCE', ex:'NSE', price:'₹6,842.50', strength:88, hot:true,  bell:true,  added:98,  trend:'up'},
  {tk:'TATAMOTORS', ex:'NSE', price:'₹942.10',   strength:74, hot:true,  bell:false, added:82,  trend:'up'},
  {tk:'ZOMATO',     ex:'NSE', price:'₹218.40',   strength:52, hot:false, bell:false, added:64,  trend:'up'},
  {tk:'RELIANCE',   ex:'NSE', price:'₹2,890.05', strength:34, hot:false, bell:false, added:147, trend:'up'},
  {tk:'INFY',       ex:'NSE', price:'₹1,524.80', strength:21, hot:false, bell:false, added:31,  trend:'down'},
];

const SurgeScreen = ({ screenClass, toast }) => {
  const [stocks, setStocks] = useState(STOCKS_INIT);
  const [ringing, setRinging] = useState(null);
  const toggleBell = (i) => {
    setStocks(prev => prev.map((s,j) => j===i ? {...s, bell:!s.bell} : s));
    setRinging(i);
    setTimeout(()=>setRinging(null), 520);
    const s = stocks[i];
    toast(s.bell ? `Alert removed · ${s.tk}` : `Alert active · ${s.tk}`);
  };
  return (
    <div className={screenClass}>
      <StatusBar />
      <TopBar title="Surge Watch" />
      <div className="screen-body">
        <div className="section-row">
          <span className="eyebrow">Smart Money Radar</span>
          <span className="meta">Updated 3m ago</span>
        </div>
        <div className="radar">
          <div className="radar-eyebrow">— Insider Flow —</div>
          <div className="radar-title">12 veteran traders rotating</div>
          <div className="radar-body">Bajaj Finance saw a 4.2x volume spike across veteran portfolios today. Tata Motors flow indicates accumulation phase from multibagger-tier traders. Three rotation patterns detected matching prior 100x setups.</div>
          <div className="radar-overlay">
            <button className="btn-pill" onClick={()=>toast('Subscribe flow')}>Subscribe to reveal →</button>
          </div>
        </div>
        <div className="section-row" style={{paddingTop:0}}>
          <span className="eyebrow">Top Surges Today</span>
          <span className="meta">5 stocks</span>
        </div>
        {stocks.map((s,i) => (
          <div className="stock-row" key={s.tk}>
            <span className={`pulse-dot ${s.hot?'hot':''}`}></span>
            <div className="stock-mid">
              <div className="stock-ticker">{s.tk}</div>
              <div className="stock-meta"><span>{s.ex}</span><span>·</span><span>{s.price}</span></div>
              <div className="stock-adds"><span className={`adds-cnt ${s.trend}`}>{s.trend==='up'?'+':'-'}{s.added}</span><span className="adds-lbl">added today</span></div>
              <div className="progress"><div className="progress-fill" style={{width:`${s.strength}%`}}></div></div>
            </div>
            <button className={`bell ${s.bell?'on':''} ${ringing===i?'ringing':''}`} onClick={()=>toggleBell(i)}>
              {Icon.bell()}
            </button>
          </div>
        ))}
        <div className="section-row" style={{paddingTop:22}}>
          <span className="eyebrow">Watchlist</span>
          <span className="meta">1 active</span>
        </div>
        <div className="watch-row">
          <div className="watch-left">
            <span className="pulse-dot hot"></span>
            <div>
              <div className="watch-tk">BAJFINANCE</div>
              <div className="watch-status">Alert active · +4.2% intraday</div>
            </div>
          </div>
          <span className="diamond" style={{color:'var(--g1)'}}>›</span>
        </div>
      </div>
    </div>
  );
};

/* ====== PORTFOLIO ====== */
const HOLDINGS = [
  {tk:'RELIANCE',  qty:'42 sh',  val:'₹1,21,380', chg:'+2.1%', up:true},
  {tk:'INFY',      qty:'88 sh',  val:'₹1,34,170', chg:'+0.8%', up:true},
  {tk:'TATAMOTORS',qty:'120 sh', val:'₹1,13,052', chg:'-1.2%', up:false},
  {tk:'HDFCBANK',  qty:'60 sh',  val:'₹98,400',   chg:'+0.4%', up:true},
  {tk:'ZOMATO',    qty:'400 sh', val:'₹87,360',   chg:'-0.9%', up:false},
];

const CHART_DATA = {
  '1D': {pts:[42,41,43,45,44,46,48,47,49,48,50,52,51,53,52,54,53,55,54,56], delta:'+₹1,420', pct:'+0.6%', up:true},
  '1W': {pts:[40,44,42,48,46,50,53,49,55,52,58,54,60,57,62,59,64,61,66,68], delta:'+₹38,420', pct:'+1.6%', up:true},
  '1M': {pts:[18,22,20,26,30,28,34,32,38,40,38,44,42,48,46,52,55,53,58,62], delta:'+₹2,14,300', pct:'+9.4%', up:true},
  '1Y': {pts:[8,12,10,16,20,18,24,28,26,32,36,34,40,44,42,48,52,50,56,64], delta:'+₹6,82,900', pct:'+37.8%', up:true},
};
const CHART_PERIODS = ['1D','1W','1M','1Y'];

const PortfolioChart = ({ visible }) => {
  const [period, setPeriod] = useState('1M');
  const [hover, setHover] = useState(null);
  const d = CHART_DATA[period];
  const data = d.pts;
  const W = 320, H = 110, P = 4;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v,i) => [
    P + (i/(data.length-1)) * (W - P*2),
    P + (1 - (v-min)/range) * (H - P*2)
  ]);
  const linePath = pts.map((p,i) => (i===0?'M':'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const fillPath = linePath + ` L${pts[pts.length-1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`;
  const last = pts[pts.length-1];
  return (
    <div className="chart-wrap">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:10,gap:10}}>
        <div style={{minWidth:0}}>
          <div className="eyebrow">Equity Growth</div>
          <div className="chart-headline">
            <span className={`pnl ${d.up?'up':'down'}`}>{visible ? d.delta : '••••••'}</span>
            <span className="chart-pct">{d.pct}</span>
          </div>
        </div>
      </div>
      <div className="chart-svg-wrap"
        onMouseMove={(e)=>{
          const r = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * W;
          const idx = Math.max(0, Math.min(data.length-1, Math.round((x - P) / ((W - P*2) / (data.length-1)))));
          setHover({idx, x: pts[idx][0], y: pts[idx][1]});
        }}
        onMouseLeave={()=>setHover(null)}
        onTouchMove={(e)=>{
          const t = e.touches[0]; const r = e.currentTarget.getBoundingClientRect();
          const x = ((t.clientX - r.left) / r.width) * W;
          const idx = Math.max(0, Math.min(data.length-1, Math.round((x - P) / ((W - P*2) / (data.length-1)))));
          setHover({idx, x: pts[idx][0], y: pts[idx][1]});
        }}
        onTouchEnd={()=>setHover(null)}
      >
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" key={period}>
        <defs>
          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(20,18,14,0.14)"/>
            <stop offset="100%" stopColor="rgba(20,18,14,0)"/>
          </linearGradient>
        </defs>
        <path className="chart-fill" d={fillPath}/>
        <path className="chart-line" d={linePath}/>
        <circle className="chart-dot" cx={last[0]} cy={last[1]} r="3.5"/>
        {hover && <>
          <line x1={hover.x} x2={hover.x} y1="0" y2={H} className="chart-cross"/>
          <circle cx={hover.x} cy={hover.y} r="4" className="chart-hover-dot"/>
        </>}
      </svg>
      {hover && (() => {
        const baseValue = period==='1D'?2487430:period==='1W'?2449010:period==='1M'?2273130:2055530;
        const v = Math.round(baseValue * (data[hover.idx] / data[data.length-1]));
        const left = (hover.x / W) * 100;
        return (
          <div className="chart-tip" style={{left:`calc(${left}% - 56px)`}}>
            <div className="chart-tip-v">{visible ? '₹'+v.toLocaleString('en-IN') : '••••••'}</div>
            <div className="chart-tip-l">{period==='1D'?'tick '+(hover.idx+1):period==='1W'?['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][hover.idx%7]:period==='1M'?'day '+(hover.idx+1):'mo '+(hover.idx+1)}</div>
          </div>
        );
      })()}
      </div>
      <div className="chart-periods chart-periods-tabs">
        {CHART_PERIODS.map(p => (
          <button key={p} className={`pp ${period===p?'on':''}`} onClick={()=>setPeriod(p)}>{p}</button>
        ))}
      </div>
    </div>
  );
};

const useCounter = (target, active, dur=900) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) { setV(0); return; }
    let s = performance.now();
    let id;
    const tick = (t) => {
      const p = Math.min(1, (t - s) / dur);
      const eased = 1 - Math.pow(1-p, 3);
      setV(Math.round(target * eased));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active, target]);
  return v;
};

const BROKERS_INIT = [
  {id:'zerodha',  name:'Zerodha',     glyph:'Z', tint:'#387ED1', connected:true,  acct:'KP1842', value:'₹24,87,430'},
  {id:'groww',    name:'Groww',       glyph:'G', tint:'#00B386', connected:false},
  {id:'upstox',   name:'Upstox',      glyph:'U', tint:'#702EFF', connected:false},
  {id:'angelone', name:'Angel One',   glyph:'A', tint:'#E63946', connected:false},
  {id:'icici',    name:'ICICI Direct',glyph:'I', tint:'#B92534', connected:false},
  {id:'dhan',     name:'Dhan',        glyph:'D', tint:'#1B4D8B', connected:false},
];

const BrokerSheet = ({ open, onClose, brokers, setBrokers, toast }) => {
  const [pendingId, setPendingId] = useState(null);
  const [justConnectedId, setJustConnectedId] = useState(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState(null);
  const connect = (id) => {
    setPendingId(id);
    setTimeout(() => {
      setBrokers(bs => bs.map(b => b.id===id ? {...b, connected:true, acct:'KP'+Math.floor(1000+Math.random()*9000), value:'₹'+(Math.floor(50+Math.random()*900))+',•••'} : b));
      setPendingId(null);
      setJustConnectedId(id);
      setTimeout(() => setJustConnectedId(null), 600);
      toast(brokers.find(b=>b.id===id).name + ' connected');
    }, 1300);
  };
  const disconnect = (id) => {
    setBrokers(bs => bs.map(b => b.id===id ? {...b, connected:false, acct:undefined, value:undefined} : b));
    setConfirmDisconnect(null);
    toast('Disconnected');
  };
  return (
    <div className={`modal-overlay ${open?'show':''}`} onClick={onClose}>
      <div className="sheet broker-sheet" onClick={e=>e.stopPropagation()}>
        <div className="handle"></div>
        <div className="broker-sheet-head">
          <div>
            <h2>Brokers</h2>
            <div className="broker-sheet-sub">Read-only sync. We never place trades.</div>
          </div>
          <button className="sheet-x" onClick={onClose}>×</button>
        </div>
        <div className="broker-list">
          {brokers.map(b => (
            <div className={`broker-row ${b.connected?'on':''} ${justConnectedId===b.id?'just-connected':''}`} key={b.id}>
              <div className="broker-glyph" style={{background:b.tint}}>{b.glyph}</div>
              <div className="broker-info">
                <div className="broker-name">{b.name}</div>
                <div className="broker-meta">
                  {pendingId===b.id
                    ? <span className="broker-connecting"><span className="broker-spin"></span>Connecting via SEBI Account Aggregator…</span>
                    : b.connected
                      ? <><span className="broker-dot"></span>Connected · {b.acct}</>
                      : 'Not connected'}
                </div>
              </div>
              {pendingId===b.id
                ? <span className="broker-action ghost">…</span>
                : b.connected
                  ? <button className="broker-action disconnect" onClick={()=>setConfirmDisconnect(b.id)}>Disconnect</button>
                  : <button className="broker-action connect" onClick={()=>connect(b.id)}>Connect</button>
              }
            </div>
          ))}
        </div>
        <div className="broker-fineprint">
          · Linked via SEBI Account Aggregator (Sahamati framework)<br/>
          · Holdings sync once daily · You may revoke any time
        </div>
      </div>
      {confirmDisconnect && <div className="confirm-overlay" onClick={()=>setConfirmDisconnect(null)}>
        <div className="confirm-card" onClick={e=>e.stopPropagation()}>
          <div className="confirm-title">Disconnect {brokers.find(b=>b.id===confirmDisconnect)?.name}?</div>
          <div className="confirm-body">Your followers will see your portfolio update one last time, then it will pause until you reconnect.</div>
          <div className="confirm-row">
            <button className="confirm-cancel" onClick={()=>setConfirmDisconnect(null)}>Keep connected</button>
            <button className="confirm-go" onClick={()=>disconnect(confirmDisconnect)}>Disconnect</button>
          </div>
        </div>
      </div>}
    </div>
  );
};

const PortfolioScreen = ({ screenClass, onUnlockPeer, toast, subscribed }) => {
  const isActive = screenClass.includes('active');
  const [visible, setVisible] = useState(true);
  const [settled, setSettled] = useState(false);
  const [brokers, setBrokers] = useState(BROKERS_INIT);
  const [brokerSheet, setBrokerSheet] = useState(false);
  const counter = useCounter(2487430, isActive);
  const todayPnl = useCounter(1420, isActive);
  useEffect(() => {
    if (isActive) { setSettled(false); const t = setTimeout(()=>setSettled(true), 920); return ()=>clearTimeout(t); }
  }, [isActive]);
  const connected = brokers.filter(b => b.connected);
  const primary = connected[0];
  return (
    <div className={screenClass}>
      <StatusBar />
      <TopBar title="Portfolio" />
      <div className="screen-body">
        <button className="broker-tag broker-tag-btn" onClick={()=>setBrokerSheet(true)}>
          {connected.length === 0
            ? <><span className="broker-tag-empty">+</span><span>Connect a broker</span></>
            : <>
                <span className="broker-tag-stack">
                  {connected.slice(0,3).map(b => (
                    <span key={b.id} className="broker-tag-glyph" style={{background:b.tint}}>{b.glyph}</span>
                  ))}
                </span>
                <span>{connected.length === 1 ? primary.name : `${connected.length} brokers`} · Connected</span>
              </>}
          <span className="broker-tag-edit">Manage</span>
        </button>
        <BrokerSheet open={brokerSheet} onClose={()=>setBrokerSheet(false)} brokers={brokers} setBrokers={setBrokers} toast={toast} />
        <div className="hero">
          <div className="eyebrow">Total Value{primary ? ' · ' + primary.name : ''} {subscribed && <span className="sub-pill">PRO</span>}</div>
          <div className={`balance ${settled?'settled':''}`}>{visible ? '₹'+counter.toLocaleString('en-IN') : '₹•• ••,•••'}</div>
          <div className="pnl-line">
            <span>Today</span>
            <span className="pnl up">+₹{todayPnl.toLocaleString('en-IN')}</span>
            <span style={{color:'var(--g1)',fontFamily:'var(--mono)',fontSize:12}}>(+0.6%)</span>
          </div>
        </div>
        <PortfolioChart visible={visible} />
        <div className="divrow">
          <span className="label">Visible to followers</span>
          <button className={`toggle ${visible?'on':''}`} onClick={()=>setVisible(v=>!v)}></button>
        </div>
        <div className="twocol">
          <div className="col">
            <div className="eyebrow">Credits Earned</div>
            <div className="val"><span className="diamond">◈</span> 240</div>
            <div className="sub">48 followers × ◈5</div>
          </div>
          <div className="divider"></div>
          <div className="col">
            <div className="eyebrow">Peer Return</div>
            {subscribed ? <>
              <div className="val">+22.8%</div>
              <div className="sub peer">Beating peer avg by +4.4%</div>
            </> : <div className="blur-wrap">
              <div className="val">+22.8%</div>
              <div className="sub peer">Peer avg: +18.4%</div>
              <button className="gate-mini" onClick={onUnlockPeer}>Subscribe</button>
            </div>}
          </div>
        </div>
        <div className="section-head">
          <h3>Holdings</h3>
          <span className="meta">5 positions</span>
        </div>
        {HOLDINGS.map((h,i) => (
          <div className="holding-row" key={h.tk} style={{animationDelay:`${i*40}ms`}}>
            <div className="holding-left">
              <div className="holding-tk">{h.tk}</div>
              <div className="holding-qty">{h.qty}</div>
            </div>
            <div className="holding-right">
              <div className="holding-val">{h.val}</div>
              <div className={`holding-chg ${h.up?'up':'down'}`}>{h.up?'↑':'↓'} {h.chg}</div>
            </div>
          </div>
        ))}
        <div className="xray">
          <div className="text"><b>X-Ray.</b> See sector overlap, concentration risk, and how your book compares to top traders.</div>
          <button className="btn-unlock outline" onClick={()=>toast('X-Ray unlock')}>Unlock</button>
        </div>
      </div>
    </div>
  );
};

/* ====== INTELLIGENCE ====== */
const INITIAL_FOLLOWED = [
  {name:'Silent Bull', initials:'SB', trade:'Trimmed ZOMATO · Added BAJFINANCE'},
  {name:'Iron Crane',  initials:'IC', trade:'Held RELIANCE for 9 quarters · No exit'},
];
const INITIAL_ALERTS = [
  {id:1, text:'Silent Bull added BAJFINANCE', time:'14m', dim:false},
  {id:2, text:'Monsoon Fox exited HDFC', time:'2h',  dim:false},
  {id:3, text:'Iron Crane: full sector report ready', time:'1d', dim:false, locked:false},
  {id:4, text:'Surge match · 3 veterans rotated into TATAMOTORS', time:'2d', dim:true, locked:true},
];

const IntelligenceScreen = ({ screenClass, onUnlock, toast, subscribed }) => {
  const [tab, setTab] = useState(0);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [removingId, setRemovingId] = useState(null);
  const removeAlert = (id) => {
    setRemovingId(id);
    setTimeout(()=>{
      setAlerts(prev => prev.filter(a => a.id !== id));
      setRemovingId(null);
    }, 300);
  };
  return (
    <div className={screenClass}>
      <StatusBar />
      <TopBar title="Intelligence" />
      <div className="screen-body">
        <Tabs items={['Following','My Alerts']} active={tab} onChange={setTab} />
        {tab === 0 && (
          <div className="tab-panel" key="following" style={{paddingTop:0}}>
            <div style={{paddingTop:8}}>
              {INITIAL_FOLLOWED.map((f,i) => (
                <div className="follow-row" key={f.name} style={{animationDelay:`${i*40}ms`,animation:'rowIn 380ms var(--ease) both'}}>
                  <div className="avatar">{f.initials}</div>
                  <div className="follow-mid">
                    <div className="follow-name">{f.name}</div>
                    <div className="follow-trade">{f.trade}</div>
                  </div>
                  <button className="btn-unfollow" onClick={()=>toast(`Unfollowed ${f.name}`)}>Unfollow</button>
                </div>
              ))}
            </div>
            <div className="sim">
              <div className="eyebrow">If You Had Followed</div>
              <h4>Silent Bull · last 90 days</h4>
              <div className="sim-stats">
                <div className="sim-stat">
                  <div className="stat-label">Their return</div>
                  <div className="stat-val">+38.2%</div>
                </div>
                <div className="sim-stat">
                  <div className="stat-label">Nifty</div>
                  <div className="stat-val">+8.1%</div>
                </div>
              </div>
              <div className="sim-gate">
                <button className="pill" onClick={onUnlock}>Subscribe to see →</button>
              </div>
            </div>
            <div className="compound">
              <div className="eyebrow">Compound Alert</div>
              <div className="quote">"3 veteran traders you follow added the same stock this week — only available to subscribers."</div>
              <button className="btn-pill" onClick={()=>toast('Subscribe flow')}>Subscribe →</button>
            </div>
          </div>
        )}
        {tab === 1 && (
          <div className="tab-panel" key="alerts" style={{paddingTop:8}}>
            {alerts.map((a,i) => (
              <div key={a.id}
                className={`alert-row ${a.dim?'dim':''} ${removingId===a.id?'removing':''}`}
                style={{animationDelay:`${i*40}ms`,animation:'rowIn 380ms var(--ease) both'}}>
                <span className="alert-dot"></span>
                <div className="alert-mid">
                  <div className="alert-text">{a.text}{a.locked && <span style={{fontFamily:'var(--dm)',fontStyle:'italic',color:'var(--g1)',fontSize:11,marginLeft:6}}>· Requires subscription</span>}</div>
                  <div className="alert-time">{a.time} ago</div>
                </div>
                <button className="alert-del" onClick={()=>removeAlert(a.id)}>×</button>
              </div>
            ))}
            <div className="add-alert">
              <div>
                <div className="label">+ Add Alert</div>
                <div className="meta">3/3 used · upgrade for unlimited</div>
              </div>
              <button className="plus" onClick={()=>toast('Alert limit reached')}>+</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ====== MODAL ====== */
const UnlockModal = ({ open, trader, onClose, toast, onSubscribe, subscribed }) => {
  const [stage, setStage] = useState('preview'); // preview | pay | success
  useEffect(() => { if (open) setStage('preview'); }, [open]);
  const pay = () => {
    setStage('pay');
    setTimeout(() => {
      setStage('success');
      onSubscribe();
      setTimeout(() => { onClose(); }, 1400);
    }, 1100);
  };
  return (
    <div className={`modal-overlay ${open?'show':''}`} onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="handle"></div>
        {stage === 'preview' && <>
          <div className="sheet-header">
            <div className="sheet-avatar">{trader ? initials(trader.name) : 'IC'}</div>
            <div>
              <h2>{trader?.name || 'Iron Crane'}</h2>
              <div className="badges">{trader?.badges || '14 yrs · Seen a 100x · 22 trades/mo'}</div>
            </div>
          </div>
          <div className="sheet-section-label">Holdings preview</div>
          <div className="sheet-block">
            {[['RELIANCE','₹1,42,318'],['INFY','₹88,402'],['HDFCBANK','₹62,950'],['BAJFINANCE','₹39,210']].map(([tk,v]) => (
              <div className="sheet-holding" key={tk}>
                <span className="tk">{subscribed ? tk : <span className="score-blur">{tk}</span>}</span>
                <span className="v">{subscribed ? v : '₹•,••,•••'}</span>
              </div>
            ))}
          </div>
          <div className="sheet-section-label">If You Had Followed</div>
          <div className="sim-mini">
            <div className="stats">
              <div><div className="l">Their return</div><div className="v up">+38.2%</div></div>
              <div><div className="l">Nifty</div><div className="v">+8.1%</div></div>
            </div>
            {!subscribed && <>
              <div style={{height:42}}></div>
              <button className="gate-pill" onClick={pay}>Subscribe ₹499/mo →</button>
            </>}
          </div>
          <button className="btn-pill" onClick={()=>{toast('Portfolio unlocked'); onClose();}}>
            {subscribed ? 'Open Full Portfolio' : <>Unlock Full Portfolio <span className="dia">◈ 10</span></>}
          </button>
          {!subscribed && <div className="sub-line">◈ 240 available · ◈ 230 after unlock</div>}
        </>}
        {stage === 'pay' && (
          <div className="pay-stage">
            <div className="pay-spin"><span className="dia">◈</span></div>
            <div className="pay-title">Processing payment</div>
            <div className="pay-sub">UPI · ₹499.00 · openfolio Pro</div>
            <div className="pay-bar"><div className="pay-bar-fill"></div></div>
          </div>
        )}
        {stage === 'success' && (
          <div className="pay-stage">
            <div className="pay-tick">✓</div>
            <div className="pay-title">You're in</div>
            <div className="pay-sub">openfolio Pro is now active</div>
            <div className="pay-perks">
              <div>+ Full peer-return benchmarking</div>
              <div>+ All locked alerts &amp; reports</div>
              <div>+ X-Ray on your portfolio</div>
              <div>+ See Live for every active trader</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ====== BOTTOM NAV ====== */
const BottomNav = ({ active, onChange }) => {
  const items = [
    {key:'discover', label:'Home',      icon:Icon.home},
    {key:'surge',    label:'Surge',     icon:Icon.surge},
    {key:'portfolio',label:'Portfolio', icon:Icon.portfolio},
    {key:'alerts',   label:'Bell',      icon:Icon.bell},
  ];
  return (
    <div className="bottomnav">
      {items.map((it,i) => (
        <button key={it.key} className={`navitem ${active===i?'active':''}`} onClick={()=>onChange(i)}>
          <span className="navitem-icon">{it.icon(active===i?'#fff':'#CCCCCC')}</span>
          <span className="navitem-label">{it.label}</span>
        </button>
      ))}
    </div>
  );
};

/* ====== DIRECTIONAL SCREEN WRAPPER ====== */
const useDirectionalNav = (screen) => {
  const prev = useRef(screen);
  const [dir, setDir] = useState(null); // 'left' | 'right'
  useEffect(() => {
    if (prev.current !== screen) {
      setDir(screen > prev.current ? 'right' : 'left');
      prev.current = screen;
    }
  }, [screen]);
  return dir;
};

/* ====== APP ====== */
const ONBOARD_KEY = 'openfolio_onboarded_v1';
const PSEUDO_POOL = ['Cobalt Hawk','Glass Tiger','Quiet Wolf','Smoke Heron','Marble Fox','Slate Owl','Pale Crane','Steel Otter','Ash Lynx','Iron Crow'];
const OB_BROKER_TINTS = {zerodha:'#387ED1',groww:'#00B386',upstox:'#702EFF',angelone:'#E63946'};

/* ── Illustration 0: Hidden Portfolios ── */
const ObIllus0 = () => (
  <svg viewBox="0 0 320 250" fill="none" className="ob2-svg" aria-hidden="true">
    <circle cx="30" cy="38" r="5" fill="#111"/>
    <circle cx="291" cy="54" r="3.5" fill="#111"/>
    <circle cx="18" cy="168" r="3" fill="#E4E4E4"/>
    <circle cx="300" cy="178" r="7" stroke="#E4E4E4" strokeWidth="1.5"/>
    <circle cx="268" cy="30" r="11" stroke="#E4E4E4" strokeWidth="1.5"/>
    {/* Left ghost card */}
    <g transform="rotate(-10,80,138)">
      <rect x="14" y="96" width="112" height="78" rx="13" fill="#F7F7F7" stroke="#E4E4E4" strokeWidth="1.5"/>
      <rect x="28" y="112" width="46" height="8" rx="4" fill="#E4E4E4"/>
      <rect x="28" y="128" width="68" height="5" rx="2.5" fill="#EEEEEE"/>
      <rect x="28" y="141" width="55" height="5" rx="2.5" fill="#EEEEEE"/>
      <rect x="28" y="154" width="38" height="5" rx="2.5" fill="#EEEEEE"/>
      <rect x="90" y="136" width="17" height="14" rx="4" fill="#CCCCCC"/>
      <path d="M93 136 Q93 130 98.5 130 Q104 130 104 136" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
    {/* Right ghost card */}
    <g transform="rotate(8,238,132)">
      <rect x="194" y="88" width="112" height="78" rx="13" fill="#F7F7F7" stroke="#E4E4E4" strokeWidth="1.5"/>
      <rect x="208" y="104" width="46" height="8" rx="4" fill="#E4E4E4"/>
      <rect x="208" y="120" width="68" height="5" rx="2.5" fill="#EEEEEE"/>
      <rect x="208" y="133" width="55" height="5" rx="2.5" fill="#EEEEEE"/>
      <rect x="208" y="146" width="38" height="5" rx="2.5" fill="#EEEEEE"/>
      <rect x="266" y="128" width="17" height="14" rx="4" fill="#CCCCCC"/>
      <path d="M269 128 Q269 122 274.5 122 Q280 122 280 128" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
    {/* Centre aperture eye */}
    <circle cx="160" cy="125" r="52" fill="white" stroke="#111" strokeWidth="2"/>
    <path d="M160 125 L160 73 L204 99Z" fill="white"/><path d="M160 125 L204 99 L204 151Z" fill="white"/>
    <path d="M160 125 L204 151 L160 177Z" fill="white"/><path d="M160 125 L160 177 L116 151Z" fill="white"/>
    <path d="M160 125 L116 151 L116 99Z" fill="white"/><path d="M160 125 L116 99 L160 73Z" fill="white"/>
    <circle cx="160" cy="125" r="20" fill="#111"/>
    <circle cx="160" cy="125" r="7" fill="white"/>
    {/* Trend dash */}
    <path d="M44 228 Q100 200 152 180 Q200 158 255 132" stroke="#111" strokeWidth="1.5" strokeDasharray="4 5" opacity="0.18"/>
    {/* Candlesticks */}
    <g transform="translate(254,42)" opacity="0.5">
      <line x1="5" y1="0" x2="5" y2="26" stroke="#111" strokeWidth="1.5"/>
      <rect x="1" y="6" width="8" height="14" fill="#111" rx="1"/>
      <line x1="20" y1="4" x2="20" y2="24" stroke="#111" strokeWidth="1.5"/>
      <rect x="16" y="10" width="8" height="10" fill="none" stroke="#111" strokeWidth="1.5" rx="1"/>
      <line x1="35" y1="2" x2="35" y2="22" stroke="#111" strokeWidth="1.5"/>
      <rect x="31" y="5" width="8" height="12" fill="#111" rx="1"/>
    </g>
    {/* ₹? removed — font can't load in SVG */}
    <rect x="282" y="202" width="15" height="15" rx="3" stroke="#CCCCCC" strokeWidth="1.5" transform="rotate(22,289,209)"/>
    <circle cx="55" cy="84" r="7" stroke="#DDDDDD" strokeWidth="1.5"/>
  </svg>
);

/* ── Illustration 1: Credit Exchange ── */
const ObIllus1 = () => (
  <svg viewBox="0 0 320 250" fill="none" className="ob2-svg" aria-hidden="true">
    {/* Accent dots */}
    <circle cx="28" cy="38" r="4.5" fill="#111"/>
    <circle cx="290" cy="28" r="4" fill="#111"/>
    <circle cx="18" cy="218" r="3" fill="#E4E4E4"/>
    <circle cx="302" cy="215" r="6" stroke="#CCCCCC" strokeWidth="1.5"/>
    {/* YOUR portfolio card — light, tilted left */}
    <g transform="rotate(-5,74,130)">
      <rect x="12" y="50" width="124" height="160" rx="16" fill="#FAFAFA" stroke="#E8E8E8" strokeWidth="1.5"/>
      <rect x="28" y="66" width="52" height="9" rx="4.5" fill="#EEEEEE"/>
      <rect x="86" y="66" width="34" height="9" rx="4.5" fill="#F4F4F4"/>
      <rect x="28" y="174" width="14" height="18" rx="3" fill="#DDDDDD"/>
      <rect x="48" y="158" width="14" height="34" rx="3" fill="#BBBBBB"/>
      <rect x="68" y="140" width="14" height="52" rx="3" fill="#888"/>
      <rect x="88" y="126" width="14" height="66" rx="3" fill="#444"/>
      <rect x="108" y="140" width="14" height="52" rx="3" fill="#111"/>
      <path d="M35 166 L55 151 L75 133 L95 120 L115 133" stroke="#111" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45"/>
      <text x="74" y="222" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="7.5" fontWeight="700" fill="#BBBBBB" letterSpacing="1.8">YOURS</text>
    </g>
    {/* VETERAN portfolio card — dark, tilted right */}
    <g transform="rotate(5,246,130)">
      <rect x="184" y="50" width="124" height="160" rx="16" fill="#111"/>
      <rect x="200" y="66" width="52" height="9" rx="4.5" fill="white" opacity="0.1"/>
      <rect x="258" y="66" width="34" height="9" rx="4.5" fill="white" opacity="0.07"/>
      <rect x="200" y="174" width="14" height="18" rx="3" fill="white" opacity="0.1"/>
      <rect x="220" y="158" width="14" height="34" rx="3" fill="white" opacity="0.1"/>
      <rect x="240" y="140" width="14" height="52" rx="3" fill="white" opacity="0.1"/>
      <rect x="260" y="126" width="14" height="66" rx="3" fill="white" opacity="0.1"/>
      <rect x="280" y="140" width="14" height="52" rx="3" fill="white" opacity="0.1"/>
      <rect x="192" y="120" width="108" height="78" rx="10" fill="#111" opacity="0.85"/>
      <rect x="240" y="136" width="28" height="24" rx="7" fill="white" opacity="0.9"/>
      <path d="M245 136 Q245 128 254 128 Q263 128 263 136" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9"/>
      <circle cx="254" cy="146" r="3" fill="#111"/>
      <rect x="252.5" y="148" width="3" height="5" rx="1.5" fill="#111"/>
      <text x="246" y="222" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="7.5" fontWeight="700" fill="white" opacity="0.22" letterSpacing="1.8">VETERAN</text>
    </g>
    {/* Exchange circle — drawn on top of both cards */}
    <circle cx="160" cy="130" r="22" fill="#111"/>
    <path d="M151 123 L169 123" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <polyline points="164,118 169,123 164,128" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M169 137 L151 137" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <polyline points="156,132 151,137 156,142" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* Decorative */}
    <rect x="270" y="34" width="13" height="13" rx="3" stroke="#CCCCCC" strokeWidth="1.5" transform="rotate(18,276,40)"/>
  </svg>
);

/* ── Illustration 2: Your Identity ── */
const ObIllus2 = ({ pseudo }) => {
  const ini = initials(pseudo);
  return (
    <svg viewBox="0 0 320 250" fill="none" className="ob2-svg" aria-hidden="true">
      <circle cx="32" cy="40" r="5" fill="#111"/><circle cx="288" cy="58" r="3.5" fill="#111"/>
      {/* Orbiting rejected names */}
      <circle cx="92" cy="56" r="20" fill="#F7F7F7" stroke="#EEEEEE" strokeWidth="1.5"/>
      <text x="92" y="59" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="8.5" fill="#CCCCCC">Rahul K.</text>
      <line x1="73" y1="56" x2="111" y2="56" stroke="#CCCCCC" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="232" cy="48" r="20" fill="#F7F7F7" stroke="#EEEEEE" strokeWidth="1.5"/>
      <text x="232" y="51" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="8.5" fill="#CCCCCC">Priya M.</text>
      <line x1="213" y1="48" x2="251" y2="48" stroke="#CCCCCC" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="74" cy="180" r="20" fill="#F7F7F7" stroke="#EEEEEE" strokeWidth="1.5"/>
      <text x="74" y="183" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="8.5" fill="#CCCCCC">Amit R.</text>
      <line x1="55" y1="180" x2="93" y2="180" stroke="#CCCCCC" strokeWidth="1" strokeLinecap="round"/>
      {/* Dotted connectors */}
      <path d="M108 64 Q130 86 142 100" stroke="#EEEEEE" strokeWidth="1" strokeDasharray="3 4"/>
      <path d="M214 56 Q192 76 178 100" stroke="#EEEEEE" strokeWidth="1" strokeDasharray="3 4"/>
      <path d="M90 164 Q112 152 138 138" stroke="#EEEEEE" strokeWidth="1" strokeDasharray="3 4"/>
      {/* Main avatar */}
      <circle cx="160" cy="122" r="70" fill="none" stroke="#E4E4E4" strokeWidth="1.5"/>
      <circle cx="160" cy="122" r="60" fill="#111"/>
      <text x="160" y="140" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="32" fontWeight="700" fill="white">{ini}</text>
      {/* Name badge */}
      <rect x="112" y="196" width="96" height="28" rx="14" fill="#111"/>
      <text x="160" y="215" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="11" fontWeight="700" fill="white">{pseudo.length>12?pseudo.split(' ')[0]:pseudo}</text>
      <rect x="278" y="178" width="14" height="14" rx="3" stroke="#CCCCCC" strokeWidth="1.5" transform="rotate(20,285,185)"/>
      <circle cx="50" cy="112" r="8" stroke="#EEEEEE" strokeWidth="1.5"/>
    </svg>
  );
};

/* ── Illustration 3: Broker Shield ── */
const ObIllus3 = () => (
  <svg viewBox="0 0 320 250" fill="none" className="ob2-svg" aria-hidden="true">
    <circle cx="28" cy="44" r="4.5" fill="#111"/><circle cx="292" cy="60" r="3.5" fill="#111"/>
    <circle cx="20" cy="195" r="3" fill="#E4E4E4"/>
    {/* Shield */}
    <path d="M160 26 L212 50 L212 114 Q212 158 160 180 Q108 158 108 114 L108 50Z" fill="#F7F7F7" stroke="#111" strokeWidth="2"/>
    <rect x="144" y="102" width="32" height="26" rx="7" fill="#111"/>
    <path d="M149 102 Q149 88 160 88 Q171 88 171 102" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <circle cx="160" cy="113" r="4.5" fill="white"/>
    <rect x="158" y="116" width="4" height="7" rx="1.5" fill="white"/>
    {/* Broker dots */}
    <path d="M114 76 L90 72" stroke="#DDDDDD" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="72" cy="72" r="26" fill="#387ED1"/>
    <text x="72" y="79" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="18" fontWeight="700" fill="white">Z</text>
    <path d="M206 76 L230 72" stroke="#DDDDDD" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="248" cy="72" r="26" fill="#00B386"/>
    <text x="248" y="79" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="18" fontWeight="700" fill="white">G</text>
    <path d="M114 152 L90 165" stroke="#DDDDDD" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="74" cy="174" r="26" fill="#702EFF"/>
    <text x="74" y="181" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="18" fontWeight="700" fill="white">U</text>
    <path d="M206 152 L230 165" stroke="#DDDDDD" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="246" cy="174" r="26" fill="#E63946"/>
    <text x="246" y="181" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="18" fontWeight="700" fill="white">A</text>
    {/* SEBI badge */}
    <rect x="112" y="198" width="96" height="26" rx="13" fill="#F0F0F0" stroke="#E4E4E4" strokeWidth="1"/>
    <text x="160" y="215" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="11" fontWeight="600" fill="#888">SEBI · AA</text>
    <rect x="280" y="202" width="15" height="15" rx="3" stroke="#CCCCCC" strokeWidth="1.5" transform="rotate(18,287,209)"/>
    <circle cx="160" cy="20" r="3.5" fill="#E4E4E4"/>
  </svg>
);

const Onboarding = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState('go-forward');
  const [pseudo, setPseudo] = useState(PSEUDO_POOL[Math.floor(Math.random()*PSEUDO_POOL.length)]);
  const [selBroker, setSelBroker] = useState(0);

  const reroll = () => {
    let n = pseudo;
    while (n === pseudo) n = PSEUDO_POOL[Math.floor(Math.random()*PSEUDO_POOL.length)];
    setPseudo(n);
  };
  const next = () => { setDir('go-forward'); step < 3 ? setStep(step+1) : onDone(); };
  const back = () => { setDir('go-back'); setStep(step-1); };

  const STEPS = [
    {
      illus: <ObIllus0 />,
      headline: "The moves veteran traders don't post about.",
      copy: "Real portfolios. Zero identity. See who's positioned where — without revealing who you are.",
    },
    {
      illus: <ObIllus1 />,
      headline: "A silent exchange. Credit for credit.",
      copy: "Share your portfolio and earn ◈ credits. Spend them to unlock any veteran trader's book.",
    },
    {
      illus: <ObIllus2 pseudo={pseudo} />,
      headline: `You're ${pseudo}.`,
      copy: "Randomly generated. No one — not even openfolio — can link this handle to your real identity.",
      extra: <button className="ob-reroll" style={{marginTop:14}} onClick={reroll}>↻ try another name</button>,
    },
    {
      illus: <ObIllus3 />,
      headline: "Bring your portfolio. We'll never trade.",
      copy: "Read-only sync via SEBI Account Aggregator. Your credentials never leave your device.",
      extra: (
        <div className="ob2-brokers">
          {[{n:'Zerodha',t:'#387ED1'},{n:'Groww',t:'#00B386'},{n:'Upstox',t:'#702EFF'},{n:'Angel One',t:'#E63946'}].map((b,i)=>(
            <button key={b.n} className={`ob2-broker ${selBroker===i?'on':''}`} onClick={()=>setSelBroker(i)}>
              <span className="ob2-broker-dot" style={{background:b.t}}>{b.n[0]}</span>
              <span>{b.n}</span>
              {selBroker===i && <span className="ob2-broker-check">✓</span>}
            </button>
          ))}
        </div>
      ),
    },
  ];

  const s = STEPS[step];

  return (
    <div className="ob2">
      <StatusBar />
      <div className="ob2-top">
        <span className="ob2-count">{step+1}<span style={{opacity:.3}}> / 4</span></span>
        {step < 3 && <button className="ob2-skip" onClick={onDone}>Skip</button>}
      </div>

      <div className="ob2-illus">
        <div className={`ob2-illus-inner ${dir}`} key={step}>{s.illus}</div>
        <div className="ob2-progress">
          {[0,1,2,3].map(i=><span key={i} className={`ob2-pdot ${i===step?'on':i<step?'past':''}`}/>)}
        </div>
      </div>

      <div className="ob2-content" key={`c${step}`}>
        <h2 className="ob2-headline">{s.headline}</h2>
        <p className="ob2-copy">{s.copy}</p>
        {s.extra}
      </div>

      <div className="ob2-footer">
        {step > 0 ? <button className="ob2-back-btn" onClick={back}>←</button> : <span/>}
        <button className="ob2-next-btn" onClick={next}>→</button>
      </div>
    </div>
  );
};

const App = () => {
  const [onboarded, setOnboarded] = useState(() => {
    try { return localStorage.getItem(ONBOARD_KEY) === '1'; } catch { return false; }
  });
  const finishOnboarding = () => {
    try { localStorage.setItem(ONBOARD_KEY, '1'); } catch {}
    setOnboarded(true);
  };
  const [screen, setScreen] = useState(0);
  const [prevScreen, setPrevScreen] = useState(0);
  const [traders, setTraders] = useState(TRADERS_INIT);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTrader, setModalTrader] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(()=>setToastMsg(null), 2600);
  };

  const openUnlock = (t) => {
    setModalTrader(t);
    setModalOpen(true);
  };

  const navigate = (next) => {
    setPrevScreen(screen);
    setScreen(next);
  };

  const screenClass = (idx) => {
    const isActive = screen === idx;
    const wasActive = prevScreen === idx && prevScreen !== screen;
    const goingRight = screen > prevScreen;
    if (isActive) return `screen active ${goingRight ? 'enter-right' : 'enter-left'}`;
    if (wasActive) return `screen ${goingRight ? 'exit-left' : 'exit-right'}`;
    return 'screen';
  };

  return (
    <div className="device">
      {!onboarded && <Onboarding onDone={finishOnboarding} />}
      {onboarded && <>
      <DiscoverScreen screenClass={screenClass(0)} traders={traders} setTraders={setTraders} onUnlock={openUnlock} toast={showToast} />
      <SurgeScreen screenClass={screenClass(1)} toast={showToast} />
      <PortfolioScreen screenClass={screenClass(2)} onUnlockPeer={()=>openUnlock(null)} toast={showToast} subscribed={subscribed} />
      <IntelligenceScreen screenClass={screenClass(3)} onUnlock={()=>openUnlock(null)} toast={showToast} subscribed={subscribed} />
      <BottomNav active={screen} onChange={navigate} />
      <UnlockModal open={modalOpen} trader={modalTrader} onClose={()=>setModalOpen(false)} toast={showToast} onSubscribe={()=>setSubscribed(true)} subscribed={subscribed} />
      <div className={`toast ${toastMsg?'show':''}`}>{toastMsg || ''}</div>
      </>}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
