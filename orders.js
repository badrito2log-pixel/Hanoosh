/* ════════════════════════════════════════════
   HANOOSH CAFÉ — orders.js
   Kitchen Display: real-time, sound alerts, status management
   ════════════════════════════════════════════ */

const PASS = 'hanoosh2026';

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const getOrders = () => { try { return JSON.parse(localStorage.getItem('horders') || '[]'); } catch (e) { return []; } };
const saveOrders = o => localStorage.setItem('horders', JSON.stringify(o));

let currentTab = 'active';
let soundOn = localStorage.getItem('hkdSound') !== '0';
let lastOrderCount = 0;
let pulsingIds = new Set();

document.addEventListener('DOMContentLoaded', () => {

    // Session
    if (sessionStorage.getItem('hkdAuth') === '1') {
        showDashboard();
    }

    $('btnLogin').addEventListener('click', doLogin);
    $('adminPass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

    function doLogin() {
        if ($('adminPass').value === PASS) {
            sessionStorage.setItem('hkdAuth', '1');
            showDashboard();
        } else {
            $('loginError').textContent = '❌ Incorrect password.';
            $('adminPass').value = '';
            $('adminPass').focus();
        }
    }

    function showDashboard() {
        $('loginGate').style.display = 'none';
        $('kdWrap').style.display = 'flex';
        initKitchen();
    }

    $('btnLogout').addEventListener('click', () => {
        sessionStorage.removeItem('hkdAuth');
        location.reload();
    });

});

function initKitchen() {
    // Initial count
    lastOrderCount = getOrders().filter(o => o.status !== 'served').length;

    // Tabs
    $$('.kd-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('.kd-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.tab;
            render();
        });
    });

    // Sound toggle
    updateSoundIcon();
    $('btnSound').addEventListener('click', () => {
        soundOn = !soundOn;
        localStorage.setItem('hkdSound', soundOn ? '1' : '0');
        updateSoundIcon();
    });

    // Clock
    const updateClock = () => {
        const d = new Date();
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        $('kdClock').textContent = hh + ':' + mm;
    };
    updateClock();
    setInterval(updateClock, 10000);

    // Listen for new orders (cross-tab via storage event)
    window.addEventListener('storage', e => {
        if (e.key === 'horderPing' || e.key === 'horders') {
            checkForNewOrders();
            render();
        }
    });

    // Poll every 3s (for same-tab consistency + elapsed time update)
    setInterval(() => {
        checkForNewOrders();
        render();
    }, 3000);

    render();
}

function updateSoundIcon() {
    $('iconSoundOn').style.display = soundOn ? 'block' : 'none';
    $('iconSoundOff').style.display = soundOn ? 'none' : 'block';
    $('btnSound').classList.toggle('muted', !soundOn);
}

function checkForNewOrders() {
    const orders = getOrders();
    const activeCount = orders.filter(o => o.status !== 'served').length;
    if (activeCount > lastOrderCount) {
        // New order arrived
        const newest = orders.filter(o => o.status === 'new').sort((a, b) => b.createdAt - a.createdAt)[0];
        if (newest) {
            pulsingIds.add(newest.id);
            setTimeout(() => { pulsingIds.delete(newest.id); render(); }, 5000);
        }
        if (soundOn) playBeep();
    }
    lastOrderCount = activeCount;
}

function playBeep() {
    try {
        // Generate a beep with Web Audio API (more reliable than audio tag)
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);

        // Second beep
        setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.type = 'sine';
            osc2.frequency.value = 1100;
            gain2.gain.setValueAtTime(0.001, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc2.start(ctx.currentTime);
            osc2.stop(ctx.currentTime + 0.4);
        }, 180);
    } catch (e) {
        console.log('Sound unavailable');
    }
}

function render() {
    const orders = getOrders();

    // Update counts
    $('countActive').textContent = orders.filter(o => o.status === 'new').length;
    $('countPrep').textContent = orders.filter(o => o.status === 'preparing').length;
    $('countReady').textContent = orders.filter(o => o.status === 'ready').length;

    // Filter by current tab
    let filtered;
    if (currentTab === 'active') filtered = orders.filter(o => o.status === 'new');
    else if (currentTab === 'preparing') filtered = orders.filter(o => o.status === 'preparing');
    else if (currentTab === 'ready') filtered = orders.filter(o => o.status === 'ready');
    else if (currentTab === 'history') filtered = orders.filter(o => o.status === 'served').slice(-30).reverse();
    else filtered = orders;

    // Sort: oldest first for active (FIFO), newest first for history
    if (currentTab !== 'history') {
        filtered.sort((a, b) => a.createdAt - b.createdAt);
    }

    const main = $('kdMain');

    if (!filtered.length) {
        main.innerHTML = `
            <div class="kd-empty">
                <div class="kd-empty-icon">${currentTab === 'history' ? '📜' : '🍽️'}</div>
                <h3>${emptyTitle()}</h3>
                <p>${emptySub()}</p>
            </div>`;
        return;
    }

    main.innerHTML = filtered.map(o => renderCard(o)).join('');

    // Bind actions
    main.querySelectorAll('[data-act]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const act = btn.dataset.act;
            updateStatus(id, act);
        });
    });
}

