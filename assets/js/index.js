// Set the Mapbox access token
console.log('Setting Mapbox access token');
mapboxgl.accessToken = 'pk.eyJ1IjoiZmlubmVoIiwiYSI6ImNrODQyZWxiZjBqazAzZm85bndxZTQycW0ifQ.kU3n1xZMj7WA1JSO44f14Q';

// Define the types of stops
console.log('Defining stop types');
let stopTypes = ['metrostops', 'vlinestops', 'tramstops'];

// Create a new Mapbox map
console.log('Creating a new Mapbox map');
let map = new mapboxgl.Map({
  container: 'map', // The DOM element to which the map will be appended
  style: 'mapbox://styles/finneh/ckjtu5t9y07rv19rywf2wsr4y', // The Mapbox style URL
  center: [144.966964, -37.818305], // The initial geographical center of the map
  zoom: 10.7 // The initial zoom level of the map
});

/**
 * Returns a debounced function that delays invoking 'func' until after 'wait' milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param {function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @return {function} The debounced function
 */
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Create a new Mapbox popup with offset
console.log('Creating a new Mapbox popup with offset');
const popup = new mapboxgl.Popup({ offset: [0, -15] });

// Attach a debounced click event listener to the map
console.log('Attaching a debounced click event listener to the map');
map.on('click', debounce((e) => {
  // Query the rendered features at the clicked point
  console.log('Querying the rendered features at the clicked point');
  const features = map.queryRenderedFeatures(e.point, { layers: stopTypes });
  // Get the first feature
  const feature = features[0];
  // If a feature exists
  if (feature) {
    // Create a popup at the feature's coordinates with stop information
    popup
      .setLngLat(feature.geometry.coordinates)
      .setHTML(`
        <center>
          <h3>${feature.properties.stop_name}</h3>
          <p style="font: 'Network Sans 2019'">
            Stop GTFS ID #${feature.properties.stop_id}
            <br>
            This is a test
          <p>
        </center>`)
      .addTo(map);
  }
}, 250));

// Add navigation control to the map
console.log('Adding navigation control to the map');
map.addControl(new mapboxgl.NavigationControl());

/**
 * Adds event listeners for the given layer type.
 * @param {string} type The layer type, e.g. 'metrostops'.
 */
stopTypes.forEach((type) => {
  console.log(`Adding event listeners for ${type}`);
  // Add click event listener to the map for the given layer type
 // Add click event listener to the map for the given layer type
map.on('click', type, (e) => {
  const [lng, lat] = e.features[0].geometry.coordinates
  console.log(lng,lat) // Extract the first pair of coordinates
  map.flyTo({
    center: [lng, lat], // Use the extracted coordinates
    zoom: 15.2
  });
});

  // Add mouseenter event listener to the map for the given layer type
  map.on('mouseenter', type, () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Add mouseleave event listener to the map for the given layer type
  map.on('mouseleave', type, () => {
    map.getCanvas().style.cursor = '';
  });
});