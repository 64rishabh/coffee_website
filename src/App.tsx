import { useState, useEffect, useRef, useCallback } from 'react';

/* ============================================
   BREWHAUS — Artisan Coffee Experience
   ============================================ */

// ---- PRELOADER ----
function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 800);
          }, 300);
          return 100;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setDone(true);
    setTimeout(onComplete, 800);
  };

  return (
    <div
      className={`preloader ${done ? 'done' : ''}`}
      onClick={handleSkip}
      role="progressbar"
      aria-valuenow={Math.min(Math.round(progress), 100)}
    >
      {/* Line-art coffee cup SVG with steam */}
      <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cup body */}
        <path d="M20 70 L25 140 Q30 155 60 155 Q90 155 95 140 L100 70 Z" stroke="#E8D5B7" strokeWidth="2" fill="none" />
        {/* Cup handle */}
        <path d="M100 85 Q120 85 120 105 Q120 125 100 125" stroke="#E8D5B7" strokeWidth="2" fill="none" />
        {/* Steam paths */}
        <path className="steam-path" d="M45 65 Q40 45 50 30 Q60 15 55 0" stroke="#C08457" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path className="steam-path" d="M60 65 Q55 40 65 25 Q75 10 70 0" stroke="#C08457" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path className="steam-path" d="M75 65 Q70 50 80 35 Q90 20 85 5" stroke="#C08457" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      <div className="preloader-counter">
        {Math.min(Math.round(progress), 100)}%
      </div>
    </div>
  );
}

