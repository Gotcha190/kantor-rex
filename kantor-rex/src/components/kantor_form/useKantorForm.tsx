import useKantorFormState from "./useKantorFormState";
import useKantorFormValidation from "./useKantorFormValidation";
import useKantorFormSubmission from "./useKantorFormSubmission";

const useKantorForm = () => {
  const { formData, handleChange, touchedFields } = useKantorFormState();
  const formErrors = useKantorFormValidation(formData);
  const { serverError, handleSubmit } = useKantorFormSubmission();

  return {
    formErrors,
    serverError,
    formData,
    handleSubmit,
    handleChange,
    touchedFields,
  };
};

export default useKantorForm;
