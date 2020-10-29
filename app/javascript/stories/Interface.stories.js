import Interface from '../src/components/leftSidebar/Interface.svelte'
import { server } from '../spec/msw_mocks/server'

const ele = document.createElement("div")
ele.setAttribute("name", "csrf-token")
document.body.append(ele)

export default {
  title: 'Interface',
  excludeStories: /.*Data$/,
}

export const interfaceData = {
  selected: "disease"
}

export const Default = () => ({
  Component: Interface,
  props: {
    interface: interfaceData,
  }
})
