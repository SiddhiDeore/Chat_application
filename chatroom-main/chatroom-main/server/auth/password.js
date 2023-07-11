module.exports.hashPassword = async (password) => {
    return password
}

module.exports.validatePassword = (hash, password) => {
    return password === hash;
}