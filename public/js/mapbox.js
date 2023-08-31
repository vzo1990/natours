/* eslint-disable */
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidnpvcmljaGV2IiwiYSI6ImNsbG1lMWNrajFnaWYzZmx3bG9xNHVsOWYifQ.-38bFnQcqiHBFWJIZ3PmBg';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/vzorichev/cllmef6pl02i401mfhq5c1ao8',
    interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    const pin = document.createElement('div');
    pin.className = 'marker';

    new mapboxgl.Marker({
      element: pin,
      anchor: 'bottom',
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .setMaxWidth('300px')
      .addTo(map);

    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, { padding: 150 });
};
