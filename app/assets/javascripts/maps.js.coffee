$ ->
  map = new ForecastMap($('#google-map')[0])

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

    Database.fetchSeverityLegend(pest)
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

  google.maps.event.addDomListener($('#crop-select')[0], 'change', (event) ->
    crop_id = $(event.target).val()
    crop_select_wrapper = "#select-" + crop_id
    $(".infliction").hide()
    $(crop_select_wrapper).show()
    change_pest($('#pest-select-' + crop_id)[0])
  )

  for pest_entry in $(".infliction-select")
    google.maps.event.addDomListener($(pest_entry)[0], 'change', (event) ->
      change_pest($(event.target))
    )

  change_pest = (pest) ->
    pest_id = $(pest).val()
    Database.fetchPestInfo(pest_id, (pest_info) ->
      change_pest_info(pest, pest_info.info)
      change_pest_info_link(pest_info.pest_link)
      change_start_date(new Date(moment(pest_info.biofix)))
      toggle_end_date(pest_info.end_date_enabled)
    )

  change_pest_info = (pest, new_info) ->
      $(pest).parent()
        .find('span')
        .remove()
      $(pest).parent()
        .append('<span class="more-information" title="" id="infliction-select-information">?</span>')
        .tooltip(content: new_info)

  change_pest_info_link = (new_link) ->
    $('#more-information-link').attr('href', "http://" + new_link)

  toggle_end_date = (enabled) ->
    if enabled
      $('#datepicker-end').prop('disabled', false)
    else
      $('#datepicker-end').prop('disabled', true)

  createDatePicker = (options) ->

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

  change_start_date = (new_date) ->
    if new_date > new Date()
      startPicker.setDate(moment().subtract(7,'d').toDate())
    else
      startPicker.setDate(new_date)

  endPicker = createDatePicker(
    defaultDate: endDate
    minDate: startPicker.getDate()
    field: $('#datepicker-end')[0]
  )

  initializer = () ->
    init_crop_id = $('#crop-select')[0].value
    pest = $('#pest-select-' + init_crop_id)[0]
    change_pest(pest)
    start_date = moment((new Date()).getFullYear() + "0101", "YYYYMMDD").toDate()
    Database.fetchSeverities(start_date, endPicker.getDate(),
      pest.value, map.severityOverlay.bind(map))
    Database.fetchSeverityLegend(pest.value)

  initializer()

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
      point = new DataPoint(1, new google.maps.LatLng(severity.lat, severity.long), severity.severity)
      @dataPoints.push(point)
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
      crop = $('#crop-select')[0].value
      pest = $('#pest-select-' + crop)[0].value
      $(content).attr("id", "iw-container")
      content.innerHTML =  Mustache.render($('#infowindow-tmpl').html())
      infowindow.open(map)
      infowindow.setContent(content)
      Database.fetchPointDetails(latitude, longitude, $('#datepicker-start')[0].value, $('#datepicker-end')[0].value, pest, (newContent) ->
        content.innerHTML = newContent
        $(content).find(".more-information").tooltip(
          content: ->
            $(this).data("tooltip")
        )
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
        pest_id: type
      type: 'POST'
      dataType: 'html'
      error: (jqxhr, textstatus, errorthrown) ->
        $('body').append "ajax error: #{textstatus}"
      success: (data, textStatus, jqXHR) =>
        $('#severity-legend').html(data)
        $("#severity-legend").find(".more-information").tooltip(
          content: ->
            $(this).data("tooltip")
        )


  @fetchPointDetails: (lat, long, start_date, end_date, pest, callback) =>
    $.ajax
      url: Routes.point_details_db_index_path()
      data:
        latitude: lat
        longitude: long
        start_date: start_date
        end_date: end_date
        pest_id: pest
      type: 'POST'
      dataType: 'html'
      error: (jqxhr, textstatus, errorthrown) ->
        $('body').append "ajax error: #{textstatus}"
      success: (data, textStatus, jqXHR) =>
        callback(data)

  @fetchPestInfo: (pest, callback) =>
    $.ajax
      url: Routes.pest_info_db_index_path()
      data:
        pest_id: pest
      type: 'POST'
      dataType: 'json'
      error: (jqxhr, textstatus, errorthrown) ->
        $('body').append "ajax error: #{textstatus}"
      success: (data, textStatus, jqXHR) =>
        callback(data)
