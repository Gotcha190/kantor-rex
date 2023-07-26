import { useState } from "react";
import { MarkerData } from "../interfaces";

const useKantorFormState = () => {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [formData, setFormData] = useState<MarkerData>({
    lat: 0,
    lng: 0,
    name: "",
    country: "",
    city: "",
    street: "",
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
