const axios = require("axios");
const { InvalidType, MissingArgument } = require("../Errors/Errors");

class User {
    /**
     * The User Constructor
     * @constructor
     * @param {Client} client 
     * @param {Object} data
     * @param {String} data.email - The email of the user
     * @param {Number} data.id - The id of the user
     * @param {String} data.name - The name of the user
     * @param {String} data.nickname - The nickname of the user
     * @param {String} data.avatar - The avatar of the user
     * @param {Array} data.roles - The roles of the user
     * @param {Object} data.permissions - The permissions of the user
     * @param {Date} data.created_on - The created on of the user
     * @param {Date} data.modified_on - The modified on of the user
     * @param {Boolean} data.is_disabled - The is disabled of the user 
     */
    constructor(client, data) {

        /**
         * The Client
         * @type {client}
         * @readonly
         * @private
         * @default null
         * @returns {client}
         */
        this.client = client

        /**
         * The User's ID
         * @type {Number}
         * @readonly
         * @default null
         * @returns {Number}
         * @example 1
         */
        this.id = Number(data.id)

        /**
         * The User's Created On Date
         * @type {Date}
         * @readonly
         * @default null
         * @returns {Date}
         * @example '2022-01-21T02:17:44.000Z'
         */
        this.created_on = new Date(data.created_on)

        /**
         * The User's Modified On Date
         * @type {Date}
         * @readonly
         * @default null
         * @returns {Date}
         * @example '2022-01-21T02:18:06.000Z'
         */
        this.modified_on = new Date(data.modified_on)

        /**
         * Whether or not the User is Disabled
         * @type {Boolean}
         * @readonly
         * @default false
         * @returns {Boolean}
         * @example false
         */
        this.is_disabled = Boolean(data.is_disabled)

        /**
         * The User's nickname
         * @type {String}
         * @readonly
         * @default null
         * @returns {String}
         * @example "dark"
         */
        this.nickname = data.nickname

        /**
         * The User's Email
         * @type {String}
         * @readonly
         * @default null
         * @returns {String}
         * @example "example@email.com"
         */
        this.email = data.email

        /**
         * The User's Name
         * @type {String}
         * @readonly
         * @default null
         * @returns {String}
         * @example "DarkerInk"
         */
        this.name = data.name

        /**
         * The User's Avatar
         * @type {String}
         * @readonly
         * @default null
         * @returns {String}
         * @example "//www.gravatar.com/avatar/a62586b1c155bc903ede9c4b2d9c99fa?default=mm"
         */
        this.avatar = data.avatar

        /**
         * The User's Roles
         * @type {Array}
         * @readonly
         * @default null
         * @returns {Array}
         * @example [ "admin" ]
         */
        this.roles = data.roles

        /**
         * The User's Permissions
         * @type {Object}
         * @readonly
         * @default null
         * @returns {Object}
         * @example {
         *  visibility: "all",
         * proxy_hosts: "manage",
         * redirection_hosts: "manage",
         * dead_hosts: "manage",
         * streams: "manage",
         * access_lists: "manage",
         * certificates: "manage"
         * }
         */
        this.permissions = data.permissions
    }

    /**
     * Sets the User's Nickname
     * @param {String} nickname - The new nickname
     * @returns {Promise<User>}
     * @example await user.setNickname("darkerink")
     */
    async setNickname(nickname) {

        if (!nickname) throw new MissingArgument("Nickname is required")
        

        if (!nickname.length > 3) throw new Error("Nickname must be at least 3 characters")
        

        if (nickname === this.nickname) return this
        

        try {

            await axios({
                method: "PUT",
                url: `${this.client.schema}://${this.client.host}/api/users/${this.id}`,
                headers: {
                    Authorization: `Bearer ${this.client.token}`,
                    "Content-Type": "application/json"
                },
                data: {
                    nickname
                }
            })

            this.nickname = nickname

            return this

        } catch (e) {

            const msg = e?.response?.data?.message || e?.message

            throw new Error(msg)
        }

    }


