mapboxgl.accessToken = 'pk.eyJ1IjoiZmlubmVoIiwiYSI6ImNrODQyZWxiZjBqazAzZm85bndxZTQycW0ifQ.kU3n1xZMj7WA1JSO44f14Q' // replace this with your access token
let stopTypes = ['metrostops', 'vlinestops', 'tramstops']

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/finneh/ckjtu5t9y07rv19rywf2wsr4y', // replace this with your style URL
  center: [144.966964, -37.818305],
  zoom: 10.7
})

map.on('click', function(e) {
  let features = map.queryRenderedFeatures(e.point, {
    layers: stopTypes
  })

  let feature
  if (feature = features[0]) {
    var popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(`
<center>
  <h3>${feature.properties.stop_name}</h3>
  <p style="font: "Network Sans 2019">
    Stop GTFS ID #${feature.properties.stop_id}
    <br>
    This is a test
  <p>
</center>`)
    .addTo(map)
  }
})

map.addControl(new mapboxgl.NavigationControl())

stopTypes.forEach(type => {
  map.on('click', type, function (e) {
    map.flyTo({
      center: e.features[0].geometry.coordinates,
      zoom: 15.2
    })
  })

  map.on('mouseenter', type, function () {
    map.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', type, function () {
    map.getCanvas().style.cursor = ''
  })
})
