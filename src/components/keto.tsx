'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, MapPin, Search, Wifi, Utensils, BookOpen, Shirt, ShieldCheck, Sun, Moon, ChevronDown, ChevronLeft, X, Check, BedDouble, Layers, DoorOpen, HeartHandshake, Upload, CheckCircle2, LoaderCircle, Menu, Sparkles, Phone, Navigation, Car, Clock, Plus, RotateCcw, Eye, ExternalLink, Trash2, Droplets, Bike, WashingMachine, BroomSparkles } from 'lucide-react';
import { hostels, money, track, type Hostel } from '@/lib/data';

type View = 'enquiry' | 'hostel' | 'admission' | null;
type Route = { view: View; hostel: string; floor: number; room: number };
const baseRoute: Route = { view: null, hostel: 'karaparamba', floor: 1, room: 101 };
const readRoute = (): Route => {
  const q = new URLSearchParams(window.location.search);
  const view = q.get('view');
  const floor = Math.min(3, Math.max(1, Number(q.get('floor')) || 1));
  const room = Number(q.get('room')) || floor * 100 + 1;
  const hostelParam = q.get('hostel');
  const validHostel = hostels.some(h => h.id === hostelParam) ? hostelParam! : (hostels[0]?.id || 'karaparamba');
  return { view: ['enquiry','hostel','admission'].includes(view || '') ? view as View : null, hostel: validHostel, floor, room: [1,2,3].map(n => floor * 100 + n).includes(room) ? room : floor * 100 + 1 };
};
const amenityIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Wi-Fi': Wifi,
  'Homely Food': Utensils,
  'Study Area': BookOpen,
  'Parking': Car,
  'Washing M/C': Shirt,
  'Ironing': Sparkles,
  Meals: Utensils,
  'Study space': BookOpen,
  Laundry: Shirt,
};

function IronIcon({ size = 21, strokeWidth = 1.5, className = '' }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 18h14.5a3.5 3.5 0 0 0 3.5-3.5c0-2.8-2-4.5-5-4.5H6.5L3 18z" />
      <path d="M7 10V6.5A2.5 2.5 0 0 1 9.5 4h5a2.5 2.5 0 0 1 2.5 2.5V8" />
      <line x1="8.5" y1="14" x2="14.5" y2="14" />
    </svg>
  );
}

type Amenity = {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  sub?: string;
  mobileSub?: string;
};

const allAmenities: Amenity[] = [
  { Icon: Utensils, title: 'Homely Food', sub: 'Daily nutritious home-style meals', mobileSub: 'Homely daily meals' },
  { Icon: Wifi, title: 'High-Speed Wi-Fi', sub: 'Reliable speed for study & streaming', mobileSub: 'Fast study & streaming' },
  { Icon: Droplets, title: 'Purified Drinking Water', sub: 'Continuous multi-stage RO filtration', mobileSub: 'Clean RO drinking water' },
  { Icon: BookOpen, title: 'Quiet Study Spaces', sub: 'Distraction-free focus environments', mobileSub: 'Quiet focus area' },
  { Icon: Bike, title: 'Vehicle Parking', sub: 'Secure on-premise parking facility', mobileSub: 'Secure on-site parking' },
  { Icon: WashingMachine, title: 'Washing Machine', sub: 'Fully automatic laundry equipment', mobileSub: 'Automatic laundry care' },
  { Icon: IronIcon, title: 'Iron Box Station', sub: 'Dedicated pressing & garment care', mobileSub: 'Garment iron station' },
  { Icon: BroomSparkles, title: 'Weekly Cleaning', sub: 'Regular deep sanitization & upkeep', mobileSub: 'Deep sanitization' },
];

const row1Amenities: Amenity[] = allAmenities;
const row2Amenities: Amenity[] = [
  ...allAmenities.slice(4),
  ...allAmenities.slice(0, 4),
];

function AmenityCardItem({ Icon, title, sub, mobileSub }: Amenity) {
  return (
    <div className="amenity-card">
      <div className="amenity-icon-box">
        <Icon size={21} strokeWidth={1.5} />
      </div>
      <div className="amenity-info">
        <strong>{title}</strong>
        {sub && (
          <>
            <span className="amenity-sub-desktop">{sub}</span>
            <span className="amenity-sub-mobile">{mobileSub || sub}</span>
          </>
        )}
      </div>
    </div>
  );
}



function Dialog({ children, onClose, title, small = false }: { children: React.ReactNode; onClose: () => void; title: string; small?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const active = document.activeElement as HTMLElement | null;
    dialog?.showModal();

    // Lock background scroll without shifting page position
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Prevent background touch-drag on mobile devices
    const preventBackgroundTouch = (e: TouchEvent) => {
      if (dialog && !dialog.contains(e.target as Node)) {
        e.preventDefault();
      }
    };
    window.addEventListener('touchmove', preventBackgroundTouch, { passive: false });

    return () => {
      dialog?.close();
      active?.focus();

      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      document.body.style.paddingRight = '';
      window.removeEventListener('touchmove', preventBackgroundTouch);
    };
  }, []);
  return <dialog ref={ref} className={`dialog ${small ? 'dialog-small' : ''}`} aria-label={title} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) { const bounds = e.currentTarget.getBoundingClientRect(); if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) onClose(); } }}><div className="dialog-inner">{children}</div></dialog>;
}

