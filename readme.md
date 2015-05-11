# hl-hal

A JavaScript library of functions for working with [Hypertext Application Language](http://stateless.co/hal_specification.html) (HAL) resources.  It contains functions for accessing information stored in a resource's links and embedded resources.

Using services which expose HAL resources is really awesome.  However, the JavaScript patterns for dealing with HAL data can be inelegant.

To illustrate, imagine a HAL resource which provides information about friends on your friends list.  If you already have friends on your list, that response might look like:

```json
{
    "_links": {
        "self": "http://example.com/friends"
    },
    "_embedded": {
        "friends": [
            { "name": "Monica" },
            { "name": "Joey" }
        ]
    }
}
```

If we wanted to work with the list of friends, it would be very easy to do so.  We might write some code like:

```js
var friends = resource._embedded.friends;
console.log('You have ' + friends.length + ' friends');
//=> You have 2 friends
```

But edge cases exist.  When you only have one friend, you might receive a resource which looks like this:

```json
{
    "_links": {
        "self": "http://example.com/friends"
    },
    "_embedded": {
        "friends": { "name": "Monica" }
    }
}
```

Notice that in this case, the `friends` property contains an object instead of an array.  Further complicating matters, if your friends list were empty, the resource might not even include the `_embedded` property.  These edge cases force you to write a lot more guard code.  For example:

```js
var friends = [];
if (resource._embedded && resource._embedded.friends) {
    friends = resource._embedded.friends;
    if (!Array.isArray(friends)) {
        friends = [friends];
    }
}
console.log('You have ' + friends.length + ' friends');
```

This library exposes pure functions which handle those edge cases for you so that you can write nice code like:

```js
var hal = require('hl-hal');

var friends = hal.resources(resource, 'friends');
console.log('You have ' + friends.length + ' friends');
```

## API

The API provides functions for getting embedded resources:

```js
function resource(resource, relation)
function resources(resource, relation)
```

It also provides functions for getting urls out of links:

```js
function href(resource, relation, templateVars)
function hrefs(resource, relation, templateVars)
```

And it exposes a function for expanding RFC6570 URL templates:

```js
function expandUrlTemplate(template, vars)
```

And if you ever need to work directly with links (as opposed to the urls inside of them), these functions are available:

```js
function link(resource, relation)
function links(resource, relation)
```

## Usage

The best way to understand how the functions work is to take a quick look at the [test suite](./index.spec.js).

## Acknowledgements

This library makes use of the [`uritemplate-js`](https://github.com/fxa/uritemplate-js) library by Franz Antesberger.
