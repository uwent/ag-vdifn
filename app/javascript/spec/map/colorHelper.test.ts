import ColorHelper from '../../src/components/map/TypeScript/colorHelper';

it('returns hex color if given valid severity level', () => {
    expect(ColorHelper.color(1, 5)).toEqual("#66cf34")
})

it('returns hex color if given severity level outside of range', () => {
    expect(ColorHelper.color(-10, 5)).toEqual("#00c957")
    expect(ColorHelper.color(10, 5)).toEqual("#cc0000")
})
