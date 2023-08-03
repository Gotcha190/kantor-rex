import styles from "./kantorForm.module.scss";
import classNames from "classnames";
import useKantorForm from "./useKantorForm";
import InputLabel from "./inputLabel";

export const KantorForm = () => {
  const { formError, serverError, formData, handleSubmit, handleChange } =
    useKantorForm();

  const formFields = [
    { name: "street", label: "Ulica:" },
    { name: "city", label: "Miasto:" },
    { name: "company_name", label: "Nazwa:" },
  ];
  const currencies = [
    { code: "USD" },
    { code: "EUR" },
    { code: "CHF" },
    { code: "GBP" },
  ];

  return (
    <div className={styles.form_container}>
      <form onSubmit={handleSubmit} className={styles.form_field_wrapper}>
        {formFields.map((field) => (
          <InputLabel
            key={field.name}
            label={field.label}
            type="text"
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className={styles.form_input}
          />
        ))}

        <div className={styles.form_prices}>
          <label className={classNames(styles.divider)}>Kursy wymiany:</label>

          <div className={styles.currencyContainer}>
            {currencies.map((currency) => (
              <div key={currency.code} className={styles.currency}>
                <label className={classNames(styles.currency_label)}>
                  {currency.code}
                </label>
                <InputLabel
                  label="Kupno"
                  type="number"
                  name={`${currency.code.toLowerCase()}_buy` as string}
                  value={formData[`${currency.code.toLowerCase()}_buy`]}
                  onChange={handleChange}
                  className={styles.form_input}
                />

                <InputLabel
                  label="Sprzedaż"
                  type="number"
                  name={`${currency.code.toLowerCase()}_sell` as string}
                  value={formData[`${currency.code.toLowerCase()}_sell`]}
                  onChange={handleChange}
                  className={styles.form_input}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.form_component}>
          <button type="submit" className={classNames(styles.form_button)}>
            Dodaj kantor
          </button>
        </div>
      </form>

      {formError && (
        <p className={styles.error_message}>FormError: {formError}</p>
      )}
      {serverError && (
        <p className={styles.error_message}>ServerError: {serverError}</p>
      )}
    </div>
  );
};
