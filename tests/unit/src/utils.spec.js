import {
  areSoftEqualArrays,
  deleteKey,
  getDomainFromUrl,
  standardizeWitUnits,
  standardizeTransactionResult,
  calculateCurrentFocusAfterUndo,
  calculateCurrentFocusAfterRedo,
  simplifyDrResult,
  encodeAggregationTally,
} from '@/utils'
import { WIT_UNIT } from '@/constants'
import { Radon } from 'witnet-radon-js'

describe('areSoftEqualArrays', () => {
  it('check if two sorted arrays contains the same items', () => {
    const arr1 = [1, 2, 3, 4, 5]
    const arr2 = [1, 2, 3, 4, 5]
    expect(areSoftEqualArrays(arr1, arr2)).toBe(true)
  })

  it('check if two unsorted arrays contains the same items', () => {
    const arr1 = [1, 3, 5, 4, 2]
    const arr2 = [5, 2, 3, 4, 1]
    expect(areSoftEqualArrays(arr1, arr2)).toBe(true)
  })

  it('check if two different arrays contains the same items', () => {
    const arr1 = [1, 2, 3, 4, 5]
    const arr2 = [1, 2, 3, 4, 6]
    expect(areSoftEqualArrays(arr1, arr2)).toBe(false)
  })

  it('check if two different arrays with repeated items contains the same items', () => {
    const arr1 = [1, 3, 5, 4, 5]
    const arr2 = [5, 2, 3, 4, 1]
    expect(areSoftEqualArrays(arr1, arr2)).toBe(false)
  })

  it('check if two different sized arrays contains the same items', () => {
    const arr1 = [1, 3, 5, 4]
    const arr2 = [5, 2, 3, 4, 1]
    expect(areSoftEqualArrays(arr1, arr2)).toBe(false)
  })
})

describe('order alphabetically and by amount', () => {
  it('should order alphabetically and by amount', () => {
    const list = {
      '0c6758e7c1ecc802fd33100c57b4db11b5c9c30f39369510390f453fe2291509:0': {
        amount: '10000000000',
        pkh: 'a',
        time_lock: '0',
      },
      '2168c06914c62ee3c8a60eb10981f8643718df57463baa576628b0e3e26f7e2b:0': {
        amount: '10000000000',
        pkh: 'c',
        time_lock: '0',
      },
      '2ced242a524500f0aca80c2140774d1540150d2ab96b29807c41ebc6aee72168:0': {
        amount: '9999999990',
        pkh: 'b',
        time_lock: '0',
      },
      '60fa24e6daa2a9cd536a9de362d0418ecce9bd29f211df99640440cde3def171:0': {
        amount: '6',
        pkh: 'f',
        time_lock: '0',
      },
      '7d03629698ea52da762297d301217bf0f88a627586d14e1fce81bad21a543beb:0': {
        amount: '5',
        pkh: 'f',
        time_lock: '0',
      },
      'd06113e2a779c09a78fdfb93c9c933d044faceff0c3849442da1931a8093922d:0': {
        amount: '1',
        pkh: 'e',
        time_lock: '0',
      },
      'd06113e2a779c09a78fdfb93c9c933d044faceff0c3849442da1931a8093922d:1': {
        amount: '0',
        pkh: 'e',
        time_lock: '0',
      },
    }
    const expected = [
      [
        '0c6758e7c1ecc802fd33100c57b4db11b5c9c30f39369510390f453fe2291509:0',
        { amount: '10000000000', pkh: 'a', time_lock: '0' },
      ],
      [
        '2ced242a524500f0aca80c2140774d1540150d2ab96b29807c41ebc6aee72168:0',
        { amount: '9999999990', pkh: 'b', time_lock: '0' },
      ],
      [
        '2168c06914c62ee3c8a60eb10981f8643718df57463baa576628b0e3e26f7e2b:0',
        { amount: '10000000000', pkh: 'c', time_lock: '0' },
      ],
      [
        'd06113e2a779c09a78fdfb93c9c933d044faceff0c3849442da1931a8093922d:1',
        { amount: '0', pkh: 'e', time_lock: '0' },
      ],
      [
        'd06113e2a779c09a78fdfb93c9c933d044faceff0c3849442da1931a8093922d:0',
        { amount: '1', pkh: 'e', time_lock: '0' },
      ],
      [
        '7d03629698ea52da762297d301217bf0f88a627586d14e1fce81bad21a543beb:0',
        { amount: '5', pkh: 'f', time_lock: '0' },
      ],
      [
        '60fa24e6daa2a9cd536a9de362d0418ecce9bd29f211df99640440cde3def171:0',
        { amount: '6', pkh: 'f', time_lock: '0' },
      ],
    ]
    const result = Object.entries(list).sort(
      (a1, a2) =>
        a1[1].pkh.localeCompare(a2[1].pkh) || a1[1].amount - a2[1].amount,
    )
    expect(result).toStrictEqual(expected)
  })
})

