import fashion1 from "@/assets/fashion-1.png";
import fashion2 from "@/assets/fashion-2.png";
import fashion3 from "@/assets/fashion-3.png";
import fashion4 from "@/assets/fashion-4.png";
import fashion5 from "@/assets/fashion-5.png";
import fashion6 from "@/assets/fashion-6.png";
import fashion7 from "@/assets/fashion-7.png";
import fashion8 from "@/assets/fashion-8.png";
import fashion9 from "@/assets/fashion-9.png";
import fashion10 from "@/assets/fashion-10.png";
import fashion11 from "@/assets/fashion-11.png";
import fashion12 from "@/assets/fashion-12.png";
import fashion13 from "@/assets/fashion-13.png";
import fashion14 from "@/assets/fashion-14.png";
import fashion15 from "@/assets/fashion-15.png";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  is_featured: boolean;
  is_new: boolean;
}

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Linen Oversized Blazer",
    description: "A timeless oversized blazer crafted from premium linen. Features a relaxed silhouette with structured shoulders and a single-button closure. Perfect for layering over casual or formal looks.",
    price: 285,
    category: "Women",
    images: [fashion1, fashion7, fashion8],
    colors: ["Cream", "Black", "Navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 15,
    is_featured: true,
    is_new: true,
  },
  {
    id: "2",
    name: "Silk Tie-Neck Blouse",
    description: "Elegant silk blouse with a sophisticated tie-neck detail. Made from 100% mulberry silk with a fluid drape. Features subtle pleating and mother-of-pearl buttons.",
    price: 195,
    category: "Women",
    images: [fashion2, fashion9, fashion10],
    colors: ["Black", "Ivory", "Dusty Rose"],
    sizes: ["XS", "S", "M", "L"],
    stock: 22,
    is_featured: true,
    is_new: true,
  },
  {
    id: "3",
    name: "Wool Double-Breasted Coat",
    description: "Luxurious double-breasted coat in a rich terracotta wool blend. Features a classic notched lapel, tortoiseshell buttons, and a warm Italian wool lining.",
    price: 485,
    category: "Women",
    images: [fashion3, fashion11, fashion12],
    colors: ["Terracotta", "Camel", "Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 8,
    is_featured: true,
    is_new: false,
  },
  {
    id: "4",
    name: "Cashmere Turtleneck Sweater",
    description: "Sumptuous cashmere turtleneck with a relaxed fit. Made from Grade A Mongolian cashmere for exceptional softness. Ribbed cuffs and hem for structure.",
    price: 345,
    category: "Women",
    images: [fashion4, fashion13, fashion14],
    colors: ["Cream", "Oatmeal", "Dove Grey"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 18,
    is_featured: false,
    is_new: true,
  },
  {
    id: "5",
    name: "Linen Jumpsuit",
    description: "Effortlessly chic linen jumpsuit with a relaxed silhouette. Features a classic collar, cinched waist with self-tie belt, and functional pockets. Perfect for warm days.",
    price: 265,
    category: "Women",
    images: [fashion5, fashion15, fashion1],
    colors: ["Olive", "Sand", "Terracotta"],
    sizes: ["XS", "S", "M", "L"],
    stock: 12,
    is_featured: true,
    is_new: false,
  },
  {
    id: "6",
    name: "Tailored Wrap Dress",
    description: "Sophisticated wrap dress with impeccable tailoring. Features a flattering V-neckline, long sleeves, and a midi length. Made from premium Italian wool crepe.",
    price: 385,
    category: "Women",
    images: [fashion6, fashion2, fashion3],
    colors: ["Navy", "Black", "Burgundy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 10,
    is_featured: true,
    is_new: true,
  },
];

export const CATEGORIES = ["All", "Women", "Accessories"];
