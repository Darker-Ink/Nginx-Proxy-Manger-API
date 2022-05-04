const axios = require("axios");

class Proxy {
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
     * Get the AuthToken
     * @returns {Promise<String>}
     */
    async getAuth() {

        const data = await axios({
            method: "POST",
            url: `${this.client.schema}://${this.client.host}/api/tokens`,
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                "identity": this.client.email,
                "secret": this.client.password
            }
        })

        return data.data

    }

    /**
     * Gets A Proxy from the Proxy Server
     * @param {String} Domain - The domain to get the proxy for
     * @returns {Promise<String>}
     * @example
     * const proxy = await client.proxy.getProxy("proxied.example.com")
     * console.log(proxy)
     * // => { ip: "0.0.0.0", port: "80", "ssl": false, created: "2020-01-01T00:00:00.000Z", updated: "2020-01-01T00:00:00.000Z", id: 1 }
     */
    async getProxy(domain) {

        const Proxies = await axios({
            method: "GET",
            url: `${this.client.schema}://${this.client.host}/api/nginx/proxy-hosts`,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.client.token}`
            }
        })

        const domainData = Proxies.data.filter(proxy => proxy.domain_names[0] === domain)[0]

        if (domainData.length === 0) throw new Error("No Proxy Found")

        return {
            ip: domainData.forward_host,
            port: domainData.forward_port,
            ssl: domainData.meta.letsencrypt_agree ? true : false,
            created: domainData.created_on,
            updated: domainData.modified_on,
            id: domainData.id
        }

    }

    /**
     * Gets All proxies from the Proxy Server
     * @returns {Promise<Array>}
     * @example
     * const proxies = await client.proxy.getProxies()
     * console.log(proxies)
     */
    async getProxies() {

        const Proxies = await axios({
            method: "GET",
            url: `${this.client.schema}://${this.client.host}/api/nginx/proxy-hosts`,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.client.token}`
            }
        })

        return Proxies.data.map(proxy => {
            return {
                domains: proxy.domain_names,
                ip: proxy.forward_host,
                port: proxy.forward_port,
                ssl: proxy.meta.letsencrypt_agree ? true : false,
                created: proxy.created_on,
                updated: proxy.modified_on,
                id: proxy.id
            }
        })

    }

    /**
     * Proxies A Domain/Domains
     * @param {Object} options - The options
     * @param {String|Array} options.domain - The domain(s) to proxy
     * @param {String} options.ip - The IP to proxy to
     * @param {Number} options.port - The port to proxy to
     * @param {Boolean} options.ssl - Whether or not to proxy SSL
     * @returns {Promise<Array>}
     */
    async proxy(options = {}) {

        if (!options.domain) throw new Error("No Domain Provided")
        if (!options.ip) throw new Error("No IP Provided")
        if (!options.port) throw new Error("No Port Provided")

        if (typeof options.domain === "string") options.domain = [options.domain]
        try {
            const Proxy = await axios({
                method: "POST",
                url: `${this.client.schema}://${this.client.host}/api/nginx/proxy-hosts`,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${this.client.token}`
                },
                data: {
                    "domain_names": options.domain,
                    "forward_host": options.ip,
                    "forward_port": options.port,
                    "access_list_id": "0",
                    "certificate_id": "new",
                    "meta": {
                        "letsencrypt_agree": options.ssl,
                        "letsencrypt_email": this.client.email,
                        "dns_challenge": false
                    },
                    "advanced_config": "",
                    "locations": [],
                    "block_exploits": true,
                    "caching_enabled": false,
                    "allow_websocket_upgrade": true,
                    "http2_support": false,
                    "hsts_enabled": false,
                    "hsts_subdomains": false,
                    "ssl_forced": true
                }
            })

            return {
                domains: Proxy.domain_names,
                ip: Proxy.forward_host,
                port: Proxy.forward_port,
            }
        } catch (e) {
            if(e.data.error.message.includes("is already in use")) throw new Error("Domain Already Proxied")
            if(e.data.error.message == "Internal Error") throw new Error("Internal Error (This Usually Means The IP is wrong or Certbot is ratelimited. The Domain has proxied without an SSL)")
        }

        return Proxy.data
    }
}

module.exports = Proxy;