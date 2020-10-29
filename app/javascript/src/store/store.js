import { writable } from 'svelte/store';

export const startDate = writable("");
export const endDate = writable("");
export const afflictionValue = writable(0);
export const selectedAffliction = writable({})
export const overlayGradient = writable({});
export const overlayLoading = writable(false)
export const customOverlaySubmitted = writable(false)

export const twoPointGradientState = writable({})
export const threePointGradientState = writable({})
export const tMinTmax = writable({})
export const mapMinMapMax = writable({min: 0, max: 0})
export const panelKey = {};
export const mapKey = {};
export const interfaceKey = {};

export const afflictionParams = writable({})
export const customParams = writable({})