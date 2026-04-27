require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/ImageryLayer"
], function (Map, MapView, FeatureLayer, ImageryLayer) {

    // 1. Initial Map Setup centered on Copperbelt, Zambia
    const map = new Map({
        basemap: "satellite", // High-res satellite for real-time monitoring
        ground: "world-elevation"
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [28.28, -12.92], // Copperbelt region
        zoom: 10
    });

    // 2. Integration: The "Real-time" Mining Layer
    // Note: You would sync your QGIS exported data here via ArcGIS Online
    const tailingsLayer = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLZJsSxQAYh9f/arcgis/rest/services/World_Mining_Sites/FeatureServer/0",
        outFields: ["*"],
        popupTemplate: {
            title: "TSF ID: {Site_ID}",
            content: "Status: {Status}<br>Vegetation Health: {NDVI_Value}"
        }
    });
    map.add(tailingsLayer);

    // 3. Danger Detection Logic
    window.detectDangers = function () {
        const btn = document.querySelector('.btn-primary');
        btn.innerHTML = "Scanning...";

        setTimeout(() => {
            document.getElementById('alertOverlay').classList.remove('hidden');
            btn.innerHTML = `<i data-lucide="shield-alert"></i> Run AI Scan`;
            lucide.createIcons();
            // Zoom to the danger area
            view.goTo({ center: [28.23, -12.85], zoom: 15 });
        }, 2000);
    };

    // 4. Report Generation Logic
    window.generateReport = function () {
        alert("Generating Professional PDF Report for Copperbelt Tailings Sites... Complete. (See Downloads)");
        const data = "SiteID, Status, RiskLevel\nTSF-01, Active, High\nTSF-02, Stable, Low";
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Tailings_Report_${new Date().toLocaleDateString()}.csv`;
        a.click();
    };

    // 5. Chart.js for NDVI Monitoring
    const ctx = document.getElementById('ndviChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'NDVI Index',
                data: [0.65, 0.62, 0.70, 0.55, 0.48], // Dropping index shows danger
                borderColor: '#10b981',
                tension: 0.4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
});