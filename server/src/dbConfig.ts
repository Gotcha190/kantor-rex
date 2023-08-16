import { KantorData } from "@shared/interfaces";

export const columnTypes: {
    [K in keyof KantorData]: string;
  } = {
    lat: "FLOAT",
    lng: "FLOAT",
    street: "VARCHAR(255)",
    city: "VARCHAR(255)",
    country: "VARCHAR(255)",
    company_name: "VARCHAR(255)",
    usd_buy: "FLOAT",
    usd_sell: "FLOAT",
    eur_buy: "FLOAT",
    eur_sell: "FLOAT",
    chf_buy: "FLOAT",
    chf_sell: "FLOAT",
    gbp_buy: "FLOAT",
    gbp_sell: "FLOAT",
  };