describe('standardizeTransactionResult', () => {
  it('should end with "ago" copy', () => {
    const result =
      'RadonTypes::RadonString("0000000000000000000a55ab43b096575bf281f35d68807c52a0202582c15947")'
    const expected =
      'RadonString("0000000000000000000a55ab43b096575bf281f35d68807c52a0202582c15947")'

    expect(standardizeTransactionResult(result)).toBe(expected)
  })
})

describe('getDomainFromUrl', () => {
  it('should work url with protocol', () => {
    const url = 'http://witnet.io'

    expect(getDomainFromUrl(url)).toBe('witnet.io')
  })

  it('should work without protocol', () => {
    const url = 'witnet.io'

    expect(getDomainFromUrl(url)).toBe('witnet.io')
  })

  it('should work with subdomain', () => {
    const url = 'http://docs.witnet.io'

    expect(getDomainFromUrl(url)).toBe('docs.witnet.io')
  })

  it('should NOT work without tld', () => {
    const url = 'http://witnet'

    expect(getDomainFromUrl(url)).toBe('')
  })

  it('should NOT work with invalid tld', () => {
    const url = 'http://witnet.abcdefghij'

    expect(getDomainFromUrl(url)).toBe('')
  })
})

describe('simplifyDrResult', () => {
  it('with object', () => {
    const drResult = {
      RadonMap: {
        AUD: {
          RadonMap: {
            '15m': {
              RadonFloat: 16135.65,
            },
            buy: {
              RadonFloat: 16135.65,
            },
            last: {
              RadonFloat: 16135.65,
            },
            sell: {
              RadonFloat: 16135.65,
            },
            symbol: {
              RadonString: '$',
            },
          },
        },
      },
    }

    const drResultSimplified = {
      AUD: {
        '15m': 'Float(16135.65)',
        buy: 'Float(16135.65)',
        last: 'Float(16135.65)',
        sell: 'Float(16135.65)',
        symbol: 'String($)',
      },
    }

    expect(drResultSimplified).toStrictEqual(simplifyDrResult(drResult))
  })

  it('with array', () => {
    const drResult = [
      {
        RadonMap: {
          AUD: {
            RadonMap: {
              '15m': {
                RadonFloat: 16135.65,
              },
              buy: {
                RadonFloat: 16135.65,
              },
              last: {
                RadonFloat: 16135.65,
              },
              sell: {
                RadonFloat: 16135.65,
              },
              symbol: {
                RadonString: '$',
              },
            },
          },
        },
      },
      {
        RadonMap: {
          AUD: {
            RadonMap: {
              '15m': {
                RadonFloat: 16135.65,
              },
              buy: {
                RadonFloat: 16135.65,
              },
              last: {
                RadonFloat: 16135.65,
              },
              sell: {
                RadonFloat: 16135.65,
              },
              symbol: {
                RadonString: '$',
              },
            },
          },
        },
      },
    ]

    const drResultSimplified = [
      {
        AUD: {
          '15m': 'Float(16135.65)',
          buy: 'Float(16135.65)',
          last: 'Float(16135.65)',
          sell: 'Float(16135.65)',
          symbol: 'String($)',
        },
      },
      {
        AUD: {
          '15m': 'Float(16135.65)',
          buy: 'Float(16135.65)',
          last: 'Float(16135.65)',
          sell: 'Float(16135.65)',
          symbol: 'String($)',
        },
      },
    ]

    expect(drResultSimplified).toStrictEqual(simplifyDrResult(drResult))
  })
})

