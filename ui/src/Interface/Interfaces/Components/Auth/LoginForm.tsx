import type { Dispatch, SetStateAction } from 'react';
import * as Icons from "lucide-react";
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
                <h1>Welcome Back</h1>
                <p>Login to your account</p>
            </div>
            
            <InputField
                icon={<Icons.User size={20} />}
                label="Username"
                type="text"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={(value) => setLoginData(prev => ({ ...prev, username: value }))}
            />
            
            <InputField
                icon={<Icons.Lock size={20} />}
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(value) => setLoginData(prev => ({ ...prev, password: value }))}
            />
            
            <Switch
                id="rememberMe"
                label="Remember me"
                checked={loginData.rememberMe}
                onChange={(checked) => setLoginData(prev => ({ ...prev, rememberMe: checked }))}
                size="medium"
            />
            
            <Button variant="primary" onClick={onLogin} style={{width: '100%'}}>
                <Icons.LogIn size={16} />
                LOGIN
            </Button>
            
            <div className={styles.authLinks}>
                <span>Don't have an account? </span>
                <Button variant="link" size="small" glow={false} onClick={onSwitchToRegister}>
                    Sign Up
                </Button>
            </div>
        </div>
    );
}