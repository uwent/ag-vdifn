import Temperature from '../../src/components/leftSidebar/TypeScript/temperature';

describe('to_c', () => {
  it('converts from farenheit to celcius', () => {
    expect(Temperature.to_c(0)).toBe("-17.8")
    expect(Temperature.to_c(-50)).toBe("-45.6")
    expect(Temperature.to_c(50)).toBe("10.0")
    expect(Temperature.to_c(100)).toBe("37.8")
  })
})

describe('to_f', () => {
  it('converts from celcius to farenheit', () => {
   expect(Temperature.to_f(0)).toBe("32.0")
   expect(Temperature.to_f(-50)).toBe("-58.0")
   expect(Temperature.to_f(50)).toBe("122.0")
   expect(Temperature.to_f(100)).toBe("212.0")
  })
})
