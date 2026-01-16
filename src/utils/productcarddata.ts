export interface ProductCardData {
  id: number
  image: string
  title: string
  price: number
  originalPrice?: number
  href: string
  category: string
  outOfStock?: boolean
  isSelected?: boolean
  isDiscounted?: boolean
  gender?: string 
  mechanism?: string 
  strap?: string 
  glass?: string 
  ledLight?: string 
}

const allProducts: ProductCardData[] = [
  {
    id: 1,
    image: '/images/saat.png',
    title: 'CASIO MTP-1303PD-1FVE',
    price: 480.00,
    originalPrice: 560.00,
    href: '#',
    category: 'Casio',
    isSelected: true,
    isDiscounted: true,
    gender: 'Kişi',
    mechanism: 'Kvars',
    strap: 'Bio Plastik',
    glass: 'Mineral',
    ledLight: 'Ağ',
  },
  {
    id: 2,
    image: '/images/saat.png',
    title: 'Casio Classic Analog Watch',
    price: 89.99,
    originalPrice: 119.99,
    href: '#',
    category: 'Casio',
    gender: 'Qadın',
    mechanism: 'Kvars',
    strap: 'Bio Plastik',
    glass: 'Mineral',
    ledLight: 'Ağ',
    outOfStock: true,
    isSelected: true,
    isDiscounted: true,
  },
  {
    id: 3,
    image: '/images/saat.png',
    title: 'Casio Edifice Chronograph',
    price: 199.99,
    href: '#',
    category: 'Casio',
    gender: 'Kişi',
    mechanism: 'Kvars',
    strap: 'Bio Plastik',
    glass: 'Mineral',
    ledLight: 'Ağ',
    isSelected: true,
    isDiscounted: false,
  },
  {
    id: 4,
    image: '/images/saat.png',
    title: 'Casio Pro Trek Smart Watch',
    price: 249.99,
    originalPrice: 299.99,
    href: '#',
    category: 'Casio',
    isSelected: true,
    isDiscounted: true,
    gender: 'Kişi',
    mechanism: 'Kvars',
    strap: 'Bio Plastik',
    glass: 'Mineral',
    ledLight: 'Ağ',
  },
  {
    id: 5,
    image: '/images/saat.png',
    title: 'Casio Pro Trek Smart Watch',
    price: 249.99,
    originalPrice: 299.99,
    href: '#',
    category: 'Casio',
    isDiscounted: true,
    gender: 'Kişi',
    mechanism: 'Kvars',
    strap: 'Bio Plastik',
    glass: 'Mineral',
    ledLight: 'Ağ',
  },
  {
    id: 6,
    image: '/images/saat.png',
    title: 'Casio Pro Trek Smart Watch',
    price: 249.99,
    originalPrice: 299.99,
    href: '#',
    category: 'Casio',
    isDiscounted: true,
    gender: 'Kişi',
    mechanism: 'Kvars',
    strap: 'Bio Plastik',
    glass: 'Mineral',
    ledLight: 'Ağ',
  },
  {
    id: 7,
    image: '/images/saat.png',
    title: 'Casio Pro Trek Smart Watch',
    price: 249.99,
    originalPrice: 299.99,
    href: '#',
    category: 'Casio',
    isDiscounted: true,
    gender: 'Kişi',
    mechanism: 'Kvars',
    strap: 'Bio Plastik',
    glass: 'Mineral',
    ledLight: 'Ağ',
  },
]

export const selectedProducts: ProductCardData[] = allProducts.filter(
  (product) => product.isSelected === true
)

export const discountedProducts: ProductCardData[] = allProducts.filter(
  (product) => product.isDiscounted === true || (product.originalPrice && product.originalPrice > product.price)
)

export const getAllProducts = () => allProducts
