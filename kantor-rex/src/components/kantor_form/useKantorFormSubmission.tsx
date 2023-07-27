// @ts-nocheck
import { FormEvent, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MarkerData, ServerError } from "../interfaces";


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
      city: form.city.value,
      street: form.street.value,
      name: form.name.value,
    };

    try {
      const response = await axios.post("/geocode", {
        street: formData.street,
        city: formData.city
      });
      const { lat, lng } = response.data;

      const newMarker: MarkerData = {
        ...formData,
        lat,
        lng,
      };
      axios.post("/api/add-new-currency-exchange", newMarker, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        // Handle success if needed
        console.log("Form submitted successfully!");
      })
      .catch((error) => {
        // Handle error if needed
        console.error("Error adding new marker:", error);
      });
      navigate("/");
    } catch (error) {
      if (isServerError(error)) {
        setServerError(
          (error as ServerError).error || "Wystąpił błąd podczas geokodowania"
        );
      } else {
        setServerError("Wystąpił błąd podczas geokodowania");
      }
    }
  };

  return { serverError, setServerError, handleSubmit };
};

export default useKantorFormSubmission;