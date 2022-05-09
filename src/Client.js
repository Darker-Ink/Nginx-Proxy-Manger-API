const { default: axios } = require("axios");
const Collection = require("./Utils/Collection");
const { Proxy } = require("./Utils/Structures/Proxy");
const { User } = require("./Utils/Structures/User");
const { Users } = require("./Utils/Structures/Users");

class Client {
    /**
     * Client Class for making the Proxy Client
     * @constructor
     * @param {Object} options - The options for the client
     * @param {String} options.host - The host of the proxy server
     * @param {String} options.schema - The schema of the proxy server
     * @param {String} options.email - The email for the proxy server
     * @param {String} options.password - The password for the proxy server
     */
    constructor(options = {}) {

        /**
         * The AuthToken
         * @type {String}
         * @readonly
         * @private
         * @default null
         * @returns {String}
         */
        this.token = null;

        /**
         * The host of the proxy server
         * @type {String}
         * @readonly
         * @default null
         * @returns {String}
         */
        this.host = options.host


        /**
         * The Schema of the proxy server (http, https, etc)
         * @type {String}
         * @readonly
         * @default https
         * @returns {String}
         */
        this.schema = options.schema || "https";

        /**
         * The email for the proxy server
         * @type {String}
         * @readonly
         * @default null
         * @returns {String}
         */
        this.email = options.email

        /**
         * The password for the proxy server
         * @type {String}
         * @readonly
         * @default null
         * @private
         * @returns {String}
         */
        this.password = options.password

        // /**
        //  * The Proxies
        //  * @type {Collection}
        //  */
        // this.proxies = new Collection() Removed As of now

        /**
         * When the AuthToken expires
         * @type {Date}
         * @readonly
         * @default null
         * @private
         * @returns {Date}
         */
        this.expires = null

        /**
         * If the client is connected
         * @type {Boolean}
         * @readonly
         * @default false
         * @returns {Boolean}
         * @private
         */
        this.connected = false;


        /**
         * The Proxy Server
         * @type {Proxy}
         */
        this.proxy = new Proxy(this)

        /**
         * The Proxy Servers Users
         * @type {Users}
         */
        this.users = new Users(this)
    }



    /**
     * Connects to the proxy server
     * @returns {Promise<Client>}
     */
    async connect() {
        if (this.connected) throw new Error("Client is already connected");

        const AuthData = await this.proxy.getAuth()

        this.token = AuthData.token
        this.expires = new Date(AuthData.expires)
        this.connected = true;
        
        await this.checkPermission()

        setTimeout(async () => {
            await this.getToken()
        }, this.expires - new Date())

        return this;
    }


    /**
     * Gets a new token
     * @private
     * @returns {Promise<Client.token>}
     */
    async getToken() {
        if (!this.connected) throw new Error("Client is not connected");

        if (this.expires < new Date()) {
            const AuthData = await this.proxy.getAuth()
            this.token = AuthData.token
            this.expires = new Date(AuthData.expires)

            setTimeout(async () => {
                await this.getToken()
            }, this.expires - new Date())
        }

        return this.token;
    }

    /**
     * Permission Check
     * @private
     * @returns void
     */
    async checkPermission() {
        if (!this.connected) throw new Error("Client is not connected");

        const UserData = await axios({
            method: "GET",
            url: `${this.schema}://${this.host}/api/users/me?expand=permissions`,
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })

        if(!UserData.data.roles.includes("admin")) {
            console.warn(`WARNING: You are using a User that is Not An Admin. This may cause issues. We have removed <Client>.users`)
            this.users = null
        }
    }

}

module.exports.Client = Client