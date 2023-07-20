import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styles from "./App.module.scss";
import { Header } from "./components/header/header";
import Map from "./components/map/map";
import { KantorForm } from "./components/kantor_form/KantorForm";

export default function App() {
  return (
    <div className={styles.App}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/add-new-currency-exchange" element={<KantorForm />} />
        </Routes>
      </Router>
    </div>
  );
}

function AppContent() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className={styles["App-content"]}>
      <h2>Znajdź kantor w okolicy i sprawdź jego kurs</h2>
      <Map />
      <Link to="/add-new-currency-exchange">
        <h3>Nie ma Twojego ulubionego kantoru? Dodaj go do naszego serwisu</h3>
      </Link>
      <p>{data}</p>
    </div>
  );
}
