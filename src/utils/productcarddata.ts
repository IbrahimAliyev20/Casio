export interface ProductCardData {
  id: number
  image: string
  thumb_image?: string
  title: string
  name?: string
  price: number
  originalPrice?: number
  discount_price?: number | string
  href: string
  slug?: string
  category: string
  stock?: number
  outOfStock?: boolean
  isSelected?: boolean
  isDiscounted?: boolean
  gender?: string
  mechanism?: string
  strap?: string
  glass?: string
  ledLight?: string
  attributes?: Array<{
    attribute: string
    attribute_value: string
  }>
  collection_products?: Array<{
    id: number
    name: string
    slug: string
    image: string
  }>
  created_at?: string
  updated_at?: string
}

// Note: All product data is now fetched dynamically from API
// The static data has been removed to use only API-driven content
