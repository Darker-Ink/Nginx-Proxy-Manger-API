const { Client } = require("../../Client")

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
         * @type {Client}
         * @private
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
        console.log("Setting Nickname... " + nickname)
    }

}

module.exports.User = User