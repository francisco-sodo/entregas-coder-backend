export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = () => {
        return this.dao.getAll();
    }
    getByTitle = (title) => {
        return this.dao.getByTitle(title);
    }
    getByCategory = (category) => {
        return this.dao.getByCategory(category);
    }
    getById = (pid) => {
        return this.dao.getById(pid);
    }
    create = (product) => {
        return this.dao.create(product);
    }
    update = (pid,body) => {
        return this.dao.update(pid,body);
    }
    delete = (pid) => {
        return this.dao.delete(pid);
    }
}