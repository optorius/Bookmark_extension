const bcrypt = require('bcrypt');

const getHashedPass = async ( password ) => {
    const salt = 5;
    const ret = await bcrypt.hash( password, salt );
    return ret;
}

module.exports = getHashedPass;
