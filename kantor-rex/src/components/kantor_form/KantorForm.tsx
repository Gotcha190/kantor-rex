import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
}

export const KantorForm: React.FC = () => {
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
    <form onSubmit={handleSubmit}>
      <label>
        Latitude:
        <input
          type="number"
          name="lat"
          value={formData.lat}
          onChange={handleChange}
        />
      </label>
      <label>
        Longitude:
        <input
          type="number"
          name="lng"
          value={formData.lng}
          onChange={handleChange}
        />
      </label>
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Dodaj marker</button>
    </form>
  );
};
