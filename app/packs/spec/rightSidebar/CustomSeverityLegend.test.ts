import CustomSeverityLegend from '../../src/components/rightSidebar/CustomSeverityLegend.svelte'
import { render } from '@testing-library/svelte'
import { tick } from 'svelte'

let getId
let queryId

beforeEach(() => {
  const { getByTestId, queryAllByTestId } = render(CustomSeverityLegend, {
    props: {
      gradientMapping: [
        { color: 'green', number: 100 },
        { color: 'yellow', number: 200 },
        { color: 'orange', number: 300 },
        { color: 'red', number: Infinity },
      ],
    },
  })
  getId = getByTestId
  queryId = queryAllByTestId
})

it('displays legend', async () => {
  await tick()
  expect(getId('dsv-legend')).toBeInTheDocument()
})

it('displays all the gradient levels', async () => {
  await tick()
  expect(queryId('dsv-row').length).toEqual(4)
})

it('displays ranges on each row', async () => {
  await tick()
  expect(queryId('dsv-row')[0]).toHaveTextContent('301+')
  expect(queryId('dsv-row')[1]).toHaveTextContent('201 - 300')
  expect(queryId('dsv-row')[2]).toHaveTextContent('101 - 200')
  expect(queryId('dsv-row')[3]).toHaveTextContent('0 - 100')
})

it('displays the correct colors', async () => {
  await tick()
  expect(queryId('dsv-color')[0].style).toHaveProperty('background', 'red')
  expect(queryId('dsv-color')[1].style).toHaveProperty('background', 'orange')
  expect(queryId('dsv-color')[2].style).toHaveProperty('background', 'yellow')
  expect(queryId('dsv-color')[3].style).toHaveProperty('background', 'green')
})
