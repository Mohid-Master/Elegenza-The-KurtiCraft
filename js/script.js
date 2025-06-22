// js/script.js

document.addEventListener('DOMContentLoaded', () => {
let CN = mohid181;
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
    // function renderProducts() {
    //     if (!productGrid) return;
    //     productGrid.innerHTML = '';
    //     products.forEach(product => {
    //         const productCard = document.createElement('div');
    //         productCard.className = 'product-card';
    //         productCard.innerHTML = `
    //             <img src="${product.images[0]}" alt="${product.name}" class="product-image">
    //             <div class="product-info">
    //                 <h3 class="product-title">${product.name}</h3>
    //                 <div class="price-container">${product.salePrice ? `<span class="product-price sale">Rs ${product.salePrice.toFixed(2)}</span><br><span class="price original">Rs ${product.price.toFixed(2)}</span>` : `<span class="product-price">Rs ${product.price.toFixed(2)}</span>`}</div>
    //                 <button class="btn btn-secondary view-details-btn" data-id="${product.id}">View Details</button>
    //             </div>
    //         `;
    //         productGrid.appendChild(productCard);
    //     });

    //     gsap.from(".product-card", {
    //         scrollTrigger: { trigger: ".product-grid", start: "top 80%" },
    //         opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: 'power3.out'
    //     });
    // }
    // 2. Replace your OLD renderProducts function with this NEW version
const renderProducts = (searchQuery = '') => {
    if (!productGrid) return;

    const lowerCaseQuery = searchQuery.toLowerCase();

    // Filter products based on the search query
    const filteredProducts = products.filter(product => {
        // Check if the query is in the name, description, or variants
        const nameMatch = product.name.toLowerCase().includes(lowerCaseQuery);
        const descriptionMatch = product.description.toLowerCase().includes(lowerCaseQuery);
        // You can add more checks here (e.g., for colors, sizes)
        return nameMatch || descriptionMatch;
    });

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<p class="empty-cart-message">No products found for "${searchQuery}"</p>`;
    } else {
        productGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="price-container">${product.salePrice ? `<span class="product-price sale">Rs ${product.salePrice.toFixed(2)}</span><br><span class="price original">Rs ${product.price.toFixed(2)}</span>` : `<span class="product-price">Rs ${product.price.toFixed(2)}</span>`}</div>
                    <button class="btn btn-secondary view-details-btn" data-id="${product.id}">View Details</button>
                </div>
            </div>`).join('');
    }
    
    // Re-apply the GSAP animation to the newly rendered cards
    gsap.from(".product-card", {
        opacity: 0, y: 60, duration: 0.8, stagger: 0.1, ease: 'power3.out'
    });
};


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
                    const variantText = Object.entries(item.variants)
        .map(([key, value]) => `<span>${key}: ${value}</span>`)
        .join(', ');
        // --- NEW LOGIC FOR TOTALS ---
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            let discount = 0;
            let c = cart;
            const totalItems = c.reduce((sum, item) => sum + item.quantity, 0);
            if (appliedCoupon && affiliateCodes[appliedCoupon]) {
                discount = affiliateCodes[appliedCoupon];
                discountRow.style.display = 'flex';
                discountHr.style.display = 'block';
                discountAmountEl.textContent = `- Rs ${discount.toFixed(2)  * totalItems}`;
                couponStatus.textContent = `Coupon "${appliedCoupon}" applied!`;
                couponStatus.className = 'success';
                CN = appliedCoupon;
            } else {
                discountRow.style.display = 'none';
                discountHr.style.display = 'none';
                couponStatus.textContent = '';
            }

            
            const total = subtotal - (discount * totalItems);
        
            cartSubtotalEl.textContent = `Rs ${subtotal.toFixed(2)}`;
            cartTotalEl.textContent = `Rs ${total > 0 ? total.toFixed(2) : '0.00'}`;

    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p class="cart-item-variants">${variantText}</p>
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
            openProductModal(e.target.dataset.id);
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
    // In js/script.js, replace your entire openProductModal function with this one.

