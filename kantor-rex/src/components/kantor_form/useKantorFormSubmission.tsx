import { FormEvent, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { KantorData, ServerError } from "@shared/interfaces";

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
    const formData: KantorData = {
      lat: 0,
      lng: 0,
      country: "Polska",
      city: form.city.value,
      street: form.street.value,
      company_name: form.company_name.value,
      usd_buy: form.usd_buy.value,
      usd_sell: form.usd_sell.value,
      eur_buy: form.eur_buy.value,
      eur_sell: form.eur_sell.value,
      chf_buy: form.chf_buy.value,
      chf_sell: form.chf_sell.value,
      gbp_buy: form.gbp_buy.value,
      gbp_sell: form.gbp_sell.value,
    };

    try {
      const response = await axios.post("/geocode", {
        street: formData.street,
        city: formData.city,
      });

      const { lat, lng } = response.data;

      const newMarker: KantorData = {
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
