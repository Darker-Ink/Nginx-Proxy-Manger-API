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
                id: proxy.id,
                certificate_id: proxy.certificate_id || null
            }
        })

    }

    /**
     * Gets all the certificates from the Proxy Server
     * @returns {Promise<Array>}
     */
    async getCertificates() {

        const Certificates = await axios({
            method: "GET",
            url: `${this.client.schema}://${this.client.host}/api/certificates`,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.client.token}`
            }
        })

        return Certificates.data.map(cert => {
            return {
                domains: cert.domain_names,
                id: cert.id,
                expires: cert.expires,
                created: cert.created_on,
                updated: cert.modified_on
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
    async createProxy(options = {}) {
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
                    "forward_scheme": "http",
                    "access_list_id": "0",
                    "certificate_id": options.ssl ? "new" : "0",
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
                    "ssl_forced": options.ssl,
                }
            })

            return {
                domains: Proxy.data.domain_names,
                ip: Proxy.data.forward_host,
                port: Proxy.data.forward_port,
                id: Proxy.data.id,
                created: Proxy.data.created_on,
                updated: Proxy.data.modified_on,
                certificate_id: Proxy.data.certificate_id || null
            }
        } catch (e) {
            const msg = e?.response?.data?.error.message || e?.message
            if (msg?.includes("is already in use")) {
                const domain = msg.split(" ")[0]
                throw new Error(`${domain} is already in use.`)
            }

            if (msg?.message == "Internal Error") {
                let mm = "Internal Error (This normally means The Domain(s) IP isn't pointing towards the Proxies or Certbot is RateLimited)"
                throw new Error(mm)
            } else {
                throw new Error(msg)
            }

        }
    }

    /**
     * UnProxies The Domain
     * @param {String} domain - The domain to UnProxy
     * @returns {Promise<String>} 
     */
    async unProxy(domain) {
        if (!domain) throw new Error("No Domain Provided")

        const Proxies = await this.getProxies();

        const Proxy = Proxies.filter(proxy => proxy.domains.includes(domain))[0]

        if (!Proxy) throw new Error("No Proxy Found")

        const ProxyID = Proxy.id

        try {
             await axios({
                method: "DELETE",
                url: `${this.client.schema}://${this.client.host}/api/nginx/proxy-hosts/${ProxyID}`,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${this.client.token}`
                }
            })

            return "UnProxied Successfully"

        } catch (e) {

            const msg = e?.response?.data?.error || e?.message

            throw new Error(msg)
        }

    }


}

module.exports = Proxy;