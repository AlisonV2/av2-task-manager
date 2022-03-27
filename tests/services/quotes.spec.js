import QuoteService from '../../src/services/QuoteService';

describe('Quote service', () => {
    test('Function should exist', () => {
        expect(QuoteService.getRandomQuote()).toBeDefined();
    })

    test('Should return a quote', async () => {
        const { content, author } = await QuoteService.getRandomQuote();
        expect(content).toBeDefined();
        expect(author).toBeDefined();
    })
})