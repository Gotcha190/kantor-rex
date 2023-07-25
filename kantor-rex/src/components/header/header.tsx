import { Link } from "react-router-dom";
import styles from "./header.module.scss";
import classNames from "classnames";
import t_rex from "../../assets/t-rex.png";
import t_rex_orange from "../../assets/t-rex-orange.png";
import { useState } from "react";

export const Header = () => {
  const [isHover, setIsHover] = useState(false);

  const handleHover = (hover: boolean) => {
    setIsHover(hover);
  };

  return (
    <div className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <Link
              to="/"
              className={classNames(styles.a, styles.logo)}
              onMouseEnter={() => handleHover(true)}
              onMouseLeave={() => handleHover(false)}
            >
              <h1 className={styles.h1}>Kantor</h1>
              <img
                src={isHover ? t_rex_orange : t_rex}
                alt="Rex"
                className={classNames(styles.rex, styles.rex_black)}
              />
            </Link>
          </li>
          <li className={styles.li}>
            <Link to="/add-new-currency-exchange">
              Add New Currency Exchange
            </Link>
          </li>
          <li className={styles.li}>
            <Link to="/">Map</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
