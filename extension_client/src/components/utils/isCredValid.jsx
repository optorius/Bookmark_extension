
/// @return true - с кредами все нормуль
export const isEmailValid = ( email, callback ) => {
    if (!email) {
        callback("Email is required.");
        return false;
    }
    else if (!/\S+@\S+\.\S+/.test(email)) {
        callback("Email address is invalid.");
        return false;
    }
    return true;
}

export const isPasswordValid = ( password, callback ) => {
    if (!password) {
        callback("Password is required.");
        return false;
    }
    else if (password.length < 8) {
        callback("Password must be at least 8 characters long.");
        return false;
    }
    return true;
}

export const isPasswordEqual = (lhs, rhs, callback) => {
    if (lhs !== rhs) {
        callback('The passwords entered do not match. Please make sure to enter the same password in both fields.');
        return false;
    }
    return true;
}

export const isCredValid = (email, password, callback) => {
    if ( !isEmailValid( email, callback ) ) {
        return false;
    }

    if ( !isPasswordValid( password, callback ) ) {
        return false;
    }

    return true;
};