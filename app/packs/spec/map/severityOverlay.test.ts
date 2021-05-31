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
  PANELS,
  overlayGradient,
  overlayLoading,
  mapMinMapMax,
} from '../../src/store/store'
import OverlayHelper from '../../src/components/map/overlayHelper'
import { Severity } from '../../src/components/common/TypeScript/types'
import { get } from 'svelte/store'

const severityParams = {
  start_date: '2020-10-10',
  end_date: '2020-10-15',
  pest_id: 1,
}
const customSeverityParams = {
  start_date: '2020-10-10',
  end_date: '2020-10-15',
  t_min: '10',
  t_max: '15',
  in_fahrenheit: true,
}
const severities: Severity[] = [
  { lat: 5, long: 10, level: 1 },
  { lat: 2, long: 4, level: 2 },
]

let mockUpdateOverlay = jest.fn()
let mockUpdateOverlayGradient = jest.fn()
let mockShowOverlay = jest.fn()

jest.mock('../../src/components/map/overlayHelper')

const overlayLoadingSpy = jest.spyOn(overlayLoading, 'set')
const mapMinMapMaxSpy = jest.spyOn(mapMinMapMax, 'set')
// const customPanelStateSpy = jest.spyOn(customPanelState, 'set')

beforeEach(() => {
  ;(OverlayHelper as jest.Mock).mockImplementation(() => {
    return {
      updateOverlay: mockUpdateOverlay,
      updateOverlayGradient: mockUpdateOverlayGradient,
      hideOverlay: jest.fn(),
      closeInfoWindow: jest.fn(),
      showOverlay: mockShowOverlay,
      severities: severities,
      min: 10,
      max: 15,
    }
  })
  render(SetContextTest, {
    props: {
      Component: SeverityOverlay,
      context_key: mapKey,
      context_value: {
        getMap: () => {},
        getGoogle: () => {},
      },
    },
  })
})

afterEach(() => {
  mapMinMapMaxSpy.mockClear()
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
    expect(mockUpdateOverlay).toHaveBeenCalledWith(
      severityParams,
      PANELS.DISEASE,
    )
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
    expect(mockUpdateOverlay).toHaveBeenCalledWith(
      severityParams,
      PANELS.INSECT,
    )
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

  it('sets mapMinMapMax', async () => {
    customPanelParams.set(customSeverityParams)
    mockUpdateOverlay.mockResolvedValue({})
    await expect(mapMinMapMaxSpy).toHaveBeenCalledWith({ max: 15, min: 10 })
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