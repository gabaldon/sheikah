import { RadonMarkupInterpreter } from '@/radon'

describe('RadonMarkupInterpreter', () => {
  it.only('converts MIR to markup correctly', () => {
    const mir = {
      data_request: {
        not_before: 1669852800,
        retrieve: [
          {
            url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
            script: [117, 69, 116, [97, 'bpi'], 116, [97, 'USD'], 116, [97, 'rate_float'], 114],
          },
          {
            url: 'https://blockchain.info/ticker',
            script: [117, 69, 116, [97, 'USD'], 116, [97, '15m'], 114],
          },
          {
            url: 'https://www.bitstamp.net/api/ticker/',
            script: [117, 69, 116, [97, 'last'], 114],
          },
        ],
        aggregate: { script: [84, [83, 5, 2], [87, 3]] },
        tally: { script: [84, [83, 5, 1.5], [87, 3]] },
      },
    }

    const rmi = new RadonMarkupInterpreter(mir)
    const markup = require('./radonMarkup')
    expect(rmi.getMarkup()).toMatchObject(markup.dr)
  })
})
