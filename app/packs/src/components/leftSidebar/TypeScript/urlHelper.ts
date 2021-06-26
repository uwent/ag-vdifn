export default class UrlHelper {

  setParam(param, newval, oldquery) {
    var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    var query = oldquery.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
  }

}
