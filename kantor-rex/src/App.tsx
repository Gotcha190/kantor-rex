import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import classNames from "classnames";
import styles from "./App.module.scss";
import { Header } from "./components/header/header";
import Map from "./components/map/map";
import { KantorForm } from "./components/kantor_form/kantorForm";
import { KantorShow } from "./components/kantor_show/kantorShow";

export default function App() {
  return (
    <div className={styles.App}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/add-new-currency-exchange" element={<KantorForm />} />
          <Route path='/show-all' element={<KantorShow />} />
        </Routes>
      </Router>
    </div>
  );
}

function AppContent() {
  return (
    <div className={classNames(styles.App, styles.Content)}>
      <h2>Znajdź kantor w okolicy i sprawdź jego kurs</h2>
      <Map />
      <Link to="/add-new-currency-exchange">
        <h3>Nie ma Twojego ulubionego kantoru? Dodaj go do naszego serwisu</h3>
      </Link>
    </div>
  );
}
