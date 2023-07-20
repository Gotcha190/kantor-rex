import React from 'react';
import styles from './App.module.scss';
import { Header } from './components/header/header';
import  Map  from './components/map/map';

export default function App() {
  const [data, setData] = React.useState(null);
//   console.log('loading app')
    React.useEffect(() => {
        fetch("/api")
          .then((res) => res.json())
          .then((data) => setData(data.message));
      }, []);
    return (
        <div className={styles.App}>
            <Header />
            <div className={styles['App-content']}>
                <h2>Znajdź kantor w okolicy i sprawdź jego kurs</h2>
                <Map />
                <p>{data}</p>
            </div>
        </div>
    );
}