node-auth-weibo
===============

A complete oauth flow example for Sina Weibo.

I followed up the awesome series [EASY NODE AUTHENTICATION](http://scotch.io/series/easy-node-authentication) from [scotch.io](http://scotch.io/) and what I did is to add the support for Sina Weibo. It's really useful and I think you may need this in your next hackthon project.


### Development

First you need to add your key to the config file.

```
$ cp ./config/auth.example.js ./config/auth.js
```

And then

```
$ npm install
$ npm run start
```

### Stack

* Mongodb
* Express
* Passport

### License

MIT