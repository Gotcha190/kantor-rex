import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./kantorForm.module.scss";
import classNames from "classnames";

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
}

export const KantorForm = () => {
  const [formData, setFormData] = useState<MarkerData>({
    lat: 0,
    lng: 0,
    title: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMarker: MarkerData = {
      lat: formData.lat,
      lng: formData.lng,
      title: formData.title,
    };

    // Save the new marker to the database
    axios
      .post("/api/add-new-currency-exchange", newMarker, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        setFormData({
          lat: 0,
          lng: 0,
          title: "",
        });
        navigate("/");
      })
      .catch((error) => {
        console.error("Error adding new marker:", error);
      });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className={classNames(styles.form_container)}>
      <form onSubmit={handleSubmit} className={classNames(styles.form_field_wrapper)}>
        <label className={classNames(styles.form_label)}>Latitude:</label>
        <input
          type="number"
          name="lat"
          value={formData.lat}
          onChange={handleChange}
          className={classNames(styles.form_input)}
        />

        <label className={classNames(styles.form_label)}>Longitude:</label>
        <input
          type="number"
          name="lng"
          value={formData.lng}
          onChange={handleChange}
          className={classNames(styles.form_input)}
        />

        <label className={classNames(styles.form_label)}>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={classNames(styles.form_input)}
        />

        <button type="submit" className={classNames(styles.form_button)}>
          Dodaj marker
        </button>
      </form>
    </div>
  );
};