var UriTemplate = require('uritemplate');

function expandUrlTemplate(template, vars) {
    return UriTemplate.parse(template).expand(vars);
}
module.exports.expandUrlTemplate = expandUrlTemplate;

function resources(resource, relation) {
    return getRelation(resource, '_embedded', relation);
}
module.exports.resources = resources;

function resource(resource, relation) {
    return only(resources(resource, relation), 'resource');
}
module.exports.resource = resource;

function links(resource, relation) {
    return getRelation(resource, '_links', relation);
}
module.exports.links = links;

function link(resource, relation) {
    return only(links(resource, relation), 'link');
}
module.exports.link = link;

function hrefs(resource, relation, vars) {
    return links(resource, relation).map(expandLink.bind(null, vars));
}
module.exports.hrefs = hrefs;

function href(resource, relation, vars) {
    return only(hrefs(resource, relation, vars), 'href');
}
module.exports.href = href;

function only(collection, name) {
    if (collection.length !== 1) {
        throw new Error('Expected exactly one ' + name + ', instead found ' + collection.length);
    }
    return collection[0];
}

function getRelation(resource, type, relation) {
    if (!resource[type]) {
        return [];
    }
    return makeArray(resource[type][relation]);
}

function makeArray(value) {
    if (typeof value === 'undefined') {
        return [];
    }
    return isArray(value) ? value : [value];
}

function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}

function expandLink(vars, link) {
    return link.templated ? expandUrlTemplate(link.href, vars) : link.href;
}