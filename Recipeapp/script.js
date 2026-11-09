/* ============ 雷达图数据 ============ */
const data = {
    familiarity: 7,
    effort: 3,
    budget: 9,
    time: 5
};

const MAX_RADIUS = 150;
const CENTER = 172;

const sectors = [
    { id: 'familiarity', startAngle: -45, endAngle: 45 },
    { id: 'effort',      startAngle: 45,  endAngle: 135 },
    { id: 'budget',      startAngle: 135, endAngle: 225 },
    { id: 'time',        startAngle: 225, endAngle: 315 }
];

function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = (angleDeg - 90) * Math.PI / 180.0;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end   = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", x, y, "Z"
    ].join(" ");
}

/* 兼容多种 id 前缀：main / step1 / step2 / step3 / step4 / step5 / 无前缀 */
function findEl(prefix, suffix) {
    return document.getElementById(`${prefix}-${suffix}`)
        || document.getElementById(suffix);
}

function updateChart() {
    sectors.forEach(s => {
        const val = data[s.id];
        const radius = (val / 10) * MAX_RADIUS;
        const d = describeArc(CENTER, CENTER, radius, s.startAngle, s.endAngle);

        ['main', 'step1', 'step2', 'step3', 'step4', 'step5', ''].forEach(prefix => {
            const p = findEl(prefix, `sector-${s.id}`) || findEl(prefix, `step1-sector-${s.id}`);
            // 简化：直接按已知 id 查
        });

        // 直接列出所有可能的 id
        const pathIds = [
            `sector-${s.id}`,
            `main-sector-${s.id}`,
            `step1-sector-${s.id}`,
            `step2-sector-${s.id}`,
            `step3-sector-${s.id}`,
            `step4-sector-${s.id}`,
            `step5-sector-${s.id}`
        ];
        pathIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.setAttribute('d', d);
        });

        const valIds = [
            `val-${s.id}`,
            `main-val-${s.id}`,
            `step1-val-${s.id}`,
            `step2-val-${s.id}`,
            `step3-val-${s.id}`,
            `step4-val-${s.id}`,
            `step5-val-${s.id}`
        ];
        valIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = val;
        });
    });
}

function updateValue(key, delta) {
    data[key] = Math.max(1, Math.min(10, data[key] + delta));
    updateChart();
}

function goToPage(id) {
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
}

window.addEventListener('DOMContentLoaded', updateChart);