# Groove

A router for connect that lets you have more specific handlers.

```javascript
var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(groove.route({
    'GET /ponies.json': ponies.all,
    'GET /ponies.json?kind=earh&mane=:mane': ponies.earthPoniesWithManeColour,
    'GET /ponies/:id.json': ponies.byId
  }));
```