describe('standardizeWitUnits', () => {
  describe('return the value in selected unit', () => {
    describe('wit', () => {
      describe('to wit', () => {
        it('with decimal', () => {
          const expected = '0.00004'

          const result = standardizeWitUnits(
            '0.00004',
            WIT_UNIT.WIT,
            WIT_UNIT.WIT,
          )

          expect(result).toBe(expected)
        })

        it('without decimal', () => {
          const expected = '1.00'

          const result = standardizeWitUnits('1', WIT_UNIT.WIT, WIT_UNIT.WIT)

          expect(result).toBe(expected)
        })
      })

      describe('to microWit', () => {
        it('with decimal', () => {
          const expected = '400000.00'

          const result = standardizeWitUnits(
            '0.4',
            WIT_UNIT.MICRO,
            WIT_UNIT.WIT,
          )

          expect(result).toBe(expected)
        })

        it('without decimal', () => {
          const expected = '400000.00'

          const result = standardizeWitUnits(
            '0.4',
            WIT_UNIT.MICRO,
            WIT_UNIT.WIT,
          )

          expect(result).toBe(expected)
        })
      })

      describe('to nanoWit', () => {
        it('with decimal', () => {
          const expected = '100000000'

          const result = standardizeWitUnits('0.1', WIT_UNIT.NANO, WIT_UNIT.WIT)

          expect(result).toBe(expected)
        })

        it('without decimal', () => {
          const expected = '1000000000'

          const result = standardizeWitUnits('1', WIT_UNIT.NANO, WIT_UNIT.WIT)

          expect(result).toBe(expected)
        })
      })
    })

    describe('microWit', () => {
      describe('to wit', () => {
        it('with decimal', () => {
          const expected = '0.0000011'

          const result = standardizeWitUnits(
            '1.1',
            WIT_UNIT.WIT,
            WIT_UNIT.MICRO,
          )

          expect(result).toBe(expected)
        })

        it('without decimal', () => {
          const expected = '1.00'

          const result = standardizeWitUnits(
            '1000000',
            WIT_UNIT.WIT,
            WIT_UNIT.MICRO,
          )

          expect(result).toBe(expected)
        })
      })

      describe('to microWit', () => {
        it('with decimal', () => {
          const expected = '0.1'

          const result = standardizeWitUnits(
            '0.1',
            WIT_UNIT.MICRO,
            WIT_UNIT.MICRO,
            5,
          )

          expect(result).toBe(expected)
        })

        it('without decimal', () => {
          const expected = '1.00'

          const result = standardizeWitUnits(
            '1',
            WIT_UNIT.MICRO,
            WIT_UNIT.MICRO,
          )

          expect(result).toBe(expected)
        })
      })

      describe('to nanoWit', () => {
        it('with decimal', () => {
          const expected = '100'

          const result = standardizeWitUnits(
            '0.1',
            WIT_UNIT.NANO,
            WIT_UNIT.MICRO,
          )

          expect(result).toBe(expected)
        })

        it('without decimal', () => {
          const expected = '1000'

          const result = standardizeWitUnits('1', WIT_UNIT.NANO, WIT_UNIT.MICRO)

          expect(result).toBe(expected)
        })
      })
    })

    describe('nanoWit', () => {
      describe('to wit', () => {
        it('without decimal', () => {
          const expected = '0.000000001'

          const result = standardizeWitUnits('1', WIT_UNIT.WIT, WIT_UNIT.NANO)

          expect(result).toBe(expected)
        })
      })

      describe('to microWit', () => {
        it('with decimal', () => {
          const expected = '0.0001'

          const result = standardizeWitUnits(
            '0.1',
            WIT_UNIT.MICRO,
            WIT_UNIT.NANO,
          )

          expect(result).toBe(expected)
        })

        it('without decimal', () => {
          const expected = '0.001'

          const result = standardizeWitUnits('1', WIT_UNIT.MICRO, WIT_UNIT.NANO)

          expect(result).toBe(expected)
        })
      })

      it('to nanoWit', () => {
        const expected = '1'

        const result = standardizeWitUnits('1', WIT_UNIT.NANO, WIT_UNIT.NANO)

        expect(result).toBe(expected)
      })
    })
  })
})

