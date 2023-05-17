import SettingsOptionUnit from '@/components/SettingsOptionUnit.vue'

describe('SettingsOptionUnit.vue', () => {
  describe('change unit', () => {
    const changeDefaultUnitMock = jest.fn()

    it('should call the mutation to change the unit', async () => {
      const wrapper = mount(
        SettingsOptionUnit,
        createComponentMocks({
          router: true,
          store: {
            wallet: {
              state: {
                unit: 'nanoWit',
              },
              mutations: {
                changeDefaultUnit: changeDefaultUnitMock,
              },
            },
          },
        }),
      )
      wrapper.setData({
        options: [
          { primaryText: 'wit', value: 'wit' },
          { primaryText: 'milliWit', value: 'milliWit' },
          { primaryText: 'microWit', value: 'microWit' },
          { primaryText: 'nanoWit', value: 'nanoWit' },
        ],
      })
      const selectButton = wrapper.find('[data-test="select-btn"]')
      await selectButton.trigger('click')

      const option2Button = wrapper.find('[data-test="option-2"]')
      await option2Button.trigger('click')
      expect(changeDefaultUnitMock).toHaveBeenCalled()
    })

    it('the default unit should be microWit on change', async () => {
      const wrapper = mount(
        SettingsOptionUnit,
        createComponentMocks({
          router: true,
          store: {
            wallet: {
              state: {
                unit: 'nanoWit',
              },
              mutations: {
                changeDefaultUnit: changeDefaultUnitMock,
              },
            },
          },
        }),
      )
      wrapper.setData({
        options: [
          { primaryText: 'wit', value: 'wit' },
          { primaryText: 'milliWit', value: 'milliWit' },
          { primaryText: 'microWit', value: 'microWit' },
          { primaryText: 'nanoWit', value: 'nanoWit' },
        ],
      })
      const selectButton = wrapper.find('[data-test="select-btn"]')
      await selectButton.trigger('click')

      const option2Button = wrapper.find('[data-test="option-2"]')
      await option2Button.trigger('click')
      expect(wrapper.find('[data-test="selected-option-primary"]').text()).toBe(
        'microWit',
      )
    })

    it('the default unit should be nanoWit on change', async () => {
      const wrapper = mount(
        SettingsOptionUnit,
        createComponentMocks({
          router: true,
          store: {
            wallet: {
              state: {
                unit: 'nanoWit',
              },
              mutations: {
                changeDefaultUnit: changeDefaultUnitMock,
              },
            },
          },
        }),
      )
      wrapper.setData({
        options: [
          { primaryText: 'wit', value: 'wit' },
          { primaryText: 'milliWit', value: 'milliWit' },
          { primaryText: 'microWit', value: 'microWit' },
          { primaryText: 'nanoWit', value: 'nanoWit' },
        ],
      })
      const selectButton = wrapper.find('[data-test="select-btn"]')
      await selectButton.trigger('click')

      const option2Button = wrapper.find('[data-test="option-3"]')
      await option2Button.trigger('click')
      expect(wrapper.find('[data-test="selected-option-primary"]').text()).toBe(
        'nanoWit',
      )
    })

    it('the default unit should be milliWit on change', async () => {
      const wrapper = mount(
        SettingsOptionUnit,
        createComponentMocks({
          router: true,
          store: {
            wallet: {
              state: {
                unit: 'nanoWit',
              },
              mutations: {
                changeDefaultUnit: changeDefaultUnitMock,
              },
            },
          },
        }),
      )
      wrapper.setData({
        options: [
          { primaryText: 'wit', value: 'wit' },
          { primaryText: 'milliWit', value: 'milliWit' },
          { primaryText: 'microWit', value: 'microWit' },
          { primaryText: 'nanoWit', value: 'nanoWit' },
        ],
      })
      const selectButton = wrapper.find('[data-test="select-btn"]')
      await selectButton.trigger('click')

      const option2Button = wrapper.find('[data-test="option-1"]')
      await option2Button.trigger('click')
      expect(wrapper.find('[data-test="selected-option-primary"]').text()).toBe(
        'milliWit',
      )
    })

    it('the default unit should be wit on change', async () => {
      const wrapper = mount(
        SettingsOptionUnit,
        createComponentMocks({
          router: true,
          store: {
            wallet: {
              state: {
                unit: 'nanoWit',
              },
              mutations: {
                changeDefaultUnit: changeDefaultUnitMock,
              },
            },
          },
        }),
      )
      wrapper.setData({
        options: [
          { primaryText: 'wit', value: 'wit' },
          { primaryText: 'milliWit', value: 'milliWit' },
          { primaryText: 'microWit', value: 'microWit' },
          { primaryText: 'nanoWit', value: 'nanoWit' },
        ],
      })
      const selectButton = wrapper.find('[data-test="select-btn"]')
      await selectButton.trigger('click')

      const option2Button = wrapper.find('[data-test="option-0"]')
      await option2Button.trigger('click')
      expect(wrapper.find('[data-test="selected-option-primary"]').text()).toBe(
        'wit',
      )
    })
  })
})
