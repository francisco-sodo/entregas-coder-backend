export default class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = () => {
        return this.dao.getAll();
    }
    getById = (_id) => {
        return this.dao.getById(_id);
    }
    create = (cart) => {
        return this.dao.create(cart);
    }
    update = (cid,pid) => {
        return this.dao.update(cid,pid);
    }
    updateQuantity = (cid,pid,quantity) => {
        return this.dao.updateQuantity(cid,pid,quantity);
    }
    delete = (cid,pid) => {
        return this.dao.delete(cid,pid);
    }
    clear = (cid) => {
        return this.dao.clear(cid);
    }




    purchase = (cid,pid,quantity) => {
        return this.dao.purchase(cid,pid,quantity);
    }


    //!
    addToCart = (uid, pid) => {
        return this.dao.addToCart(uid, pid);
    }


}