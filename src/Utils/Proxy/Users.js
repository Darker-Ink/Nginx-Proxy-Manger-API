const { User } = require("./User")
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
     * @returns {Promise<User>} - The user
     */
    async getUser(options) {
        const searchData = options.username || options.email || options.id;

        if (!searchData) {
            throw new Error("You must provide a username, email, or id to search for a user");
        }

        const users = await this.getUsers();

        const user = users.filter(user => user.username === searchData || user.email === searchData || user.id === searchData)[0]

        return new User(this.client, user)
    }

    /**
     * 
     * @param {Object} options - The options to create the user
     * @param {String} options.email - The email of the user
     * @param {Boolean} options.isDisabled - Whether or not the user is disabled
     * @param {String} options.name - The name of the user
     * @param {String} options.nickname - The nickname of the user
     * @param {String} options.password - The password of the user
     * @param {Boolean} options.isAdmin - Whether or not the user is an admin
     * @param {Object} options.permissions - The permissions of the user
     * @param {String} options.permissions.access_lists - If the user can access the access lists
     * @param {String} options.permissions.certificates - If the user can access the api keys
     * @returns {Promise<User>} - The created user
     */
    async createUser(options) {

        if (!options.email) {
            throw new Error("You must provide an email to create a user");
        }

        if (!options.password) {
            throw new Error("You must provide a password to create a user");
        }

        if (!options.name) {
            throw new Error("You must provide a name to create a user");
        }

        if (!options.nickname) {
            throw new Error("You must provide a nickname to create a user");
        }

        if (!options.password.length > 7) {
            throw new Error("Password must be at least 8 characters")
        }

        const res = await axios({
            method: "POST",
            url: `${this.client.schema}://${this.client.host}/api/users`,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.client.token}`
            },
            data: {
                email: options.email,
                is_disabled: options.isDisabled || false,
                name: options.name,
                nickname: options.nickname,
                roles: options.isAdmin ? ["admin"] : []
            }
        })

        const user = new User(this.client, res.data)

        await user.setPassword(options.password)

        return user
    }
}

module.exports.Users = Users