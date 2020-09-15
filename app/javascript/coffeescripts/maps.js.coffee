import { Options, InsectOptions } from './options.js.coffee'
import { Database } from './database.js.coffee'
import Mustache from 'mustache'
import Routes from '../routes/js-routes.js.erb'
$ ->
  map = new ForecastMap($('#google-map')[0])

  $(".infliction:first").show()

  $(".more-information-left").qtip
    content: ->
      $(this).data("tooltip")
    style:
      classes: 'qtip-light qtip-rounded qtip-shadow qtip-vdifn'
    position:
      my: 'right bottom'
      at: 'top left'

  $(".more-information").qtip
    content: ->
      $(this).data("tooltip")
    hide:
      fixed: true
    style:
      classes: 'qtip-light qtip-rounded qtip-shadow qtip-vdifn'

  $('input[type=radio]').on 'change', (event) ->
    change_interface(event.target.value)

  change_interface = (interface_name) ->
    $.ajax
      url: Routes.sidebar_maps_path()
      data:
        interface: interface_name
      type: 'POST'
      dataType: 'html'
      error: (jqxhr, textstatus, errorthrown) ->
        $('body').append "ajax error: #{textstatus}"
      success: (data, textStatus, jqXHR) =>
        $('#interface-options').replaceWith(data)
        $(".infliction:first").show()
        if interface_name == 'disease'
          new Options(map)
        else
          new InsectOptions(map)

  new Options(map)

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
    @stations = []
    # taking the station marker off the map.
    # Database.fetchStations(this.placeStations.bind(this))
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

  placeStations: (data) ->
    for station in data
      station = new Station(1, station.name, new google.maps.LatLng(station.lat, station.long))
      @stations.push(station)
      station.draw(this)

  reload: (start_date, end_date, pest) ->
    this.closeInfoWindow()
    this.clearDataPoints()
    this.openLoadingOverlay()
    Database.fetchSeverityLegend(pest)
    Database.fetchSeverities(
      start_date,
      end_date,
      pest,
      this.severityOverlay.bind(this))

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
      content.innerHTML = Mustache.render($('#infowindow-tmpl').html())
      infowindow.open(map)
      infowindow.setContent(content)
      Database.fetchPointDetails(latitude, longitude, $('#datepicker-start')[0].value, $('#datepicker-end')[0].value, pest, (newContent) ->
        content.innerHTML = newContent
        $(content).find(".more-information").qtip(
          content: ->
            $(this).data("tooltip")
          style:
            classes: 'qtip-light qtip-rounded qtip-shadow qtip-vdifn'
        )
      )
    )

class Station
  constructor: (@id, @title, @latLng) ->
    @drawn = false

  draw: (forecastMap) ->
    map = forecastMap.getMap()

    @map_object = new google.maps.Marker(
      position: @latLng
      map: map
      title: @title)

    @map_object.addListener('click', (event) ->
      forecastMap.closeInfoWindow()
      forecastMap.infoWindow = new google.maps.InfoWindow(
        position: event.latLng
      )

      infowindow = forecastMap.infoWindow
      content = document.createElement("div")
      $(content).attr("id", "iw-container")
      content.innerHTML =  Mustache.render($('#station-infowindow-tmpl').html())
      infowindow.open(map)
      infowindow.setContent(content)
      Database.fetchStationDetails(@title, $('#datepicker-start')[0].value, $('#datepicker-end')[0].value, (newContent) ->
        content.innerHTML = newContent
        $(content).find(".more-information").qtip(
          content: ->
            $(this).data("tooltip")
          style:
            classes: 'qtip-light qtip-rounded qtip-shadow qtip-vdifn'
        )
      )
    )
