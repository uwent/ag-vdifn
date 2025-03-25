import ColorHelper from '@components/map/ts/colorHelper';

const spectralHelper = new ColorHelper('spectral');
const viridisHelper = new ColorHelper('viridis');

test('returns hex color if given valid severity level', () => {
  expect(spectralHelper.color(1, 5)).toEqual('#80d200');
});

test('returns hex color if given severity level outside of range', () => {
  expect(spectralHelper.color(-10, 5)).toEqual('#00cc00');
  expect(spectralHelper.color(10, 5)).toEqual('#cc0000');
});
