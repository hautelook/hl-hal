# hl-hal

A HAL resource is composed of properties, embedded resources, and links to other resources.  This library provides a consistent way to access embedded resources and links.

The following examples will be based off this resource representing a list of orders:

```json
{
    "_links": {
        "self": { "href": "/orders" },
        "next": { "href": "/orders?page=2" },
        "find": { "href": "/orders{?id}", "templated": true }
    },
    "_embedded": {
        "orders": [{
            "_links": {
                "self": { "href": "/orders/123" },
                "basket": { "href": "/baskets/98712" }
            },
            "_embedded": {
                "customer": {
                    "_links": {
                        "self": { "href": "/customers/7809" }
                    },
                    "name": "John Doe"
                }
            },
            "total": 30.00,
            "currency": "USD",
            "status": "shipped",
        },{
            "_links": {
                "self": { "href": "/orders/124" },
                "basket": { "href": "/baskets/97213" }
            },
            "_embedded": {
                "customer": {
                    "_links": {
                        "self": { "href": "/customers/12369" }
                    },
                    "name": "Jane Doe"
                }
            },
            "total": 20.00,
            "currency": "USD",
            "status": "processing"
        }]
    },
    "currentlyProcessing": 14,
    "shippedToday": 20
}
```

### Embedded Resources

Embedded resources can be obtained using the `resources` function.  The function takes a HAL resource and the name of a relation.  For example, the embedded resources labeled `orders` can be obtained like:

```js
var orders = hal.resources(resource, 'orders');
console.log(orders.length);
// -> 2
```

Note that the `resources` function always returns an array; even when the original data structure represents the relation as an object and not an array (like the `customer` resource embedded in the `orders` resources).

```js
var orders = hal.resources(resource, 'orders');
orders.forEach(function(order) {
    var customers = hal.resources(resource, 'customer');
    var customer = customers[0]; // resources always returns an array
    console.log(customer.name);
});
// -> John Doe
// -> Jane Doe
```

### Links

Links in HAL are an abstraction around urls.  This abstraction allows for urls to be templated.  As a consumer of HAL, you will usually just be interested in urls and not in links themselves.  The urls of links can be obtained using the `hrefs` function.  The `hrefs` function takes a HAL resource, the name of a relation and, optionally, a hash which will be used to expand url templates.  For example, if a client wished to find an order by id, it would use the `find` link like so:

```js
var hrefs = hal.hrefs(resource, 'find', { id: 31337 });
var href = hrefs[0]; // hrefs always returns an array
console.log(href);
// -> /orders?id=31337
```

Occasionally you may need to work with links directly.  The `links` method will return an array of link objects for a specified relation.

```js
var links = hal.links(resource, 'find');
console.log(links.length);
// -> 1
```
