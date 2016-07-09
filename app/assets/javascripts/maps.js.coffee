$ ->
  INITIAL_LATITUDE = 45.05024026979463
  INITIAL_LONGITUDE = -90.274658203125
  INITIAL_ZOOM = 8

  map = new google.maps.Map($("#map")[0], 
    center: lat: INITIAL_LATITUDE, lng: INITIAL_LONGITUDE
    mapTypeControl: true,
    mapTypeControlOptions: 
      mapTypeIds: [google.maps.MapTypeId.TERRAIN, google.maps.MapTypeId.HYBRID],
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    maxZoom: 12,
    minZoom: 6,
    streetViewControl: false,
    zoom: INITIAL_ZOOM
  )