describe('deleteKey', () => {
  it('delete if the key is found', () => {
    const result = deleteKey({ a: 'a', b: 'b', c: 'c' }, 'b')
    const expected = { a: 'a', c: 'c' }

    expect(result).toStrictEqual(expected)
  })

  it('should not change if key is not found', () => {
    const entry = { a: 'a', b: 'b', c: 'c' }
    const result = deleteKey(entry, 'd')
    const expected = { a: 'a', b: 'b', c: 'c' }

    expect(result).toStrictEqual(expected)
  })

  it('should not mutate the object', () => {
    const entry = { a: 'a', b: 'b', c: 'c' }

    deleteKey(entry, 'b')

    expect(entry).toStrictEqual({ a: 'a', b: 'b', c: 'c' })
  })
})

describe('calculateCurrentFocusAfterUndo', () => {
  describe('should work for all HISTORY_UPDATE_TYPEs', () => {
    describe('DELETE_OPERATOR', () => {
      it('on retrieve stage', () => {
        const historyCheckpoint = {
          type: 'DELETE_OPERATOR',
          scriptId: 2,
          operatorid: 3,
        }

        const mir = {
          timelock: 0,
          retrieve: [
            { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [] },
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [114],
            },
          ],
          aggregate: { filters: [], reducer: 2 },
          tally: { filters: [], reducer: 2 },
        }
        const markup = new Radon(mir).getMarkup()
        const variables = {}
        const id = calculateCurrentFocusAfterUndo(
          historyCheckpoint,
          markup,
          variables,
        )

        expect(id).toBe('void')
      })

      it('on aggragation or tally stage', () => {
        const historyCheckpoint = {
          rad: {
            timelock: 0,
            retrieve: [
              {
                kind: 'HTTP-GET',
                url: '',
                contentType: 'JSON API',
                script: [],
              },
            ],
            aggregate: {
              filters: [
                [5, 1],
                [5, 1],
              ],
              reducer: 2,
            },
            tally: { filters: [], reducer: 2 },
          },
          stage: 'aggregations',
          type: 'PUSH_OPERATOR',
          scriptId: 3,
        }

        const mir = {
          timelock: 0,
          retrieve: [
            { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [] },
          ],
          aggregate: {
            filters: [
              [5, 1],
              [5, 1],
            ],
            reducer: 2,
          },
          tally: { filters: [], reducer: 2 },
        }
        const markup = new Radon(mir).getMarkup()
        const variables = {}
        const id = calculateCurrentFocusAfterUndo(
          historyCheckpoint,
          markup,
          variables,
        )

        expect(id).toBe(6)
      })
    })
    describe('PUSH_OPERATOR', () => {
      it('on retrieve stage', () => {
        const historyCheckpoint = {
          rad: {
            timelock: 0,
            retrieve: [
              {
                kind: 'HTTP-GET',
                url: '',
                contentType: 'JSON API',
                script: [],
              },
            ],
            aggregate: { filters: [], reducer: 2 },
            tally: { filters: [], reducer: 2 },
          },
          stage: 'settings',
        }
        const mir = {
          timelock: 0,
          retrieve: [
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [112],
            },
          ],
          aggregate: { filters: [], reducer: 2 },
          tally: { filters: [], reducer: 2 },
        }
        const markup = new Radon(mir).getMarkup()
        const variables = {}
        const id = calculateCurrentFocusAfterUndo(
          historyCheckpoint,
          markup,
          variables,
        )

        expect(id).toBe(undefined)
      })
    })

    it('DELETE_SOURCE', () => {
      const historyCheckpoint = {
        rad: {
          timelock: 0,
          retrieve: [
            { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [] },
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [114],
            },
          ],
          aggregate: { filters: [], reducer: 2 },
          tally: { filters: [], reducer: 2 },
        },
        stage: 'sources',
        type: 'ADD_SOURCE',
      }
      const mir = {
        timelock: 0,
        retrieve: [
          { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [] },
        ],
        aggregate: { filters: [], reducer: 2 },
        tally: { filters: [], reducer: 2 },
      }

      const markup = new Radon(mir).getMarkup()
      const variables = {}
      const id = calculateCurrentFocusAfterUndo(
        historyCheckpoint,
        markup,
        variables,
      )

      expect(id).toBe(0)
    })

    it('ADD_SOURCE', () => {
      const historyCheckpoint = {
        rad: {
          timelock: 0,
          retrieve: [
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [112],
            },
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [114],
            },
          ],
          aggregate: { filters: [], reducer: 2 },
          tally: { filters: [], reducer: 2 },
        },
        stage: 'sources',
        type: 'ADD_SOURCE',
      }
      const mir = {
        timelock: 0,
        retrieve: [
          { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [112] },
          { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [114] },
        ],
        aggregate: { filters: [], reducer: 2 },
        tally: { filters: [], reducer: 2 },
      }
      const markup = new Radon(mir).getMarkup()
      const variables = {}
      const id = calculateCurrentFocusAfterUndo(
        historyCheckpoint,
        markup,
        variables,
      )

      expect(id).toBe(1)
    })

    it('UPDATE_TEMPLATE', () => {
      const historyCheckpoint = {
        rad: {
          timelock: 0,
          retrieve: [
            {
              kind: 'HTTP-GET',
              url: 'asd',
              contentType: 'JSON API',
              script: [112, 32],
            },
            {
              kind: 'HTTP-GET',
              url: 'asd',
              contentType: 'JSON API',
              script: [114],
            },
          ],
          aggregate: { filters: [], reducer: 2 },
          tally: { filters: [], reducer: 2 },
        },
        stage: 'scripts',
        type: 'PUSH_OPERATOR',
        scriptId: 2,
      }
      const mir = {
        timelock: 0,
        retrieve: [
          {
            kind: 'HTTP-GET',
            url: 'asd',
            contentType: 'JSON API',
            script: [112, 34],
          },
          {
            kind: 'HTTP-GET',
            url: 'asd',
            contentType: 'JSON API',
            script: [114],
          },
        ],
        aggregate: { filters: [], reducer: 2 },
        tally: { filters: [], reducer: 2 },
      }

      const markup = new Radon(mir).getMarkup()
      const variables = {}
      const id = calculateCurrentFocusAfterUndo(
        historyCheckpoint,
        markup,
        variables,
      )

      expect(id).toBe(4)
    })

    it('UPDATE_SOURCE', () => {
      const historyCheckpoint = {
        rad: {
          timelock: 0,
          retrieve: [
            {
              kind: 'HTTP-GET',
              url: 'asd',
              contentType: 'JSON API',
              script: [],
            },
            {
              kind: 'HTTP-GET',
              url: 'asd',
              contentType: 'JSON API',
              script: [114],
            },
          ],
          aggregate: { filters: [], reducer: 2 },
          tally: { filters: [], reducer: 2 },
        },
        stage: 'sources',
        type: 'UPDATE_SOURCE',
        index: 0,
        source: { protocol: 'HTTP-GET', url: 'asd' },
      }
      const mir = {
        timelock: 0,
        retrieve: [
          { kind: 'HTTP-GET', url: 'asd', contentType: 'JSON API', script: [] },
          {
            kind: 'HTTP-GET',
            url: 'asd',
            contentType: 'JSON API',
            script: [114],
          },
        ],
        aggregate: { filters: [], reducer: 2 },
        tally: { filters: [], reducer: 2 },
      }

      const markup = new Radon(mir).getMarkup()
      const variables = {}
      const id = calculateCurrentFocusAfterUndo(
        historyCheckpoint,
        markup,
        variables,
      )

      expect(id).toBe(0)
    })
    // it('UPDATE_VARIABLE', () => {})
    // it('ADD_VARIABLE', () => {})
    // it('DELETE_VARIABLE', () => {})
  })
})

