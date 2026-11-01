import axios from "axios";

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: string;
};

type ProductsResponse = {
  products: Product[];
};

export async function getProducts(): Promise<Product[]> {
  const response = await axios.get<ProductsResponse>(
    "https://dummyjson.com/products",
  );
  return response.data.products;
}
