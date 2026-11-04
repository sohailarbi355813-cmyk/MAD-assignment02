import axios from "axios";

export type MarketAsset = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number | null;
};

export async function getMarketAssets(): Promise<MarketAsset[]> {
  const response = await axios.get<MarketAsset[]>(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 20,
        page: 1,
        sparkline: false,
        price_change_percentage: "24h",
      },
    },
  );
  return response.data;
}
