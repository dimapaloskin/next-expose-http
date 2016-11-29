# next-expose-http

It provides an easy-to-use access to your next.js app server. Thus you may expand the basic functionality with http custom request handlers.

# Installation

```bash
npm install --save next-expose-http
```

# Ready-to-use example

You may see a [ready-to-use sample](https://github.com/dimapaloskin/next-expose-http-example) how to use next.js all together with express.

# Usage example

Create a new next.js application exactly as you did it before.

```bash
 $ mkdir my-next-project
 $ cd my-next-project
 $ next init
```

Now install a next-expose-http module.

```bash
 $ npm i --save next-expose-http
```

Create architecture of your api. It's rather easy - all you need is create an api folder containing an index.js file which is you api  entry point.

```bash
 $ mkdir api
 $ touch api/index.js
```

Api entry point **must** be a function of two agruments (httpServer и prefix) and return promise.

api/index.js

```js
exports.default = function(httpServer, apiPrefix) {

 httpServer.on('request', (req, res) => {
  // do something 
 });

 return new Promise((resolve) => {
  resolve();
 });
}
```

As soon as your api setup is finished, you have to call the resolve function (or reject if setup is failed).

Now open package.json of your project and edit the `dev` and `start` commands.
Just change command `next` for `next-expose-http`. Thus `next dev -p 4000` operation will transform into `next-expose-http dev -p 4000` command.


Ready. Launch the app with the `npm run dev`.

# Additional arguments

`next-expose-http` supports additional arguments:

`--prefix` (`api` by default) - url api prefix. All url that started from this prefix will be ignored by next.js and redirected to your api. Thus
`http://localhost:300/api` and `http://localhost:300/api/users` will be proxied to your custom handler and will not get to the next.js handler.

`--api-dir` (`api` by default) - directory containing your api. Must contain index.js file.

#


MIT © [Dmitry Pavlovsky](http://palosk.in)
