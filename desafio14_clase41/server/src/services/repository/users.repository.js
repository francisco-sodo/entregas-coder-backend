export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = () => {
        return this.dao.getAll();
    }
    getByUserName = (username) => {
        return this.dao.getByUserName(username);
    }
    create = (user) => {
        return this.dao.create(user);
    }
    update = (filter, value) => {
        return this.dao.update(filter, value);
    }
    

}