// ---- HERO SECTION ----
function Hero() {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    btn.style.setProperty('--x', `${x}%`);
    btn.style.setProperty('--y', `${y}%`);

    // Magnetic effect
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) * 0.15;
    const distY = (e.clientY - centerY) * 0.15;
    btn.style.transform = `translate(${distX}px, ${distY}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const btn = btnRef.current;
    if (btn) {
      btn.style.transform = 'translate(0, 0)';
    }
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, letterSpacing: '-0.03em' }}
          className="text-5xl md:text-7xl lg:text-8xl text-[var(--crema)] mb-6"
        >
          <span className="line-reveal block">
            <span className="line-reveal-inner block">Every cup</span>
          </span>
          <span className="line-reveal block">
            <span className="line-reveal-inner block">tells a</span>
          </span>
          <span className="line-reveal block">
            <span className="line-reveal-inner block" style={{ fontStyle: 'italic', color: 'var(--caramel)' }}>story.</span>
          </span>
        </h1>
        <p className="fade-up text-lg md:text-xl text-[var(--crema)] opacity-70 mb-10 max-w-xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
          Single-origin beans, roasted with intention. From farm to your morning ritual.
        </p>
        <div className="fade-up" style={{ animationDelay: '0.9s' }}>
          <button
            ref={btnRef}
            className="magnetic-btn"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>Explore Our Roasts</span>
          </button>
        </div>
      </div>
      {/* Scroll cue */}
      <div className="scroll-cue">
        <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
          <rect x="1" y="1" width="22" height="38" rx="11" stroke="#E8D5B7" strokeWidth="2" opacity="0.5" />
          <circle cx="12" cy="12" r="3" fill="#C08457">
            <animate attributeName="cy" values="12;24;12" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </section>
  );
}

// ---- BEAN TO CUP — Sticky Scroll Story ----
function BeanToCup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    { title: 'The Cherry', subtitle: 'Hand-picked at peak ripeness', emoji: '🍒', color: 'var(--matcha)' },
    { title: 'The Roast', subtitle: 'Transforming green to gold', emoji: '🫘', color: 'var(--caramel)' },
    { title: 'The Grind', subtitle: 'Precision in every particle', emoji: '⚙️', color: 'var(--terracotta)' },
    { title: 'The Pour', subtitle: 'The ritual begins', emoji: '☕', color: 'var(--espresso)' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrolled = -rect.top;
      const totalScroll = containerHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
      const stage = Math.min(3, Math.floor(progress * 4));
      setActiveStage(stage);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bean-to-cup" ref={containerRef}>
      <div className="bean-to-cup-sticky">
        {/* Progress line */}
        <div className="progress-line hidden md:block">
          <div className="progress-fill" style={{ height: `${((activeStage + 1) / 4) * 100}%` }} />
          {stages.map((_, i) => (
            <div
              key={i}
              className={`progress-dot ${i <= activeStage ? 'active' : ''}`}
              style={{ top: `${(i / 3) * 100}%` }}
            />
          ))}
        </div>

        {/* Stages */}
        {stages.map((stage, i) => (
          <div key={i} className={`stage ${i === activeStage ? 'active' : ''}`}>
            <div className="text-center px-6">
              <div className="text-7xl md:text-9xl mb-6">{stage.emoji}</div>
              <h2
                className={`stage-title text-4xl md:text-6xl mb-3 ${i === activeStage ? 'active' : ''}`}
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: stage.color }}
              >
                {stage.title}
              </h2>
              <p className={`stage-title text-lg md:text-xl opacity-60 ${i === activeStage ? 'active' : ''}`}
                style={{ transitionDelay: '0.15s', fontFamily: 'var(--font-sans)' }}>
                {stage.subtitle}
              </p>
              {/* Decorative animation per stage */}
              {i === 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="bean-rotate text-3xl" style={{ animationDelay: `${j * 0.2}s` }}>🫘</div>
                  ))}
                </div>
              )}
              {i === 2 && (
                <div className="mt-8 relative h-20 w-40 mx-auto">
                  {[...Array(12)].map((_, j) => {
                    // Stable positions using deterministic seed
                    const seed = j * 137.508; // golden angle
                    const left = ((seed * 7) % 100);
                    const top = ((seed * 13) % 100);
                    const tx = Math.sin(seed) * 40;
                    const ty = Math.cos(seed) * 40;
                    return (
                      <div
                        key={j}
                        className="grind-particle absolute w-2 h-2 rounded-full bg-[var(--terracotta)]"
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          '--tx': `${tx}px`,
                          '--ty': `${ty}px`,
                          animationDelay: `${j * 0.15}s`,
                        } as React.CSSProperties}
                      />
                    );
                  })}
                </div>
              )}
              {i === 3 && (
                <div className="mt-8 mx-auto w-16 h-32 relative">
                  <div className="pour-stream absolute left-1/2 -translate-x-1/2 w-2 bg-[var(--caramel)] rounded-full" style={{ bottom: 0 }} />
                  <svg width="64" height="80" viewBox="0 0 64 80" fill="none" className="absolute bottom-0 left-1/2 -translate-x-1/2">
                    <path d="M8 20 L12 70 Q16 78 32 78 Q48 78 52 70 L56 20" stroke="var(--espresso)" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- MENU GRID ----
const coffeeData = [
  { name: 'Ethiopian Yirgacheffe', origin: 'Ethiopia', roast: 'Light', notes: ['Floral', 'Citrus', 'Honey'], price: '$18', gradient: 'linear-gradient(135deg, #E8D5B7, #C08457)' },
  { name: 'Colombian Supremo', origin: 'Colombia', roast: 'Medium', notes: ['Caramel', 'Nutty', 'Smooth'], price: '$16', gradient: 'linear-gradient(135deg, #C08457, #A0522D)' },
  { name: 'Sumatra Mandheling', origin: 'Indonesia', roast: 'Dark', notes: ['Earthy', 'Spice', 'Bold'], price: '$19', gradient: 'linear-gradient(135deg, #A0522D, #2A1A12)' },
  { name: 'Guatemala Antigua', origin: 'Guatemala', roast: 'Medium', notes: ['Chocolate', 'Plum', 'Cocoa'], price: '$17', gradient: 'linear-gradient(135deg, #6B7A4F, #C08457)' },
  { name: 'Kenya AA', origin: 'Kenya', roast: 'Light', notes: ['Berry', 'Wine', 'Bright'], price: '$21', gradient: 'linear-gradient(135deg, #E8D5B7, #6B7A4F)' },
  { name: 'Brazil Santos', origin: 'Brazil', roast: 'Dark', notes: ['Nutty', 'Low Acid', 'Classic'], price: '$14', gradient: 'linear-gradient(135deg, #A0522D, #2A1A12)' },
];

function MenuGrid() {
  const [filter, setFilter] = useState('All');
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const filtered = filter === 'All' ? coffeeData : coffeeData.filter(c => c.roast === filter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
            setVisibleCards(prev => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [filtered]);

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    if ('ontouchstart' in window) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
  };

  const handleTiltReset = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
  };

  return (
    <section className="py-20 md:py-32 px-6 bg-[var(--steam)]" id="menu">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 reveal-section">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }} className="text-4xl md:text-5xl mb-4">
            Our Roasts
          </h2>
          <p className="text-lg opacity-60 max-w-md mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
            Carefully sourced, meticulously roasted.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {['All', 'Light', 'Medium', 'Dark'].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((coffee, i) => (
            <div
              key={coffee.name}
              ref={el => { cardsRef.current[i] = el; }}
              data-index={i}
              className={`menu-card card-reveal ${visibleCards.has(i) ? 'visible' : ''} bg-white rounded-2xl overflow-hidden cursor-pointer`}
              style={{ transitionDelay: `${i * 0.1}s` }}
              onMouseMove={handleTilt}
              onMouseLeave={handleTiltReset}
            >
              <div className="menu-card-image h-48" style={{ background: coffee.gradient }}>
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">☕</div>
              </div>
              <div className="p-6">
                <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }} className="text-xl mb-1">
                  {coffee.name}
                </h3>
                <p className="text-sm opacity-50 mb-3">{coffee.origin} · {coffee.roast} Roast</p>
                <div className="menu-card-tags flex gap-2 mb-4 flex-wrap">
                  {coffee.notes.map(note => (
                    <span key={note} className="text-xs px-2 py-1 rounded-full bg-[var(--crema)] text-[var(--espresso)]">
                      {note}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }} className="text-2xl text-[var(--caramel)]">
                    {coffee.price}
                  </span>
                  <span className="text-sm opacity-40">250g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- ORIGINS MAP ----
function OriginsMap() {
  const origins = [
    { name: 'Ethiopia', altitude: '1,800–2,200m', flavor: 'Floral, berry, wine-like acidity', x: '55%', y: '48%' },
    { name: 'Colombia', altitude: '1,200–1,800m', flavor: 'Caramel, nutty, balanced', x: '28%', y: '55%' },
    { name: 'Guatemala', altitude: '1,300–1,700m', flavor: 'Chocolate, plum, cocoa', x: '20%', y: '45%' },
    { name: 'Sumatra', altitude: '1,000–1,500m', flavor: 'Earthy, spicy, full-bodied', x: '75%', y: '52%' },
  ];

  return (
    <section className="py-20 md:py-32 px-6 bg-[var(--crema)]" id="origins">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 reveal-section">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }} className="text-4xl md:text-5xl mb-4">
            Where It Grows
          </h2>
          <p className="text-lg opacity-60 max-w-md mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
            Four corners of the world, one perfect cup.
          </p>
        </div>

        {/* Stylized map */}
        <div className="relative w-full aspect-[2/1] bg-[var(--steam)] rounded-3xl overflow-hidden shadow-lg">
          {/* Abstract landmasses */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" fill="none" preserveAspectRatio="xMidYMid meet">
            {/* Abstract continents */}
            <path d="M100 150 Q150 120 200 140 Q250 160 220 200 Q190 240 140 220 Q90 200 100 150Z" fill="var(--espresso)" opacity="0.08" />
            <path d="M250 180 Q300 150 350 170 Q380 200 360 240 Q320 280 270 260 Q230 230 250 180Z" fill="var(--espresso)" opacity="0.08" />
            <path d="M380 120 Q450 100 520 130 Q560 160 540 200 Q500 240 440 230 Q380 210 380 120Z" fill="var(--espresso)" opacity="0.08" />
            <path d="M550 160 Q620 140 700 170 Q740 200 720 240 Q680 280 620 270 Q560 250 550 160Z" fill="var(--espresso)" opacity="0.08" />
            <path d="M150 250 Q200 230 250 260 Q280 290 250 320 Q200 340 160 310 Q130 280 150 250Z" fill="var(--espresso)" opacity="0.06" />
            {/* Grid lines */}
            <line x1="0" y1="200" x2="800" y2="200" stroke="var(--espresso)" strokeWidth="0.5" opacity="0.05" />
            <line x1="400" y1="0" x2="400" y2="400" stroke="var(--espresso)" strokeWidth="0.5" opacity="0.05" />
          </svg>

          {/* Origin dots */}
          {origins.map((origin) => (
            <div
              key={origin.name}
              className="origin-dot"
              style={{ left: origin.x, top: origin.y }}
            >
              <div className="radar-pulse" />
              <div className="origin-tooltip bg-[var(--espresso)] text-[var(--crema)] rounded-xl px-4 py-3 shadow-xl">
                <p className="font-semibold text-sm" style={{ fontFamily: 'var(--font-serif)' }}>{origin.name}</p>
                <p className="text-xs opacity-60 mt-1">{origin.altitude}</p>
                <p className="text-xs mt-1 italic opacity-80">{origin.flavor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- BREW METHODS — Horizontal Scroll ----
function BrewMethods() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  const methods = [
    { num: '01', name: 'Espresso', desc: '9 bars of pressure, 25 seconds of perfection. The foundation of every great milk drink.', icon: '⚡' },
    { num: '02', name: 'Pour Over', desc: 'A meditative ritual. Water meets coffee in a slow, controlled dance of extraction.', icon: '💧' },
    { num: '03', name: 'French Press', desc: 'Full immersion, full body. The simplest way to honor a great bean.', icon: '🫖' },
    { num: '04', name: 'Cold Brew', desc: '16 hours of patience. Time replaces heat, yielding smooth, sweet concentrate.', icon: '🧊' },
  ];

  // Desktop scroll-jacking: convert vertical scroll to horizontal
  useEffect(() => {
    const section = sectionRef.current;
    const container = scrollRef.current;
    if (!section || !container) return;

    const isTouchDevice = 'ontouchstart' in window;
    if (isTouchDevice) return; // Use native horizontal scroll on touch

    const handleWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.5;
      }
    };

    section.addEventListener('wheel', handleWheel, { passive: false });
    return () => section.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const panelWidth = container.querySelector('.brew-panel')?.clientWidth || 1;
      const idx = Math.round(scrollLeft / (panelWidth + 24)); // 24 = gap
      setActivePanel(Math.min(idx, methods.length - 1));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [methods.length]);

  // Reveal panels on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelector('.brew-panel-content')?.classList.add('revealed');
          }
        });
      },
      { threshold: 0.3 }
    );

    panelsRef.current.forEach(panel => {
      if (panel) observer.observe(panel);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 md:py-32 bg-[var(--steam)]" id="brew" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="text-center reveal-section">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }} className="text-4xl md:text-5xl mb-4">
            The Art of Brewing
          </h2>
          <p className="text-lg opacity-60 max-w-md mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
            Every method tells a different story.
          </p>
        </div>
      </div>

      <div className="brew-scroll-container flex gap-6 px-6 md:px-12" ref={scrollRef}>
        {methods.map((method, i) => (
          <div
            key={method.num}
            ref={el => { panelsRef.current[i] = el; }}
            className="brew-panel"
          >
            <div className="brew-panel-content h-full bg-[var(--espresso)] rounded-3xl p-8 md:p-12 flex flex-col justify-center">
              <span className="text-6xl md:text-8xl mb-4">{method.icon}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }} className="text-[var(--caramel)] text-sm mb-2">
                {method.num}
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }} className="text-3xl md:text-4xl text-[var(--crema)] mb-4">
                {method.name}
              </h3>
              <p className="text-[var(--crema)] opacity-60 text-lg max-w-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                {method.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-3 mt-8">
        {methods.map((_, i) => (
          <div key={i} className={`brew-progress-dot ${i === activePanel ? 'active' : ''}`} />
        ))}
      </div>
    </section>
  );
}

// ---- TESTIMONIALS MARQUEE ----
function Testimonials() {
  const quotes = [
    { text: "The best coffee I've ever had at home. It's like a café in my kitchen.", name: 'Sarah M.', gradient: 'linear-gradient(135deg, #C08457, #E8D5B7)' },
    { text: "Brewhaus changed my morning ritual completely. I can't go back.", name: 'James K.', gradient: 'linear-gradient(135deg, #6B7A4F, #C08457)' },
    { text: "The Ethiopian Yirgacheffe is absolutely transcendent.", name: 'Maria L.', gradient: 'linear-gradient(135deg, #A0522D, #E8D5B7)' },
    { text: "Freshness you can taste. This is what specialty coffee should be.", name: 'David R.', gradient: 'linear-gradient(135deg, #2A1A12, #C08457)' },
    { text: "I gifted a subscription to my dad. He calls me every morning now.", name: 'Alex T.', gradient: 'linear-gradient(135deg, #C08457, #6B7A4F)' },
    { text: "The pour-over blend is poetry in a cup. Simply magnificent.", name: 'Nina P.', gradient: 'linear-gradient(135deg, #E8D5B7, #A0522D)' },
  ];

  const doubledQuotes = [...quotes, ...quotes];

  return (
    <section className="py-16 md:py-24 bg-[var(--crema)] overflow-hidden">
      <div className="text-center mb-12 px-6">
        <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }} className="text-3xl md:text-4xl">
          What They Say
        </h2>
      </div>

      {/* Row 1 */}
      <div className="mb-6">
        <div className="marquee-track">
          {doubledQuotes.map((q, i) => (
            <div key={i} className="flex-shrink-0 w-80 md:w-96 mx-4 p-6 bg-white rounded-2xl shadow-sm">
              <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }} className="text-lg mb-4 text-[var(--espresso)]">
                "{q.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full" style={{ background: q.gradient }} />
                <span className="text-sm font-medium">{q.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — reverse direction */}
      <div>
        <div className="marquee-track marquee-track-reverse">
          {doubledQuotes.map((q, i) => (
            <div key={`r-${i}`} className="flex-shrink-0 w-80 md:w-96 mx-4 p-6 bg-white rounded-2xl shadow-sm">
              <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }} className="text-lg mb-4 text-[var(--espresso)]">
                "{q.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full" style={{ background: q.gradient }} />
                <span className="text-sm font-medium">{q.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- NEWSLETTER ----
function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }, 500);
  };

  return (
    <section className="py-20 md:py-32 px-6 bg-[var(--espresso)] relative" id="newsletter">
      <div className="max-w-xl mx-auto text-center">
        <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }} className="text-4xl md:text-5xl text-[var(--crema)] mb-4">
          Join the Ritual
        </h2>
        <p className="text-[var(--crema)] opacity-60 mb-10 text-lg" style={{ fontFamily: 'var(--font-sans)' }}>
          Weekly brew guides, origin stories, and first access to new roasts.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="input-underline w-full sm:w-72">
            <input
              type="email"
              className="newsletter-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`submit-btn ${submitted ? 'success' : ''}`}
            disabled={submitted}
          >
            {submitted ? '✓' : 'Subscribe'}
          </button>
        </form>

        {submitted && (
          <p className="mt-6 text-[var(--caramel)] fade-up" style={{ animationDelay: '0s', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            Thanks! Welcome to the family. ☕
          </p>
        )}
      </div>
    </section>
  );
}

// ---- FOOTER ----
function Footer() {
  return (
    <footer className="bg-[var(--espresso)] border-t border-[var(--crema)]/10 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }} className="text-2xl text-[var(--crema)] mb-3">
            Brewhaus
          </h3>
          <p className="text-[var(--crema)] opacity-50 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
            Artisan coffee roasted with intention. Every bean tells a story of origin, craft, and care.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-[var(--crema)] font-semibold mb-3 text-sm uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2">
            {['Our Story', 'Shop Coffee', 'Brew Guides', 'Subscriptions'].map(link => (
              <li key={link}>
                <a href="#" className="text-[var(--crema)] opacity-50 hover:opacity-100 text-sm transition-opacity" style={{ fontFamily: 'var(--font-sans)' }}>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-[var(--crema)] font-semibold mb-3 text-sm uppercase tracking-wider">Follow</h4>
          <div className="flex gap-4">
            {['Instagram', 'Twitter', 'YouTube'].map(social => (
              <a key={social} href="#" className="social-icon text-[var(--crema)] opacity-60 text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div>
          <h4 className="text-[var(--crema)] font-semibold mb-3 text-sm uppercase tracking-wider">Visit Us</h4>
          <div className="text-[var(--crema)] opacity-50 text-sm space-y-1" style={{ fontFamily: 'var(--font-sans)' }}>
            <p>Mon–Fri: 7am – 6pm</p>
            <p>Sat–Sun: 8am – 5pm</p>
            <p className="mt-2">42 Roastery Lane</p>
            <p>Portland, OR 97201</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-[var(--crema)]/10 text-center">
        <p className="text-[var(--crema)] opacity-30 text-xs" style={{ fontFamily: 'var(--font-sans)' }}>
          © 2026 Brewhaus. Crafted with care.
        </p>
      </div>
    </footer>
  );
}

// ---- BACK TO TOP ----
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 16V4M10 4L4 10M10 4L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ---- GRAIN OVERLAY ----
function GrainOverlay() {
  return (
    <svg className="grain-overlay" xmlns="http://www.w3.org/2000/svg">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

// ---- SECTION REVEAL OBSERVER ----
function useSectionReveal(deps: unknown[] = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-section').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ---- NAVIGATION ----
function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[var(--espresso)]/90 backdrop-blur-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#hero" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }} className="text-xl text-[var(--crema)]">
          Brewhaus
        </a>
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Roasts', href: '#menu' },
            { label: 'Origins', href: '#origins' },
            { label: 'Brew', href: '#brew' },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-[var(--crema)] opacity-60 hover:opacity-100 text-sm transition-opacity"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#newsletter"
            className="text-sm px-4 py-2 rounded-full bg-[var(--caramel)] text-[var(--espresso)] font-semibold hover:bg-[var(--terracotta)] hover:text-[var(--steam)] transition-all"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Subscribe
          </a>
        </div>
      </div>
    </nav>
  );
}

// ---- MAIN APP ----
export default function App() {
  const [loaded, setLoaded] = useState(false);

  useSectionReveal([loaded]);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <GrainOverlay />
      <Navigation />
      <main className={loaded ? '' : 'invisible'}>
        <Hero />
        <BeanToCup />
        <MenuGrid />
        <OriginsMap />
        <BrewMethods />
        <Testimonials />
        <Newsletter />
        <Footer />
      </main>
      <BackToTop />
    </>
  );
}
