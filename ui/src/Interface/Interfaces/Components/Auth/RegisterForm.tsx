import type { Dispatch, SetStateAction } from 'react';
import * as Icons from "lucide-react";
import translate from '@shared/Translation/Translation';
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
                <h1>{translate('auth.register.title')}</h1>
                <p>{translate('auth.register.subtitle')}</p>
            </div>
            
            <InputField
                icon={<Icons.User size={20} />}
                label={translate('auth.register.username')}
                type="text"
                placeholder={translate('auth.register.username.placeholder')}
                value={registerData.username}
                onChange={(value) => setRegisterData(prev => ({ ...prev, username: value }))}
            />
            
            <InputField
                icon={<Icons.Mail size={20} />}
                label={translate('auth.register.email')}
                type="email"
                placeholder={translate('auth.register.email.placeholder')}
                value={registerData.email}
                onChange={(value) => setRegisterData(prev => ({ ...prev, email: value }))}
            />
            
            <InputField
                icon={<Icons.Lock size={20} />}
                label={translate('auth.register.password')}
                type="password"
                placeholder={translate('auth.register.password.placeholder')}
                value={registerData.password}
                onChange={(value) => setRegisterData(prev => ({ ...prev, password: value }))}
            />
            
            <InputField
                icon={<Icons.Lock size={20} />}
                label={translate('auth.register.confirmPassword')}
                type="password"
                placeholder={translate('auth.register.confirmPassword.placeholder')}
                value={registerData.confirmPassword}
                onChange={(value) => setRegisterData(prev => ({ ...prev, confirmPassword: value }))}
            />
            
            <Switch
                id="acceptRules"
                label={<>{translate('auth.register.acceptRules')}<Button variant="link" size="small" glow={false} onClick={onShowRules}>{translate('auth.register.termsRules')}</Button></>}
                checked={registerData.acceptRules}
                onChange={(checked) => setRegisterData(prev => ({ ...prev, acceptRules: checked }))}
                size="medium"
            />
            
            <Button variant="primary" onClick={onRegister} style={{ width: '100%' }}>
                <Icons.UserPlus size={16} />
                {translate('auth.register.button')}
            </Button>
            
            <div className={styles.authLinks}>
                <span>{translate('auth.register.hasAccount')}</span>
                <Button variant="link" size="small" glow={false} onClick={onSwitchToLogin}>
                    {translate('auth.register.signIn')}
                </Button>
            </div>
        </div>
    );
}