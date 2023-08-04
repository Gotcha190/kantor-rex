export interface MarkerData {
  [key: string]: string | number;
  lat: number;
  lng: number;
  country: string;
  city: string;
  street: string;
  company_name: string;
  usd_buy: number;
  usd_sell: number;
  eur_buy: number;
  eur_sell: number;
  chf_buy: number;
  chf_sell: number;
  gbp_buy: number;
  gbp_sell: number;
}

export interface FormErrors {
  [key: string]: string | null;
  street: string | null;
  city: string | null;
  company_name: string | null;
}

export interface GeocodeResponse {
  lat: number;
  lng: number;
}

export interface ServerError {
  error: string;
}

export interface InputLabelProps {
  label: string;
  type: string;
  name: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
  touched?: boolean;
  error?: string | null;
}
