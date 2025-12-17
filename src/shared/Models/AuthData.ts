export interface AuthLoginData {
	username: string;
	password: string;
	rememberMe: boolean;
}

export interface AuthRegisterData {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
	acceptRules: boolean;
}

export interface AuthResponse {
	success: boolean;
	message: string;
	data?: any;
    hasCharacter?: boolean;
}
