import { FormEvent, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MarkerData, ServerError } from "../interfaces";

interface GeocodeResponse {
  lat: number;
  lng: number;
}

const useKantorFormSubmission = () => {
  const [serverError, setServerError] = useState("");

  const isServerError = (obj: any): obj is ServerError => {
    return (obj as ServerError).error !== undefined;
  };

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError("");

    const form = event.currentTarget;
    const formData: MarkerData = {
      lat: 0,
      lng: 0,
      country: "Polska",
      city: (form.querySelector("[name='city']") as HTMLInputElement).value,
      street: (form.querySelector("[name='street']") as HTMLInputElement).value,
      name: (form.querySelector("[name='name']") as HTMLInputElement).value,
      usd_buy: parseFloat((form.querySelector("[name='usd_buy']") as HTMLInputElement).value),
      usd_sell: parseFloat((form.querySelector("[name='usd_sell']") as HTMLInputElement).value),
      eur_buy: parseFloat((form.querySelector("[name='eur_buy']") as HTMLInputElement).value),
      eur_sell: parseFloat((form.querySelector("[name='eur_sell']") as HTMLInputElement).value),
      chf_buy: parseFloat((form.querySelector("[name='chf_buy']") as HTMLInputElement).value),
      chf_sell: parseFloat((form.querySelector("[name='chf_sell']") as HTMLInputElement).value),
      gbp_buy: parseFloat((form.querySelector("[name='gbp_buy']") as HTMLInputElement).value),
      gbp_sell: parseFloat((form.querySelector("[name='gbp_sell']") as HTMLInputElement).value),
    };

    try {
      const response = await axios.post<GeocodeResponse>("/geocode", {
        street: formData.street,
        city: formData.city,
      });

      const { lat, lng } = response.data;

      const newMarker: MarkerData = {
        ...formData,
        lat,
        lng,
      };

      await axios.post("/api/add-new-currency-exchange", newMarker, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle success if needed
      console.log("Form submitted successfully!");
      navigate("/");
    } catch (error) {
      if (isServerError(error)) {
        setServerError((error as ServerError).error || "Wystąpił błąd podczas geokodowania");
      } else {
        setServerError("Wystąpił błąd podczas geokodowania");
      }
    }
  };

  return { serverError, setServerError, handleSubmit };
};

export default useKantorFormSubmission;
