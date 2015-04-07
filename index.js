var UriTemplate = require('uritemplate');

module.exports = {
    resources: function(resource, relation) {
        return getRelation(resource, '_embedded', relation);
    },

    links: function(resource, relation) {
        return getRelation(resource, '_links', relation);
    },

    hrefs: function(resource, relation, vars) {
        return getRelation(resource, '_links', relation).map(function(link) {
            return link.templated ? expandUriTemplate(link.href, vars) : link.href;
        });
    }
};

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
    if (isArray(value)) {
        return value;
    }
    return [value];
}

function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}

function expandUriTemplate(template, vars) {
    return UriTemplate.parse(template).expand(vars);
}