const openProductModal = (productId) => {
    // Find product by its string ID. This is now safe because data.js is clean.
    const product = products.find(p => p.id == productId);
    if (!product) {
        console.error(`Product with ID "${productId}" not found.`);
        return;
    }

    // --- 1. SETUP: Prepare gallery items and helper function ---
    const getYouTubeThumbnail = (videoUrl) => {
        try {
            const videoId = new URL(videoUrl).pathname.split('/').pop();
            // Use a high-quality thumbnail image from YouTube
            return `https://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        } catch (e) {
            // A fallback icon if the URL is ever broken
            return 'https://i.imgur.com/tX2hB5g.png'; 
        }
    };

    // Combine images and videos into a single array for the gallery
    const galleryItems = [
        ...(product.images || []).map(url => ({ type: 'image', url })),
        ...(product.videoUrls || []).map(url => ({ type: 'video', url }))
    ];

    // --- 2. BUILD HTML: Create the complete HTML string for the modal body ---
    const variantHTML = (product.variants || []).map(v => `
        <div class="option-group">
            <h4>${v.name}:</h4>
            <div class="option-boxes" data-variant-name="${v.name}">
                ${v.options.map(o => `<div class="option-box" data-value="${o}">${o}</div>`).join('')}
            </div>
        </div>`).join('');

    const reviewHTML = (product.reviews && product.reviews.length > 0) ? `
        <div class="reviews-section">
            <h4>What Our Customers Say</h4>
            ${product.reviews.map(r => `
                <div class="review-item">
                    <div class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                    <p class="review-comment">"${r.comment}"</p>
                    <p class="review-author">- ${r.author}</p>
                </div>`).join('')}
        </div>` : '';

    const modalBody = document.getElementById('product-modal-body');
    // This single innerHTML assignment prevents the conflicts you saw before.
    modalBody.innerHTML = `
        <div class="modal-gallery">
            <div class="gallery-main-view">
                <!-- Main view will be populated by JS -->
            </div>
            <div class="gallery-thumbnails">
                ${galleryItems.map((item, i) => `
                    <div class="thumbnail-item ${i === 0 ? 'active' : ''}" data-type="${item.type}" data-url="${item.url}">
                        <img src="${item.type === 'image' ? item.url : getYouTubeThumbnail(item.url)}" alt="Thumbnail">
                        ${item.type === 'video' ? '<div class="video-play-icon"><i class="fas fa-play"></i></div>' : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="modal-product-details">
            <h3>${product.name}</h3>
            <div class="price-container">${product.salePrice ? `<span class="price sale">Rs ${product.salePrice.toFixed(2)}</span><br><span class="price original">Rs ${product.price.toFixed(2)}</span>` : `<span class="price">Rs ${product.price.toFixed(2)}</span>`}</div>
            <p class="description">${product.description}</p>
            ${variantHTML}
            <div class="option-group quantity-selector"><h4>Quantity:</h4><input type="number" id="quantity" value="1" min="1" max="10" required></div>
            <button id="add-to-cart-btn" class="btn btn-primary btn-full-width">Add to Cart</button>
            ${reviewHTML}
        </div>
    `;
    
    // --- 3. BIND EVENTS: Make the new gallery interactive ---
    const mainView = modalBody.querySelector('.gallery-main-view');
    const thumbnails = modalBody.querySelectorAll('.thumbnail-item');

    const loadMainView = (element) => {
        const type = element.dataset.type;
        const url = element.dataset.url;

        gsap.to(mainView, { opacity: 0, duration: 0.2, onComplete: () => {
            if (type === 'image') {
                mainView.innerHTML = `<img src="${url}" alt="Main product view">`;
            } else if (type === 'video') {
                mainView.innerHTML = `<iframe src="${url}?autoplay=1&mute=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            }
            gsap.to(mainView, { opacity: 1, duration: 0.3, delay: 0.1 });
        }});
    };

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            mainView.innerHTML = ''; // Stop any playing video
            modalBody.querySelector('.thumbnail-item.active')?.classList.remove('active');
            thumb.classList.add('active');
            loadMainView(thumb);
        });
    });

    // Load the first item when the modal opens
    if (thumbnails.length > 0) {
        loadMainView(thumbnails[0]);
    }

    // --- 4. BIND FORM LOGIC ---
    modalBody.addEventListener('click', e => {
        if (e.target.classList.contains('option-box')) {
            const group = e.target.closest('.option-boxes');
            group.querySelector('.selected')?.classList.remove('selected');
            e.target.classList.add('selected');
        }
    });

    modalBody.querySelector('#add-to-cart-btn').addEventListener('click', () => {
        let allVariantsSelected = true;
        const selectedVariants = {};
        modalBody.querySelectorAll('.option-boxes').forEach(group => {
            const selected = group.querySelector('.selected');
            if (selected) {
                selectedVariants[group.dataset.variantName] = selected.dataset.value;
            } else if ((product.variants || []).length > 0) {
                allVariantsSelected = false;
            }
        });
        if (!allVariantsSelected) {
            showToast('Please select an option for each variant.', 3000, true);
            return;
        }
        const newItem = {
            cartId: Date.now(),
            id: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            image: product.images[0],
            quantity: parseInt(modalBody.querySelector('#quantity').value),
            variants: selectedVariants
        };
        cart.push(newItem);
        updateCartUI();
        animateCartIcon();
        closeModal(productModal);
        showToast(`${newItem.name} added to cart!`);
    });

    openModal(productModal);
};
    
    function openCheckoutPage() {
        const summaryItemsEl = document.getElementById('checkout-summary-items');
        const totalEl = document.getElementById('checkout-total');
        console.log(cart)
        summaryItemsEl.innerHTML = cart.map(item =>  `<div class="cart-item"><img src="${item.image}" class="cart-item-img"><div class="cart-item-info"><h4>${item.name} (x${item.quantity})</h4>${ Object.entries(item.variants).map(([key, value]) => `<p>${key}: ${value}</p>`).join(', ')}</div></div>`).join('');
        totalEl.textContent = `Rs ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`;
        if (user) {
            document.getElementById('checkout-name').value = user.name;
            document.getElementById('checkout-phone').value = user.phone;
            document.getElementById('checkout-address').value = user.location && user.location !== "Not Provided" ? `${user.location}` : '';
        } else {
            document.getElementById('checkout-form').reset();
        }
        openModal(checkoutPage);
    }
    
    function handleCompleteOrder() {
        const name = document.getElementById('checkout-name').value;
        const phone = document.getElementById('checkout-phone').value;
        const address = document.getElementById('checkout-address').value;
            // --- NEW LOGIC STARTS HERE ---
    let locationInfo = address; // Default to the typed address
    
    // Check if the address contains GPS coordinates
    // if (address.toLowerCase().startsWith('gps:')) {
        // Extract the coordinates (e.g., "34.0522,-118.2437")
        // const coords = address.split('gps:')[1].trim();
        // Create a clickable Google Maps link
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
        // Replace the plain text with the clickable link for the WhatsApp message
        locationInfo = `[Click to View on Google Maps](${googleMapsUrl})`; 
    // }
    // --- NEW LOGIC ENDS HERE ---
        const clientWhatsAppNumber = '+923051120225'; // <-- IMPORTANT: REPLACE
        let message = `*New Order from Elegenza Website!* 🎉  \n*Customer Details:*\n*Name:* ${name}\n*Phone:* ${phone}\n *Address:* ${locationInfo}\n\n\n*Order Items:*\n CN?`AffiliateCoupon:${CN}`:""`;
        let total = 0;

        cart.forEach(item => {
         const variantText = Object.entries(item.variants)
        .map(([key, value]) => `\n *${key}*: ${value} \n`)
        .join(', ');
            message += `------------------------\n*Product:* ${item.name}\n* ${variantText} \n*Price:* RS ${(item.price * item.quantity).toFixed(2)}\n`;
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
// In js/script.js

// 1. Add this new constant with your other DOM elements at the top
const searchBar = document.getElementById('search-bar');




// 3. Add this new event listener somewhere in your script
if(searchBar) {
    searchBar.addEventListener('keyup', (e) => {
        // Render the products again with the current search bar value
        renderProducts(e.target.value);
    });
}
// In js/script.js

// 1. Add this at the top with your other STATE variables
const affiliateCodes = {
    "MOHID181": 100,
    "Usman20": 70,
    "hanzala48": 40
};
let appliedCoupon = null;


// 2. Add these new constants with your other DOM elements
const couponInput = document.getElementById('coupon-input');
const applyCouponBtn = document.getElementById('apply-coupon-btn');
const couponStatus = document.getElementById('coupon-status');
const discountRow = document.getElementById('discount-row');
const discountAmountEl = document.getElementById('discount-amount');
const cartTotalEl = document.getElementById('cart-total');
const discountHr = document.getElementById('discount-hr');


// 3. Replace your OLD updateCartUI function with this NEW version
// const updateCartUI = () => {
//     if (!cartItemsEl) return;
//     // The first part of the function that renders items is the same...
//     cartItemsEl.innerHTML = cart.length === 0 ? '...' : cart.map(item => `...`).join('');
    
//     // --- NEW LOGIC FOR TOTALS ---
//     const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     let discount = 0;

//     if (appliedCoupon && affiliateCodes[appliedCoupon]) {
//         discount = affiliateCodes[appliedCoupon];
//         discountRow.style.display = 'flex';
//         discountHr.style.display = 'block';
//         discountAmountEl.textContent = `- Rs ${discount.toFixed(2)}`;
//         couponStatus.textContent = `Coupon "${appliedCoupon}" applied!`;
//         couponStatus.className = 'success';
//     } else {
//         discountRow.style.display = 'none';
//         discountHr.style.display = 'none';
//         couponStatus.textContent = '';
//     }

//     const total = subtotal - discount;

//     cartSubtotalEl.textContent = `Rs ${subtotal.toFixed(2)}`;
//     cartTotalEl.textContent = `Rs ${total > 0 ? total.toFixed(2) : '0.00'}`;

//     // The rest of the function (updating cart count, local storage) is the same...
// };


// 4. Add this new event listener for the Apply button
if(applyCouponBtn) {
    applyCouponBtn.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        if (affiliateCodes[code]) {
            appliedCoupon = code;
            couponStatus.textContent = 'Coupon applied successfully!';
            couponStatus.className = 'success';
        } else {
            appliedCoupon = null;
            couponStatus.textContent = 'Invalid coupon code.';
            couponStatus.className = 'error';
        }
        updateCartUI(); // Re-calculate totals
    });
}

// 4. IMPORTANT: In your INITIALIZATION section at the very bottom of the file,
// make sure the first call to renderProducts has no arguments.
// renderProducts(); // This should be the line at the very bottom
    // ======================= INITIALIZATION =======================
    renderProducts();
    updateCartUI();
    updateUserUI();
});
