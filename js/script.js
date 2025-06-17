// js/script.js

document.addEventListener('DOMContentLoaded', () => {

    // NOTE: The 'products' variable is now available globally because 'data.js' is loaded first.
    
    // ======================= STATE MANAGEMENT =======================
    let cart = JSON.parse(localStorage.getItem('elegenzaCart')) || [];
    let user = JSON.parse(localStorage.getItem('elegenzaUser')) || null;

    // ======================= DOM ELEMENTS =======================
    const productGrid = document.getElementById('product-grid');
    const productModal = document.getElementById('product-modal');
    const userAuthSection = document.getElementById('user-auth-section');
    const signupModal = document.getElementById('signup-modal');
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartCountEl = document.getElementById('cart-count');
    const cartItemsEl = document.getElementById('cart-items');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutPage = document.getElementById('checkout-page');

    // Mobile Navigation Elements
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');

    
    // ======================= GSAP ANIMATIONS =======================
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.nav-item', { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0.5)
      .to('.nav-icons .icon-wrapper', { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.4');

    gsap.to('.hero-content', { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' });

    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.to(title, {
            scrollTrigger: { trigger: title, start: 'top 90%', toggleActions: 'play none none none' },
            opacity: 1, y: 0, duration: 1, ease: 'power3.out'
        });
    });
    
    // ======================= RENDER & UI FUNCTIONS =======================
    function renderProducts() {
        if (!productGrid) return;
        productGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">Rs ${product.price.toFixed(2)}</p>
                    <button class="btn btn-secondary view-details-btn" data-id="${product.id}">View Details</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });

        gsap.from(".product-card", {
            scrollTrigger: { trigger: ".product-grid", start: "top 80%" },
            opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: 'power3.out'
        });
    }

    function updateUserUI() {
        if (user) {
            userAuthSection.innerHTML = `<span class="user-greeting"><span>Hi,</span> ${user.name.split(' ')[0]}</span>`;
        } else {
            userAuthSection.innerHTML = `<i class="fa-solid fa-user"></i>`;
        }
    }
    
    function updateCartUI() {
        cartItemsEl.innerHTML = '';
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="empty-cart-message">Your cart is a blank canvas. <br> Add some art!</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Size: ${item.size}, Color: ${item.color}</p>
                        <p>Price: Rs ${item.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" data-action="decrease" data-cart-id="${item.cartId}">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" data-action="increase" data-cart-id="${item.cartId}">+</button>
                        </div>
                    </div>
                    <i class="fas fa-times cart-item-remove-btn" data-id="${item.cartId}"></i>
                `;
                cartItemsEl.appendChild(cartItem);
            });
        }
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
        cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';
                // const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        // const cartCountEl = document.getElementById('cart-count');
        // cartCountEl.textContent = totalItems;
        // cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';
        
        const subtotalEl = document.getElementById('cart-subtotal')
            // cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
            // .textContent = `Rs ${subtotal.toFixed(2)}`;
        subtotalEl.textContent = `Rs ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`;
        
        localStorage.setItem('elegenzaCart', JSON.stringify(cart));
    }

    // ======================= CORE LOGIC & EVENT HANDLERS =======================

    // --- Product & User Auth Handlers ---
    productGrid.addEventListener('click', e => {
        if (e.target.classList.contains('view-details-btn')) {
            openProductModal(parseInt(e.target.dataset.id));
        }
    });

    userAuthSection.addEventListener('click', () => {
        const modalTitle = document.getElementById('signup-modal-title');
        const submitBtn = document.getElementById('signup-submit-btn');
        const form = document.getElementById('signup-form');
        if (user) {
            modalTitle.textContent = 'Update Your Details';
            submitBtn.textContent = 'Update Details';
            document.getElementById('signup-name').value = user.name;
            document.getElementById('signup-phone').value = user.phone;
            document.getElementById('location-status').textContent = user.location && user.location.includes(',') ? 'Location on file' : '';
            document.getElementById('location-status').dataset.location = user.location;
        } else {
            modalTitle.textContent = 'Create an Account';
            submitBtn.textContent = 'Sign Up';
            form.reset();
            document.getElementById('location-status').textContent = '';
        }
        openModal(signupModal);
    });

    signupModal.addEventListener('submit', e => {
        e.preventDefault();
        const wasAlreadyUser = !!user;
        const name = document.getElementById('signup-name').value;
        const phone = document.getElementById('signup-phone').value;
        const location = document.getElementById('location-status').dataset.location || "Not Provided";
        user = { name, phone, location };
        localStorage.setItem('elegenzaUser', JSON.stringify(user));
        closeModal(signupModal);
        updateUserUI();
        showToast(wasAlreadyUser ? `Details updated, ${name.split(' ')[0]}!` : `Welcome, ${name.split(' ')[0]}!`);
    });

    document.getElementById('get-location-btn').addEventListener('click', () => {
        const locationStatus = document.getElementById('location-status');
        if (navigator.geolocation) {
            locationStatus.textContent = "Fetching location...";
            navigator.geolocation.getCurrentPosition(pos => {
                locationStatus.textContent = `Location Captured!`;
                locationStatus.style.color = 'green';
                locationStatus.dataset.location = `${pos.coords.latitude},${pos.coords.longitude}`;
            }, () => {
                locationStatus.textContent = "Could not get location.";
                locationStatus.style.color = 'red';
            });
        } else {
            locationStatus.textContent = "Geolocation not supported.";
        }
    });

    // --- Cart & Checkout Handlers ---
    // CORRECTED SYNTAX and re-organized for clarity
    cartItemsEl.addEventListener('click', e => {
        const target = e.target;
        let changed = false;

        if (target.classList.contains('cart-item-remove-btn')) {
            cart = cart.filter(item => item.cartId !== parseInt(target.dataset.id));
            changed = true;
        }
        
        if (target.classList.contains('quantity-btn')) {
            const cartId = parseInt(target.dataset.cartId);
            const action = target.dataset.action;
            const itemInCart = cart.find(item => item.cartId === cartId);
            if (itemInCart) {
                if (action === 'increase') itemInCart.quantity++;
                else if (action === 'decrease') itemInCart.quantity--;
                
                if (itemInCart.quantity <= 0) {
                    cart = cart.filter(item => item.cartId !== cartId);
                }
                changed = true;
            }
        }
        
        if (changed) {
            animateCartIcon();
            updateCartUI();
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast("Your cart is empty!", 3000, true);
            return;
        }
        cartSidebar.classList.remove('active');
        openCheckoutPage();
    });

    checkoutPage.addEventListener('submit', e => {
        if (e.target.id === 'checkout-form') {
            e.preventDefault();
            handleCompleteOrder();
        }
    });

    // --- Mobile Navigation Handlers ---
    hamburgerIcon.addEventListener('click', () => mobileNavMenu.classList.add('active'));
    closeMobileMenuBtn.addEventListener('click', () => mobileNavMenu.classList.remove('active'));
    mobileNavMenu.addEventListener('click', e => {
        if (e.target.classList.contains('nav-link')) {
            mobileNavMenu.classList.remove('active');
        }
    });

    // ======================= MODAL & PAGE FUNCTIONS =======================
    function openProductModal(productId) {
        const product = products.find(p => p.id === productId);
        document.getElementById('product-modal-body').innerHTML = `
            <div class="modal-gallery">
                <div class="gallery-main-view"><img src="${product.images[0]}" alt="${product.name}"></div>
                <div class="gallery-thumbnails">
                    ${product.images.map((img, index) => `<div class="thumbnail-item ${index === 0 ? 'active' : ''}" data-src="${img}" data-type="image"><img src="${img}" alt="Thumbnail ${index + 1}"></div>`).join('')}
                    ${product.video ? `<div class="thumbnail-item" data-src="${product.video}" data-type="video"><img src="${product.images[0]}" alt="Video thumbnail"><div class="video-play-icon"><i class="fas fa-play"></i></div></div>` : ''}
                </div>
            </div>
            <div class="modal-product-details">
                <h3>${product.name}</h3>
                <p class="price">Rs ${product.price.toFixed(2)}</p>
                <p class="description">${product.description}</p>
                <div class="option-group"><h4>Size:</h4><div class="option-boxes" id="size-options">${product.sizes.map(s => `<div class="option-box" data-value="${s}">${s}</div>`).join('')}</div></div>
                <div class="option-group"><h4>Color:</h4><div class="option-boxes" id="color-options">${product.colors.map(c => `<div class="option-box" data-value="${c}">${c}</div>`).join('')}</div></div>
                <div class="option-group quantity-selector"><h4>Quantity:</h4><input type="number" id="quantity" value="1" min="1" max="10" required></div>
                <button id="add-to-cart-btn" class="btn btn-primary btn-full-width" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        const modalBody = document.getElementById('product-modal-body');
        const mainView = modalBody.querySelector('.gallery-main-view');
        
        modalBody.querySelectorAll('.thumbnail-item').forEach(thumb => {
            thumb.addEventListener('click', () => {
                modalBody.querySelector('.thumbnail-item.active').classList.remove('active');
                thumb.classList.add('active');
                if (thumb.dataset.type === 'video') mainView.innerHTML = `<video src="${thumb.dataset.src}" autoplay controls></video>`;
                else mainView.innerHTML = `<img src="${thumb.dataset.src}" alt="${product.name}">`;
            });
        });

        modalBody.addEventListener('click', e => {
            if (e.target.classList.contains('option-box')) {
                const parent = e.target.parentElement;
                if (parent.querySelector('.selected')) parent.querySelector('.selected').classList.remove('selected');
                e.target.classList.add('selected');
            }
        });

        document.getElementById('add-to-cart-btn').addEventListener('click', () => {
            const selectedSizeEl = modalBody.querySelector('#size-options .selected');
            const selectedColorEl = modalBody.querySelector('#color-options .selected');
            if (!selectedSizeEl || !selectedColorEl) {
                showToast('Please select a size and color.', 3000, true); return;
            }
            const newItem = {
                cartId: Date.now(), id: product.id, name: product.name, price: product.price, image: product.images[0],
                quantity: parseInt(modalBody.querySelector('#quantity').value),
                size: selectedSizeEl.dataset.value, color: selectedColorEl.dataset.value,
            };
            cart.push(newItem);
            updateCartUI();
            animateCartIcon();
            closeModal(productModal);
            showToast(`${newItem.name} added to cart!`);
        });

        openModal(productModal);
    }
    
    function openCheckoutPage() {
        const summaryItemsEl = document.getElementById('checkout-summary-items');
        const totalEl = document.getElementById('checkout-total');
        summaryItemsEl.innerHTML = cart.map(item => `<div class="cart-item"><img src="${item.image}" class="cart-item-img"><div class="cart-item-info"><h4>${item.name} (x${item.quantity})</h4><p>Size: ${item.size}, Color: ${item.color}</p></div></div>`).join('');
        totalEl.textContent = `Rs ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`;
        if (user) {
            document.getElementById('checkout-name').value = user.name;
            document.getElementById('checkout-phone').value = user.phone;
            document.getElementById('checkout-address').value = user.location && user.location !== "Not Provided" ? `GPS: ${user.location}\n` : '';
        } else {
            document.getElementById('checkout-form').reset();
        }
        openModal(checkoutPage);
    }
    
    function handleCompleteOrder() {
        const name = document.getElementById('checkout-name').value;
        const phone = document.getElementById('checkout-phone').value;
        const address = document.getElementById('checkout-address').value + ;
        const clientWhatsAppNumber = '+923051120225'; // <-- IMPORTANT: REPLACE
        let message = `*New Order from Elegenza Website!* 🎉\n\n*Customer Details:*\n*Name:* ${name}\n*Phone:* ${phone}\n*Address:* ${address}\n\n*Order Items:*\n`;
        let total = 0;
        cart.forEach(item => {
            message += `------------------------\n*Product:* ${item.name}\n*Size:* ${item.size}, *Color:* ${item.color}\n*Quantity:* ${item.quantity}\n*Price:* RS ${(item.price * item.quantity).toFixed(2)}\n`;
            total += item.price * item.quantity;
        });
        message += `------------------------\n*GRAND TOTAL: Rs ${total.toFixed(2)}*\n\nPlease confirm this order.`;
        const whatsappUrl = `https://wa.me/${clientWhatsAppNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        cart = [];
        updateCartUI();
        closeModal(checkoutPage);
        showToast("Order placed! Redirecting...", 4000);
    }

    // ======================= HELPER & UTILITY FUNCTIONS =======================
    function animateCartIcon() {
        gsap.timeline().to(cartIcon, { scale: 1.3, duration: 0.2, ease: 'power2.out' }).to(cartIcon, { x: -3, duration: 0.05 }).to(cartIcon, { x: 3, duration: 0.05 }).to(cartIcon, { x: 0, duration: 0.05 }).to(cartIcon, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
    }

    function openModal(modal) { modal.classList.add('active'); }
    function closeModal(modal) { modal.classList.remove('active'); }

    cartIcon.addEventListener('click', () => cartSidebar.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('active'));
    cartSidebar.addEventListener('click', e => { if (e.target === cartSidebar) cartSidebar.classList.remove('active'); });

    document.querySelectorAll('.modal-overlay:not(#cart-sidebar)').forEach(m => {
        m.addEventListener('click', e => { if (e.target === m || e.target.classList.contains('modal-close-btn')) m.classList.remove('active'); });
    });
    
    function showToast(message, duration = 3000, isError = false) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        if (isError) toast.style.backgroundColor = 'var(--accent-color)';
        toast.textContent = message;
        document.body.appendChild(toast);
        gsap.fromTo(toast, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
        setTimeout(() => { gsap.to(toast, { y: 100, opacity: 0, duration: 0.5, ease: 'power3.in', onComplete: () => toast.remove() }); }, duration);
    }
    
    const toastStyle = document.createElement('style');
    toastStyle.innerHTML = `.toast-notification { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: var(--primary-color); color: white; padding: 15px 30px; border-radius: 50px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 9999; font-weight: 600; }`;
    document.head.appendChild(toastStyle);

    // ======================= INITIALIZATION =======================
    renderProducts();
    updateCartUI();
    updateUserUI();
});