    /**
     * 
     * @param {String} password - The new password
     * @returns {Promise<User>} 
     * @example await user.setPassword("m3&zPg$F")
     */
    async setPassword(password) {

        if (!password) throw new MissingArgument("Password is required")
        

        if (!password.length > 7) throw new Error("Password must be at least 8 characters")
        

        try {
            await axios({
                method: "PUT",
                url: `${this.client.schema}://${this.client.host}/api/users/${this.id}/auth`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.client.token}`
                },
                data: {
                    secret: password,
                    type: "password"
                }
            })

        } catch (e) {
            const msg = e?.response?.data?.error || e?.message

            throw new Error(msg)
        }

        return this
    }

    /**
     * Sets the User's Email
     * @param {String} email - The new email
     * @returns {Promise<User>}
     */
    async setEmail(email) {

        if (!email) throw new MissingArgument("Email is required")
        

        if (!email.length > 3) throw new MissingArgument("Email must be at least 3 characters")
        

        if (email === this.email) return this
        

        try {
            await axios({

                method: "PUT",
                url: `${this.client.schema}://${this.client.host}/api/users/${this.id}`,
                headers: {
                    Authorization: `Bearer ${this.client.token}`,
                    "Content-Type": "application/json"
                },
                data: {
                    email
                }
            })

            this.email = email

            return this

        } catch (e) {
            const msg = e?.response?.data?.message || e?.message

            throw new Error(msg)

        }
    }

    /**
     * Sets the User's Name
     * @param {String} name - The new name
     * @returns {Promise<User>}
     * @example await user.setName("Darker Ink")
     */
    async setName(name) {

        if (!name) throw new Error("Name is required")
        

        if (!name.length > 3) throw new Error("Name must be at least 3 characters")
        

        if (name === this.name) return this
        

        try {
            await axios({
                method: "PUT",
                url: `${this.client.schema}://${this.client.host}/api/users/${this.id}`,
                headers: {
                    Authorization: `Bearer ${this.client.token}`,
                    "Content-Type": "application/json"
                },
                data: {
                    name
                }
            })
        } catch (e) {
            const msg = e?.response?.data?.message || e?.message

            throw new Error(msg)
        }
    }

    /**
     * Sets The users permissions
     * @param {Object} permissions - The new permissions
     * @param {String} permissions.visibility - The visibility permission
     * @param {String} permissions.proxy_hosts - The proxy hosts permission
     * @param {String} permissions.redirection_hosts - The redirection hosts permission
     * @param {String} permissions.dead_hosts - The dead hosts permission
     * @param {String} permissions.streams - The streams permission
     * @param {String} permissions.access_lists - The access lists permission
     * @param {String} permissions.certificates - The certificates permission
     * @returns {Promise<User>} 
     */
    async setPermissions(permissions) {

        if (!permissions) throw new MissingArgument("At least one permission is required")

        if (permissions.visibility && !["all", "user"].includes(permissions.visibility)) throw new InvalidType(`${permissions?.visibility} is not a valid visibility type (Valid Types: all, user)`)


        if (permissions.proxy_hosts && !["manage", "view", "hidden"].includes(permissions.proxy_hosts)) throw new InvalidType(`${permissions?.proxy_hosts} is not a valid proxy hosts type (Valid Types: ${["manage", "view", "hidden"].join(", ")})`)


        if (permissions.redirection_hosts && !["manage", "view", "hidden"].includes(permissions.redirection_hosts)) throw new InvalidType(`${permissions?.redirection_hosts} is not a valid redirection hosts type (Valid Types: ${["manage", "view", "hidden"].join(", ")})`)


        if (permissions.dead_hosts && !["manage", "view", "hidden"].includes(permissions.dead_hosts)) throw new InvalidType(`${permissions?.dead_hosts} is not a valid dead hosts type (Valid Types: ${["manage", "view", "hidden"].join(", ")})`)


        if (permissions.streams && !["manage", "view", "hidden"].includes(permissions.streams)) throw new InvalidType(`${permissions?.streams} is not a valid streams type (Valid Types: ${["manage", "view", "hidden"].join(", ")})`)


        if (permissions.access_lists && !["manage", "view", "hidden"].includes(permissions.access_lists)) throw new InvalidType(`${permissions?.access_lists} is not a valid access lists type (Valid Types: ${["manage", "view", "hidden"].join(", ")})`)


        if (permissions.certificates && !["manage", "view", "hidden"].includes(permissions.certificates)) throw new InvalidType(`${permissions?.certificates} is not a valid certificates type (Valid Types: ${["manage", "view", "hidden"].join(", ")})`)


        try {

            const newPerms = {
                ...this.permissions,
                ...permissions
            }

            await axios({
                method: "PUT",
                url: `${this.client.schema}://${this.client.host}/api/users/${this.id}`,
                headers: {
                    Authorization: `Bearer ${this.client.token}`,
                    "Content-Type": "application/json"
                },
                data: {
                    permissions: newPerms
                }
            })

            this.permissions = newPerms

            return this
        } catch (e) {
            const msg = e?.response?.data?.message || e?.message

            throw new Error(msg)
        }
    }
}

module.exports.User = User