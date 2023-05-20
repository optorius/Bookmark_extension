
/// @return true - с кредами все нормуль
export const isCredValid = (email, password, callback) => {
    if (!email) {
        callback("Email is required.");
        return false;
    }
    else if (!/\S+@\S+\.\S+/.test(email)) {
        callback("Email address is invalid.");
        return false;
    }
    if (!password) {
        callback("Password is required.");
        return false;
    }
    else if (password.length < 8) {
        callback("Password must be at least 8 characters long.");
        return false;
    }
    return true;
};