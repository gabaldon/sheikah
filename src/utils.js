import cbor from 'cbor'
import uuidv4 from 'uuid/v4'

export function encodeDataRequest(radRequest) {
  console.log("-encodeDataRequest->", radRequest)
  // return {
  //   time_lock: radRequest.timelock || 0,
  //   retrieve: radRequest.retrieve.map(retrieve => {
  //     return { ...retrieve, script: [...cbor.encode(retrieve.script)] }
  //   }),
  //   aggregate: encodeAggregationTally(radRequest.aggregate),
  //   tally: encodeAggregationTally(radRequest.tally),
  // }
  return {
    "time_lock": 1574703683,
    "retrieve": [
      {
        "kind": "HTTP-GET",
        "url": "https://www.bitstamp.net/api/ticker/",
        "script": [
          130,
          24,
          119,
          130,
          24,
          100,
          100,
          108,
          97,
          115,
          116
        ]
      },
      {
        "kind": "HTTP-GET",
        "url": "https://api.coindesk.com/v1/bpi/currentprice.json",
        "script": [
          132,
          24,
          119,
          130,
          24,
          102,
          99,
          98,
          112,
          105,
          130,
          24,
          102,
          99,
          85,
          83,
          68,
          130,
          24,
          100,
          106,
          114,
          97,
          116,
          101,
          95,
          102,
          108,
          111,
          97,
          116
        ]
      }
    ],
    "aggregate": {
      "filters": [],
      "reducer": 3
    },
    "tally": {
      "filters": [],
      "reducer": 3
    }
  }
}

export function match(value, options, result) {
  const search = options.find(x => x.options.includes(value))
  return search ? search.result : null
}

export function changeDateFormat(string) {
  let date = new Date(string)
  let month = '' + (date.getMonth() + 1)
  let day = '' + date.getDate()
  let year = date.getFullYear()

  if (month.length < 2) {
    month = '0' + month
  }
  if (day.length < 2) {
    day = '0' + day
  }
  return `${day}-${month}-${year}`
}

export async function openInExternalApp(url) {
  if (process.env.IS_ELECTRON) {
    import('electron')
      .then(electron => {
        electron.shell.openExternal(url)
      })
      .catch(error => {
        throw Error(error)
      })
  } else {
    window.location.href = url
  }
}

export function generateId(random) {
  return random ? uuidv4(random) : uuidv4()
}

// check if contains the same elements
export function areSoftEqualArrays(arr1, arr2) {
  return (
    arr1.length === arr2.length &&
    arr1.reduce((acc, item) => (acc ? arr2.includes(item) : false), true) &&
    arr2.reduce((acc, item) => (acc ? arr1.includes(item) : false), true)
  )
}

export function formatSectionApiErrorsByRoute(routeName, errorsMap, apiErrors) {
  const errorMessages = {
    getTransactionsError: 'An error occurred retrieving your transactions',
    createVTTError: 'An error occurred creating a Value Transfer Transaction',
    tryDataRequestError: 'An error occurred trying your data request',
    deployDataRequestError: 'An error occurred deploying a data request',
  }
  return Object.entries(errorsMap)
    .filter(entry => entry[0] === routeName)
    .filter(entry => entry[1].find(errorName => !!apiErrors[errorName]))
    .map(entry => [...entry[1]])
    .reduce((acc, errorNames) => [...acc, ...errorNames], [])
    .map(errorName => ({
      name: errorName,
      message: errorMessages[errorName],
      description: `
      ${apiErrors[errorName].message}.
      ${JSON.stringify(apiErrors[errorName].data)}
      `,
    }))
}

export function copyToClipboard(id) {
  let textToCopy = document.getElementById(id)
  let currentRange
  if (document.getSelection().rangeCount > 0) {
    currentRange = document.getSelection().getRangeAt(0)
    window.getSelection().removeRange(currentRange)
  } else {
    currentRange = false
  }
  let CopyRange = document.createRange()
  CopyRange.selectNode(textToCopy)
  window.getSelection().addRange(CopyRange)
  document.execCommand('copy')
  window.getSelection().removeRange(CopyRange)
  if (currentRange) {
    window.getSelection().addRange(currentRange)
  }
}
