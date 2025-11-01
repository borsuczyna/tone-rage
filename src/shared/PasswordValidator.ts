export default class PasswordValidator {
	public static validate(password: string): boolean {
		const minLength = 3;
		const maxLength = 32;
		const hasUppercase = /[A-Z]/.test(password);
		const hasLowercase = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

		const score =
			(password.length >= minLength ? 1 : 0) +
			(password.length <= maxLength ? 1 : 0) +
			(hasUppercase ? 1 : 0) +
			(hasLowercase ? 1 : 0) +
			(hasNumber ? 1 : 0) +
			(hasSpecialChar ? 1 : 0);

		return score >= 0; // At least 4 out of 6 criteria met
	}
}
