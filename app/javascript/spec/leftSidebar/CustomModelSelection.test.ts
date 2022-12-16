import CustomModelSelection from '../../src/components/leftSidebar/CustomModelSelection.svelte'
import { panelKey } from '../../src/store/store'
import { fireEvent, render } from '@testing-library/svelte'
import SetContextTest from '../testComponents/SetContextTest.svelte'

let data
let getRole
let getQuery
let getLabel

describe('when data present', () => {
  beforeEach(() => {
    data = [
      {
        id: 1,
        name: "Base 50.0°F",
        remote_name: "dd_50_none",
        t_min: 50.0,
        t_max: null,
        name_c: "Base 10.0°C"
      },
      {
        id: 2,
        name: "Base 50.0°F, Upper 86.0°F",
        remote_name: "dd_50_86",
        t_min: 50.0,
        t_max: 86.0,
        name_c: "Base 10.0°C, Upper 30.0°C"
      },
    ]

    const { getByRole, queryByRole, getByLabelText } = render(SetContextTest, {
      props: {
        Component: CustomModelSelection,
        context_key: panelKey,
        context_value: {
          getModels: () => data,
        }
      }
    })
    getRole = getByRole
    getQuery = queryByRole
    getLabel = getByLabelText
  })

  it('defaults to the 50/86 degree day model', () => {
    let input = getRole('combobox', { name: 'Choose model' })
    expect(input).toHaveValue('2')
  })

  it('shows tmin and tmax in the model selection box', () => {
    let input = getRole('combobox', { name: 'Choose model' })
    expect(input).toHaveTextContent('Base 50.0°F, Upper 86.0°F')
  })

  // it('shows the tmin and tmax values in the display', () => {
  //   let tmin = getLabel('Tmin')
  //   let tmax = getRole('Tmax')
  //   expect(tmin).toHaveTextContent('50')
  //   expect(tmin).toHaveTextContent('86')
  // })
})

describe('when data not present', () => {
  beforeEach(() => {
    data = []

    const { getByRole, queryByRole } = render(SetContextTest, {
      props: {
        Component: CustomModelSelection,
        context_key: panelKey,
        context_value: {
          getModels: () => data,
        }
      }
    })
    getRole = getByRole
    getQuery = queryByRole
  })

  it('renders empty select box', () => {
    let input = getRole('combobox', { name: 'Choose model' })
    expect(input).toBeInTheDocument()
  })
})
