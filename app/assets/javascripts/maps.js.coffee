$ ->
  map = new ForecastMap($('#google-map')[0])
  Database.fetchSeverities(null, null, 5, map.severityOverlay.bind(map))
  Database.fetchSeverityLegend('carrot')
  $(".infliction:first").show()


  $(".more-information").tooltip(
    content: ->
      $(this).data("tooltip")
  )

  google.maps.event.addDomListener($('#change-params')[0], 'click', ->
    map.closeInfoWindow()
    map.openLoadingOverlay()
    crop = $('#crop-select')[0].value
    pest = $('#pest-select-' + crop)[0].value

    Database.fetchSeverityLegend(crop)
    Database.fetchSeverities(
      startPicker.getMoment().format('YYYY-MM-DD'),
      endPicker.getMoment().format('YYYY-MM-DD'),
      pest,
      map.severityOverlay.bind(map))
  )

  google.maps.event.addDomListener($('#crop-select')[0], 'change', (event) ->
    crop_select_wrapper = "#select-" + $(event.target).val()
    $(".infliction").hide()
    $(crop_select_wrapper).show()
  )

  createDatePicker = (options) ->
    console.log(options)

    defaultOptions =
      setDefaultDate: true
      maxDate: new Date()
      format: 'MMMM D, YYYY'
      onClose: () ->
        this.config().field.blur()

    return new Pikaday($.extend({}, options || {}, defaultOptions), false, false)

  endDate = new Date()

  startPicker = createDatePicker(
    defaultDate: moment().subtract(7,'d').toDate()
    minDate: new Date(2014, 4, 16)
    field: $('#datepicker-start')[0]
    onSelect: () ->
      maxDate = new Date()

      endPicker.setMinDate(this.getDate())
      endPicker.setMaxDate(maxDate)

      if $('#datepicker-end').prop('disabled')
        endPicker.setDate(moment(this.getDate()).add(7, 'd').toDate())

      if (endPicker.getDate() < this.getDate())
        endPicker.setDate(this.getDate())

      if (endPicker.getDate() > maxDate)
        endPicker.setDate(maxDate)
  )

  endPicker = createDatePicker(
    defaultDate: endDate
    minDate: startPicker.getDate()
    field: $('#datepicker-end')[0]
  )

selectCarrot = () ->
  $('#infliction-select')
    .find('option')
    .remove()
    .end()
    .append('<option value="disease-foliar-disease">Foliar Disease</option>')
    .val('disease-foliar-disease')
  $('#infliction-select-wrapper')
    .find('span')
    .remove()
  $('#infliction-select-wrapper')
    .append('<span class="more-information" title="" id="infliction-select-information"  data-tooltip="<u>Late blight:</u> Phytophthora infestans infects all aboveground plant parts and potato tubers and can be transmitted via seed, culls, volunteers, and weeds (i.e., nightshade). Foliar infections begin with watersoaking and progress quickly to cause tan/brown dead tissue. Brown cankers can girdle petioles and stems. White, downy sporulation is often visible, with high humidity, on undersides of leaves along lesion edges. Infected tomato fruits remain firm underneath mottled-looking brown areas. Infected tubers appear as brown decay on the surface and into the top ¼-inch of tissue. Late blight disease advances quickly under conditions of high humidity (≥90%) and cool temperatures (50-70°F). Prevention is critical for control. Eliminate culls and volunteer plants. Avoid prolonged wetness on leaves and canopy, use certified seed, and follow DSV accumulation values that prompt early, preventative fungicide applications. If disease is present, treat with appropriate fungicides on a 5-7 day spray interval.<br /><br />[<a href=\'http://www.plantpath.wisc.edu/wivegdis/\'>http://www.plantpath.wisc.edu/wivegdis/</a>]">?</span>')
    $('#datepicker-end').prop('disabled', false)

selectPotato = () ->
  $('#infliction-select')
    .find('option')
    .remove()
    .end()
    .append('<option value="disease-late-blight">Late Blight</option>')
    .val('disease-late-blight')
  $('#infliction-select-wrapper')
    .find('span')
    .remove()
  $('#infliction-select-wrapper')
    .append('<span class="more-information" title="" id="infliction-select-information"  data-tooltip="<u>Alternaria leaf blight:</u> the seedborne Alternaria fungus causes dark-brown lesions on leaflets and petioles that weaken and/or kill carrot foliage, causing separation from root crowns during mechanical harvest.<br/><br/> Disease management includes using certified or heat-treated seed, crop rotation, in- furrow irrigation to reduce foliar wetness, and disease forecasting programs for initiating a fungicide program.<br/><br/><u>Cercospora leaf blight:</u> the potentially seedborne Cercospora fungus causes tan lesions with a darker brown margin on carrot leaflets and petioles. Plant growth can be reduced from dead, curled leaflets and, in severe cases, death of the entire canopy.<br /><br /> Disease management includes using certified or pre-treated seed, crop rotation, avoiding overhead irrigation to reduce foliar wetness, and disease forecasting programs for initiating a fungicide program.<br /><br />[<a href=\'http://www.plantpath.wisc.edu/wivegdis/\'>http://www.plantpath.wisc.edu/wivegdis/</a>]">?</span>')
  $('#datepicker-end').prop('disabled', true)

