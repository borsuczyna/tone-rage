import { useState, useEffect } from 'react';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import styles from './Styles/AuthInterface.module.css';
import LoginForm from './Components/Auth/LoginForm';
import RegisterForm from './Components/Auth/RegisterForm';
import RulesForm from './Components/Auth/RulesForm';
import UpdatesPanel from './Components/Auth/UpdatesPanel';
import type { AuthLoginData, AuthRegisterData, AuthResponse } from '@shared/Models/AuthData';
import { fetchServerData, triggerEvent } from 'src/Hooks/Fetch';
import { addNotification } from 'src/Hooks/NotificationsProvider';
import translate from '@shared/Translation/Translation';
import EmailValidator from '@shared/EmailValidator';
import PasswordValidator from '@shared/PasswordValidator';
import { NotificationType } from '@shared/Models/NotificationType';
import { loginMusicManager } from 'src/Utils/LoginMusicManager';
import { useRageEvent } from 'src/Hooks/RageEventProvider';

type AuthPage = 'login' | 'register' | 'rules';

export default function AuthInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const [currentPage, setCurrentPage] = useState<AuthPage>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [isDisappearing, setIsDisappearing] = useState(false);

    // Start login music when interface becomes visible
    useEffect(() => {
        loginMusicManager.startMusic();
    }, []); // Empty dependency array - only run once on mount/unmount

    // Load saved credentials from client storage on component mount
    useEffect(() => {
        triggerEvent('credentials:load');
    }, []); // Only run once on mount

    // Handle credentials loaded from client storage
    useRageEvent('credentials:loaded', (credentials: { username: string; password: string; rememberMe: boolean } | null) => {
        if (credentials && credentials.rememberMe) {
            setLoginData({
                username: credentials.username,
                password: credentials.password,
                rememberMe: true
            });
        }
    });

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

    const handleLogin = async () => {
        if (!loginData.username || !loginData.password) {
            addNotification(translate('default.error'), translate('auth.login.missingFields'), NotificationType.Error);
            return;
        }

        setIsLoading(true);

        try {
            let response = await fetchServerData<AuthResponse>('auth:login', loginData);
            if (response?.success) {
                // Save credentials to client storage
                triggerEvent('credentials:save', {
                    username: loginData.username,
                    password: loginData.password,
                    rememberMe: loginData.rememberMe
                });

                addNotification(translate('default.success'), translate('auth.login.success'), NotificationType.Success);
                setIsDisappearing(true);
                triggerEvent('auth:loginSuccess');

            } else {
                addNotification(translate('default.error'), translate(response?.message || 'auth.login.failed' as any), NotificationType.Error);
                setIsLoading(false);
            }
        } catch (error: Error | any) {
            addNotification(translate('default.error'), translate(error.message || 'auth.login.failed'), NotificationType.Error);
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword) {
            addNotification(translate('default.error'), translate('auth.register.missingFields'), NotificationType.Error);
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            addNotification(translate('default.error'), translate('auth.register.passwordsDoNotMatch'), NotificationType.Error);
            return;
        }

        if (!registerData.acceptRules) {
            addNotification(translate('default.error'), translate('auth.register.acceptRulesError'), NotificationType.Error);
            return;
        }

        if (registerData.username.length < 3 || registerData.username.length > 20) {
            addNotification(translate('default.error'), translate('auth.register.usernameLength'), NotificationType.Error);
            return;    
        }

        if (!EmailValidator.validate(registerData.email)) {
            addNotification(translate('default.error'), translate('auth.register.invalidEmail'), NotificationType.Error);
            return;    
        }

        if (!PasswordValidator.validate(registerData.password)) {
            addNotification(translate('default.error'), translate('auth.register.weakPassword'), NotificationType.Error);
            return;
        }

        setIsLoading(true);

        try {
            let response = await fetchServerData<AuthResponse>('auth:register', registerData);
            if (response?.success) {
                addNotification(translate('default.success'), translate('auth.register.success'), NotificationType.Success);
                setCurrentPage('login');
                setLoginData({ ...loginData, username: registerData.username, password: registerData.password });
                await handleLogin();
            } else {
                addNotification(translate('default.error'), translate(response?.message || 'auth.register.failed' as any), NotificationType.Error);
            }
        } catch (error: Error | any) {
            addNotification(translate('default.error'), translate(error.message || 'auth.register.failed'), NotificationType.Error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isInterfaceVisible('AuthInterface')) return null;

    return (
        <div className={`${styles.container} ${isDisappearing ? styles.disappearing : ''}`}>
            <div className={styles.contentWrapper}>
                <div className={styles.authPanel}>
                    {currentPage === 'login' && (
                        <LoginForm
                            loginData={loginData}
                            setLoginData={setLoginData}
                            onLogin={handleLogin}
                            onSwitchToRegister={() => setCurrentPage('register')}
                            isLoading={isLoading}
                        />
                    )}

                {currentPage === 'register' && (
                        <RegisterForm
                            registerData={registerData}
                            setRegisterData={setRegisterData}
                            onRegister={handleRegister}
                            onSwitchToLogin={() => setCurrentPage('login')}
                            onShowRules={() => setCurrentPage('rules')}
                            isLoading={isLoading}
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