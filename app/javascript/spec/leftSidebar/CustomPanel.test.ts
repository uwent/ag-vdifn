import moment = require('moment')
import CustomPanel from '../../src/components/leftSidebar/CustomPanel.svelte'
import { fireEvent, render } from '@testing-library/svelte'
import {
  customPanelState,
  panelKey,
  selectedPanel,
  overlayLoading,
  customPanelParams,
  startDate,
  endDate,
  tMinTmax,
  customOverlaySubmitted,
  defaults
} from '../../src/store/store'
import { get } from 'svelte/store'
import { tick } from 'svelte'

let getText
let customPanel
let submitSpy
let selectedPanelSpy
let queryId
let dd1 = {
  id: 1,
  name: "Base 50.0°F",
  remote_name: "dd_50_none",
  t_min: 50.0,
  t_max: null,
  name_c: "Base 10.0°C"
}
let dd2 = {
  id: 2,
  name: "Base 50.0°F, Upper 86.0°F",
  remote_name: "dd_50_86",
  t_min: 50.0,
  t_max: 86.0,
  name_c: "Base 10.0°C, Upper 30.0°C"
}

beforeEach(() => {
  window.gtag = jest.fn()
  selectedPanelSpy = jest.spyOn(selectedPanel, 'set')
  const { getByText, queryByTestId, component } = render(CustomPanel, {
    props: {
      data: [dd1, dd2]
    }
  })
  submitSpy = jest.spyOn(customPanelParams, 'set')
  customPanel = component
  getText = getByText
  queryId = queryByTestId
  startDate.set('2000-10-10')
  endDate.set('2000-11-10')
  tMinTmax.set({ t_min: 1, t_max: 2, in_fahrenheit: true })
  customOverlaySubmitted.set(false)
})

it('should set the selected panel state on mount', () => {
  expect(selectedPanelSpy).toHaveBeenCalledWith('custom')
})

it('should dispatch submit params when button is clicked', async () => {
  jest.clearAllMocks()
  const button = getText('Submit')
  await fireEvent.click(button)
  expect(submitSpy).toHaveBeenCalled()
})

it('sets customOverlaySubmitted to true when submitted', async () => {
  const button = getText('Submit')
  expect(get(customOverlaySubmitted)).toEqual(false)
  await fireEvent.click(button)
  expect(get(customOverlaySubmitted)).toEqual(true)
})

it('updates state on submit', async () => {
  const button = getText('Submit')
  await fireEvent.click(button)
  expect(get(customPanelState)).toEqual({
    severities: undefined,
    severyParams: undefined,
    selectedGradient: 1,
    selectedExtent: defaults.extent,
    selectedModel: dd2,
    params: expect.any(Object),
    loaded: true,
  })
})

it('doesnt show the overlay options until submit', async () => {
  customOverlaySubmitted.set(false)
  await tick()
  expect(queryId('gradient-opts')).toBeNull()
  customOverlaySubmitted.set(true)
  await tick()
  expect(queryId('gradient-opts')).toBeInTheDocument()
})

it('displays loading component if options are submitted and the overlay is loading', async () => {
  customOverlaySubmitted.set(true)
  overlayLoading.set(true)
  await tick()
  expect(queryId('loading')).toBeInTheDocument()
})

it('displays severity gradient options if options have been submitted', async () => {
  customOverlaySubmitted.set(true)
  overlayLoading.set(false)
  await tick()
  expect(getText('Gradient Type')).toBeInTheDocument()
  expect(getText('Custom Degree-Day Values')).toBeInTheDocument()
})

it('sets context data for child elements', () => {
  expect(customPanel.$$.context.get(panelKey)).toEqual({
    panelType: 'custom',
    getModels: expect.any(Function),
    dateToolTip: {
      startDate: 'Biofix',
      endDate: 'Date through which degree-days are accumulated'
    },
    defaultStartDate: moment.utc().startOf('year').format('YYYY-MM-DD')
  })
})
