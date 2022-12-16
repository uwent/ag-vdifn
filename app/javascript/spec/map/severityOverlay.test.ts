import SeverityOverlay from '../../src/components/map/SeverityOverlay.svelte'
import SetContextTest from '../testComponents/SetContextTest.svelte'
import { render } from '@testing-library/svelte'
import {
  mapKey,
  diseasePanelParams,
  insectPanelParams,
  customPanelParams,
  diseasePanelState,
  insectPanelState,
  customPanelState,
  selectedPanel,
  overlayGradient,
  overlayLoading,
  mapRange
} from '../../src/store/store'
import OverlayHelper from '../../src/components/map/ts/overlayHelper'
import { Severity } from '../../src/components/common/ts/types'
import { get } from 'svelte/store'

const severityParams = {
  start_date: '2020-10-10',
  end_date: '2020-10-15',
  pest_id: 1
}
const customSeverityParams = {
  start_date: '2020-10-10',
  end_date: '2020-10-15',
  t_min: '10',
  t_max: '15',
  in_fahrenheit: true
}
const severities: Severity[] = [
  { lat: 5, long: 10, level: 1 },
  { lat: 2, long: 4, level: 2 }
]

const mockUpdateOverlay = jest.fn()
const mockUpdateOverlayGradient = jest.fn()
const mockShowOverlay = jest.fn()
const mockShowBounds = jest.fn()

jest.mock('../../src/components/map/ts/overlayHelper')

const overlayLoadingSpy = jest.spyOn(overlayLoading, 'set')
const mapRangeSpy = jest.spyOn(mapRange, 'set')
// const customPanelStateSpy = jest.spyOn(customPanelState, 'set')

beforeEach(() => {
  (OverlayHelper as jest.Mock).mockImplementation(() => {
    return {
      updateOverlay: mockUpdateOverlay,
      updateOverlayGradient: mockUpdateOverlayGradient,
      hideOverlay: jest.fn(),
      closeInfoWindow: jest.fn(),
      showOverlay: mockShowOverlay,
      showBounds: mockShowBounds,
      severities: severities,
      min: 10,
      max: 15
    }
  })
  render(SetContextTest, {
    props: {
      Component: SeverityOverlay,
      context_key: mapKey,
      context_value: {
        getMap: () => { },
        getGoogle: () => { }
      }
    }
  })
})

afterEach(() => {
  mapRangeSpy.mockClear()
})

afterAll(() => {
  jest.clearAllMocks()
  overlayLoadingSpy.mockClear()
  diseasePanelParams.set({})
  customPanelState.set({})
})

describe('updating overlay for disease panel params', () => {
  it('updates overlay when afflictionParams is updated', () => {
    diseasePanelParams.set(severityParams)
    expect(mockUpdateOverlay).toHaveBeenCalledWith(severityParams, 'disease')
  })

  it('sets overlay loading to true, then false after update overlay finished loading', async () => {
    diseasePanelParams.set(severityParams)
    mockUpdateOverlay.mockResolvedValue({})
    await expect(overlayLoadingSpy).toHaveBeenNthCalledWith(1, true)
    await expect(overlayLoadingSpy).toHaveBeenNthCalledWith(2, false)
  })

  it('updates store with new severities', async () => {
    diseasePanelParams.set(severityParams)
    mockUpdateOverlay.mockResolvedValue({})
    expect(get(diseasePanelState)['severities']).toEqual(severities)
    expect(get(diseasePanelState)['severityParams']).toEqual(severityParams)
  })
})

describe('updating overlay for insect panel params', () => {
  it('updates overlay when afflictionParams is updated', () => {
    insectPanelParams.set(severityParams)
    expect(mockUpdateOverlay).toHaveBeenCalledWith(severityParams, 'insect')
  })

  it('sets overlay loading to true, then false after update overlay finished loading', async () => {
    insectPanelParams.set(severityParams)
    mockUpdateOverlay.mockResolvedValue({})
    await expect(overlayLoadingSpy).toHaveBeenNthCalledWith(1, true)
    await expect(overlayLoadingSpy).toHaveBeenNthCalledWith(2, false)
  })

  it('updates store with new severities', async () => {
    insectPanelParams.set(severityParams)
    mockUpdateOverlay.mockResolvedValue({})
    expect(get(insectPanelState)['severities']).toEqual(severities)
    expect(get(insectPanelState)['severityParams']).toEqual(severityParams)
  })
})

describe('updating overlay for custom panel params', () => {
  it('sets overlay loading to true then false after finished loading overlay', async () => {
    customPanelParams.set(customSeverityParams)
    mockUpdateOverlay.mockResolvedValue({})
    await expect(overlayLoadingSpy).toHaveBeenNthCalledWith(1, true)
    await expect(overlayLoadingSpy).toHaveBeenNthCalledWith(2, false)
  })

  it('sets mapRange', async () => {
    customPanelParams.set(customSeverityParams)
    mockUpdateOverlay.mockResolvedValue({})
    await expect(mapRangeSpy).toHaveBeenCalledWith({ max: 15, min: 10 })
  })
})

describe('overlayGradient', () => {
  it('calls updateOverlayGradient', () => {
    const gradientMapping = { a: 1, b: 2 }
    overlayGradient.set(gradientMapping)
    expect(mockUpdateOverlayGradient).toHaveBeenCalledWith(gradientMapping)
  })
})

describe('when new panel is loaded', () => {
  it('loads in insect overlay if it exists', () => {
    insectPanelParams.set(severityParams)
    selectedPanel.set('insect')
    expect(mockShowOverlay).toHaveBeenCalled()
  })
})
