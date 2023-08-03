import { MarkerData } from "../interfaces";

const useKantorFormValidation = (formData: MarkerData) => {
  let formError = "";

  if (!/^.*\s+\d+[A-Za-z]?$/.test(formData.street)) {
    formError = "Nieprawidłowa ulica - ulica musi posiadać numer budynku.";
  }

  if (formData.city.trim() === "") {
    formError = "Pole wymagane - podaj miasto.";
  }
  if (formData.company_name.trim() === "") {
    formError = "Pole wymagane - podaj tytuł.";
  }
  return formError;
};

export default useKantorFormValidation;
