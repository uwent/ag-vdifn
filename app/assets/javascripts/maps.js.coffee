$ ->
  map = new ForecastMap($('#google-map')[0])
  Database.fetchSeverities(null, null, 'carrot', map.severityOverlay.bind(map))

  selectCarrot()

  google.maps.event.addDomListener($('#change-params')[0], 'click', ->
    map.openLoadingOverlay()

    Database.fetchSeverities(
      startPicker.getMoment().format('YYYY-MM-DD'),
      endPicker.getMoment().format('YYYY-MM-DD'),
      $('#crop-select')[0].value,
      map.severityOverlay.bind(map))
  )

  google.maps.event.addDomListener($('#crop-select')[0], 'change', (event) ->
    if $(event.target).val() == 'carrot'
      selectCarrot()
    else
      selectPotato()
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
  $('#datepicker-end').prop('disabled', false)

selectPotato = () ->
  $('#infliction-select')
    .find('option')
    .remove()
    .end()
    .append('<option value="disease-late-blight">Late Blight</option>')
    .val('disease-late-blight')
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
    @initialLoad = true
    google.maps.event.addListenerOnce(@map, 'tilesloaded', this.tilesLoaded)

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
      point.draw(@map)

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

  draw: (map) ->
    latitude = @latLng.lat()
    longitude = @latLng.lng()
    longitudeOffset = 0.05
    latitudeOffset = 0.05
    cornerOffset = 0.0025

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
      infowindow = new google.maps.InfoWindow(
        position: event.latLng
      )

      content = document.createElement("div")
      $(content).addClass("allen")
      $(content).attr("id", "iw-container")
      content.innerHTML =  Mustache.render($('#infowindow-tmpl').html())
      infowindow.open(map)
      infowindow.setContent(content)
#      Database.fetchInfo(latitude, longitude, $('#datepicker-start')[0].value, $('#datepicker-end')[0].value, $('#crop-select')[0].value, (newContent) ->
#        content.innerHTML = newContent
#      )
    )

class Database
  @fetchSeverities: (start_date, end_date, type, callback) =>
    $.ajax
      url: Routes.severities_db_index_path()
      data:
        start_date: start_date
        end_date: end_date
        type: type
      type: 'POST'
      dataType: 'json'
      error: (jqxhr, textstatus, errorthrown) ->
        $('body').append "ajax error: #{textstatus}"
      success: (data, textStatus, jqXHR) =>
        callback(data)

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
