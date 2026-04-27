const app = {
    init: function () {
        lucide.createIcons();
        this.initMap();
        this.initCharts();
    },

    login: function () {
        document.getElementById('screen-auth').classList.remove('active');
        document.getElementById('screen-main').classList.add('active');
        this.notify("System Access", "Authentication successful.");
    },

    nav: function (viewId, el) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.getElementById('view-' + viewId).classList.add('active');
        el.classList.add('active');
    },

    initMap: function () {
        require(["esri/Map", "esri/views/MapView"], (Map, MapView) => {
            const map = new Map({ basemap: "hybrid" });
            new MapView({
                container: "viewDiv",
                map: map,
                center: [28.23, -12.85], // Zambia Copperbelt
                zoom: 12
            });
        });
    },

    initCharts: function () {
        const ctx = document.getElementById('aiChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['08:00', '10:00', '12:00', '14:00', '16:00'],
                datasets: [{
                    label: 'Structural Integrity',
                    data: [94, 95, 94.2, 93.8, 94.8],
                    borderColor: '#2E7D32',
                    fill: false
                }]
            }
        });
    },

    runAIScan: function () {
        this.notify("AI Scan", "Analyzing satellite and sensor telemetry...");
        setTimeout(() => alert("Analysis Complete: Stability Nominal."), 1500);
    },

    startVoice: function () {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Voice not supported in this browser.");
        const rec = new SpeechRecognition();
        rec.onresult = (e) => document.getElementById('voice-output').value = e.results[0][0].transcript;
        rec.start();
        this.notify("Mic Active", "Recording inspection notes.");
    },

    triggerEmergency: function () {
        document.getElementById('stability-val').innerText = "CRITICAL";
        document.getElementById('ai-status').style.border = "2px solid red";
        this.notify("EMERGENCY", "Siren triggered. Alerts sent to all users.");
    },

    genReport: function (type) {
        const text = "MUKU PRO SAFETY REPORT\nStatus: Active\nStability: 94.8%";
        const blob = new Blob([text], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "Report.txt";
        a.click();
    },

    toggleTheme: function () {
        const current = document.body.getAttribute('data-theme');
        document.body.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    },

    notify: function (title, body) {
        const toast = document.getElementById('toast');
        document.getElementById('toast-title').innerText = title;
        document.getElementById('toast-body').innerText = body;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 4000);
    }
};

window.onload = () => app.init();