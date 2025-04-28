import { Link } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Button from '@mui/material/Button';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <>
            <div className={styles.navContainerStyle}>
                <div className={styles.leftDiv}>
                    <AssignmentIcon className={styles.assignmentIcon} />
                    <Button component={Link} to="/" className={styles.button}>Strona główna</Button>
                </div>
                <div className={styles.rightDiv}>
                    <Button component={Link} to="/about" className={styles.button}>O nas</Button>
                    <Button component={Link} to="/policy" className={styles.button}>Polityka</Button>
                </div>
            </div>
            <div style={{ height: '70px', width: '100%' }} />
        </>
    );
}
