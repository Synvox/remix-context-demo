# Remix context demo

A brief example of reusable context in remix to solve the middleware problem.

## Running

```
npm i
# Assuming you have postgres running
createdb remix_context_demo
npm run dev
```

## Associating the results of async functions with some sort of context object

### Using properties

```js
let req = {};

let user = {
  id: 1,
  name: "Ryan",
};

req.user = user;

console.log(req.user);
```

### Using Symbol

```js
let req = {};
let symbol = Symbol();

let user = {
  id: 1,
  name: "Ryan",
};

req[symbol] = user;

function getUser(req) {
  return req[symbol];
}

console.log(getUser(req));
```

### Using WeakMap

```js
let req = {};

let user = {
  id: 1,
  name: "Ryan",
};

let weakMap = new WeakMap();
weakMap.set(req, user);

function getUser(req) {
  return weakMap.get(req);
}

console.log(getUser(req));
```

### Reducing Calls

```js
let req = {};

function createGetter(fn) {
  let weakMap = new WeakMap();

  return function (request) {
    if (weakMap.has(request)) {
      return weakMap.get(request);
    }

    let result = fn(request);
    weakMap.set(request, result);

    return result;
  };
}

// wrap with createGetter
let getUser = (req) => {
  console.log("got user");
  // do something to get the user
  let user = {
    id: 1,
    name: "Ryan",
  };

  return user;
};

console.log(getUser(req));
console.log(getUser(req));
```

### Still works with async

```js
let req = {};

function createGetter(fn) {
  let weakMap = new WeakMap();

  return function (request) {
    if (weakMap.has(request)) {
      return weakMap.get(request);
    }

    let result = fn(request);
    weakMap.set(request, result);

    return result;
  };
}

let sleep = (time) => new Promise((r) => setTimeout(r, time));

// wrap with createGetter
let getUser = async (req) => {
  await sleep(200);

  console.log("got user");
  // do something to get the user
  let user = {
    id: 1,
    name: "Ryan",
  };

  return user;
};

async function loader(req) {
  let user = await getUser(req);
  return user;
}

let [user1, user2] = await Promise.all([loader(req), loader(req)]);

console.log(user1, user2);
console.log(user1 === user2);

let before = Date.now();
let user3 = await getUser(req);
let after = Date.now();

console.log(`${after - before}ms`);
console.log(getUser(req));
```
