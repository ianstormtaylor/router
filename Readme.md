# router

  A nice client-side router.

## Installation

    $ component install ianstormtaylor/router

## Example

Super simple example:

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
  var id = context.params.user;
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

### #listen(path)
  Start and listen for link clicks that the router should handle, optionally namespaced by a `path`. This means that you don't need to `.preventDefault` clicks by hand on `a[href]`'s since the router will do it for you for internal links.

### #go(path, [state])
  Dispatch to a `path` and push it onto the history with an optional `state` object.
  
### #dispatch(path)
  Trigger middleware for a `path`.

### #push(path, [state])
  Push a `path` onto the history, with an optional `state` object.

### #replace(path, [state])
  Replace the current URL in the history with a new `path`, with an optional `state` object.

### .use(plugin)
  Use the given `plugin`.

## License

  MIT
