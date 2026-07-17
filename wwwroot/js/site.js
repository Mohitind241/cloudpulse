// CloudPulse - Live Metrics JavaScript
// Built by Mohit | mohitdocker241

(function () {
    'use strict';

    // ── Simulate live system metrics ──
    let cpuHistory = [];
    let memHistory = [];
    let diskHistory = [];
    let netHistory = [];

    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateMetrics() {
        const cpu  = randomBetween(18, 72);
        const mem  = randomBetween(40, 78);
        const disk = randomBetween(5, 45);
        const net  = randomBetween(10, 60);

        // Update hero card
        setTextSafe('cpu-val',    cpu  + '%');
        setTextSafe('mem-val',    mem  + '%');
        setTextSafe('disk-val',   disk + ' MB/s');
        setTextSafe('uptime-val', getUptime());

        // Update stat cards
        setTextSafe('cpu-stat', cpu  + '%');
        setTextSafe('mem-stat', mem  + '%');

        // Update gauge bars + values
        setGauge('cpu-bar',  'cpu-pct',  cpu,  '%');
        setGauge('mem-bar',  'mem-pct',  mem,  '%');
        setGauge('disk-bar', 'disk-pct', disk, ' MB/s');
        setGauge('net-bar',  'net-pct',  net,  ' Mbps');

        // Update history bars
        cpuHistory.push(cpu);
        memHistory.push(mem);
        diskHistory.push(disk);
        netHistory.push(net);
        if (cpuHistory.length > 20)  cpuHistory.shift();
        if (memHistory.length > 20)  memHistory.shift();
        if (diskHistory.length > 20) diskHistory.shift();
        if (netHistory.length > 20)  netHistory.shift();

        renderHistory('cpu-history',  cpuHistory,  100);
        renderHistory('mem-history',  memHistory,  100);
        renderHistory('disk-history', diskHistory, 100);
        renderHistory('net-history',  netHistory,  100);

        // Update pipeline table times
        const now = new Date().toLocaleTimeString();
        for (let i = 1; i <= 6; i++) {
            setTextSafe('time-' + i, now);
        }
    }

    function setTextSafe(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    function setGauge(barId, valId, value, unit) {
        const bar = document.getElementById(barId);
        const val = document.getElementById(valId);
        if (bar) bar.style.width = value + '%';
        if (val) val.textContent = value + unit;
    }

    function renderHistory(containerId, data, max) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = data.map(v => {
            const h = Math.max(4, Math.round((v / max) * 40));
            return `<div class="history-bar" style="height:${h}px;"></div>`;
        }).join('');
    }

    function getUptime() {
        const start = new Date('2024-01-15T08:00:00');
        const now   = new Date();
        const diff  = Math.floor((now - start) / 1000);
        const d = Math.floor(diff / 86400);
        const h = Math.floor((diff % 86400) / 3600);
        const m = Math.floor((diff % 3600) / 60);
        return d + 'd ' + h + 'h ' + m + 'm';
    }

    // Start live updates
    updateMetrics();
    setInterval(updateMetrics, 2000);

    // ── Animate elements on scroll ──
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stat-card, .pipeline-stage, .tech-card, .metric-card, .about-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    console.log('%c☁️ CloudPulse by Mohit | mohitdocker241', 'color:#6366f1; font-size:14px; font-weight:bold;');
})();
