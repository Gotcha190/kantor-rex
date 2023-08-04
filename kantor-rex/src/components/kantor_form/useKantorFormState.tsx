import { useState } from "react";
import { MarkerData } from "../interfaces";

type TouchedFields = {
  [key: string]: boolean;
};

const useKantorFormState = () => {
  const initialFormData: MarkerData = {
    lat: 0,
    lng: 0,
    company_name: "",
    country: "",
    city: "",
    street: "",
    usd_buy: 0,
    usd_sell: 0,
    eur_buy: 0,
    eur_sell: 0,
    chf_buy: 0,
    chf_sell: 0,
    gbp_buy: 0,
    gbp_sell: 0,
  };

  const [formData, setFormData] = useState<MarkerData>(initialFormData);
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    street: false,
    city: false,
    company_name: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setTouchedFields((prevTouchedFields) => ({ ...prevTouchedFields, [name]: true }));
  };

  return { formData, handleChange, touchedFields };
};

export default useKantorFormState;