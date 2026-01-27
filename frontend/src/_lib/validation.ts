import { RegisterValues } from "./interfaces/register";

export const validateRegistration = (registerData: RegisterValues) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const emailErrMsg = registerData.email && !emailRegex.test(registerData.email)
        ? "Invalid email format"
        : null;
    const usernameErrMsg = registerData.username && !usernameRegex.test(registerData.username)
        ? "3-15 characters, no special symbols"
        : null;
    const passwordErrMsg = registerData.password && !passwordRegex.test(registerData.password)
        ? "Min 8 chars, at least one uppercase letter and one number"
        : null;
    return {
        usernameErrMsg,
        emailErrMsg,
        passwordErrMsg
    }
};
