# Groove.js

A connect.js router for APIs.

## Usage

```javascript
var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(groove.route({
    'GET /ponies.json': poniesController.list
    'POST /ponies.json': poniesController.create
  }));
```

## Why use Groove.js?

### Expressiveness

When developing APIs your code is usually coupled to the HTTP method,
the URL and the querystring. Groove.js let you express that coupling without
bloating your handler function.

```javascript
// Using Express.js
var handler = function(req, res) {
  if (! req.query['type']) {
    return res.json(find());
  }

  if (req.query['type'] === 'upcoming') {
    if (req.query['cityId']) {
      res.json(findByCity(req.query['cityID'], 'upcoming'));
    } else {
      res.json(find('upcoming'));
    }
  } else {
      res.json(find(req.query['type']));
  }
};

// setup express app ...

app.get('/events.json', handler);
```

```javascript
// Using Groove.js
var eventsByType = function(req, res) { res.json(find(req.params['type'])) },
    all          = function(req, res) { res.json(find()); },
    upcomingByCity = function(req, res) {
      res.json(findByCity(req.params['cityId'], 'upcoming'));
    };

// setup connect app ...
app.use(groove.route({
  'GET /events.json?type=upcoming&cityId=:cityId': upcomingByCity,
  'GET /events.json?type=:type': eventsByType
  'GET /events.json' : all,
}));
```
### Flexibility

Because the input to the router is a simple object mapping URL patterns to
functions, Groove.js doesn't impose any rules on how developers should
organize their code.
