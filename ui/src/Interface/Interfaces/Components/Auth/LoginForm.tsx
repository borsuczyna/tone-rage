import type { Dispatch, SetStateAction } from 'react';
import * as Icons from "lucide-react";
import translate from '@shared/Translation/Translation';
import Button from '../Button';
import InputField from '../InputField';
import Switch from '../Switch';
import styles from '../../Styles/AuthInterface.module.css';
import type { AuthLoginData } from '@shared/Models/AuthData';

interface LoginFormProps {
    loginData: AuthLoginData;
    setLoginData: Dispatch<SetStateAction<AuthLoginData>>;
    onLogin: () => void;
    onSwitchToRegister: () => void;
    isLoading?: boolean;
}

export default function LoginForm({ 
    loginData, 
    setLoginData, 
    onLogin, 
    onSwitchToRegister,
    isLoading = false
}: LoginFormProps) {
    return (
        <div className={styles.authForm}>
            <div className={styles.header}>
                <h1>{translate('auth.login.welcome')}</h1>
                <p>{translate('auth.login.subtitle')}</p>
            </div>

            <InputField
                icon={<Icons.User size='1.3rem' />}
                label={translate('auth.login.username')}
                type="text"
                placeholder={translate('auth.login.username.placeholder')}
                value={loginData.username}
                onChange={(value) => setLoginData(prev => ({ ...prev, username: value }))}
                disabled={isLoading}
                groupStyle={{ marginBottom: '1.5rem' }}
            />
            
            <InputField
                icon={<Icons.Lock size='1.3rem' />}
                label={translate('auth.login.password')}
                type="password"
                placeholder={translate('auth.login.password.placeholder')}
                value={loginData.password}
                onChange={(value) => setLoginData(prev => ({ ...prev, password: value }))}
                disabled={isLoading}
                groupStyle={{ marginBottom: '1.5rem' }}
            />
            
            <Switch
                id="rememberMe"
                label={translate('auth.login.rememberMe')}
                checked={loginData.rememberMe}
                onChange={(checked) => setLoginData(prev => ({ ...prev, rememberMe: checked }))}
                size="medium"
                disabled={isLoading}
            />
            
            <Button variant="primary" onClick={onLogin} style={{width: '100%'}} loading={isLoading} disabled={isLoading}>
                <Icons.LogIn size='1rem' />
                {translate('auth.login.button')}
            </Button>
            
            <div className={styles.authLinks}>
                <span>{translate('auth.login.noAccount')}</span>
                <Button variant="link" size="small" glow={false} onClick={onSwitchToRegister} disabled={isLoading}>
                    {translate('auth.login.signUp')}
                </Button>
            </div>
        </div>
    );
}