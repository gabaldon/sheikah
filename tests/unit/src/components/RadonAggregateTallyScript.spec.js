import RadonAggregateTallyScript from '@/components/RadonAggregateTallyScript'

describe('RadonAggregateTallyScript.vue', () => {
  describe('should render correctly when the type is filters', () => {
    const wrapper = mount(RadonAggregateTallyScript, {
      propsData: {
        type: 'filters',
        scriptId: 4,
        script: {
          filters: [
            {
              hierarchicalType: 'operator',
              id: 5,
              label: 'deviationAbsolute',
              markupType: 'select',
              options: [
                {
                  hierarchicalType: 'operatorOption',
                  label: 'deviationAbsolute',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
                {
                  hierarchicalType: 'operatorOption',
                  label: 'deviationRelative',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
                {
                  hierarchicalType: 'operatorOption',
                  label: 'deviationStandard',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
                {
                  hierarchicalType: 'operatorOption',
                  label: 'mode',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
              ],
              outputType: 'filterOutput',
              scriptId: 4,
              selected: {
                arguments: [
                  {
                    hierarchicalType: 'argument',
                    id: 6,
                    label: 'by',
                    markupType: 'input',
                    value: '1',
                  },
                ],
                hierarchicalType: 'selectedOperatorOption',
                label: 'deviationAbsolute',
                markupType: 'option',
                outputType: 'filterOutput',
              },
            },
            {
              hierarchicalType: 'operator',
              id: 7,
              label: 'deviationStandard',
              markupType: 'select',
              options: [
                {
                  hierarchicalType: 'operatorOption',
                  label: 'deviationAbsolute',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
                {
                  hierarchicalType: 'operatorOption',
                  label: 'deviationRelative',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
                {
                  hierarchicalType: 'operatorOption',
                  label: 'deviationStandard',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
                {
                  hierarchicalType: 'operatorOption',
                  label: 'mode',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
              ],
              outputType: 'filterOutput',
              scriptId: 4,
              selected: {
                arguments: [
                  {
                    hierarchicalType: 'argument',
                    id: 8,
                    label: 'by',
                    markupType: 'input',
                    value: 1,
                  },
                ],
                hierarchicalType: 'selectedOperatorOption',
                label: 'deviationStandard',
                markupType: 'option',
                outputType: 'filterOutput',
              },
            },
          ],
          reducer: {
            hierarchicalType: 'operator',
            id: 9,
            label: 'averageMean',
            markupType: 'select',
            options: [
              {
                hierarchicalType: 'operatorOption',
                label: 'mode',
                markupType: 'option',
                outputType: 'filterOutput',
              },
              {
                hierarchicalType: 'operatorOption',
                label: 'averageMean',
                markupType: 'option',
                outputType: 'filterOutput',
              },
              {
                hierarchicalType: 'operatorOption',
                label: 'averageMeanWeighted',
                markupType: 'option',
                outputType: 'filterOutput',
              },
              {
                hierarchicalType: 'operatorOption',
                label: 'averageMedian',
                markupType: 'option',
                outputType: 'filterOutput',
              },
              {
                hierarchicalType: 'operatorOption',
                label: 'averageMedianWeighted',
                markupType: 'option',
                outputType: 'filterOutput',
              },
            ],
            outputType: 'filterOutput',
            scriptId: 4,
            selected: {
              arguments: [],
              hierarchicalType: 'selectedOperatorOption',
              label: 'averageMean',
              markupType: 'option',
              outputType: 'reducerOutput',
            },
          },
        },
      },
      ...createComponentMocks({
        store: {
          rad: {
            state: {
              currentTemplate: {
                variables: [{}],
              },
            },
          },
        },
      }),
    })
    it('finds the header text', () => {
      expect(wrapper.find('[data-test="header"]').text()).toBe(
        'From x sources and companion scripts'
      )
    })
    it('finds the footer text', () => {
      expect(wrapper.find('[data-test="footer"]').text()).toBe('Into aggregation reducer')
    })
    it('finds the filter operator', () => {
      expect(wrapper.contains('[data-test="filter-operator"]')).toBe(true)
    })
    it('finds the add operator button', () => {
      expect(wrapper.contains('[data-test="reducer-operator"]')).toBe(false)
    })
  })
  describe('should render correctly', () => {
    const wrapper = mount(RadonAggregateTallyScript, {
      propsData: {
        type: 'reducer',
        scriptId: 4,
        script: {
          filters: [
            {
              hierarchicalType: 'operator',
              id: 5,
              label: 'deviationAbsolute',
              markupType: 'select',
              options: [
                {
                  hierarchicalType: 'operatorOption',
                  label: 'deviationAbsolute',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
                {
                  hierarchicalType: 'operatorOption',
                  label: 'deviationRelative',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
                {
                  hierarchicalType: 'operatorOption',
                  label: 'deviationStandard',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
                {
                  hierarchicalType: 'operatorOption',
                  label: 'mode',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
              ],
              outputType: 'filterOutput',
              scriptId: 4,
              selected: {
                arguments: [
                  {
                    hierarchicalType: 'argument',
                    id: 6,
                    label: 'by',
                    markupType: 'input',
                    value: '1',
                  },
                ],
                hierarchicalType: 'selectedOperatorOption',
                label: 'deviationAbsolute',
                markupType: 'option',
                outputType: 'filterOutput',
              },
            },
            {
              hierarchicalType: 'operator',
              id: 7,
              label: 'deviationStandard',
              markupType: 'select',
              options: [
                {
                  hierarchicalType: 'operatorOption',
                  label: 'deviationAbsolute',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
                {
                  hierarchicalType: 'operatorOption',
                  label: 'deviationRelative',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
                {
                  hierarchicalType: 'operatorOption',
                  label: 'deviationStandard',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
                {
                  hierarchicalType: 'operatorOption',
                  label: 'mode',
                  markupType: 'option',
                  outputType: 'filterOutput',
                },
              ],
              outputType: 'filterOutput',
              scriptId: 4,
              selected: {
                arguments: [
                  {
                    hierarchicalType: 'argument',
                    id: 8,
                    label: 'by',
                    markupType: 'input',
                    value: 1,
                  },
                ],
                hierarchicalType: 'selectedOperatorOption',
                label: 'deviationStandard',
                markupType: 'option',
                outputType: 'filterOutput',
              },
            },
          ],
          reducer: {
            hierarchicalType: 'operator',
            id: 9,
            label: 'averageMean',
            markupType: 'select',
            options: [
              {
                hierarchicalType: 'operatorOption',
                label: 'mode',
                markupType: 'option',
                outputType: 'filterOutput',
              },
              {
                hierarchicalType: 'operatorOption',
                label: 'averageMean',
                markupType: 'option',
                outputType: 'filterOutput',
              },
              {
                hierarchicalType: 'operatorOption',
                label: 'averageMeanWeighted',
                markupType: 'option',
                outputType: 'filterOutput',
              },
              {
                hierarchicalType: 'operatorOption',
                label: 'averageMedian',
                markupType: 'option',
                outputType: 'filterOutput',
              },
              {
                hierarchicalType: 'operatorOption',
                label: 'averageMedianWeighted',
                markupType: 'option',
                outputType: 'filterOutput',
              },
            ],
            outputType: 'filterOutput',
            scriptId: 4,
            selected: {
              arguments: [],
              hierarchicalType: 'selectedOperatorOption',
              label: 'averageMean',
              markupType: 'option',
              outputType: 'reducerOutput',
            },
          },
        },
      },
      ...createComponentMocks({
        store: {
          rad: {
            state: {
              currentTemplate: {
                variables: [{}],
              },
            },
          },
        },
      }),
    })
    it('finds the header text', () => {
      expect(wrapper.find('[data-test="header"]').text()).toBe('From aggregation filters')
    })
    it('finds the footer text', () => {
      expect(wrapper.find('[data-test="footer"]').text()).toBe('Return and report to the network')
    })
    it('finds the filter operator', () => {
      expect(wrapper.contains('[data-test="filter-operator"]')).toBe(false)
    })
    it('finds the add operator button', () => {
      expect(wrapper.contains('[data-test="reducer-operator"]')).toBe(true)
    })
  })
})
