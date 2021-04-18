/* eslint-disable */

export const showMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWF0aGV1c3RyaW5jYSIsImEiOiJja25tYzBmeXQwcDh4MnBwZmJoamM4bmhhIn0.pcd-Zl14BdsFi_Dd26GI4Q';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/matheustrinca/cknm9mltp0s7a17mgv9qhtoqp',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30, // Um pouco para cima
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
