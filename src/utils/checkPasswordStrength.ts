export const isPasswordStrong = (password: string): boolean => {
    if (
        password.length >= 6 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
        return true;
    } else {
        return false;
    }
};
