import { JamuProduct } from './types';

export const JAMU_PRODUCTS: JamuProduct[] = [
  {
    id: '1',
    name: 'Beras Kencur',
    description: 'Minuman penyegar tradisional dari beras dan rimpang kencur yang menghangatkan.',
    benefits: ['Meningkatkan nafsu makan', 'Menghilangkan letih', 'Meredakan sakit kepala'],
    price: 15000,
    image: 'https://images.unsplash.com/photo-1621506821199-a996b7df6804?q=80&w=1000&auto=format&fit=crop', // Kencur vibes
    category: 'Energi'
  },
  {
    id: '2',
    name: 'Kunyit Asam',
    description: 'Campuran kunyit dan asam jawa yang murni dan menyegarkan tubuh.',
    benefits: ['Melancarkan metabolisme', 'Anti-inflamasi alami', 'Mencerahkan kulit'],
    price: 12000,
    image: 'https://images.unsplash.com/photo-1615485244981-4422176378e0?q=80&w=1000&auto=format&fit=crop', // Turmeric vibes
    category: 'Segar'
  },
  {
    id: '3',
    name: 'Temulawak',
    description: 'Rimpang temulawak pilihan untuk kesehatan hati dan empedu.',
    benefits: ['Menjaga kesehatan hati', 'Meningkatkan fungsi pencernaan', 'Menurunkan lemak darah'],
    price: 18000,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop', // Ginger/Rhizome vibes
    category: 'Kesehatan'
  },
  {
    id: '4',
    name: 'Gulas (Gula Asam)',
    description: 'Kesegaran asam jawa asli yang dipadukan dengan gula aren pilihan.',
    benefits: ['Meredakan batuk', 'Sariawan', 'Penyegar tenggorokan'],
    price: 10000,
    image: 'https://images.unsplash.com/photo-1589135003398-6ce2b651034c?q=80&w=1000&auto=format&fit=crop',
    category: 'Segar'
  },
  {
    id: '5',
    name: 'Jahe Wangi',
    description: 'Minuman jahe hangat dengan aroma rempah yang menenangkan.',
    benefits: ['Menghangatkan tubuh', 'Meredakan gejala flu', 'Antioksidan tinggi'],
    price: 14000,
    image: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?q=80&w=1000&auto=format&fit=crop',
    category: 'Energi'
  },
  {
     id: '6',
     name: 'Pahitan',
     description: 'Ramuan berbagai rempah pahit untuk detoksifikasi tubuh yang mendalam.',
     benefits: ['Detoksifikasi darah', 'Mengobati gatal-gatal', 'Menurunkan kadar gula'],
     price: 15000,
     image: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?q=80&w=1000&auto=format&fit=crop',
     category: 'Kesehatan'
  }
];
