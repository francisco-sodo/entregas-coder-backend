export default class TicketsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    generateTicket = (ticket) => {
        return this.dao.generateTicket(ticket);
    }


}