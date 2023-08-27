import * as z from "zod";

const ProductSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  price: z.number(),
});

type Product = z.infer<typeof ProductSchema>;

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Laptop",
    price: 900,
  },
  {
    id: 2,
    name: "Smartphone",
    price: 700,
  },
  {
    id: 3,
    name: "T-shirt",
    price: 20,
  },
  {
    id: 4,
    name: "Jeans",
    price: 50,
  },
  {
    id: 5,
    name: "Running Shoes",
    price: 90,
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 50,
  },
  {
    id: 7,
    name: "Dress Shirt",
    price: 30,
  },
  {
    id: 8,
    name: "Gaming Console",
    price: 350,
  },
  {
    id: 9,
    name: "Sneakers",
    price: 120,
  },
  {
    id: 10,
    name: "Watch",
    price: 200,
  },
  {
    id: 11,
    name: "Hoodie",
    price: 40,
  },
  {
    id: 12,
    name: "Guitar",
    price: 300,
  },
  {
    id: 13,
    name: "Fitness Tracker",
    price: 80,
  },
  {
    id: 14,
    name: "Backpack",
    price: 50,
  },
  {
    id: 15,
    name: "Dumbbell Set",
    price: 130,
  },
];
