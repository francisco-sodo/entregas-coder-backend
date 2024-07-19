export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = () => {
        return this.dao.getAll();
    }
    getById = (uid) => {
        return this.dao.getById(uid)
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
    
    getInactiveUsers = (date) => {
        return this.dao.getInactiveUsers(date);
    }
    delete = (uid) => {
        return this.dao.delete(uid);
    }
    

}