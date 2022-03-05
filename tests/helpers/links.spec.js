import LinksGenerator from '../../src/helpers/LinksGenerator';

describe('Links Generator', () => {
    test('Should return default case', () => {
        const links = LinksGenerator.getLink('test', null);
        expect(links).toBe('');
    })
})