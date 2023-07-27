import styles from "./kantorForm.module.scss";
import classNames from "classnames";
import useKantorForm from "./useKantorForm";
import InputLabel from "./inputLabel";

export const KantorForm = () => {
  const { formError, serverError, formData, handleSubmit, handleChange } =
    useKantorForm();

  return (
    <div className={classNames(styles.form_container)}>
      <form
        onSubmit={handleSubmit}
        className={classNames(styles.form_field_wrapper)}
      >
        <InputLabel
          label="Ulica:"
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          className={styles.form_input}
        />

        <InputLabel
          label="Miasto:"
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className={styles.form_input}
        />

        <InputLabel
          label="Nazwa:"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.form_input}
        />

        <div className={styles.form_prices}>
          <label className={classNames(styles.divider)}>Kursy wymiany:</label>

          <div className={styles.currencyContainer}>
            <div className={styles.currency}>
              <label className={classNames(styles.currency_label)}>USD</label>
              <InputLabel
                label="Kupno"
                type="number"
                name="usd_buy"
                value={formData.usd_buy}
                onChange={handleChange}
                className={styles.form_input}
              />
              <InputLabel
                label="Sprzedaż"
                type="number"
                name="usd_sell"
                value={formData.usd_sell}
                onChange={handleChange}
                className={styles.form_input}
              />
            </div>

            <div className={styles.currency}>
              <label className={classNames(styles.currency_label)}>EUR</label>
              <InputLabel
                label="Kupno"
                type="number"
                name="eur_buy"
                value={formData.eur_buy}
                onChange={handleChange}
                className={styles.form_input}
              />
              <InputLabel
                label="Sprzedaż"
                type="number"
                name="eur_sell"
                value={formData.eur_sell}
                onChange={handleChange}
                className={styles.form_input}
              />
            </div>

            <div className={styles.currency}>
              <label className={classNames(styles.currency_label)}>CHF</label>
              <InputLabel
                label="Kupno"
                type="number"
                name="chf_buy"
                value={formData.chf_buy}
                onChange={handleChange}
                className={styles.form_input}
              />
              <InputLabel
                label="Sprzedaż"
                type="number"
                name="chf_sell"
                value={formData.chf_sell}
                onChange={handleChange}
                className={styles.form_input}
              />
            </div>

            <div className={styles.currency}>
              <label className={classNames(styles.currency_label)}>GBP</label>
              <InputLabel
                label="Kupno"
                type="number"
                name="gbp_buy"
                value={formData.gbp_buy}
                onChange={handleChange}
                className={styles.form_input}
              />
              <InputLabel
                label="Sprzedaż"
                type="number"
                name="gbp_sell"
                value={formData.gbp_sell}
                onChange={handleChange}
                className={styles.form_input}
              />
            </div>
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
