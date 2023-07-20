import styles from './header.module.scss';
import classNames from 'classnames';
import t_rex from '../../assets/t-rex.png';

export interface HeaderProps {
    className?: string;
}

export const Header = ({ className }: HeaderProps) => {
    return (
        <div className={classNames(styles.root, className, styles.header)}>
            <a href="http://localhost:3000/" className={styles.a}>
                <div className={styles.logo}>
                    <h1 className={styles.h1}>Kantor</h1>
                    <img src={t_rex} alt="Rex" className={styles.rex} />
                </div>
            </a>
        </div>
    );
};