function FinderSelect({ label, value, options, onChange, icon: Icon, ariaLabel }: { label: string; value: string; options: string[]; onChange: (val: string) => void; icon: React.ComponentType<{ size?: number; className?: string }>; ariaLabel: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={`finder-field ${open ? 'select-open' : ''}`} ref={ref}>
      <button
        type="button"
        className="finder-field-btn"
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <Icon size={21} className="finder-field-icon" />
        <div className="finder-field-content">
          <span className="finder-field-label">{label}</span>
          <span className="finder-field-value">{value}</span>
        </div>
        <ChevronDown size={17} className={`finder-chevron ${open ? 'rotated' : ''}`} />
      </button>

      {open && (
        <ul className="custom-dropdown-menu" role="listbox" aria-label={label}>
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <li
                key={opt}
                role="option"
                aria-selected={isSelected}
                className={`custom-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                <span>{opt}</span>
                {isSelected && <Check size={16} className="item-check" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SortDropdown({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'price', label: 'Price: low to high' },
    { value: 'availability', label: 'Availability' },
  ];
  const currentLabel = sortOptions.find(o => o.value === value)?.label || 'Recommended';

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={`sort-wrap ${open ? 'sort-open' : ''}`} ref={ref}>
      <span className="sort-caption">Sort by</span>
      <div className="sort-btn-wrap">
        <button
          type="button"
          className="sort-btn"
          onClick={() => setOpen(prev => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Sort hostels"
        >
          <span>{currentLabel}</span>
          <ChevronDown size={15} className={`sort-chevron ${open ? 'rotated' : ''}`} />
        </button>

        {open && (
          <ul className="sort-menu" role="listbox" aria-label="Sort options">
            {sortOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`sort-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={15} className="item-check" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function FilterDropdown({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const filterOptions = [
    { value: 'Everyone', label: 'All hostels' },
    { value: 'Girls', label: 'Girls hostels' },
    { value: 'Boys', label: 'Boys hostels' },
  ];
  const currentLabel = filterOptions.find(o => o.value === value)?.label || 'All hostels';

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={`sort-wrap filter-dropdown-wrap ${open ? 'sort-open' : ''}`} ref={ref}>
      <span className="sort-caption">Filter</span>
      <div className="sort-btn-wrap">
        <button
          type="button"
          className="sort-btn"
          onClick={() => setOpen(prev => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Filter hostels by gender"
        >
          <span>{currentLabel}</span>
          <ChevronDown size={15} className={`sort-chevron ${open ? 'rotated' : ''}`} />
        </button>

        {open && (
          <ul className="sort-menu" role="listbox" aria-label="Filter options">
            {filterOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`sort-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={15} className="item-check" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Keto() {
  const [route, setRoute] = useState<Route>(baseRoute);
  const routeRef = useRef(route);
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const [area, setArea] = useState('All locations');
  const [audience, setAudience] = useState('Everyone');
  const [filter, setFilter] = useState({ area: 'All locations', audience: 'Everyone' });
  const [sort, setSort] = useState('recommended');
  const [dirty, setDirty] = useState(false);
  const dirtyRef = useRef(false);
  const [discard, setDiscard] = useState(false);
  const pending = useRef<(() => void) | null>(null);
  const [toast, setToast] = useState('');
  const [faq, setFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const updateDirty = useCallback((value: boolean) => { dirtyRef.current = value; setDirty(value); }, []);
  const applyRoute = useCallback((next: Route, replace = false) => {
    const url = new URL(window.location.href);
    url.search = '';
    if (next.view) { url.searchParams.set('view', next.view); if (next.view !== 'enquiry') url.searchParams.set('hostel', next.hostel); if (next.view === 'hostel') { url.searchParams.set('floor', String(next.floor)); url.searchParams.set('room', String(next.room)); } }
    window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
    routeRef.current = next;
    setRoute(next);
  }, []);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(currentScrollY > 20);

          if (menu) {
            setHeaderVisible(true);
            lastScrollY.current = Math.max(0, currentScrollY);
            ticking = false;
            return;
          }

          if (currentScrollY <= 40) {
            setHeaderVisible(true);
          } else {
            const delta = currentScrollY - lastScrollY.current;
            if (delta > 6) {
              setHeaderVisible(false);
            } else if (delta < -6) {
              setHeaderVisible(true);
            }
          }

          lastScrollY.current = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menu]);
  useEffect(() => {
    const initial = readRoute(); setRoute(initial); routeRef.current = initial;
    const savedTheme = localStorage.getItem('keto-theme');
    const isDark = savedTheme === 'dark'; setDark(isDark); document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    const onPop = () => {
      const next = readRoute();
      if (dirtyRef.current) {
        applyRoute(routeRef.current);
        pending.current = () => applyRoute(next, true);
        setDiscard(true);
      } else { routeRef.current = next; setRoute(next); }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [applyRoute]);
  useEffect(() => {
    const protect = (e: BeforeUnloadEvent) => { if (dirtyRef.current) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', protect);
    return () => window.removeEventListener('beforeunload', protect);
  }, []);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 6000); return () => clearTimeout(timer); }, [toast]);
  const closeMenu = useCallback((onDone?: () => void) => {
    if (!menu || menuClosing) return;
    setMenuClosing(true);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setMenu(false);
      setMenuClosing(false);
      onDone?.();
    }, 240);
  }, [menu, menuClosing]);

  const toggleMenu = useCallback(() => {
    if (menu) {
      closeMenu();
    } else {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setMenuClosing(false);
      setMenu(true);
    }
  }, [menu, closeMenu]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function navigate(next: Route) { if (dirty) { pending.current = () => applyRoute(next); setDiscard(true); } else applyRoute(next); }
  function open(view: View, hostel = route.hostel) {
    if (menu) {
      closeMenu(() => navigate({ ...baseRoute, view, hostel }));
    } else {
      navigate({ ...baseRoute, view, hostel });
    }
  }
  function toggleTheme() { const next = !dark; setDark(next); document.documentElement.dataset.theme = next ? 'dark' : 'light'; localStorage.setItem('keto-theme', next ? 'dark' : 'light'); }
  const selected = hostels.find(h => h.id === route.hostel) || hostels[0];
  const visible = [...hostels]
    .filter(h => (filter.area === 'All locations' || h.area === filter.area) && (filter.audience === 'Everyone' || h.audience === filter.audience))
    .sort((a, b) => {
      if ((a.status === 'coming-soon') !== (b.status === 'coming-soon')) {
        return a.status === 'coming-soon' ? 1 : -1;
      }
      return sort === 'price' ? (a.price || 0) - (b.price || 0) : sort === 'availability' ? (b.available || 0) - (a.available || 0) : 0;
    });

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu(); };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('mobile-nav-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('mobile-nav-open');
    };
  }, [menu, closeMenu]);

  const isMenuVisible = menu || menuClosing;

  return <>
    <div className="hero-screen-wrapper">
      <div className="announcement"><span className="announcement-dot" /> A new city. A familiar feeling. <span className="announcement-extra">Find your place with Keto.</span></div>
      <div className="header-slot">
        <header className={`header-wrapper ${scrolled ? 'header-scrolled' : ''} ${!headerVisible && scrolled ? 'header-hidden' : ''}`}>
          <div className="site-header shell">
            <a href="/" aria-label="Keto home" className="brand"><span className="brand-logo-wrap"><Image className="logo-light" src="/logo.webp" width={133} height={54} alt="Keto" priority unoptimized /><Image className="logo-dark" src="/logowhite.webp" width={133} height={54} alt="Keto" priority unoptimized /></span><span className="brand-tag">student living</span></a>
            {isMenuVisible && (
              <div
                className={`nav-backdrop ${menuClosing ? 'nav-backdrop-closing' : ''}`}
                onClick={() => closeMenu()}
                aria-hidden="true"
              />
            )}
            <nav
              className={
                isMenuVisible
                  ? `nav nav-open ${menuClosing ? 'nav-closing' : ''}`
                  : 'nav'
              }
              aria-label="Main navigation"
            >
              <div className="sheet-handle" aria-hidden="true" />
              <div className="mobile-nav-header">
                <a href="/" aria-label="Keto home" className="brand" onClick={() => closeMenu()}>
                  <span className="brand-logo-wrap">
                    <Image className="logo-light" src="/logo.webp" width={110} height={45} alt="Keto" priority unoptimized />
                    <Image className="logo-dark" src="/logowhite.webp" width={110} height={45} alt="Keto" priority unoptimized />
                  </span>
                  <span className="brand-tag">student living</span>
                </a>
                <div className="mobile-nav-actions">
                  <button className="icon-button theme-toggle" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>
                    <span className="theme-icon-wrap"><Sun className="theme-icon sun-icon" size={18} /><Moon className="theme-icon moon-icon" size={18} /></span>
                  </button>
                  <button className="icon-button mobile-nav-close" aria-label="Close navigation" onClick={() => closeMenu()}>
                    <X size={22} />
                  </button>
                </div>
              </div>
              <a href="#home" onClick={() => closeMenu()}>Keto Home</a>
              <a href="#hostels" onClick={() => closeMenu()}>Our hostels</a>
              <a href="#how-it-works" onClick={() => closeMenu()}>How it works</a>
              <button className="button primary mobile-nav-cta" onClick={() => closeMenu(() => open('enquiry'))}>
                Find my space <ArrowUpRight size={17} />
              </button>
            </nav>
            <div className="header-actions">
              <button className="icon-button theme-toggle" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>
                <span className="theme-icon-wrap"><Sun className="theme-icon sun-icon" size={18} /><Moon className="theme-icon moon-icon" size={18} /></span>
              </button>
              <button className="button primary header-cta" onClick={() => open('enquiry')}>Find my space <ArrowUpRight size={17} /></button>
              <button className="icon-button mobile-menu" aria-label="Toggle navigation" aria-expanded={menu} onClick={toggleMenu}>
                {menu && !menuClosing ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </header>
      </div>

      <section id="home" className="hero shell">
        <div className="hero-copy"><div className="eyebrow"><span className="tiny-line" /> MORE THAN A PLACE TO STAY</div><h1>A little closer<br />to <span className="serif-word">home.</span><span className="hero-asterisk">✳</span></h1><p>Student living that feels right, from day one.</p><div className="hero-actions"><a href="#hostels" className="button primary">Explore our hostels <ArrowUpRight size={18} /></a><a href="#how-it-works" className="button secondary">How it works <ArrowRight size={17} /></a></div><div className="hero-note"><span>Explore online. Visit in person. Feel at home.</span></div></div>
        <div className="hero-art"><Image className="hero-photo" src="/hero.webp" alt="Bright shared bedroom with natural light and comfortable beds" fill priority sizes="(max-width: 800px) 100vw, 52vw" /><div className="photo-shade" /><span className="photo-caption">SPACE TO MAKE YOUR OWN</span><div className="hero-sticker"><span>GOOD DAYS<br />START HERE</span><Sun size={31} strokeWidth={1.4} /></div></div>
      </section>
    </div>

    <main>
      <section id="living" className="amenities-section shell" aria-label="Life at Keto">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FIND YOUR EVERYDAY HAPPY</span>
            <h2>Different places. <span className="serif-word">Same feeling.</span></h2>
          </div>
        </div>
        <div className="amenities-marquee-wrapper" aria-label="Amenities showcase">
          <div className="marquee-track marquee-track-right">
            <div className="marquee-half">
              {row1Amenities.map((amenity, idx) => (
                <AmenityCardItem key={`r1-a-${idx}`} {...amenity} />
              ))}
            </div>
            <div className="marquee-half" aria-hidden="true">
              {row1Amenities.map((amenity, idx) => (
                <AmenityCardItem key={`r1-b-${idx}`} {...amenity} />
              ))}
            </div>
          </div>

          <div className="marquee-track marquee-track-left">
            <div className="marquee-half">
              {row2Amenities.map((amenity, idx) => (
                <AmenityCardItem key={`r2-a-${idx}`} {...amenity} />
              ))}
            </div>
            <div className="marquee-half" aria-hidden="true">
              {row2Amenities.map((amenity, idx) => (
                <AmenityCardItem key={`r2-b-${idx}`} {...amenity} />
              ))}
            </div>
          </div>
        </div>

        <div id="finder" className="finder" role="region" aria-label="Find a hostel">
          <div className="finder-intro"><span className="eyebrow">LET’S FIND YOUR PLACE</span><strong>Where will life take you?</strong></div>
          <FinderSelect
            label="LOCATION"
            value={area}
            options={['All locations', ...Array.from(new Set(hostels.map(h => h.area)))]}
            onChange={setArea}
            icon={MapPin}
            ariaLabel="Filter hostels by location"
          />
          <FinderSelect
            label="LOOKING FOR"
            value={audience}
            options={['Everyone', 'Girls', 'Boys']}
            onChange={setAudience}
            icon={BedDouble}
            ariaLabel="Filter hostels by student type"
          />
          <button className="button primary" onClick={() => { setFilter({area,audience}); document.getElementById('hostels')?.scrollIntoView({behavior:'smooth'}); }}>
            <Search size={18} /> Find a hostel
          </button>
        </div>
      </section>

      <section id="hostels" className="hostels-section shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">OUR HOSTELS</span>
            <h2>Spaces designed <span className="serif-word">for living.</span></h2>
          </div>
        </div>
        <div className="listing-tools">
          <FilterDropdown
            value={filter.audience}
            onChange={(val) => { setFilter({...filter, audience: val}); setAudience(val); }}
          />
          <SortDropdown value={sort} onChange={setSort} />
        </div>
        <p className="sample-notice"><span /> Explore active residences and upcoming student living locations</p>
        <div className="cards">
          {visible.map(hostel => (
            hostel.status === 'coming-soon' ? (
              <article className="hostel-card coming-soon-card" key={hostel.id}>
                <div className="coming-soon-banner">
                  <span className="audience-tag">{hostel.audience} hostel</span>
                  <div className="coming-soon-badge-center">
                    <span>COMING SOON</span>
                  </div>
                  <span className="upcoming-tag"><Clock size={12}/> Upcoming</span>
                </div>
                <div className="card-content">
                  <div className="card-top-info">
                    <span className="location"><MapPin size={13}/><strong>{hostel.area}</strong></span>
                    <span className="upcoming-pill">New Branch</span>
                  </div>
                  <h3>{hostel.name}</h3>
                  <p>{hostel.tag}</p>
                  <div className="card-bottom">
                    <div>
                      <small>Status</small>
                      <strong className="coming-soon-price">Opening Soon</strong>
                    </div>
                    <button className="button secondary coming-soon-cta" onClick={() => open('enquiry')}>
                      Enquire <ArrowUpRight size={15}/>
                    </button>
                  </div>
                </div>
              </article>
            ) : (
              <article className="hostel-card" key={hostel.id}>
                <button className="card-photo" onClick={() => open('hostel', hostel.id)} aria-label={`Explore ${hostel.name}`}>
                  <Image src={hostel.image || '/campus.webp'} alt={`Interior for ${hostel.name}`} fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" loading="lazy" />
                  <span className="audience-tag">{hostel.audience} hostel</span>
                  <span className="photo-arrow"><ArrowUpRight size={21}/></span>
                </button>
                <div className="card-content">
                  <div className="card-top-info">
                    <span className="location"><MapPin size={13}/><strong>{hostel.area}</strong>{hostel.subArea ? ` (${hostel.subArea})` : ''}</span>
                    {hostel.mapUrl && (
                      <a
                        href={hostel.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-loc-link"
                        title="Open branch location on Google Maps"
                        onClick={e => e.stopPropagation()}
                      >
                        <Navigation size={12}/> Maps
                      </a>
                    )}
                  </div>
                  <h3>{hostel.name}</h3>
                  <p>{hostel.tag}</p>
                  <div className="card-bottom">
                    <div>
                      <small>Starting from (Stay + Food)</small>
                      <strong>₹{money(hostel.price || 6500)}<span> / month</span></strong>
                    </div>
                    <button className="text-link" onClick={() => open('hostel', hostel.id)}>
                      Explore <ArrowUpRight size={17}/>
                    </button>
                  </div>
                </div>
              </article>
            )
          ))}
        </div>

        {visible.length === 0 && (
          <div className="empty-state">
            <Search size={32}/>
            <h3>{filter.audience === 'Girls' ? 'No girls hostels available' : 'No hostels in this selection'}</h3>
            <p>
              {filter.audience === 'Girls'
                ? 'We currently operate Sapphire Boys Hostels across 4 prime locations in Calicut. Girls hostel branches are planned for future expansion.'
                : 'Try another location or explore all branches.'}
            </p>
            <button
              className="button secondary"
              onClick={() => {
                setArea('All locations');
                setAudience('Everyone');
                setFilter({ area: 'All locations', audience: 'Everyone' });
              }}
            >
              View all hostels
            </button>
          </div>
        )}
      </section>

      <section id="how-it-works" className="how-section">
        <div className="shell how-layout">
          <div className="how-intro">
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>
              Your new home,<br />
              <span className="serif-word">in 3 simple steps.</span>
            </h2>
            <button className="text-link" onClick={() => open('enquiry')}>
              Get started <ArrowUpRight size={17}/>
            </button>
          </div>
          <div className="steps">
            {[
              { n: '01', Icon: Search, title: 'Say hello', copy: 'Leave your name and college. We’ll help you explore your options.' },
              { n: '02', Icon: DoorOpen, title: 'Come on over', copy: 'Visit the hostel, meet your warden and choose the right room.' },
              { n: '03', Icon: HeartHandshake, title: 'Make it yours', copy: 'Fill in your details online and get ready to move in.' }
            ].map(({ n, Icon, title, copy }) => (
              <div className="step" key={n}>
                <div className="step-top">
                  <span>{n}</span>
                  <Icon size={24} strokeWidth={1.4}/>
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section shell">
        <div>
          <span className="eyebrow">A LITTLE CLARITY</span>
          <h2>Before you <span className="serif-word">move in.</span></h2>
          <p>A few things you might be wondering.</p>
        </div>
        <div className="faq-list">
          {[
            { q: 'Can I book a bed directly on the website?', a: 'Start with an enquiry. Management will contact you to discuss a location and arrange a visit. You choose your bed in person with the warden.' },
            { q: 'What do I need to send an enquiry?', a: 'Just your name, phone number and school or college. Your personal documents are only requested later in the admission application.' },
            { q: 'How do I complete my admission?', a: 'After you choose a bed, your warden shares a QR code or application link. Complete your details and upload your photo and Aadhaar before submitting.' },
            { q: 'Can I see the rooms before deciding?', a: 'Yes. Your visit is part of the process. Explore the hostel and discuss the room, bed and fees with your warden before completing admission.' }
          ].map((item, i) => (
            <div className={`faq-item ${faq === i ? 'faq-active' : ''}`} key={item.q}>
              <h3>
                <button
                  type="button"
                  id={`faq-btn-${i}`}
                  aria-expanded={faq === i}
                  aria-controls={`faq-${i}`}
                  onClick={() => setFaq(faq === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className={`faq-icon ${faq === i ? 'open' : ''}`}>
                    <Plus size={18} />
                  </span>
                </button>
              </h3>
              <div
                id={`faq-${i}`}
                role="region"
                aria-labelledby={`faq-btn-${i}`}
                className={`faq-collapse ${faq === i ? 'open' : ''}`}
              >
                <div className="faq-collapse-inner">
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section shell"><div className="cta-symbol">✳</div><div><span className="eyebrow">YOUR NEXT CHAPTER IS WAITING</span><h2>Let’s find where <span className="serif-word">you belong.</span></h2></div><button className="button primary" onClick={() => open('enquiry')}>Enquire now <ArrowUpRight size={18}/></button></section>
    </main>
    <footer className="shell footer"><div className="footer-brand"><span className="brand-logo-wrap footer-logo-wrap"><Image className="logo-light" src="/logo.webp" alt="Keto" width={106} height={43} unoptimized /><Image className="logo-dark" src="/logowhite.webp" alt="Keto" width={106} height={43} unoptimized /></span><span className="footer-tag">A little closer to home.</span></div><div className="footer-links"><a href="#home">Keto Home</a><a href="#hostels">Our hostels</a><a href="#how-it-works">How it works</a><button onClick={() => open('admission')}>Admission preview <ArrowUpRight size={13}/></button></div><span className="copyright">© {new Date().getFullYear()} Keto · Student living</span></footer>

    {route.view && <Dialog title={route.view === 'hostel' ? `${selected.name} (${selected.area})` : route.view === 'enquiry' ? 'Enquire with Keto' : 'Admission application preview'} onClose={() => navigate({...baseRoute})}><button className="icon-button close-button" aria-label="Close dialog" onClick={() => navigate({...baseRoute})}><X size={20}/></button>{route.view === 'hostel' ? <HostelDetail hostel={selected} route={route} navigate={navigate} enquire={() => open('enquiry')} /> : <Application key={route.view} admission={route.view === 'admission'} setDirty={updateDirty} onDone={() => {updateDirty(false);setToast(route.view === 'admission' ? 'Registration application submitted.' : 'Enquiry submitted successfully.');}} onClose={() => navigate({...baseRoute})} />}</Dialog>}
    {discard && <Dialog title="Discard unsaved changes?" small onClose={() => {setDiscard(false);pending.current=null;}}><div className="form-heading"><span className="form-icon"><ShieldCheck/></span><h2>Leave this form?</h2><p>Your unsaved details and selected files will be cleared.</p></div><div className="confirm-actions"><button className="button secondary" onClick={() => {setDiscard(false);pending.current=null;}}>Keep editing</button><button className="button primary" onClick={() => {updateDirty(false);setDiscard(false);pending.current?.();pending.current=null;}}>Discard changes</button></div></Dialog>}
    {toast && <div className="toast" role="status"><CheckCircle2 size={20}/><span>{toast}</span><button aria-label="Dismiss notification" onClick={() => setToast('')}><X size={16}/></button></div>}
  </>;
}

function HostelDetail({hostel,route,navigate,enquire}:{hostel:Hostel;route:Route;navigate:(route:Route)=>void;enquire:()=>void}) {
  return (
    <div className="hostel-detail">
      <div className="detail-cover">
        <Image src={hostel.image || '/campus.webp'} alt={`Interior for ${hostel.name}`} fill sizes="800px"/>
        <span className="audience-tag">{hostel.audience} hostel · Calicut</span>
      </div>
      <div className="detail-body">
        <div className="detail-header-row">
          <span className="location">
            <MapPin size={14}/> <strong>{hostel.area}</strong>{hostel.subArea ? ` (${hostel.subArea})` : ''}
          </span>
          {hostel.mapUrl && (
            <a href={hostel.mapUrl} target="_blank" rel="noopener noreferrer" className="detail-map-link">
              <Navigation size={13}/> View on Google Maps <ArrowUpRight size={13}/>
            </a>
          )}
        </div>
        <h2>{hostel.name}</h2>

        <p>Your second home in Calicut. Clean rooms, homely food, study areas, Wi-Fi, and complete peace of mind.</p>

        {/* Warden Contact Call Card */}
        {hostel.phone && (
          <div className="detail-contact-card">
            <div className="contact-text">
              <span className="contact-badge">{hostel.contactRole === 'Warden' ? 'Hostel Warden' : 'Branch Contact'}</span>
              <span className="contact-number">{hostel.phoneDisplay}</span>
            </div>
            <a href={`tel:${hostel.phone}`} className="button primary call-button">
              <Phone size={15}/> Call {hostel.contactRole}
            </a>
          </div>
        )}

        {/* Stay + Food Sharing Plans */}
        {hostel.sharingOptions && hostel.sharingOptions.length > 0 && (
          <div className="detail-plans-box">
            <div className="plans-header">
              <h4>STAY + FOOD PLANS</h4>
              <span className="maint-charge">{hostel.maintenanceFee || '₹1,000 for 3 months'}</span>
            </div>
            <div className="plans-grid">
              {hostel.sharingOptions.map(opt => (
                <div className="plan-item" key={opt.sharing}>
                  <span className="plan-sharing-title">{opt.sharing} Sharing</span>
                  <strong className="plan-price-num">₹{money(opt.price)}<span> / month</span></strong>
                  <span className="plan-sub">Stay + Homely Food included</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facilities Section */}
        {hostel.features && hostel.features.length > 0 && (
          <div className="detail-amenities-section">
            <h4>Facilities provided</h4>
            <div className="detail-amenities">
              {hostel.features.map(f => {
                const Icon = amenityIcons[f] || Check;
                return (
                  <span key={f}>
                    <Check size={14} className="amenity-check" />
                    <Icon size={14} />
                    {f}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Room / Bed Browser */}
        <div className="bed-browser">
          <div className="browser-heading">
            <h3>Find your corner</h3>
            <span className="pill">Sample layout</span>
          </div>
          <label className="floor-label"><Layers size={16}/> Floor</label>
          <div className="floor-tabs" role="group" aria-label="Select floor">
            {[1,2,3].map(f => <button className={`chip ${route.floor === f ? 'active' : ''}`} key={f} onClick={() => navigate({...route,floor:f,room:f*100+1})}>Floor {f}</button>)}
          </div>
          <label className="floor-label"><DoorOpen size={16}/> Room</label>
          <div className="floor-tabs">
            {[1,2,3].map(n => <button key={n} className={`chip ${route.room === route.floor*100+n ? 'active' : ''}`} onClick={() => navigate({...route,room:route.floor*100+n})}>Room {route.floor*100+n}</button>)}
          </div>
          <div className="room-plan">
            <div className="room-label">ROOM {route.room} <span>4 & 6 sharing layout options</span></div>
            <div className="bunk-grid">
              {['A','B'].map((b,idx) => (
                <div className="bunk" key={b}>
                  <span>BUNK {b}</span>
                  {['Upper','Lower'].map((level,j) => {
                    const occupied = (route.room+idx+j)%3===0;
                    return (
                      <div className={`bed ${occupied?'occupied':'available'}`} key={level}>
                        <BedDouble size={23}/>
                        <div><strong>{b}{j+1} · {level}</strong><span>{occupied?'Occupied':'Available'}</span></div>
                        {!occupied && <Check size={15}/>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="room-entry"><DoorOpen size={15}/> Entrance</div>
          </div>
          <div className="bed-legend">
            <span><i className="legend-available"/>Available</span>
            <span><i className="legend-occupied"/>Occupied</span>
            <small>Confirm your bed with {hostel.contactRole ? `${hostel.contactRole.toLowerCase()} ${hostel.phoneDisplay || ''}` : 'the warden'} during your visit.</small>
          </div>
        </div>

        <div className="detail-bottom">
          <div>
            <small>Starting from (Stay + Food)</small>
            <strong>₹{money(hostel.price || 6500)} <span>/ month</span></strong>
          </div>
          <button className="button primary" onClick={enquire}>Arrange a visit <ArrowUpRight size={17}/></button>
        </div>
      </div>
    </div>
  );
}


const emptyFields = {name:'',phone:'',college:'',email:'',guardian:'',guardianPhone:'',address:''};
type Fields = typeof emptyFields;
function Application({admission,setDirty,onDone,onClose}:{admission:boolean;setDirty:(value:boolean)=>void;onDone:()=>void;onClose?:()=>void}) {
  const [submittedInfo, setSubmittedInfo] = useState<{name: string; phone: string}>({name: '', phone: ''});
  const [fields,setFields] = useState<Fields>({...emptyFields});
  const [step,setStep] = useState(1);
  const [photo,setPhoto] = useState<File | null>(null);
  const [aadhaar,setAadhaar] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ file: File; title: string; url: string } | null>(null);

  function openPreview(file: File, title: string) {
    const url = URL.createObjectURL(file);
    setPreview({ file, title, url });
  }

  function closePreview() {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  }

  function openDocInNewTab(file: File) {
    const fileUrl = URL.createObjectURL(file);
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const win = window.open('', '_blank');
    if (!win) {
      // Fallback if popup blocked
      const a = document.createElement('a');
      a.href = fileUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    try {
      win.document.title = `${file.name} - Keto Living`;
      win.document.body.style.margin = '0';
      win.document.body.style.padding = '0';
      win.document.body.style.backgroundColor = isPdf ? '#2b2b2b' : '#0d1117';
      win.document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

      if (isPdf) {
        win.document.body.style.height = '100vh';
        win.document.body.style.overflow = 'hidden';
        const iframe = win.document.createElement('iframe');
        iframe.src = fileUrl;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.title = file.name;
        win.document.body.appendChild(iframe);
      } else {
        win.document.body.style.minHeight = '100vh';
        win.document.body.style.display = 'flex';
        win.document.body.style.flexDirection = 'column';
        win.document.body.style.alignItems = 'center';
        win.document.body.style.justifyContent = 'center';
        win.document.body.style.padding = '24px';
        win.document.body.style.boxSizing = 'border-box';

        const img = win.document.createElement('img');
        img.src = fileUrl;
        img.alt = file.name;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '85vh';
        img.style.objectFit = 'contain';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 12px 40px rgba(0,0,0,0.6)';

        const label = win.document.createElement('div');
        label.style.marginTop = '16px';
        label.style.color = '#cbd5e1';
        label.style.fontSize = '14px';
        label.style.fontWeight = '500';
        label.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;

        win.document.body.appendChild(img);
        win.document.body.appendChild(label);
      }
    } catch {
      win.location.href = fileUrl;
    }
  }

  useEffect(() => {
    return () => {
      if (preview?.url) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePreview(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview]);

  const [fileError,setFileError] = useState('');
  const [touched,setTouched] = useState<string[]>([]);
  const [consent,setConsent] = useState(false);
  const [busy,setBusy] = useState(false);
  const [done,setDone] = useState(false);
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => () => { if(timer.current) clearTimeout(timer.current); setDirty(false); }, [setDirty]);
  function error(key:keyof Fields) {
    const value = fields[key].trim();
    if(!value) return 'This field is required.';
    if((key === 'phone' || key === 'guardianPhone') && !/^[6-9]\d{9}$/.test(value)) return 'Enter a valid 10-digit Indian mobile number.';
    if(key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
    if((key === 'name' || key === 'guardian') && value.length < 2) return 'Enter at least 2 characters.';
    return '';
  }
  const required: (keyof Fields)[] = admission ? step === 1 ? ['name','phone','college','email'] : ['guardian','guardianPhone','address'] : ['name','phone','college'];
  const valid = admission && step === 3 ? !!photo && !!aadhaar && consent : required.every(k => !error(k));
  function field(key:keyof Fields,label:string,placeholder:string,maxLength:number,type='text') {
    const err = touched.includes(key) ? error(key) : '';
    return (
      <label className="input-label" key={key}>
        <span>{label} <span className="required">*</span></span>
        <input
          name={key}
          dir={type === 'tel' || type === 'email' ? 'ltr' : 'auto'}
          type={type}
          maxLength={maxLength}
          inputMode={type === 'tel' ? 'numeric' : type === 'email' ? 'email' : 'text'}
          autoComplete={key === 'name' ? 'name' : key === 'phone' ? 'tel-national' : key === 'email' ? 'email' : 'off'}
          placeholder={placeholder}
          value={fields[key]}
          aria-invalid={!!err}
          aria-describedby={err ? `${key}-error` : undefined}
          onBlur={() => setTouched(prev => [...new Set([...prev,key])])}
          onChange={e => {
            const value = type === 'tel' ? e.target.value.replace(/\D/g,'').slice(0,10) : e.target.value;
            setFields(prev => ({...prev,[key]:value}));
            setDirty(true);
            setTouched(prev => [...new Set([...prev,key])]);
          }}
          required
        />
        <span className={`field-error ${err ? 'has-error' : ''}`} id={`${key}-error`} aria-live="polite">
          {err}
        </span>
      </label>
    );
  }
  function fileChange(file:File|undefined,kind:'photo'|'aadhaar') {if(!file)return;const allowed = kind === 'photo' ? ['image/jpeg','image/png','image/webp'] : ['image/jpeg','image/png','image/webp','application/pdf'];if(!allowed.includes(file.type)||file.size>5*1024*1024){setFileError('Choose a supported file smaller than 5 MB.');return;}setFileError('');if(kind === 'photo')setPhoto(file);else setAadhaar(file);setDirty(true);}
  function submit(e:React.FormEvent) {
    e.preventDefault();
    if(!valid||locked.current) return;
    if(admission && step < 3) {
      setStep(step + 1);
      setTouched([]);
      return;
    }
    locked.current = true;
    setBusy(true);
    track(admission ? 'admission_preview_submit' : 'enquiry_preview_submit');
    setSubmittedInfo({ name: fields.name.trim(), phone: fields.phone.trim() });
    timer.current = setTimeout(() => {
      setFields({...emptyFields});
      setPhoto(null);
      setAadhaar(null);
      setTouched([]);
      setConsent(false);
      form.current?.reset();
      setDirty(false);
      setBusy(false);
      locked.current = false;
      setDone(true);
      onDone();
    }, 650);
  }
  if(done) {
    return (
      <div className={`application ${admission ? 'registration-modal' : 'enquiry-modal'} is-done`}>
        <div className="success-panel reg-success-panel">
          <span className="success-icon"><CheckCircle2 size={36} strokeWidth={2.2}/></span>
          <span className="eyebrow">{admission ? 'REGISTRATION CONFIRMED' : 'ENQUIRY RECEIVED'}</span>
          <h2>{admission ? 'Application submitted successfully.' : 'Thank you for reaching out.'}</h2>
          {admission ? (
            <>
              <div className="reg-success-voucher">
                <div className="voucher-item">
                  <span className="voucher-label">Hostel & Room</span>
                  <strong>Sapphire Boys Hostel · Room 101</strong>
                </div>
                <div className="voucher-item">
                  <span className="voucher-label">Bed Assignment</span>
                  <strong>Floor 1 · Bunk B · Lower Bed</strong>
                </div>
                <div className="voucher-item">
                  <span className="voucher-label">Applicant Name</span>
                  <strong>{submittedInfo.name || 'Student Applicant'}</strong>
                </div>
                <div className="voucher-item">
                  <span className="voucher-label">Contact Number</span>
                  <strong>{submittedInfo.phone ? `+91 ${submittedInfo.phone}` : '+91 —'}</strong>
                </div>
              </div>
              <p>Your admission details and room reservation have been recorded. Our warden and administrative team will review your documents and reach out with your onboarding schedule.</p>
            </>
          ) : (
            <p>We have received your enquiry. Our student admissions team will review your details and contact you shortly to answer any queries and arrange a hostel visit.</p>
          )}
          <div className="success-actions">
            <button className="button primary success-close-btn" type="button" onClick={onClose}>
              <span>Back to website</span> <Check size={15}/>
            </button>
            <button className="button secondary success-retry-btn" type="button" onClick={() => { setDone(false); setStep(1); setSubmittedInfo({ name: '', phone: '' }); }}>
              <span>Submit another</span> <RotateCcw size={14}/>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (admission) {
    return (
      <div className="application registration-modal">
        <div className="reg-header">
          <div className="reg-top-meta">
            <span className="reg-badge"><ShieldCheck size={13}/> OFFICIAL ADMISSION</span>
            <span className="reg-step-pill">Step {step} of 3</span>
          </div>
          <h2>Student Registration</h2>
          <p>Complete your verified admission for the allocated bed.</p>
        </div>

        {/* Boarding Pass / Allocated Bed Card */}
        <div className="reg-room-card">
          <div className="reg-room-icon">
            <BedDouble size={20}/>
          </div>
          <div className="reg-room-info">
            <div className="reg-room-title">
              <strong>Sapphire Boys Hostel · Room 101</strong>
              <span className="reg-room-badge"><Check size={11} strokeWidth={2.6}/> Allocated</span>
            </div>
            <div className="reg-room-meta">
              <span>Floor 1</span>
              <span className="reg-dot">·</span>
              <span>Bunk B</span>
              <span className="reg-dot">·</span>
              <span>Lower bed</span>
              <span className="reg-dot">·</span>
              <span>Karaparamba</span>
            </div>
          </div>
        </div>

        {/* Connected Multi-Step Stepper */}
        <div className="reg-stepper" aria-label="Registration steps">
          <div className="reg-stepper-track">
            <div className="reg-stepper-progress" style={{ width: step === 1 ? '16%' : step === 2 ? '50%' : '100%' }} />
          </div>
          <div className="reg-steps-row">
            {[
              { num: 1, title: 'Your details', desc: 'Basic info' },
              { num: 2, title: 'Contact & address', desc: 'Guardian info' },
              { num: 3, title: 'Documents', desc: 'ID & photo' }
            ].map(({ num, title, desc }) => (
              <div key={num} className={`reg-step-node ${step === num ? 'active' : step > num ? 'done' : ''}`}>
                <span className="reg-step-num">
                  {step > num ? <Check size={12} strokeWidth={2.8}/> : num}
                </span>
                <div className="reg-step-text">
                  <span className="reg-step-title">{title}</span>
                  <span className="reg-step-desc">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form ref={form} onSubmit={submit} noValidate>
          {step === 1 && (
            <div className="reg-grid">
              {field('name','Full name','Enter your full name',100)}
              {field('phone','Phone number','Enter 10-digit mobile number',10,'tel')}
              {field('college','College / Institution','Enter your college or institution',160)}
              {field('email','Email address','Enter your email address',254,'email')}
            </div>
          )}

          {step === 2 && (
            <div className="reg-grid">
              {field('guardian','Parent / Guardian name','Enter parent or guardian name',100)}
              {field('guardianPhone','Parent / Guardian phone','Enter 10-digit mobile number',10,'tel')}
              <div className="reg-col-full">
                {field('address','Permanent address','Enter street, city, state, and PIN code',500)}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="reg-step-docs">
              <div className="reg-docs-intro">
                <strong>Upload verification documents</strong>
                <span>JPG, PNG or WebP · Up to 5 MB each. Aadhaar also accepts PDF.</span>
              </div>
              <div className="reg-upload-grid">
                <div className={`upload-box reg-upload-box ${photo ? 'has-file' : ''}`}>
                  <label htmlFor="reg-photo-upload" className="upload-box-clickable">
                    <div className={`upload-box-icon ${photo ? 'is-uploaded' : ''}`}>
                      {photo ? <Check size={20} strokeWidth={2.8}/> : <Upload size={22}/>}
                    </div>
                    <div className="upload-box-content">
                      <strong>{photo?.name || 'Student photograph'}</strong>
                      <span>{photo ? `${(photo.size / (1024 * 1024)).toFixed(2)} MB · Click to replace` : 'Choose JPG, PNG or WebP image'}</span>
                    </div>
                  </label>
                  <input
                    id="reg-photo-upload"
                    aria-label="Upload photograph"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="upload-hidden-input"
                    onChange={e => { fileChange(e.target.files?.[0], 'photo'); e.target.value = ''; }}
                  />
                  {photo && (
                    <div className="upload-box-actions">
                      <button
                        type="button"
                        className="upload-action-btn upload-view-btn"
                        title="View photograph preview"
                        aria-label="View photograph preview"
                        onClick={() => openPreview(photo, 'Student photograph')}
                      >
                        <Eye size={15}/>
                      </button>
                      <button
                        type="button"
                        className="upload-action-btn upload-remove-btn"
                        title="Remove photograph"
                        aria-label="Remove photograph"
                        onClick={() => {
                          setPhoto(null);
                          setDirty(true);
                        }}
                      >
                        <Trash2 size={15}/>
                      </button>
                    </div>
                  )}
                </div>

                <div className={`upload-box reg-upload-box ${aadhaar ? 'has-file' : ''}`}>
                  <label htmlFor="reg-aadhaar-upload" className="upload-box-clickable">
                    <div className={`upload-box-icon ${aadhaar ? 'is-uploaded' : ''}`}>
                      {aadhaar ? <Check size={20} strokeWidth={2.8}/> : <ShieldCheck size={22}/>}
                    </div>
                    <div className="upload-box-content">
                      <strong>{aadhaar?.name || 'Aadhaar copy (ID)'}</strong>
                      <span>{aadhaar ? `${(aadhaar.size / (1024 * 1024)).toFixed(2)} MB · Click to replace` : 'Choose JPG, PNG or PDF document'}</span>
                    </div>
                  </label>
                  <input
                    id="reg-aadhaar-upload"
                    aria-label="Upload Aadhaar copy"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    className="upload-hidden-input"
                    onChange={e => { fileChange(e.target.files?.[0], 'aadhaar'); e.target.value = ''; }}
                  />
                  {aadhaar && (
                    <div className="upload-box-actions">
                      <button
                        type="button"
                        className="upload-action-btn upload-view-btn"
                        title="View document preview"
                        aria-label="View document preview"
                        onClick={() => openPreview(aadhaar, 'Aadhaar copy (ID)')}
                      >
                        <Eye size={15}/>
                      </button>
                      <button
                        type="button"
                        className="upload-action-btn upload-remove-btn"
                        title="Remove document"
                        aria-label="Remove document"
                        onClick={() => {
                          setAadhaar(null);
                          setDirty(true);
                        }}
                      >
                        <Trash2 size={15}/>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {fileError && <p role="alert" className="field-error">{fileError}</p>}

              <label className="consent reg-consent-box">
                <input type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); setDirty(true); }} />
                <span>I confirm that the details entered above are accurate and I agree to the hostel admission terms.</span>
              </label>
            </div>
          )}

          <div className="form-buttons reg-form-buttons">
            {step > 1 && (
              <button type="button" className="button secondary reg-back-btn" disabled={busy} onClick={() => setStep(step - 1)}>
                <ChevronLeft size={16}/> Back
              </button>
            )}
            <button className="button primary submit-button reg-submit-btn" type="submit" disabled={!valid || busy}>
              {busy ? (
                <><LoaderCircle className="spin" size={18}/> Completing registration…</>
              ) : step === 1 ? (
                <>Next: Guardian & address <ArrowRight size={17}/></>
              ) : step === 2 ? (
                <>Next: Document upload <ArrowRight size={17}/></>
              ) : (
                <>Confirm & submit registration <CheckCircle2 size={17}/></>
              )}
            </button>
          </div>
          <p className="form-footnote"><ShieldCheck size={14}/> Official student admission flow · Safe preview.</p>
        </form>

        {preview && (
          <div className="doc-preview-backdrop" onClick={closePreview} role="dialog" aria-modal="true" aria-label="Document preview">
            <div className="doc-preview-modal" onClick={e => e.stopPropagation()}>
              <div className="doc-preview-header">
                <div className="doc-preview-title">
                  <Eye size={17} className="doc-preview-icon" />
                  <div>
                    <strong>{preview.title}</strong>
                    <span>{preview.file.name} ({(preview.file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>
                </div>
                <div className="doc-preview-header-actions">
                  <button
                    type="button"
                    className="icon-button doc-preview-action"
                    title="Open in new window"
                    aria-label="Open in new window"
                    onClick={() => openDocInNewTab(preview.file)}
                  >
                    <ExternalLink size={15}/>
                  </button>
                  <button
                    type="button"
                    className="icon-button doc-preview-action"
                    onClick={closePreview}
                    title="Close preview"
                    aria-label="Close preview"
                  >
                    <X size={17}/>
                  </button>
                </div>
              </div>
              <div className="doc-preview-body">
                {preview.file.type === 'application/pdf' ? (
                  <iframe src={preview.url} title={preview.title} className="doc-preview-iframe" />
                ) : (
                  <div className="doc-preview-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview.url} alt={preview.title} className="doc-preview-img" />
                  </div>
                )}
              </div>
              <div className="doc-preview-footer">
                <button
                  type="button"
                  className="button secondary doc-preview-external"
                  onClick={() => openDocInNewTab(preview.file)}
                >
                  <ExternalLink size={14}/> Open in new tab
                </button>
                <button type="button" className="button primary doc-preview-close" onClick={closePreview}>
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Enquiry modal (Preserved exactly as requested)
  return (
    <div className={`application enquiry-modal ${busy ? 'is-submitting' : ''}`}>
      <div className="form-heading">
        <span className="eyebrow">LET’S START WITH HELLO</span>
        <h2>Find your kind of space.</h2>
        <p>Leave a few details. We’ll help you take the next step.</p>
      </div>
      <form ref={form} onSubmit={submit} noValidate>
        <div className="form-fields">
          {field('name','Full name','Enter your full name',100)}
          {field('phone','Phone number','Enter 10-digit mobile number',10,'tel')}
          {field('college','College / Institution','Enter your college or institution',160)}
        </div>
        <div className="form-buttons">
          <button className="button primary submit-button" type="submit" disabled={!valid||busy}>
            {busy ? <><LoaderCircle className="spin" size={18}/> Completing preview…</> : <>Preview enquiry submission <ArrowUpRight size={17}/></>}
          </button>
        </div>
        <p className="form-footnote"><ShieldCheck size={14}/> An enquiry is simply a request. It does not book a bed.</p>
      </form>
    </div>
  );
}
