/* ════════════════════════════════════════════
   HANOOSH CAFÉ — script.js (main site)
   Admin logic is now in settings.js
   ════════════════════════════════════════════ */

const CATS = {
    breakfast: '🍳 Breakfast',
    plats: '🍽️ Dishes',
    patisseries: '🍰 Pastries',
    jus: '🥤 Juices',
    cafes: '☕ Coffee'
};

const DEF_MENU = [
    { id: 'b1', cat: 'breakfast', name: 'Hanoosh Full Breakfast', desc: 'Eggs, toast, salad, beans & coffee.', price: '$8', img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80', badge: 'Morning Fav' },
    { id: 'b2', cat: 'breakfast', name: 'Fluffy Pancakes', desc: 'Golden pancakes with honey & fruits.', price: '$6', img: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80', badge: '' },
    { id: 'b3', cat: 'breakfast', name: "Chef's Omelette", desc: 'Three-egg omelette with herbs.', price: '$7', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80', badge: '' },
    { id: 'd1', cat: 'plats', name: 'Hanoosh Special Platter', desc: 'Grilled meat, fries, bread & sauce.', price: '$12', img: 'images/hanoosh-plat.jpg', badge: 'Signature' },
    { id: 'd2', cat: 'plats', name: 'Bariis Iskukaris', desc: 'Somali spiced rice with meat.', price: '$10', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80', badge: '' },
    { id: 'd3', cat: 'plats', name: 'Grilled Chicken Salad', desc: 'Chicken, greens, chips & dressing.', price: '$9', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', badge: '' },
    { id: 'p1', cat: 'patisseries', name: 'Hanoosh Dessert Selection', desc: 'Colorful house-made desserts.', price: '$6', img: 'images/hanoosh-desserts.jpg', badge: 'Best Seller' },
    { id: 'p2', cat: 'patisseries', name: 'Chocolate Fondant', desc: 'Dark chocolate cake, molten center.', price: '$5.50', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', badge: '' },
    { id: 'p3', cat: 'patisseries', name: 'Berry Cheesecake', desc: 'Creamy cheesecake, berry compote.', price: '$5', img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80', badge: '' },
    { id: 'j1', cat: 'jus', name: 'Fresh Orange Juice', desc: 'Freshly squeezed, no sugar.', price: '$3.50', img: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80', badge: 'Fresh' },
    { id: 'j2', cat: 'jus', name: 'Mango Smoothie', desc: 'Mango, passion fruit, banana.', price: '$4.50', img: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=600&q=80', badge: '' },
    { id: 'j3', cat: 'jus', name: 'Mint Lemonade', desc: 'Lemon, mint, honey.', price: '$3', img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80', badge: '' },
    { id: 'c1', cat: 'cafes', name: 'Hanoosh Cappuccino', desc: 'Espresso, steamed milk, cocoa.', price: '$3.50', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', badge: 'Signature' },
    { id: 'c2', cat: 'cafes', name: 'Vanilla Latte', desc: 'Espresso, milk, natural vanilla.', price: '$4', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80', badge: '' },
    { id: 'c3', cat: 'cafes', name: 'Shaah (Somali Tea)', desc: 'Spiced tea, cardamom, cinnamon.', price: '$2.50', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80', badge: '' },
];

const DEF_GALLERY = [
    { id: 'g1', img: 'images/hanoosh-interior-2.webp', label: 'Our Space', tall: true },
    { id: 'g2', img: 'images/hanoosh-plat.jpg', label: 'Signature Dish', tall: false },
    { id: 'g3', img: 'images/hanoosh-desserts.jpg', label: 'Desserts', tall: false },
    { id: 'g4', img: 'images/hanoosh-interior-1.webp', label: 'The Lounge', tall: true },
    { id: 'g5', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', label: 'Coffee Art', tall: false },
    { id: 'g6', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', label: 'Evening Vibes', tall: false },
];

const getMenu = () => { try { const s = localStorage.getItem('hm'); if (s) return JSON.parse(s); } catch (e) { } localStorage.setItem('hm', JSON.stringify(DEF_MENU)); return [...DEF_MENU]; };
const getGallery = () => { try { const s = localStorage.getItem('hg'); if (s) return JSON.parse(s); } catch (e) { } localStorage.setItem('hg', JSON.stringify(DEF_GALLERY)); return [...DEF_GALLERY]; };
const getHours = () => localStorage.getItem('hh') || 'Open daily 7 AM – 11 PM';
const fallbackImg = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80';

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

document.addEventListener('DOMContentLoaded', () => {

    // ── Apply hours ──
    const applyHours = () => {
        const h = getHours();
        const match = h.match(/(\d+\s*[AP]M)/i);
        const heroOpen = $('heroOpen');
        const bookHours = $('bookHours');
        const contactHours = $('contactHours');
        if (heroOpen) heroOpen.textContent = match ? match[1] : '7 AM';
        if (bookHours) bookHours.textContent = h;
        if (contactHours) contactHours.textContent = h;
    };
    applyHours();

    // ── Navbar scroll ──
    const navbar = $('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ── Mobile menu ──
    const menuToggle = $('menuToggle');
    const navLinks = $('navLinks');
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ── Scroll animations ──
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    $$('.fade-up').forEach(el => observer.observe(el));

    // ── Smooth scroll (internal anchors only) ──
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
        });
    });

    // ── Back to top ──
    const backTop = $('backToTop');
    window.addEventListener('scroll', () => backTop.classList.toggle('show', window.scrollY > 400));
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ── Date input ──
    const dateInput = $('resDate');
    if (dateInput) { const td = new Date().toISOString().split('T')[0]; dateInput.min = td; dateInput.value = td; }

    // ════════════════════════════
    // MENU RENDERING
    // ════════════════════════════
    const menuGrid = $('menuGrid');
    const menuFilters = $('menuFilters');
    let currentFilter = 'all';

    const renderFilters = () => {
        menuFilters.innerHTML = ['all', ...Object.keys(CATS)].map(c =>
            `<button class="filter-btn ${c === currentFilter ? 'active' : ''}" data-f="${c}">${c === 'all' ? 'All' : CATS[c]}</button>`
        ).join('');
        menuFilters.querySelectorAll('.filter-btn').forEach(b => {
            b.addEventListener('click', () => { currentFilter = b.dataset.f; renderFilters(); renderMenu(); });
        });
    };

    const renderMenu = () => {
        const menu = getMenu();
        const filtered = currentFilter === 'all' ? menu : menu.filter(x => x.cat === currentFilter);
        menuGrid.innerHTML = filtered.map(i => `
            <div class="menu-card fade-up visible">
                <div class="menu-card-img">
                    <img src="${i.img || fallbackImg}" alt="${i.name}" onerror="this.src='${fallbackImg}'">
                    ${i.badge ? `<span class="menu-badge">${i.badge}</span>` : ''}
                </div>
                <div class="menu-card-body">
                    <div class="menu-card-top">
                        <h3>${i.name}</h3>
                        <span class="price">${i.price}</span>
                    </div>
                    <p>${i.desc}</p>
                    <button class="btn-add" data-id="${i.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Bind add-to-cart buttons
        menuGrid.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', () => openCustomize(btn.dataset.id));
        });
    };

    renderFilters();
    renderMenu();

    // ════════════════════════════
    // GALLERY RENDERING
    // ════════════════════════════
    const galerieGrid = $('galerieGrid');

    const renderGallery = () => {
        const gallery = getGallery();
        galerieGrid.innerHTML = gallery.map(g => `
            <div class="galerie-item ${g.tall ? 'galerie-tall' : ''}" data-src="${g.img}">
                <img src="${g.img}" alt="${g.label}" onerror="this.src='${fallbackImg}'">
                <div class="galerie-overlay"><span>${g.label}</span></div>
            </div>
        `).join('');
        galerieGrid.querySelectorAll('.galerie-item').forEach(item => {
            item.addEventListener('click', () => {
                lightboxImg.src = item.querySelector('img').src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    };

    renderGallery();

    // ════════════════════════════
    // LIGHTBOX
    // ════════════════════════════
    const lightbox = $('lightbox');
    const lightboxImg = $('lightboxImg');
    const closeLightbox = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };
    $('lightboxClose').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    // ════════════════════════════
    // MODAL
    // ════════════════════════════
    const modalOverlay = $('modalOverlay');
    const showModal = (title, message) => {
        $('modalTitle').textContent = title;
        $('modalMessage').textContent = message;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    const closeModal = () => { modalOverlay.classList.remove('active'); document.body.style.overflow = ''; };
    $('modalClose').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

    // ════════════════════════════
    // FORMS
    // ════════════════════════════
    $('btnReserve').addEventListener('click', () => {
        const n = $('resName').value.trim(), p = $('resPhone').value.trim(),
              d = $('resDate').value, t = $('resTime').value, g = $('resGuests').value;
        if (!n || !p || !d || !t || !g) { showModal('Missing fields', 'Please fill all fields.'); return; }
        showModal('Confirmed!', 'Thank you ' + n + '! Table for ' + g + ' booked.');
        ['resName', 'resPhone', 'resDate', 'resTime', 'resGuests', 'resNote'].forEach(x => { if ($(x)) $(x).value = ''; });
    });

    $('btnContact').addEventListener('click', () => {
        const n = $('contactName').value.trim(), e = $('contactEmail').value.trim(), m = $('contactMsg').value.trim();
        if (!n || !e || !m) { showModal('Missing', 'Please fill all fields.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { showModal('Invalid email', 'Please check your email.'); return; }
        showModal('Sent!', 'Thanks ' + n + '!');
        ['contactName', 'contactEmail', 'contactMsg'].forEach(x => { if ($(x)) $(x).value = ''; });
    });

    const btnNewsletter = $('btnNewsletter');
    if (btnNewsletter) {
        btnNewsletter.addEventListener('click', () => {
            const email = $('newsletterEmail').value.trim();
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showModal('Invalid', 'Please enter a valid email.'); return; }
            showModal('Subscribed!', 'Welcome aboard!');
            $('newsletterEmail').value = '';
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeLightbox(); closeModal(); closeCart(); closeCustomize(); closeCheckout(); }
    });

    // ════════════════════════════════════════════
    // CART SYSTEM
    // ════════════════════════════════════════════

    // Options catalog by category
    const OPTIONS_BY_CAT = {
        breakfast: ['No eggs', 'Extra cheese', 'Gluten-free bread', 'No butter'],
        plats: ['No onions', 'Extra sauce', 'Spicy', 'Well-done', 'Medium', 'No salt'],
        patisseries: ['Extra cream', 'No sugar', 'Gluten-free'],
        jus: ['No ice', 'Extra ice', 'Less sugar', 'No sugar'],
        cafes: ['Extra shot', 'Decaf', 'Oat milk', 'Almond milk', 'No sugar', 'Extra sugar']
    };

    // Cart storage
    const getCart = () => { try { return JSON.parse(localStorage.getItem('hcart') || '[]'); } catch (e) { return []; } };
    const saveCart = c => localStorage.setItem('hcart', JSON.stringify(c));
    const clearCart = () => localStorage.removeItem('hcart');

    // Parse price string to float ($3.50 -> 3.5)
    const parsePrice = str => {
        const m = String(str || '').match(/[\d.]+/);
        return m ? parseFloat(m[0]) : 0;
    };

    const fmtPrice = n => '$' + n.toFixed(2);

    // Current item being customized
    let currentItem = null;
    let currentQty = 1;
    let currentOpts = new Set();

    // ─── Open customize modal ───
    const openCustomize = (id) => {
        const item = getMenu().find(x => x.id === id);
        if (!item) return;
        currentItem = item;
        currentQty = 1;
        currentOpts = new Set();

        $('custImg').src = item.img || fallbackImg;
        $('custImg').alt = item.name;
        $('custName').textContent = item.name;
        $('custDesc').textContent = item.desc;
        $('custNote').value = '';
        $('qtyValue').textContent = '1';

        // Render options
        const opts = OPTIONS_BY_CAT[item.cat] || [];
        const optsWrap = $('custOptionsWrap');
        if (opts.length) {
            optsWrap.style.display = 'block';
            $('custOptions').innerHTML = opts.map(o =>
                `<div class="opt-chip" data-opt="${o}">${o}</div>`
            ).join('');
            $('custOptions').querySelectorAll('.opt-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    chip.classList.toggle('selected');
                    const v = chip.dataset.opt;
                    if (currentOpts.has(v)) currentOpts.delete(v); else currentOpts.add(v);
                });
            });
        } else {
            optsWrap.style.display = 'none';
        }

        updateCustPrice();
        $('customizeOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeCustomize = () => {
        $('customizeOverlay').classList.remove('active');
        document.body.style.overflow = '';
    };

    const updateCustPrice = () => {
        if (!currentItem) return;
        const total = parsePrice(currentItem.price) * currentQty;
        $('custPrice').textContent = fmtPrice(total);
    };

    $('customizeClose').addEventListener('click', closeCustomize);
    $('customizeOverlay').addEventListener('click', e => { if (e.target === $('customizeOverlay')) closeCustomize(); });

    $('qtyMinus').addEventListener('click', () => {
        if (currentQty > 1) { currentQty--; $('qtyValue').textContent = currentQty; updateCustPrice(); }
    });
    $('qtyPlus').addEventListener('click', () => {
        if (currentQty < 99) { currentQty++; $('qtyValue').textContent = currentQty; updateCustPrice(); }
    });

    $('btnAddToCart').addEventListener('click', () => {
        if (!currentItem) return;
        const cart = getCart();
        const entry = {
            lineId: 'L' + Date.now() + Math.random().toString(36).slice(2, 5),
            itemId: currentItem.id,
            name: currentItem.name,
            img: currentItem.img,
            price: parsePrice(currentItem.price),
            qty: currentQty,
            opts: [...currentOpts],
            note: $('custNote').value.trim()
        };
        cart.push(entry);
        saveCart(cart);
        refreshCart();
        closeCustomize();
        openCart();
    });

    // ─── Cart drawer ───
    const openCart = () => {
        $('cartOverlay').classList.add('active');
        $('cartDrawer').classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCart();
    };

    const closeCart = () => {
        $('cartOverlay').classList.remove('active');
        $('cartDrawer').classList.remove('active');
        document.body.style.overflow = '';
    };

    $('cartFab').addEventListener('click', openCart);
    $('cartClose').addEventListener('click', closeCart);
    $('cartOverlay').addEventListener('click', closeCart);

    const refreshCart = () => {
        const cart = getCart();
        const qty = cart.reduce((s, x) => s + x.qty, 0);
        const total = cart.reduce((s, x) => s + x.qty * x.price, 0);
        $('cartBadge').textContent = qty;
        $('cartTotal').textContent = fmtPrice(total);
        $('cartFab').classList.toggle('visible', qty > 0);
    };

    const renderCart = () => {
        const cart = getCart();
        const body = $('cartBody');
        const foot = $('cartFoot');
        if (!cart.length) {
            body.innerHTML = `
                <div class="cart-empty">
                    <span class="cart-empty-icon">🛒</span>
                    <h4>Your cart is empty</h4>
                    <p>Add some delicious items to get started.</p>
                </div>`;
            foot.style.display = 'none';
            refreshCart();
            return;
        }
        foot.style.display = 'block';
        body.innerHTML = cart.map(line => `
            <div class="cart-item">
                <div class="cart-item-img"><img src="${line.img || fallbackImg}" alt="${line.name}" onerror="this.src='${fallbackImg}'"></div>
                <div class="cart-item-info">
                    <h4>${line.name}</h4>
                    <div class="cart-item-meta">
                        ${line.opts.length ? `<span class="opts">✓ ${line.opts.join(' · ')}</span>` : ''}
                        ${line.note ? `<span class="note">"${line.note}"</span>` : ''}
                    </div>
                    <div class="cart-item-bot">
                        <div class="cart-qty">
                            <button data-act="dec" data-line="${line.lineId}">−</button>
                            <span>${line.qty}</span>
                            <button data-act="inc" data-line="${line.lineId}">+</button>
                        </div>
                        <span class="cart-item-price">${fmtPrice(line.qty * line.price)}</span>
                    </div>
                    <button class="cart-item-remove" data-line="${line.lineId}">Remove</button>
                </div>
            </div>
        `).join('');

        // Bind quantity + remove
        body.querySelectorAll('.cart-qty button').forEach(b => {
            b.addEventListener('click', () => {
                const cart = getCart();
                const idx = cart.findIndex(x => x.lineId === b.dataset.line);
                if (idx < 0) return;
                if (b.dataset.act === 'inc') cart[idx].qty++;
                else cart[idx].qty = Math.max(1, cart[idx].qty - 1);
                saveCart(cart);
                renderCart();
                refreshCart();
            });
        });
        body.querySelectorAll('.cart-item-remove').forEach(b => {
            b.addEventListener('click', () => {
                saveCart(getCart().filter(x => x.lineId !== b.dataset.line));
                renderCart();
                refreshCart();
            });
        });

        refreshCart();
    };

    // Init cart on load
    refreshCart();

    // ─── Checkout ───
    const openCheckout = () => {
        const cart = getCart();
        if (!cart.length) return;
        const total = cart.reduce((s, x) => s + x.qty * x.price, 0);
        const qty = cart.reduce((s, x) => s + x.qty, 0);
        $('csItems').textContent = qty;
        $('csTotal').textContent = fmtPrice(total);

        // Reset form
        $('chName').value = '';
        $('chTable').value = '';
        $('chPhone').value = '';

        $('checkoutOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeCheckout = () => {
        $('checkoutOverlay').classList.remove('active');
        document.body.style.overflow = '';
    };

    $('btnCheckout').addEventListener('click', () => {
        closeCart();
        setTimeout(openCheckout, 300);
    });

    $('checkoutClose').addEventListener('click', closeCheckout);
    $('checkoutOverlay').addEventListener('click', e => { if (e.target === $('checkoutOverlay')) closeCheckout(); });

    // Order type toggle
    $$('.order-type-opt').forEach(opt => {
        opt.addEventListener('click', () => {
            $$('.order-type-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            opt.querySelector('input').checked = true;
            const type = opt.dataset.type;
            if (type === 'dine-in') {
                $('chTableGroup').style.display = 'block';
                $('chPhoneGroup').style.display = 'none';
            } else {
                $('chTableGroup').style.display = 'none';
                $('chPhoneGroup').style.display = 'block';
            }
        });
    });

    // Place order
    $('btnPlaceOrder').addEventListener('click', () => {
        const name = $('chName').value.trim();
        const type = document.querySelector('input[name="orderType"]:checked').value;
        const table = $('chTable').value.trim();
        const phone = $('chPhone').value.trim();

        if (!name) { showModal('Missing info', 'Please enter your name.'); return; }
        if (type === 'dine-in' && !table) { showModal('Missing info', 'Please enter your table number.'); return; }
        if (type === 'takeaway' && !phone) { showModal('Missing info', 'Please enter your phone number.'); return; }

        const cart = getCart();
        if (!cart.length) { closeCheckout(); return; }

        // Build order
        const orders = JSON.parse(localStorage.getItem('horders') || '[]');
        const orderNum = (parseInt(localStorage.getItem('horderSeq') || '0', 10) + 1);
        localStorage.setItem('horderSeq', String(orderNum));

        const order = {
            id: 'O' + Date.now(),
            num: orderNum,
            createdAt: Date.now(),
            status: 'new', // new | preparing | ready | served
            type,
            customer: {
                name,
                table: type === 'dine-in' ? table : '',
                phone: type === 'takeaway' ? phone : ''
            },
            items: cart.map(line => ({
                name: line.name,
                qty: line.qty,
                price: line.price,
                opts: line.opts,
                note: line.note
            })),
            total: cart.reduce((s, x) => s + x.qty * x.price, 0)
        };
        orders.push(order);
        localStorage.setItem('horders', JSON.stringify(orders));

        // Signal new order to kitchen display (cross-tab)
        localStorage.setItem('horderPing', String(Date.now()));

        // Clear cart
        clearCart();
        refreshCart();

        // Show confirmed
        closeCheckout();
        $('orderNum').textContent = '#' + String(orderNum).padStart(3, '0');
        setTimeout(() => {
            $('confirmedOverlay').classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 300);
    });

    $('confirmedClose').addEventListener('click', () => {
        $('confirmedOverlay').classList.remove('active');
        document.body.style.overflow = '';
    });

});
