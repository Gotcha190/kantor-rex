import { Link } from "react-router-dom";
import styles from "./header.module.scss";
import classNames from "classnames";
import t_rex from "../../assets/t-rex.png";

export interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  return (
    <div className={classNames(styles.root, className, styles.header)}>
      <Link to="/" className={styles.a}>
        <div className={styles.logo}>
          <h1 className={styles.h1}>Kantor</h1>
          <img src={t_rex} alt="Rex" className={styles.rex} />
        </div>
      </Link>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link to="/add-new-currency-exchange">
              Add New Currency Exchange
            </Link>
          </li>
          <li>
            <Link to="/">Map</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};