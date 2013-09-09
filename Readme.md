# router

  A nice client-side router.

## Installation

    $ component install ianstormtaylor/router

## Example

Super simple example:

```js
var Router = require('router');

var router = new Router()
  .on('/about/:user', user, load)
  .start();

function user (context, next) {
  var id = context.params.user;
  // do stuff
  next();
}

function load (context, next) {
  // do stuff
}
```

More complex example, where instead of using `start`, we use `listen` to automatically catch any future `a[href]` clicks and do the routing for us:

```js
var Router = require('router');

var router = new Router()
  .on('/about/:user', user)
  .on('/about/:user/:section', user, load)
  .listen('/about');

function user (context, next) {
  var id = context.params.user;
  context.thing = 1;
  next();
}

function load (context, next) {
  var section = context.params.section;
  console.log(context.thing); // 1
  next();
}
```

## API

### #on(path, middleware...)
  Bind `middleware` functions to a `path`. Middleware take `next` callbacks to move to the next middleware on the queue.

### #start()
  Start the router, dispatching the current URL. (Convenience so you don't have to call `#dispatch(window.location...` yourself.)

### #go(path)
  Dispatch to a `path` and push it onto the history.

### #listen(path)
  Start listening for link clicks that the router should handle, optionally namespaced by a `path`. This means that you don't need to `.preventDefault` clicks by hand on `a[href]`'s since the router will do it for you for internal links.

### #dispatch(path)
  Trigger middleware for a `path`.

### #push(path)
  Push a `path` onto the history.

### #replace(path)
  Replace the current URL in the history with a new `path`.

### .use(plugin)
  Use the given `plugin`.

## License

  MIT
