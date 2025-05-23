import GradientHelper from '@ts/gradientHelper';

const gradientHelper = new GradientHelper();

test('returns expected values based on user min/max values and number of gradient levels', () => {
  expect(
    gradientHelper.gradientValues({
      min: 250,
      max: 750,
      intermediateLevels: 2,
    }),
  ).toEqual({
    userMin: 250,
    intermediateValues: [
      [250, 500],
      [500, 750],
    ],
    userMax: 750,
  });

  expect(
    gradientHelper.gradientValues({
      min: 364,
      max: 850,
      intermediateLevels: 3,
    }),
  ).toEqual({
    userMin: 364,
    intermediateValues: [
      [364, 526],
      [526, 688],
      [688, 850],
    ],
    userMax: 850,
  });

  expect(
    gradientHelper.gradientValues({
      min: 364.3,
      max: 784.2,
      intermediateLevels: 3,
    }),
  ).toEqual({
    userMin: 364.3,
    intermediateValues: [
      [364.3, 504.3],
      [504.3, 644.3],
      [644.3, 784.2],
    ],
    userMax: 784.2,
  });
});

test('maps single range to colors', () => {
  expect(
    gradientHelper.mapRangeToColors({
      min: 250,
      max: 750,
      totalLevels: 6,
    }),
  ).toEqual({
    250: '#00cc00',
    375: '#66d000',
    500: '#ccd500',
    625: '#f5ac00',
    750: '#e05600',
    Infinity: '#cc0000',
  });
});

test('maps double range to colors', () => {
  expect(
    gradientHelper.mapRangeToColors({
      min: 250,
      middleMin: 400,
      middleMax: 500,
      max: 750,
      totalLevels: 6,
    }),
  ).toEqual({
    250: '#00cc00',
    287.5: '#66d000',
    325: '#ccd500',
    362.5: '#f5ac00',
    400: '#e05600',
    500: '#cc0000',
    562.5: '#e05600',
    625: '#f5ac00',
    687.5: '#ccd500',
    750: '#66d000',
    Infinity: '#00cc00',
  });
});
