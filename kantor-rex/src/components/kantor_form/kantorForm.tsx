import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./kantorForm.module.scss";
import classNames from "classnames";

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
  country: string;
  city: string;
  street: string;
}

export const KantorForm = () => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [formData, setFormData] = useState<MarkerData>({
    lat: 0,
    lng: 0,
    title: "",
    country: "",
    city: "",
    street: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.lat === null || formData.lng === null) {
      console.error("Nieprawidłowe dane geolokalizacyjne.");
      // Tutaj możesz wyświetlić komunikat o błędzie dla użytkownika, jeśli to konieczne
      return;
    }

    const country = 'Polska';
    try {
      const response = await axios.post("/geocode", { street, city });
      const { lat, lng } = response.data;
      setFormData((prevData) => ({
        ...prevData,
        lat,
        lng,
      }));
      const newMarker: MarkerData = {
        lat: lat,
        lng: lng,
        title: formData.title,
        country: country,
        city: formData.city,
        street: formData.street,
      };
      axios.post("/api/add-new-currency-exchange", newMarker, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          setFormData((prevData) => ({
            ...prevData,
            lat: 0,
            lng: 0,
            title: "",
            address: "",
          }));
          navigate("/");
        })
        .catch((error) => {
          console.error("Error adding new marker:", error);
        });
    } catch (error) {
      console.error("Wystąpił błąd podczas geokodowania:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "street") {
      setStreet(value);
    } else if (name === "city") {
      setCity(value);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className={classNames(styles.form_container)}>
      <form
        onSubmit={handleSubmit}
        className={classNames(styles.form_field_wrapper)}
      >
        <label className={classNames(styles.form_label)}>Ulica:</label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          className={classNames(styles.form_input)}
        />

        <label className={classNames(styles.form_label)}>Miasto:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className={classNames(styles.form_input)}
        />

        <label className={classNames(styles.form_label)}>Nazwa:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={classNames(styles.form_input)}
        />

        <button type="submit" className={classNames(styles.form_button)}>
          Dodaj kantor
        </button>
      </form>
    </div>
  );
};
