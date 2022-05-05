<div align="center">
    <br />
    <p>
    <h1> Proxy-Manager-API </h1>
    </p>
    <br />
    <p>
        <a href="https://github.com/Darker-Ink/Nginx-Proxy-Manger-API/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/Darker-Ink/Nginx-Proxy-Manger-API"></a>
        <a href="https://github.com/Darker-Ink/Nginx-Proxy-Manger-API/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/Darker-Ink/Nginx-Proxy-Manger-API"></a>
        <a href="https://github.com/Darker-Ink/Nginx-Proxy-Manger-API/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/Darker-Ink/Nginx-Proxy-Manger-API"></a>
    </p>
</div>

## Info
Proxy-Manager-API is a simple API for managing Nginx Proxies Using https://nginxproxymanager.com.



## Installation

    
```sh-session
npm install proxy-manager-api
yarn add proxy-manager-api
```

## Usage

Login and Get all proxies. Then get the info of a certain domain proxied
```javascript
const ProxyManager = require('proxy-manager-api');

const client = new ProxyManager({
    host: 'proxy.example.com',
    email: 'admin@example.com',
    password: 'admin'
});

client.connect().then(() => {
    client.getProxies().then(proxies => {
        console.log(proxies);
    });

    client.getProxy('proxied.example.com').then(proxy => {
        console.log(proxy.ip);
    });
});
```

If you want to proxy a new domain you can do it like this:
```javascript
const ProxyManager = require('proxy-manager-api');

const client = new ProxyManager({
    host: 'proxy.example.com',
    email: 'admin@example.com',
    password: 'admin'
});

client.connect().then(() => {
    client.proxy.createProxy({
        domain: 'proxied.example.com',
        ip: '0.0.0.0',
        port: 8080,
        ssl: true,
    }).then(proxy => {
        console.log(proxy);
    })

});
```

If you want to proxy multiple domains to one ip and port you can do it like this:
```javascript
const ProxyManager = require('proxy-manager-api');

const client = new ProxyManager({
    host: 'proxy.example.com',
    email: 'admin@example.com',
    password: 'admin'
});

client.connect().then(() => {
    client.proxy.createProxy({
        domain: ['proxied.example.com', 'proxied2.example.com'],
        ip: '0.0.0.0',
        port: 8080,
        ssl: true,
    }).then(proxy => {
        console.log(proxy);
    });
});
```

## Links
- [GitHub](https://github.com/Darker-Ink/Nginx-Proxy-Manger-API)
- [NPM](https://www.npmjs.com/package/proxy-manager-api)

Docs Coming Soon.

## License
This project is licensed under the MIT license. See the LICENSE file for details.