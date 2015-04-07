var hal = require('./index');

describe('resources', function() {
    it('returns an empty array when missing _embedded', function() {
        var resource = {};
        expect(hal.resources(resource, 'some rel')).toEqual([]);
    });

    it('returns an empty array when missing relation', function() {
        var resource = { _embedded: {} };
        expect(hal.resources(resource, 'some rel')).toEqual([]);
    });

    it('returns an array when relation derefs to object', function() {
        var resource = { _embedded: { 'some rel': 3 } };
        expect(hal.resources(resource, 'some rel')).toEqual([3]);
    });

    it('returns an array when relation derefs to array', function() {
        var resource = { _embedded: { 'some rel': [1, 2, 3] } };
        expect(hal.resources(resource, 'some rel')).toEqual([1, 2, 3]);
    });
});

describe('links', function() {
    it('returns an empty array when missing _links', function() {
        var resource = {};
        expect(hal.links(resource, 'some rel')).toEqual([]);
    });

    it('returns an empty array when missing relation', function() {
        var resource = { _links: {} };
        expect(hal.links(resource, 'some rel')).toEqual([]);
    });

    it('returns an array when relation derefs to object', function() {
        var resource = { _links: { 'some rel': { href: 'http://example.com' } } };
        expect(hal.links(resource, 'some rel')).toEqual([{ href: 'http://example.com' }]);
    });

    it('returns an array when relation derefs to array', function() {
        var resource = { _links: { 'some rel': [
            { href: 'http://example.com/1' },
            { href: 'http://example.com/2' }
        ] } };
        expect(hal.links(resource, 'some rel')).toEqual([
            { href: 'http://example.com/1' },
            { href: 'http://example.com/2' }
        ]);
    });
});

describe('hrefs (untemplated)', function() {
    it('returns an empty array when missing _links', function() {
        var resource = {};
        expect(hal.hrefs(resource, 'some rel')).toEqual([]);
    });

    it('returns an empty array when missing relation', function() {
        var resource = { _links: {} };
        expect(hal.hrefs(resource, 'some rel')).toEqual([]);
    });

    it('returns an array when relation derefs to object', function() {
        var resource = { _links: { 'some rel': { href: 'http://example.com' } } };
        expect(hal.hrefs(resource, 'some rel')).toEqual(['http://example.com']);
    });

    it('returns an array when relation derefs to array', function() {
        var resource = { _links: { 'some rel': [
            { href: 'http://example.com/1' },
            { href: 'http://example.com/2' }
        ] } };
        expect(hal.hrefs(resource, 'some rel')).toEqual([
            'http://example.com/1',
            'http://example.com/2'
        ]);
    });
});

describe('hrefs (templated)', function() {
    it('returns an empty array when missing _links', function() {
        var resource = {};
        expect(hal.hrefs(resource, 'some rel')).toEqual([]);
    });

    it('returns an empty array when missing relation', function() {
        var resource = { _links: {} };
        expect(hal.hrefs(resource, 'some rel')).toEqual([]);
    });

    it('returns an array when relation derefs to object', function() {
        var resource = { _links: { 'some rel': { href: 'http://example.com/{exampleArg}', templated: true } } };
        expect(hal.hrefs(resource, 'some rel', { exampleArg: 'a' })).toEqual(['http://example.com/a']);
    });

    it('returns an array when relation derefs to array', function() {
        var resource = { _links: { 'some rel': [
            { href: 'http://example.com/1/{exampleArg}', templated: true },
            { href: 'http://example.com/2/{exampleArg}', templated: true }
        ] } };
        expect(hal.hrefs(resource, 'some rel', { exampleArg: 'a' })).toEqual([
            'http://example.com/1/a',
            'http://example.com/2/a'
        ]);
    });
});
