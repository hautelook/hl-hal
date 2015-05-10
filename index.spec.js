var hal = require('./index');

var fixture = {
    _links: {
        one: { href: 'http://example.com/one' },
        many: [
            { href: 'http://example.com/many/1' },
            { href: 'http://example.com/many/2' }
        ],
        templated: {
            href: 'http://example.com/{exampleArg}',
            templated: true
        }
    },
    _embedded: {
        one: { name: 'ken' },
        many: [
            { name: 'John' },
            { name: 'Fred' }
        ]
    }
}

describe('The expandUrlTemplate function', function() {
    it('expands url templates', function() {
        var template = 'http://example.com/{exampleArg}';
        var templateVars = { exampleArg: 'home' };
        expect(hal.expandUrlTemplate(template, templateVars)).toEqual('http://example.com/home');
    });
});

describe('The resources function', function() {
    it('returns an empty array when missing _embedded', function() {
        expect(hal.resources({}, 'none')).toEqual([]);
    });

    it('returns an empty array when missing relation', function() {
        expect(hal.resources(fixture, 'none')).toEqual([]);
    });

    it('returns an array when relation derefs to object', function() {
        expect(hal.resources(fixture, 'one')).toEqual([
            fixture._embedded.one
        ]);
    });

    it('returns an array when relation derefs to array', function() {
        expect(hal.resources(fixture, 'many')).toEqual([
            fixture._embedded.many[0],
            fixture._embedded.many[1]
        ]);
    });
});

describe('resource', function() {
    it('throws an exception when there are no embedded resources', function() {
        expect(hal.resource.bind(hal, {}, 'none')).toThrow(
            'Expected exactly one resource, instead found 0'
        );
    });

    it('throws an exception when there is no relation', function() {
        expect(hal.resource.bind(hal, fixture, 'none')).toThrow(
            'Expected exactly one resource, instead found 0'
        );
    });

    it('returns an embedded resource when there is exactly one', function() {
        expect(hal.resource(fixture, 'one')).toEqual(fixture._embedded.one);
    });

    it('throws an exception when there are many embedded resources', function() {
        expect(hal.resource.bind(hal, fixture, 'many')).toThrow(
            'Expected exactly one resource, instead found 2'
        );
    });
});

describe('links', function() {
    it('returns an empty array when missing _links', function() {
        expect(hal.links({}, 'none')).toEqual([]);
    });

    it('returns an empty array when missing the relation', function() {
        expect(hal.links(fixture, 'none')).toEqual([]);
    });

    it('returns an array when theres one link', function() {
        expect(hal.links(fixture, 'one')).toEqual([
            fixture._links.one
        ]);
    });

    it('returns an array when there are many links', function() {
        expect(hal.links(fixture, 'many')).toEqual([
            fixture._links.many[0],
            fixture._links.many[1]
        ]);
    });
});

describe('link', function() {
    it('throws an exception when missing _links', function() {
        expect(hal.link.bind(hal, {}, 'none')).toThrow(
            'Expected exactly one link, instead found 0'
        );
    });

    it('throws an exception when there are no links', function() {
        expect(hal.link.bind(hal, fixture, 'none')).toThrow(
            'Expected exactly one link, instead found 0'
        );
    });

    it('returns a link when there is exactly one', function() {
        expect(hal.link(fixture, 'one')).toEqual(fixture._links.one);
    });

    it('throws an exception when there are more than one link', function() {
        expect(hal.link.bind(hal, fixture, 'many')).toThrow(
            'Expected exactly one link, instead found 2'
        );
    });
});

describe('hrefs', function() {
    it('returns an empty array when missing _links', function() {
        expect(hal.hrefs({}, 'none')).toEqual([]);
    });

    it('returns an empty array when missing relation', function() {
        expect(hal.hrefs(fixture, 'none')).toEqual([]);
    });

    it('returns an array when relation derefs to object', function() {
        expect(hal.hrefs(fixture, 'one')).toEqual([
            fixture._links.one.href
        ]);
    });

    it('returns an array when relation derefs to array', function() {
        expect(hal.hrefs(fixture, 'many')).toEqual([
            fixture._links.many[0].href,
            fixture._links.many[1].href
        ]);
    });

    it('expands templated links', function() {
        var templateVars = { exampleArg: 'home' };
        expect(hal.hrefs(fixture, 'templated', templateVars)).toEqual([
            'http://example.com/home'
        ]);
    });
});

describe('href', function() {
    it('throws an exception when _links is missing', function() {
        expect(hal.href.bind(hal, {}, 'none')).toThrow(
            'Expected exactly one href, instead found 0'
        );
    });

    it('throws an exception when there are no links', function() {
        expect(hal.href.bind(hal, fixture, 'none')).toThrow(
            'Expected exactly one href, instead found 0'
        );
    });

    it('returns an href when there is exactly one', function() {
        expect(hal.href(fixture, 'one')).toEqual(fixture._links.one.href);
    });

    it('throws an exception when there are more than one link', function() {
        expect(hal.href.bind(hal, fixture, 'many')).toThrow(
            'Expected exactly one href, instead found 2'
        );
    });

    it('expands templated links', function() {
        var templateVars = { exampleArg: 'home' };
        expect(hal.href(fixture, 'templated', templateVars)).toEqual('http://example.com/home');
    });
});
