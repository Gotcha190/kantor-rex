import { useState } from "react";
import { MarkerData } from "../interfaces";

const useKantorFormState = () => {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [formData, setFormData] = useState<MarkerData>({
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
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return { street, setStreet, name, setName, city, setCity, formData, setFormData, handleChange };
};

export default useKantorFormState;
