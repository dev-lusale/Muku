require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer"
], function (Map, MapView, FeatureLayer) {

    const map = new Map({
        basemap: "hybrid" // Essential for vegetation viewing
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [28.23, -12.85], // Kitwe, Copperbelt
        zoom: 11
    });

    // Add Tailings Layer (Example URL - Replace with your QGIS-published URL)
    const tailingsLayer = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLZJsSxQAYh9f/arcgis/rest/services/World_Mining_Sites/FeatureServer/0",
        outFields: ["*"],
        popupTemplate: {
            title: "Site: {FacilityName}",
            content: "Status: {Status}<br>Veg Index (NDVI): 0.72"
        }
    });

    map.add(tailingsLayer);

    window.mapView = view; // Global access for navigation
});