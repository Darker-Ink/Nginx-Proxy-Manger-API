const Collection = require("./Utils/Collection");
const Proxy = require("./Utils/Proxy/Proxy")
/**
 * Client Class for making the Proxy Client
 * @constructor
 * @param {Object} options - The options for the client
 * @param {String} options.host - The host of the proxy server
 * @param {String} options.schema - The schema of the proxy server
 * @param {String} options.email - The email for the proxy server
 * @param {String} options.password - The password for the proxy server
 */
class Client {
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

        /**
         * The Proxies
         * @type {Collection}
         */
        this.proxies = new Collection()

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

}

module.exports = Client