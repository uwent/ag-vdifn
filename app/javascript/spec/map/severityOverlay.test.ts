import SeverityOverlay from '../../src/components/map/SeverityOverlay.svelte'
import SetContextTest from '../testComponents/SetContextTest.svelte';
import { render, } from '@testing-library/svelte'
import { overlayGradient, mapKey, afflictionParams, overlayLoading, mapMinMapMax, customOverlaySubmitted, customParams } from '../../src/store/store';
import OverlayHelper from '../../src/components/map/overlayHelper';

const severityParams = {
    start_date: "2020-10-10",
    end_date: "2020-10-15",
    pest_id: 1
}

const customSeverityParams = {
    start_date: "2020-10-10",
    end_date: "2020-10-15",
    t_min: "10",
    t_max: "15",
    in_fahrenheit: true
}

let mockUpdateOverlay = jest.fn();
let mockUpdateOverlayGradient = jest.fn();
jest.mock('../../src/components/map/overlayHelper')
const overlayLoadingSpy = jest.spyOn(overlayLoading, "set")
const mapMinMapMaxSpy = jest.spyOn(mapMinMapMax, "set")
beforeEach(() => {
    (OverlayHelper as jest.Mock).mockImplementation(() => {
        return {
            updateOverlay: mockUpdateOverlay,
            updateOverlayGradient: mockUpdateOverlayGradient,
            min: 10,
            max: 15
        }
    })
    render(SetContextTest, {
        props: {
            Component: SeverityOverlay,
            context_key: mapKey,
            context_value: {
                getMap: () => {},
                getGoogle: () => {}
            } 
        }
    })
})

afterEach(() => {
    mapMinMapMaxSpy.mockClear() 
})
afterAll(() => {
    jest.clearAllMocks();
    overlayLoadingSpy.mockClear()
 })


 describe('afflictionParams', () => {
    it('updates overlay when afflictionParams is updated', () => {
        afflictionParams.set(severityParams)
    
        expect(mockUpdateOverlay).toHaveBeenCalledWith(severityParams)
    })
    
    it('sets overlay loading to true, then false after update overlay finished loading', async () => {
        afflictionParams.set(severityParams)
        mockUpdateOverlay.mockResolvedValue({})
    
        await expect(overlayLoadingSpy).toHaveBeenNthCalledWith(1, true)
        await expect(overlayLoadingSpy).toHaveBeenNthCalledWith(2, false)
    })
    
    it('sets mapMinMapMax to null', () => {
        const mapMinMapMaxSpy = jest.spyOn(mapMinMapMax, "set")
    
        afflictionParams.set(severityParams)
        mockUpdateOverlay.mockResolvedValue({})
    
        expect(mapMinMapMaxSpy).toHaveBeenCalledWith(null)
    })
    
    it('sets customOverlaySubmitted to false', () => {
        const customOverlaySubmittedSpy = jest.spyOn(customOverlaySubmitted, "set")
    
        afflictionParams.set(severityParams)
        mockUpdateOverlay.mockResolvedValue({})
    
        expect(customOverlaySubmittedSpy).toHaveBeenCalledWith(false) 
    })
 })

 describe('customParams', () => {
    it('updates overlay when afflictionParams is updated', () => {
        customParams.set(customSeverityParams)
    
        expect(mockUpdateOverlay).toHaveBeenCalledWith(customSeverityParams)
    }) 

    it('sets overlay loading to true then false after finished loading overlay', async () => {
        customParams.set(customSeverityParams)
        mockUpdateOverlay.mockResolvedValue({})
    
        await expect(overlayLoadingSpy).toHaveBeenNthCalledWith(1, true)
        await expect(overlayLoadingSpy).toHaveBeenNthCalledWith(2, false)
    })

    it('sets mapMinMapMax', async () => {
        customParams.set(customSeverityParams)
        mockUpdateOverlay.mockResolvedValue({})
    
        await expect(mapMinMapMaxSpy).toHaveBeenCalledWith({"max": 15, "min": 10})
    })
 })

 describe("overlayGradient", () => {
    it("calls updateOverlayGradient", () => {
        const gradientMapping = {a: 1, b: 2}
        overlayGradient.set(gradientMapping)
        
        expect(mockUpdateOverlayGradient).toHaveBeenCalledWith(gradientMapping)
    })
 })
