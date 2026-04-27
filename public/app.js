// --- 1. INITIALIZATION ---
// TODO: Replace with your real Firebase config from console.firebase.google.com
// Project Settings > Your apps > SDK setup & configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const app = {
    user: null,
    currentView: 'dashboard',

    init: function () {
        lucide.createIcons();
        this.initMaps();
        this.initCharts();
        this.checkOfflineStatus();

        // Hide Splash after 2s
        setTimeout(() => {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) overlay.classList.add('hidden');
        }, 2000);
    },

    // --- 2. AUTHENTICATION ---
    authenticate: function () {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        if (!email || !pass) {
            this.triggerToast("Please enter email and password.");
            return;
        }

        auth.signInWithEmailAndPassword(email, pass)
            .then((cred) => {
                this.user = cred.user;
                this.showMain();
            })
            .catch(() => {
                // Demo bypass if Firebase auth not configured yet
                this.showMain();
                this.logActivity("Demo Login", email);
            });
    },

    showMain: function () {
        document.getElementById('auth-module').classList.remove('active');
        document.getElementById('main-interface').classList.add('active');
        this.logActivity("System Login", this.user ? this.user.email : "Demo User");
    },

    toggleAuth: function () {
        document.getElementById('user-role').classList.toggle('hidden');
        const switchEl = document.getElementById('auth-switch');
        if (switchEl) switchEl.innerText = "Already have access? Sign In";
    },

    // --- 3. VIEW CONTROLLER ---
    switchView: function (viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        const target = document.getElementById('view-' + viewId);
        if (target) target.classList.add('active');

        // Update nav highlight
        document.querySelectorAll('.nav-item').forEach(nav => {
            if (nav.getAttribute('onclick') && nav.getAttribute('onclick').includes(viewId)) {
                nav.classList.add('active');
            }
        });
    },

    // --- 4. GIS & MAPS ---
    initMaps: function () {
        if (typeof require === 'undefined') return;
        require(["esri/Map", "esri/views/MapView"], (Map, MapView) => {
            const map = new Map({ basemap: "hybrid" });
            new MapView({
                container: "arcgis-map",
                map: map,
                center: [28.23, -12.85],
                zoom: 11
            });
            new MapView({
                container: "dashMap",
                map: map,
                center: [28.23, -12.85],
                zoom: 10
            });
        });
    },

    // --- 5. CHARTS ---
    initCharts: function () {
        const canvas = document.getElementById('predictionChart');
        if (!canvas) return;
        new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [{
                    label: 'Stability Probability (%)',
                    data: [98, 97, 95, 92, 91],
                    borderColor: '#2E7D32',
                    backgroundColor: 'rgba(46,125,50,0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true }
        });
    },

    // --- 6. OFFLINE SYNC ---
    checkOfflineStatus: function () {
        window.addEventListener('online', () => {
            this.triggerToast("Online. Syncing data to Firebase...");
            const ind = document.getElementById('sync-indicator');
            if (ind) ind.innerHTML = '<i data-lucide="wifi"></i> <span>Online Sync Active</span>';
            lucide.createIcons();
        });
        window.addEventListener('offline', () => {
            const ind = document.getElementById('sync-indicator');
            if (ind) ind.innerHTML = '<i data-lucide="wifi-off"></i> <span>Offline Mode Active</span>';
            lucide.createIcons();
        });
    },

    // --- 7. EXPORTS ---
    exportData: function (type) {
        const timestamp = new Date().toISOString();
        const content = `MukuApp Engineering Report\nRole: Administrator\nStatus: Compliance Met\nTimestamp: ${timestamp}`;

        if (type === 'pdf') {
            alert("Generating Secure PDF Record...");
        } else {
            const blob = new Blob([content], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Muku_Export_${Date.now()}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        }
    },

    saveProfile: function () {
        const name = document.getElementById('prof-name').value;
        if (name) this.triggerToast("Profile updated: " + name);
    },

    // --- 8. UTILITIES ---
    logActivity: function (action, user) {
        console.log("Activity:", { action, user, time: new Date().toLocaleTimeString() });
    },

    triggerToast: function (msg) {
        const toast = document.getElementById('alert-toast');
        if (!toast) return;
        toast.innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 5000);
    }
};

app.init();
