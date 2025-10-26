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
}

export default function LoginForm({ 
    loginData, 
    setLoginData, 
    onLogin, 
    onSwitchToRegister 
}: LoginFormProps) {
    return (
        <div className={styles.authForm}>
            <div className={styles.header}>
                <h1>{translate('auth.login.welcome')}</h1>
                <p>{translate('auth.login.subtitle')}</p>
            </div>
            
            <InputField
                icon={<Icons.User size={20} />}
                label={translate('auth.login.username')}
                type="text"
                placeholder={translate('auth.login.username.placeholder')}
                value={loginData.username}
                onChange={(value) => setLoginData(prev => ({ ...prev, username: value }))}
            />
            
            <InputField
                icon={<Icons.Lock size={20} />}
                label={translate('auth.login.password')}
                type="password"
                placeholder={translate('auth.login.password.placeholder')}
                value={loginData.password}
                onChange={(value) => setLoginData(prev => ({ ...prev, password: value }))}
            />
            
            <Switch
                id="rememberMe"
                label={translate('auth.login.rememberMe')}
                checked={loginData.rememberMe}
                onChange={(checked) => setLoginData(prev => ({ ...prev, rememberMe: checked }))}
                size="medium"
            />
            
            <Button variant="primary" onClick={onLogin} style={{width: '100%'}}>
                <Icons.LogIn size={16} />
                {translate('auth.login.button')}
            </Button>
            
            <div className={styles.authLinks}>
                <span>{translate('auth.login.noAccount')}</span>
                <Button variant="link" size="small" glow={false} onClick={onSwitchToRegister}>
                    {translate('auth.login.signUp')}
                </Button>
            </div>
        </div>
    );
}