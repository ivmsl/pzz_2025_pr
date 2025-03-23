import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import AssignmentIcon from '@mui/icons-material/Assignment';
import styles from './Navbar.module.css'

export default function Navbar(){
    
    const navigate = useNavigate();

    const goHome = () => navigate('/home');
    const goInfo = () => navigate("/info");
    const goLogIn = () => navigate("/log-in");
    const goObslugaRezerwacji = () => navigate("/obsluga-rezerwacji");
    const goPomoc = () => navigate("/pomoc");

    return (
        <>
            <div className={ styles.navContainerStyle }>
                <div className={ styles.divStyle }>
                    <AssignmentIcon onClick={ goHome } className={ styles.assignmentIcon }/>
                    <Button variant="text" className={ styles.button } onClick={ goInfo }>Info</Button>
                    <Button variant="text" className={ styles.button } onClick={ goObslugaRezerwacji }>Obsługa rezerwacji</Button>
                </div>
                <div className={ styles.divStyle }> 
                    <Button variant="text" className={ styles.button } onClick={ goLogIn }>Logowanie</Button>
                    <Button variant="text" className={ styles.button } onClick={ goPomoc }>Pomoc</Button>
                </div>
            </div>
            <div style={{ height : '70px', width : '100%', margin : '0',  top : '0', left : '0',}}/>
        </>
    );
}