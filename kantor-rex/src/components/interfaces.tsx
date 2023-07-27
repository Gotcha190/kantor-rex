export interface MarkerData {
    lat: number;
    lng: number;
    country: string;
    city: string;
    street: string;
    name: string;
    usd_buy: number;
    usd_sell: number;
    eur_buy: number;
    eur_sell: number;
    chf_buy: number;
    chf_sell: number;
    gbp_buy: number;
    gbp_sell: number;
  }

  export interface ServerError {
    error: string;
  }