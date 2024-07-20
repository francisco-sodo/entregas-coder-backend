import userModel from './models/user.model.js';

export default class UserService {
    constructor(){
    };  
    getAll = async () => {
        let users = await userModel.find();
        return users.map(user=>user.toObject());
    };
    create = async (user) => {
        let result = await userModel.create(user);
        return result;
    };
    getById = async (uid) => {
        const result = await userModel.findOne({_id:uid});
        return result;
    };
    getByUserName = async (username) => {
        const result = await userModel.findOne({email: username});
        return result;
    };
    update = async (filter, value) => {
        let result = await userModel.updateOne(filter, value );
        return result;
    }
    
    getInactiveUsers = async (date) => {
        return await userModel.find({last_connection: {$lt: date} });
    }
    delete = async (uid) => {
        return await userModel.findByIdAndDelete(uid)
    }

};