class ForecastMap
  constructor: (@map_node) ->
    mapOptions =
      center: lat: 45.05026979463, lng: -90.274658203125
      mapTypeControl: true,
      mapTypeControlOptions:
        mapTypeIds: [google.maps.MapTypeId.TERRAIN,
                     google.maps.MapTypeId.HYBRID],
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      maxZoom: 12,
      minZoom: 6,
      streetViewControl: false,
      zoomControl: false,
      zoom: 7
    @map = new google.maps.Map(@map_node, mapOptions)
    @loadingOverlay = $('#loading-overlay')[0]
    @dataPoints = []
    @infoWindow = null
    @initialLoad = true
    google.maps.event.addListenerOnce(@map, 'tilesloaded', this.tilesLoaded)

  getMap: () ->
    return @map

  closeInfoWindow: () ->
    if @infoWindow
      @infoWindow.close()

  closeLoadingOverlay: () ->
    @loadingOverlay.style.opacity = 0
    @loadingOverlay.style.visibility = "hidden"

  openLoadingOverlay: () ->
    @loadingOverlay.style.opacity = 1
    @loadingOverlay.style.visibility = "visible"

  tilesLoaded: () =>
    this.closeLoadingOverlay()
    @loadingOverlay.style.backgroundColor = "transparent"
    @loadingOverlay.classList.add("radial")

    return this

  clearDataPoints: () ->
    for dataPoint in @dataPoints
      dataPoint.remove()
    @dataPoints = []

  severityOverlay: (data) ->
    this.clearDataPoints()

    for severity in data
      @dataPoints.push(new DataPoint(1, new google.maps.LatLng(severity.lat, severity.long), severity.severity))
    for point in @dataPoints
      point.draw(this)

    if !@initialLoad
      this.closeLoadingOverlay()
    @initialLoad = false

class DataPoint
  constructor: (@id, @latLng, @severity) ->
    @size = 12
    @drawn = false

  color: () ->
    ['#00c957','#7dff23', '#ffd700', '#ff8000', '#cc0000'][@severity]

  remove: () ->
    @map_object.setMap(null)
    @map_object = null

  draw: (forecastMap) ->
    latitude = @latLng.lat()
    longitude = @latLng.lng()
    longitudeOffset = 0.05
    latitudeOffset = 0.05
    cornerOffset = 0.0025
    map = forecastMap.getMap()

    @map_object = new google.maps.Rectangle(
      strokeColor: '#FF0000'
      strokeOpacity: 1.0
      strokeWeight: 0.05
      fillColor: this.color()
      fillOpacity: 0.2
      map: map,
      bounds:
        north: latitude - latitudeOffset - cornerOffset
        south: latitude + latitudeOffset + cornerOffset
        east:  longitude + longitudeOffset + cornerOffset
        west: longitude - longitudeOffset - cornerOffset
    )

    @map_object.addListener('click', (event) ->
      forecastMap.closeInfoWindow()
      forecastMap.infoWindow = new google.maps.InfoWindow(
        position: event.latLng
      )

      infowindow = forecastMap.infoWindow
      content = document.createElement("div")
      $(content).attr("id", "iw-container")
      content.innerHTML =  Mustache.render($('#infowindow-tmpl').html())
      infowindow.open(map)
      infowindow.setContent(content)
      Database.fetchInfo(latitude, longitude, $('#datepicker-start')[0].value, $('#datepicker-end')[0].value, $('#crop-select')[0].value, (newContent) ->
        content.innerHTML = newContent
      )
    )

class Database
  @fetchSeverities: (start_date, end_date, type, callback) =>
    $.ajax
      url: Routes.severities_db_index_path()
      data:
        start_date: start_date
        end_date: end_date
        pest_id: type
      type: 'POST'
      dataType: 'json'
      error: (jqxhr, textstatus, errorthrown) ->
        $('body').append "ajax error: #{textstatus}"
      success: (data, textStatus, jqXHR) =>
        callback(data)

  @fetchSeverityLegend: (type) =>
    $.ajax
      url: Routes.severity_legend_db_index_path()
      data:
        type: type
      type: 'POST'
      dataType: 'html'
      error: (jqxhr, textstatus, errorthrown) ->
        $('body').append "ajax error: #{textstatus}"
      success: (data, textStatus, jqXHR) =>
        $('#severity-legend').html(data)

  @fetchInfo: (lat, long, start_date, end_date, type, callback) =>
    $.ajax
      url: Routes.info_db_index_path()
      data:
        latitude: lat
        longitude: long
        start_date: start_date
        end_date: end_date
        type: type
      type: 'POST'
      dataType: 'html'
      error: (jqxhr, textstatus, errorthrown) ->
        $('body').append "ajax error: #{textstatus}"
      success: (data, textStatus, jqXHR) =>
        callback(data)
