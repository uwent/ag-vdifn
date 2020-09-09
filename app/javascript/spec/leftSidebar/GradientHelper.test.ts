import GradientHelper from '../../src/components/leftSidebar/TypeScript/gradientHelper';
const max = 800;
let gradientHelper;
beforeEach(() => {
    gradientHelper = new GradientHelper();
})
it('returns expected values based on user min/max values and number of gradient levels', () => {
    expect(gradientHelper.gradientValues({min: 250, max: 750, intermediateLevels: 2})).toEqual({
        userMin: 250,
        intermediateValues: [[250, 500], [500, 750]],
        userMax: 750,
    })

    expect(gradientHelper.gradientValues({min: 364, max: 850, intermediateLevels: 3})).toEqual({
        userMin: 364,
        intermediateValues: [[364, 526], [526, 688], [688, 850]],
        userMax: 850,
    })

    expect(gradientHelper.gradientValues({min: 364.3, max: 784.2, intermediateLevels: 3})).toEqual({
        userMin: 364.3,
        intermediateValues: [[364.3, 504.3], [504.3, 644.3], [644.3, 784.2]],
        userMax: 784.2,
    })
})

it('maps range minimums to colors', () => {
    expect(gradientHelper.mapRangeMinsToColors({min: 250, max: 750, intermediateLevels: 4, totalLevels: 6, absoluteMax: max})).toEqual(
        {
            250: "#00cc00",
            375: "#66d000",
            500: "#ccd500",
            625: "#f5ac00",
            750: "#e05600",
            800: "#cc0000",
        }
    )
})

