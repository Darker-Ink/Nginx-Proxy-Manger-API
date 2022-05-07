const {User} = require("./User")
const axios = require("axios");

class Users {
    constructor(client) {

        /**
         * The Client
         * @type {Client}
         * @readonly
         * @private
         * @default null
         * @returns {Client}
         */
        this.client = client
    }

    /**
     * Gets all the Users from the Proxy Server
     */
    async getUsers() {
        const res = await axios({
            method: "GET",
            url: `${this.client.schema}://${this.client.host}/api/users?expand=permissions`,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.client.token}`
            }
        })

        return res.data
    }

    /**
     * Gets a User from the Proxy Server by their Username/Email/ID
     * @param {Object} options - The options to get the user
     * @param {String} options.username - The username of the user
     * @param {String} options.email - The email of the user
     * @param {String} options.id - The id of the user
     * @returns {Promise<User>}
     */
    async getUser(options) {
        const searchData = options.username || options.email || options.id;

        const users = await this.getUsers();

        const user = users.filter(user => user.username === searchData || user.email === searchData || user.id === searchData)[0]

        return new User(this.client, user)
    }
}

module.exports.Users = Users