describe('calculateCurrentFocusAfterRedo', () => {
  describe('should work for all HISTORY_UPDATE_TYPEs', () => {
    describe('DELETE_OPERATOR', () => {
      it('on retrieve stage', () => {
        const historyCheckpoint = {
          rad: {
            timelock: 0,
            retrieve: [
              {
                kind: 'HTTP-GET',
                url: '',
                contentType: 'JSON API',
                script: [112],
              },
            ],
            aggregate: { filters: [], reducer: 2 },
            tally: { filters: [], reducer: 2 },
          },
          stage: 'scripts',
          type: 'PUSH_OPERATOR',
          scriptId: 2,
        }
        const mir = {
          timelock: 0,
          retrieve: [
            { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [] },
          ],
          aggregate: { filters: [], reducer: 2 },
          tally: { filters: [], reducer: 2 },
        }

        const markup = new Radon(mir).getMarkup()
        const variables = {}
        const id = calculateCurrentFocusAfterRedo(
          historyCheckpoint,
          markup,
          variables,
        )

        expect(id).toBe('void')
      })

      it('on aggragation or tally stage', () => {
        const historyCheckpoint = {
          rad: {
            timelock: 0,
            retrieve: [
              {
                kind: 'HTTP-GET',
                url: '',
                contentType: 'JSON API',
                script: [],
              },
            ],
            aggregate: { filters: [], reducer: 2 },
            tally: { filters: [], reducer: 2 },
          },
          stage: 'aggregations',
          type: 'DELETE_OPERATOR',
          scriptId: 3,
          operatorId: 7,
        }
        const mir = {
          timelock: 0,
          retrieve: [
            { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [] },
          ],
          aggregate: { filters: [[5, 1]], reducer: 2 },
          tally: { filters: [], reducer: 2 },
        }

        const markup = new Radon(mir).getMarkup()
        const variables = {}
        const id = calculateCurrentFocusAfterUndo(
          historyCheckpoint,
          markup,
          variables,
        )

        expect(id).toBe(4)
      })
    })

    describe('PUSH_OPERATOR', () => {
      it('on retrieve stage', () => {
        const historyCheckpoint = {
          rad: {
            timelock: 0,
            retrieve: [
              {
                kind: 'HTTP-GET',
                url: '',
                contentType: 'JSON API',
                script: [112, 34, 16, 64],
              },
            ],
            aggregate: { filters: [], reducer: 2 },
            tally: { filters: [], reducer: 2 },
          },
          stage: 'scripts',
          type: 'PUSH_OPERATOR',
          scriptId: 2,
        }
        const mir = {
          timelock: 0,
          retrieve: [
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [112, 34, 16],
            },
          ],
          aggregate: { filters: [], reducer: 2 },
          tally: { filters: [], reducer: 2 },
        }
        const markup = new Radon(mir).getMarkup()
        const variables = {}
        const id = calculateCurrentFocusAfterUndo(
          historyCheckpoint,
          markup,
          variables,
        )

        expect(id).toBe(5)
      })

      it('on aggregation tally stage', () => {
        const historyCheckpoint = {
          rad: {
            timelock: 0,
            retrieve: [
              {
                kind: 'HTTP-GET',
                url: '',
                contentType: 'JSON API',
                script: [112, 34, 16, 64],
              },
            ],
            aggregate: {
              filters: [
                [5, 1],
                [5, 1],
                [5, 1],
              ],
              reducer: 2,
            },
            tally: { filters: [], reducer: 2 },
          },
          stage: 'aggregations',
          type: 'PUSH_OPERATOR',
          scriptId: 9,
        }
        const mir = {
          timelock: 0,
          retrieve: [
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [112, 34, 16, 64],
            },
          ],
          aggregate: {
            filters: [
              [5, 1],
              [5, 1],
            ],
            reducer: 2,
          },
          tally: { filters: [], reducer: 2 },
        }

        const markup = new Radon(mir).getMarkup()
        const variables = {}
        const id = calculateCurrentFocusAfterUndo(
          historyCheckpoint,
          markup,
          variables,
        )

        expect(id).toBe(10)
      })
    })

    it('DELETE_SOURCE', () => {
      const historyCheckpoint = {
        rad: {
          timelock: 0,
          retrieve: [
            { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [] },
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [114],
            },
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [114],
            },
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [114],
            },
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [114],
            },
          ],
          aggregate: { filters: [], reducer: 2 },
          tally: { filters: [], reducer: 2 },
        },
        stage: 'sources',
        type: 'DELETE_SOURCE',
        index: 5,
      }
      const mir = {
        timelock: 0,
        retrieve: [
          { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [] },
          { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [114] },
          { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [114] },
          { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [114] },
          { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [114] },
          { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [114] },
        ],
        aggregate: { filters: [], reducer: 2 },
        tally: { filters: [], reducer: 2 },
      }

      const markup = new Radon(mir).getMarkup()
      const variables = {}
      const id = calculateCurrentFocusAfterUndo(
        historyCheckpoint,
        markup,
        variables,
      )

      expect(id).toBe(5)
    })

    it('ADD_SOURCE', () => {
      const historyCheckpoint = {
        rad: {
          timelock: 0,
          retrieve: [
            { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [] },
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [114],
            },
          ],
          aggregate: { filters: [], reducer: 2 },
          tally: { filters: [], reducer: 2 },
        },
        stage: 'sources',
        type: 'ADD_SOURCE',
      }
      const mir = {
        timelock: 0,
        retrieve: [
          { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [] },
        ],
        aggregate: { filters: [], reducer: 2 },
        tally: { filters: [], reducer: 2 },
      }
      const markup = new Radon(mir).getMarkup()

      const variables = {}
      const id = calculateCurrentFocusAfterUndo(
        historyCheckpoint,
        markup,
        variables,
      )

      expect(id).toBe(0)
    })

    it('UPDATE_TEMPLATE', () => {
      const historyCheckpoint = {
        rad: {
          timelock: 0,
          retrieve: [
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [112, 34],
            },
            {
              kind: 'HTTP-GET',
              url: '',
              contentType: 'JSON API',
              script: [114],
            },
          ],
          aggregate: { filters: [], reducer: 2 },
          tally: { filters: [], reducer: 2 },
        },
        stage: 'scripts',
        type: 'UPDATE_TEMPLATE',
        id: 11,
        value: 'BooleanNegate',
      }

      const mir = {
        timelock: 0,
        retrieve: [
          {
            kind: 'HTTP-GET',
            url: '',
            contentType: 'JSON API',
            script: [112, 34],
          },
          { kind: 'HTTP-GET', url: '', contentType: 'JSON API', script: [114] },
        ],
        aggregate: { filters: [], reducer: 2 },
        tally: { filters: [], reducer: 2 },
      }

      const markup = new Radon(mir).getMarkup()
      const variables = {}
      const id = calculateCurrentFocusAfterUndo(
        historyCheckpoint,
        markup,
        variables,
      )

      expect(id).toBe(11)
    })

    it('UPDATE_SOURCE', () => {
      const historyCheckpoint = {
        rad: {
          timelock: 0,
          retrieve: [
            {
              kind: 'HTTP-GET',
              url: 'aaaaaaa',
              contentType: 'JSON API',
              script: [],
            },
          ],
          aggregate: { filters: [], reducer: 2 },
          tally: { filters: [], reducer: 2 },
        },
        stage: 'sources',
        type: 'UPDATE_SOURCE',
        index: 0,
        source: { protocol: 'HTTP-GET', url: 'aaaaaaa' },
      }
      const mir = {
        timelock: 0,
        retrieve: [
          {
            kind: 'HTTP-GET',
            url: 'aaaaaa',
            contentType: 'JSON API',
            script: [],
          },
        ],
        aggregate: { filters: [], reducer: 2 },
        tally: { filters: [], reducer: 2 },
      }

      const markup = new Radon(mir).getMarkup()
      const variables = {}
      const id = calculateCurrentFocusAfterUndo(
        historyCheckpoint,
        markup,
        variables,
      )

      expect(id).toBe(0)
    })

    // it('UPDATE_VARIABLE', () => {})
    // it('ADD_VARIABLE', () => {})
    // it('DELETE_VARIABLE', () => {})
  })
})

describe('encodeAggregationTally', () => {
  it('without filter argument', () => {
    const expected = {
      filters: [
        {
          args: [],
          op: 8,
        },
      ],
      reducer: 3,
    }

    const result = encodeAggregationTally({
      filters: [[8]],
      reducer: 3,
    })

    expect(result).toStrictEqual(expected)
  })

  it('with a single filter argument', () => {
    const expected = {
      filters: [
        {
          args: [251, 63, 185, 153, 153, 153, 153, 153, 154],
          op: 5,
        },
      ],
      reducer: 3,
    }

    const result = encodeAggregationTally({
      filters: [[5, '0.1']],
      reducer: 3,
    })

    expect(result).toStrictEqual(expected)
  })
})
