import ColorHelper from '@ts/map/colorHelper';

test('returns hex color if given valid severity level', () => {
  expect(ColorHelper.color(1, 5)).toEqual('#80d200');
});

test('returns hex color if given severity level outside of range', () => {
  expect(ColorHelper.color(-10, 5)).toEqual('#00cc00');
  expect(ColorHelper.color(10, 5)).toEqual('#cc0000');
});
