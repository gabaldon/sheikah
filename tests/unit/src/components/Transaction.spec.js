import Transaction from '@/components/Transaction.vue'
import '@/fontAwesome'

describe('Renders the correct elements when click is not triggered', () => {
  const wrapper = shallowMount(Transaction, {
    propsData: {
      amount: '123',
      block: '511482fc9161cd17545561449c0d7aae19c9986e4119db355bb9637c7804003f',
      border: true,
      date: 'JAN 19, 1970 @ 10:00:31',
      timeAgo: '33 minutes ago',
      timelocked: false,
      epoch: '5432',
      fee: '12',
      id: '600338d94f4ef28281fbe37d5c82cf721d677f88f256be12cfae6498ed972109',
      outputs: [
        {
          value: '123',
          address: 'twit1vclrvjt7jf4jk8phyvxukctwsh0l0f8v9r8ffq',
        },
        {
          value: 499999999865,
          address: 'twit1syp754tutlpnqf4a492dssrv3lqtwqxjp4nq44',
        },
      ],
      inputs: [
        {
          value: 500000000000,
          address: 'twit1syp754tutlpnqf4a492dssrv3lqtwqxjp4nq44',
        },
      ],
      type: 'POSITIVE',
      state: 'IN PROGRESS',
      transactionType: 'value_transfer',
      reveals: [],
      currency: 'nanoWits',
    },
  })

  wrapper.setData({
    showDetails: false,
  })

  it('finds negative or positive icon', () => {
    expect(wrapper.find('[data-test="negative-positive"]').exists()).toBe(true)
  })

  it('finds the origin element', () => {
    expect(wrapper.find('[data-test="origin"]').text()).toEqual('From')
  })

  it('finds the address element', () => {
    expect(wrapper.find('[data-test="address"]').exists()).toBe(true)
  })

  it('does not find the data request element when the transaction type is value_transfer', () => {
    expect(wrapper.find('[data-test="transaction-type"]').exists()).toBe(false)
  })

  it('finds the time-ago element', () => {
    expect(wrapper.find('[data-test="time-ago"]').text()).toEqual(
      '33 minutes ago',
    )
  })

  it('does not find the transaction details element when the click is not triggered', () => {
    expect(wrapper.find('[data-test="transaction-details"]').exists()).toBe(
      false,
    )
  })

  it('does not find the inputs and outputs element when the click is not triggered', () => {
    expect(wrapper.find('[data-test="inputs-outputs"]').exists()).toBe(false)
  })
})

describe('data request', () => {
  describe('Renders the correct elements when click is triggered', () => {
    const wrapper = shallowMount(Transaction, {
      propsData: {
        amount: '123',
        timelocked: false,
        epoch: '5432',
        block:
          '511482fc9161cd17545561449c0d7aae19c9986e4119db355bb9637c7804003f',
        border: true,
        date: 'JAN 19, 1970 @ 10:00:31',
        timeAgo: '33 minutes ago',
        fee: '12',
        id: '600338d94f4ef28281fbe37d5c82cf721d677f88f256be12cfae6498ed972109',
        outputs: [
          {
            value: '123',
            address: 'twit1vclrvjt7jf4jk8phyvxukctwsh0l0f8v9r8ffq',
          },
          {
            value: 499999999865,
            address: 'twit1syp754tutlpnqf4a492dssrv3lqtwqxjp4nq44',
          },
        ],
        inputs: [
          {
            value: 500000000000,
            address: 'twit1syp754tutlpnqf4a492dssrv3lqtwqxjp4nq44',
          },
        ],
        type: 'POSITIVE',
        state: 'IN PROGRESS',
        transactionType: 'data_request',
        reveals: [],
        currency: 'nanoWits',
      },
    })

    wrapper.setData({
      showDetails: true,
    })

    it('finds negative or positive icon', () => {
      expect(wrapper.find('[data-test="negative-positive"]').exists()).toBe(
        true,
      )
    })

    it('does not find the data request element when the origin element when type is data_request', () => {
      expect(wrapper.find('[data-test="origin"]').exists()).toBe(false)
    })

    it('does not find the data request element when the address element when type is data_request', () => {
      expect(wrapper.find('[data-test="address"]').exists()).toBe(false)
    })

    it('finds the type element', () => {
      expect(wrapper.find('[data-test="transaction-type"]').text()).toEqual(
        'Data request',
      )
    })

    it('finds the time-ago element', () => {
      expect(wrapper.find('[data-test="time-ago"]').text()).toEqual(
        '33 minutes ago',
      )
    })
  })
})

describe('mint', () => {
  describe('Renders the correct elements when click is triggered', () => {
    const wrapper = shallowMount(Transaction, {
      propsData: {
        amount: '123',
        timelocked: false,
        epoch: '5432',
        block:
          '511482fc9161cd17545561449c0d7aae19c9986e4119db355bb9637c7804003f',
        border: true,
        date: 'JAN 19, 1970 @ 10:00:31',
        timeAgo: '33 minutes ago',
        fee: '12',
        id: '600338d94f4ef28281fbe37d5c82cf721d677f88f256be12cfae6498ed972109',
        outputs: [
          {
            value: '123',
            address: 'twit1vclrvjt7jf4jk8phyvxukctwsh0l0f8v9r8ffq',
          },
          {
            value: 499999999865,
            address: 'twit1syp754tutlpnqf4a492dssrv3lqtwqxjp4nq44',
          },
        ],
        inputs: null,
        type: 'POSITIVE',
        state: 'IN PROGRESS',
        transactionType: 'mint',
        reveals: [],
        currency: 'nanoWits',
      },
    })

    wrapper.setData({
      showDetails: true,
    })

    it('should finds negative or positive icon', () => {
      expect(wrapper.find('[data-test="negative-positive"]').exists()).toBe(
        true,
      )
    })

    it('should not find the origin element', () => {
      expect(wrapper.find('[data-test="origin"]').exists()).toBe(false)
    })

    it('should find time-ago element', () => {
      expect(wrapper.find('[data-test="time-ago"]').text()).toEqual(
        '33 minutes ago',
      )
    })
  })
})
