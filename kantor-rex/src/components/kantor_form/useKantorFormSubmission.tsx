import { FormEvent, useState } from "react";
import axios from "axios";
import { MarkerData, ServerError } from "../interfaces";

const useKantorFormSubmission = () => {
  const [serverError, setServerError] = useState("");

  const isServerError = (obj: any): obj is ServerError => {
    return (obj as ServerError).error !== undefined;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError("");

    const form = event.currentTarget;
    console.log(form.name.value);
    const formData: MarkerData = {
      lat: 0,
      lng: 0,
      country: "Polska",
      city: form.city.value,
      street: form.street.value,
      name: form.name.value,
    };
    // console.log(form.title);
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
      console.log(formData);
      //console.log(newMarker);
      // Now, you can perform the actual form submission here.
      // For example, you can call the API to save the newMarker data.

      // axios.post("/api/add-new-currency-exchange", newMarker, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })
      // .then(() => {
      //   // Handle success if needed
      //   console.log("Form submitted successfully!");
      // })
      // .catch((error) => {
      //   // Handle error if needed
      //   console.error("Error adding new marker:", error);
      // });
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
