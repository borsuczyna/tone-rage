import { useState } from 'react';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import styles from './Styles/AuthInterface.module.css';
import LoginForm from './Components/Auth/LoginForm';
import RegisterForm from './Components/Auth/RegisterForm';
import RulesForm from './Components/Auth/RulesForm';
import UpdatesPanel from './Components/Auth/UpdatesPanel';
import type { AuthLoginData, AuthRegisterData } from '@shared/Models/AuthData';

type AuthPage = 'login' | 'register' | 'rules';

export default function AuthInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const [currentPage, setCurrentPage] = useState<AuthPage>('login');
    
    // Form states
    const [loginData, setLoginData] = useState<AuthLoginData>({
        username: '',
        password: '',
        rememberMe: false
    });
    
    const [registerData, setRegisterData] = useState<AuthRegisterData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptRules: false
    });

    // Rage events for authentication
    useRageEvent('auth:showLogin', () => setCurrentPage('login'));
    useRageEvent('auth:showRegister', () => setCurrentPage('register'));
    useRageEvent('auth:showRules', () => setCurrentPage('rules'));

    const handleLogin = () => {
        if (!loginData.username || !loginData.password) return;
        
        // Send to server
        if (typeof mp !== "undefined" && mp?.trigger) {
            mp.trigger('auth:login', JSON.stringify(loginData));
        }
    };

    const handleRegister = () => {
        if (!registerData.username || !registerData.email || !registerData.password) return;
        if (registerData.password !== registerData.confirmPassword) return;
        if (!registerData.acceptRules) return;
        
        // Send to server
        if (typeof mp !== "undefined" && mp?.trigger) {
            mp.trigger('auth:register', JSON.stringify(registerData));
        }
    };

    if (!isInterfaceVisible('AuthInterface')) return null;

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <div className={styles.authPanel}>
                    {currentPage === 'login' && (
                        <LoginForm
                            loginData={loginData}
                            setLoginData={setLoginData}
                            onLogin={handleLogin}
                            onSwitchToRegister={() => setCurrentPage('register')}
                        />
                    )}

                {currentPage === 'register' && (
                        <RegisterForm
                            registerData={registerData}
                            setRegisterData={setRegisterData}
                            onRegister={handleRegister}
                            onSwitchToLogin={() => setCurrentPage('login')}
                            onShowRules={() => setCurrentPage('rules')}
                        />
                    )}

                {currentPage === 'rules' && (
                        <RulesForm
                            onBackToLogin={() => setCurrentPage('login')}
                            onAcceptAndRegister={() => setCurrentPage('register')}
                        />
                    )}
                </div>

                <UpdatesPanel />
            </div>
        </div>
    );
}