function emptyTitle() {
    if (currentTab === 'active') return 'No new orders';
    if (currentTab === 'preparing') return 'Nothing in preparation';
    if (currentTab === 'ready') return 'No orders ready';
    if (currentTab === 'history') return 'No orders served yet';
    return 'No orders';
}

function emptySub() {
    if (currentTab === 'active') return 'Waiting for customers...';
    if (currentTab === 'preparing') return 'Start an order to begin cooking.';
    if (currentTab === 'ready') return 'Prepared orders will appear here.';
    return '';
}

function renderCard(o) {
    const elapsed = getElapsed(o.createdAt);
    const timeClass = o.status === 'served' ? '' : elapsed.minutes >= 15 ? 'urgent' : elapsed.minutes >= 8 ? 'warn' : '';
    const isPulsing = pulsingIds.has(o.id) ? 'pulse' : '';

    const action = getActionButton(o);

    return `
        <div class="order-card ${isPulsing}" data-status="${o.status}">
            <div class="order-head">
                <div>
                    <div class="order-num">#${String(o.num).padStart(3, '0')}</div>
                    <div class="order-time ${timeClass}">${elapsed.label}</div>
                </div>
                <span class="order-badge order-badge-${o.type === 'dine-in' ? 'dinein' : 'takeaway'}">
                    ${o.type === 'dine-in' ? '🍽️ Dine In' : '🥡 Takeaway'}
                </span>
            </div>

            <div class="order-customer">
                <div class="oc-line"><span class="oc-label">Name</span><strong>${escape(o.customer.name)}</strong></div>
                ${o.type === 'dine-in'
                    ? `<div class="oc-line"><span class="oc-label">Table</span><strong>${escape(o.customer.table)}</strong></div>`
                    : `<div class="oc-line"><span class="oc-label">Phone</span><strong>${escape(o.customer.phone)}</strong></div>`}
            </div>

            <div class="order-items">
                ${o.items.map(it => `
                    <div class="order-item">
                        <div class="oi-qty">${it.qty}×</div>
                        <div class="oi-body">
                            <div class="oi-name">${escape(it.name)}</div>
                            ${it.opts && it.opts.length ? `<div class="oi-opts">✓ ${escape(it.opts.join(' · '))}</div>` : ''}
                            ${it.note ? `<div class="oi-note">💬 ${escape(it.note)}</div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="order-foot">
                <div class="order-total">
                    <small>Total</small>
                    $${o.total.toFixed(2)}
                </div>
                ${action}
            </div>
        </div>
    `;
}

function getActionButton(o) {
    if (o.status === 'new') {
        return `
            <button class="btn-action btn-cancel" data-act="cancel" data-id="${o.id}">Cancel</button>
            <button class="btn-action btn-start" data-act="start" data-id="${o.id}">▶ Start Preparing</button>`;
    }
    if (o.status === 'preparing') {
        return `<button class="btn-action btn-ready" data-act="ready" data-id="${o.id}">✓ Mark Ready</button>`;
    }
    if (o.status === 'ready') {
        return `<button class="btn-action btn-served" data-act="serve" data-id="${o.id}">✓ Served</button>`;
    }
    if (o.status === 'served') {
        return `<span style="color:var(--t3);font-size:.85rem">✓ Served</span>`;
    }
    return '';
}

function updateStatus(id, act) {
    const orders = getOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx < 0) return;

    if (act === 'start') orders[idx].status = 'preparing';
    else if (act === 'ready') orders[idx].status = 'ready';
    else if (act === 'serve') orders[idx].status = 'served';
    else if (act === 'cancel') {
        if (!confirm('Cancel this order?')) return;
        orders.splice(idx, 1);
    }

    saveOrders(orders);
    render();
}

function getElapsed(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    const minutes = Math.floor(diff / 60);
    if (diff < 60) return { minutes: 0, label: 'Just now' };
    if (minutes === 1) return { minutes: 1, label: '1 min ago' };
    if (minutes < 60) return { minutes, label: minutes + ' min ago' };
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return { minutes, label: h + 'h ' + m + 'm ago' };
}

function escape(str) {
    return String(str || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
