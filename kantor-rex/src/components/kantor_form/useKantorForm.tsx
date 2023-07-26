import useKantorFormState from "./useKantorFormState";
import useKantorFormValidation from "./useKantorFormValidation";
import useKantorFormSubmission from "./useKantorFormSubmission";

const useKantorForm = () => {
  const { formData, handleChange } = useKantorFormState();
  const formError = useKantorFormValidation(formData);
  const { serverError, handleSubmit } = useKantorFormSubmission();

  return {
    formError,
    serverError,
    formData,
    handleSubmit,
    handleChange,
  };
};

export default useKantorForm;
