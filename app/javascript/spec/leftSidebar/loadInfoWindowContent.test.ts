import infoWindowLoadingTemplate from '../../src/components/map/TypeScript/templates/infoWindowLoading';

let content: string;
beforeEach(() => {
    content = infoWindowLoadingTemplate;
    document.body.innerHTML = content;
})
it('correctly renders template',  () => {

    expect(document.getElementsByClassName("iw-title")).not.toBeNull()
    expect(document.getElementById("iw-content")).not.toBeNull();
    expect(document.getElementById("loading")).not.toBeNull();
    expect(document.getElementsByClassName("loading-icon").length).toEqual(1);
    expect(document.getElementsByTagName("li").length).toEqual(3);
})
