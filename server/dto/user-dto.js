// класс, который обладает некоторыми полями, которые мы будем отправлять клиенту DATA TRAFNSFER OBJECT
module.exports = class UserDto {
    /// field
    email;
    id;
    isActivated;

    /// @brief constructor
    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}
