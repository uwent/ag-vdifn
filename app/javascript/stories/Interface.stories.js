import Interface from '../src/Interface.svelte'
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
const ele = document.createElement("div")
ele.setAttribute("name", "csrf-token")
document.body.append(ele)

mock.onPost("/db/sidebar_info").reply(200, {
  crops: [{id: 0, name: "Any"}, {id: 5, name: "Carrot"}, {id: 19, name: "Potato"}],
  pests: [{id: 1, name: "Late Blight"}, {id:2, name: "Foliar disease"}]
});
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
