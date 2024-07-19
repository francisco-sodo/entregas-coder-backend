export class UsersDto {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.password = user.password;
        this.role = user.role;
        this.cart = user.cart
        
    }
};


export class UsersDtoSmall {
    constructor(user) {
        this.fullName = `${user.first_name} ${user.last_name} `;
        this.email = user.email;
        this.role = user.role;
        this.last_connection = user.last_connection;
    }
};
