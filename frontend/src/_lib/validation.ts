import { RegisterValues } from "./interfaces/register";

export const validateRegistration = (registerData: RegisterValues) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const errors = {
        usernameErrMsg: !registerData.username
            ? "Username is required"
            : !usernameRegex.test(registerData.username)
                ? "3-15 characters, letters/numbers/underscores only"
                : null,

        emailErrMsg: !registerData.email
            ? "Email is required"
            : !emailRegex.test(registerData.email)
                ? "Invalid email format"
                : null,

        passwordErrMsg: !registerData.password
            ? "Password is required"
            : !passwordRegex.test(registerData.password)
                ? "Min 8 chars, at least one uppercase letter and one number"
                : null,

        passwordConfirmationErrMsg: registerData.password !== registerData.password_confirmation
            ? "Passwords do not match"
            : null
    };

    return errors;
};
