var UriTemplate = require('uritemplate');

function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}

function makeArray(value) {
    return isArray(value) ? value : [value];
}

function getRelation(resource, type, relation) {
    return (resource[type] && resource[type][relation])
        ? makeArray(resource[type][relation])
        : [];
}

function expandUriTemplate(template, vars) {
    return UriTemplate.parse(template).expand(vars);
}

module.exports = {
    resources: function(resource, relation) {
        return getRelation(resource, '_embedded', relation);
    },

    links: function(resource, relation) {
        return getRelation(resource, '_links', relation);
    },

    hrefs: function(resource, relation, vars) {
        return getRelation(resource, '_links', relation).map(function(link) {
            return link.templated ? expandUriTemplate(link.href, vars) : link.href
        });
    }
};
