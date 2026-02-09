export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  customizable: boolean;
  flavors?: string;
}

export const products: Product[] = [
  {
    id: 'vegan-truffle-collection',
    sku: 'TC-VEG-009',
    name: '9-Piece Vegan Truffle Collection',
    subtitle: '72% cacao dark chocolate with early-harvest olive oil',
    price: 38,
    image: 'https://cdn.shopify.com/s/files/1/0012/8660/2848/files/Vegan_9pc_001.jpg?v=1727797701',
    rating: 4.8,
    reviewCount: 124,
    customizable: true,
    flavors: 'Forest Raspberry Rose, Tahitian Orchid Vanilla, Sicilian Blood Orange',
  },
  {
    id: 'exotic-truffle-collection-9pc',
    sku: 'TC-EXO-009',
    name: '9-Piece Exotic Truffle Collection',
    subtitle: 'Award-winning truffles infused with global spices',
    price: 38,
    image: 'https://cdn.shopify.com/s/files/1/0012/8660/2848/files/Exotic_9pc_001.jpg?v=1727797701',
    rating: 4.9,
    reviewCount: 312,
    customizable: false,
  },
  {
    id: 'dark-chocolate-truffle-collection',
    sku: 'TC-DRK-009',
    name: '9-Piece Dark Chocolate Collection',
    subtitle: 'A rich journey through single-origin dark chocolate',
    price: 38,
    image: 'https://cdn.shopify.com/s/files/1/0012/8660/2848/files/Dark_9pc_001.jpg?v=1727797701',
    rating: 4.7,
    reviewCount: 198,
    customizable: false,
  },
  {
    id: 'exotic-truffle-collection-16pc',
    sku: 'TC-EXO-016',
    name: '16-Piece Exotic Truffle Collection',
    subtitle: 'Our signature exotic collection in a grand format',
    price: 62,
    image: 'https://cdn.shopify.com/s/files/1/0012/8660/2848/files/Exotic_16pc_001_1.jpg?v=1727797701',
    rating: 4.9,
    reviewCount: 267,
    customizable: false,
  },
  {
    id: 'vegan-truffle-collection-16pc',
    sku: 'TC-VEG-016',
    name: '16-Piece Vegan Truffle Collection',
    subtitle: 'Extended vegan collection with additional flavor profiles',
    price: 62,
    image: 'https://cdn.shopify.com/s/files/1/0012/8660/2848/files/Vegan-16pc_Product-Shot_e14fdf66-7f30-44b5-a0d2-e1d219124c9d.jpg?v=1727797701',
    rating: 4.8,
    reviewCount: 89,
    customizable: false,
  },
  {
    id: 'dark-chocolate-truffle-collection-16pc',
    sku: 'TC-DRK-016',
    name: '16-Piece Dark Chocolate Collection',
    subtitle: 'The complete dark chocolate experience',
    price: 62,
    image: 'https://cdn.shopify.com/s/files/1/0012/8660/2848/files/Dark_16pc_001.jpg?v=1727797701',
    rating: 4.7,
    reviewCount: 156,
    customizable: false,
  },
];
