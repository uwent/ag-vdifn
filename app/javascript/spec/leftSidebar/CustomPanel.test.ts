import CustomPanel from '../../src/components/leftSidebar/CustomPanel.svelte'
import { fireEvent, render } from '@testing-library/svelte'
import {
  customPanelState,
  panelNames,
  panelKey,
  selectedPanel,
  overlayLoading,
  customPanelParams,
  startDate,
  endDate,
  afflictionValue,
  tMinTmax,
  customOverlaySubmitted,
  defaults
} from '../../src/store/store'
import { get } from 'svelte/store'
import { tick } from 'svelte'
import * as moment from 'moment'

let getText
let getTestId
let customPanel
let submitSpy
let selectedPanelSpy

beforeEach(() => {
  selectedPanelSpy = jest.spyOn(selectedPanel, 'set')
  const { getByText, getByTestId, component } = render(CustomPanel, {
    props: {
      data: [{ id: 1, name: 'potato', afflictions: [{ id: 1, name: 'bug' }] }]
    }
  })
  submitSpy = jest.spyOn(customPanelParams, 'set')
  customPanel = component
  getText = getByText
  getTestId = getByTestId
  startDate.set('2000-10-10')
  endDate.set('2000-11-10')
  afflictionValue.set(1)
  tMinTmax.set({ t_min: 1, t_max: 2, in_fahrenheit: true })
  customOverlaySubmitted.set(false)
})

it('should set the selected panel state on mount', () => {
  expect(selectedPanelSpy).toHaveBeenCalledWith(panelNames.custom)
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
    in_fahrenheit: true,
    selectedGradient: 1,
    t_max: 2,
    t_min: 1,
    loaded: true,
    selectedExtent: defaults.extent
  })
})

it('asks user to submit model parameters if overlay options not submitted', async () => {
  customOverlaySubmitted.set(false)
  await tick()
  expect(getText('Please submit model parameters')).toBeInTheDocument()
})

it('displays loading component if options are submitted and the overlay is loading', async () => {
  customOverlaySubmitted.set(true)
  overlayLoading.set(true)
  await tick()
  expect(getTestId('loading')).toBeInTheDocument()
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
    panelType: 'Custom',
    getCrops: expect.any(Function),
    dateToolTip: {
      startDate: 'Biofix',
      endDate: 'Date through which degree-days are accumulated'
    },
    getAfflictionName: expect.any(Function),
    defaultStartDate: moment.utc().startOf('year').format('YYYY-MM-DD')
  })
})
