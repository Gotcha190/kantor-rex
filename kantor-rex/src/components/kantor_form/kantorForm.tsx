import styles from "./kantorForm.module.scss";
import classNames from "classnames";
import useKantorForm from "./useKantorForm";

export const KantorForm = () => {
  const {
    formError,
    serverError,
    formData,
    handleSubmit,
    handleChange,
  } = useKantorForm();

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
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={classNames(styles.form_input)}
        />

        <button type="submit" className={classNames(styles.form_button)}>
          Dodaj kantor
        </button>
      </form>
      {formError && <p className={styles.error_message}>FormError: {formError}</p>}
      {serverError && <p className={styles.error_message}>ServerError: {serverError}</p>}
    </div>
  );
};
