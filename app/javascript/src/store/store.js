import { writable } from 'svelte/store';


export const startDate = writable("");
export const endDate = writable("");
export const afflictionValue = writable(0);
export const selectedAffliction = writable({})
export const panelKey = {};
export const mapKey = {};
export const interfaceKey = {};

export const submitParams = writable({})
