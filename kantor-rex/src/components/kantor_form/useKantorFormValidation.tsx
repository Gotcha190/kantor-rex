import { MarkerData, FormErrors } from "../interfaces";

const useKantorFormValidation = (formData: MarkerData): FormErrors => {
  const formErrors: FormErrors = {
    street: null,
    city: null,
    company_name: null,
  };

  if (!/^.*\s+\d+[A-Za-z]?$/.test(formData.street)) {
    formErrors.street = "Nieprawidłowa ulica - ulica musi posiadać numer budynku.";
  }

  if (formData.city.trim() === "") {
    formErrors.city = "Pole wymagane - podaj miasto.";
  }
  if (formData.company_name.trim() === "") {
    formErrors.company_name = "Pole wymagane - podaj tytuł.";
  }
  return formErrors;
};

export default useKantorFormValidation;
