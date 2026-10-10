export type SharingOption = {
  sharing: number;
  price: number;
};

export type Hostel = {
  id: string;
  name: string;
  area: string;
  subArea?: string;
  audience: string;
  image?: string;
  price?: number;
  available?: number;
  tag: string;
  phone?: string;
  phoneDisplay?: string;
  contactRole?: 'Warden' | 'Cont';
  mapUrl?: string;
  maintenanceFee?: string;
  sharingOptions?: SharingOption[];
  features?: string[];
  status?: 'active' | 'coming-soon';
};

export const hostels: Hostel[] = [
  {
    id: 'karaparamba',
    name: 'Sapphire Boys Hostel',
    area: 'Karaparamba',
    audience: 'Boys',
    image: '/campus.webp',
    price: 6500,
    available: 8,
    tag: 'Stay & Homely Food · Prime Calicut location',
    phone: '8129014790',
    phoneDisplay: '81290 14790',
    contactRole: 'Warden',
    mapUrl: 'https://maps.app.goo.gl/3qg2sQvCQgxRhKKB7',
    maintenanceFee: '₹1,000 for 3 months',
    sharingOptions: [
      { sharing: 6, price: 6500 },
      { sharing: 4, price: 7500 },
      { sharing: 2, price: 8500 },
    ],
    features: ['Homely Food', 'Wi-Fi', 'Study Area', 'Parking', 'Washing M/C', 'Ironing'],
    status: 'active',
  },
  {
    id: 'pottammal-palazhi',
    name: 'Sapphire Boys Hostel',
    area: 'Pottammal-Palazhi Rd',
    audience: 'Boys',
    image: '/garden.webp',
    price: 6500,
    available: 7,
    tag: 'Stay & Homely Food',
    phone: '9605457204',
    phoneDisplay: '96054 57204',
    contactRole: 'Cont',
    mapUrl: 'https://maps.app.goo.gl/XhSuNgEDupfdqptVA',
    maintenanceFee: '₹1,000 for 3 months',
    sharingOptions: [
      { sharing: 6, price: 6500 },
      { sharing: 4, price: 7500 },
      { sharing: 2, price: 8500 },
    ],
    features: ['Homely Food', 'Wi-Fi', 'Study Area', 'Parking', 'Washing M/C', 'Ironing'],
    status: 'active',
  },
  {
    id: 'thondayad',
    name: 'Sapphire Boys Hostel',
    area: 'Thondayad',
    audience: 'Boys',
    image: '/park.webp',
    price: 6500,
    available: 10,
    tag: 'Bypass connectivity · Stay & Homely Food',
    phone: '8304811372',
    phoneDisplay: '83048 11372',
    contactRole: 'Cont',
    mapUrl: 'https://maps.app.goo.gl/bKsVvvD2HjJxqfj49',
    maintenanceFee: '₹1,000 for 3 months',
    sharingOptions: [
      { sharing: 6, price: 6500 },
      { sharing: 4, price: 7500 },
      { sharing: 2, price: 8500 },
    ],
    features: ['Homely Food', 'Wi-Fi', 'Study Area', 'Parking', 'Washing M/C', 'Ironing'],
    status: 'active',
  },
  {
    id: 'pottammal',
    name: 'Sapphire Boys Hostel',
    area: 'Pottammal',
    audience: 'Boys',
    image: '/hero.webp',
    price: 6500,
    available: 6,
    tag: 'Central & accessible · Stay & Homely Food',
    phone: '8943751694',
    phoneDisplay: '89437 51694',
    contactRole: 'Warden',
    mapUrl: 'https://maps.app.goo.gl/va5hQKh4zVes5vQZ9',
    maintenanceFee: '₹1,000 for 3 months',
    sharingOptions: [
      { sharing: 6, price: 6500 },
      { sharing: 4, price: 7500 },
      { sharing: 2, price: 8500 },
    ],
    features: ['Homely Food', 'Wi-Fi', 'Study Area', 'Parking', 'Washing M/C', 'Ironing'],
    status: 'active',
  },
  {
    id: 'girls-upcoming-1',
    name: 'Sapphire Girls Living',
    area: 'Karaparamba',
    audience: 'Girls',
    tag: 'Safe, premium student residence with homely meals',
    status: 'coming-soon',
  },
  {
    id: 'girls-upcoming-2',
    name: 'Sapphire Girls Living',
    area: 'Pottammal',
    audience: 'Girls',
    tag: '24/7 security, warden supervision & peaceful study space',
    status: 'coming-soon',
  },
];

export const money = (value: number) => new Intl.NumberFormat('en-IN').format(value);
export function track(action: string) {
  const win = window as Window & { gtag?: (...args: unknown[]) => void };
  win.gtag?.('event', action, { event_category: 'hostel_frontend' });
}

