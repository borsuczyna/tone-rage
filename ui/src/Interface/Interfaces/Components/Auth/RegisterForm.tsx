import type { Dispatch, SetStateAction } from 'react';
import * as Icons from "lucide-react";
import Button from '../Button';
import InputField from '../InputField';
import Switch from '../Switch';
import styles from '../../Styles/AuthInterface.module.css';
import type { AuthRegisterData } from '@shared/Models/AuthData';

interface RegisterFormProps {
    registerData: AuthRegisterData;
    setRegisterData: Dispatch<SetStateAction<AuthRegisterData>>;
    onRegister: () => void;
    onSwitchToLogin: () => void;
    onShowRules: () => void;
}

export default function RegisterForm({ 
    registerData, 
    setRegisterData, 
    onRegister, 
    onSwitchToLogin,
    onShowRules
}: RegisterFormProps) {
    return (
        <div className={styles.authForm}>
            <div className={styles.header}>
                <h1>Create Account</h1>
                <p>Register your account</p>
            </div>
            
            <InputField
                icon={<Icons.User size={20} />}
                label="Username"
                type="text"
                placeholder="Choose a username"
                value={registerData.username}
                onChange={(value) => setRegisterData(prev => ({ ...prev, username: value }))}
            />
            
            <InputField
                icon={<Icons.Mail size={20} />}
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={registerData.email}
                onChange={(value) => setRegisterData(prev => ({ ...prev, email: value }))}
            />
            
            <InputField
                icon={<Icons.Lock size={20} />}
                label="Password"
                type="password"
                placeholder="Create a password"
                value={registerData.password}
                onChange={(value) => setRegisterData(prev => ({ ...prev, password: value }))}
            />
            
            <InputField
                icon={<Icons.Lock size={20} />}
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={registerData.confirmPassword}
                onChange={(value) => setRegisterData(prev => ({ ...prev, confirmPassword: value }))}
            />
            
            <Switch
                id="acceptRules"
                label={<>I accept the<Button variant="link" size="small" glow={false} onClick={onShowRules}>Terms & Rules</Button></>}
                checked={registerData.acceptRules}
                onChange={(checked) => setRegisterData(prev => ({ ...prev, acceptRules: checked }))}
                size="medium"
            />
            
            <Button variant="primary" onClick={onRegister} style={{ width: '100%' }}>
                <Icons.UserPlus size={16} />
                CREATE ACCOUNT
            </Button>
            
            <div className={styles.authLinks}>
                <span>Already have an account? </span>
                <Button variant="link" size="small" glow={false} onClick={onSwitchToLogin}>
                    Sign In
                </Button>
            </div>
        </div>
    );
}