// js/admin.js
document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const ADMIN_PASSWORD = "123"; 
    const IMGHIPPO_API_KEY = "f4d823276c4098f91a1e678f6bbcf432";

    // --- DOM ELEMENTS ---
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('admin-dashboard');
    const productListContainer = document.getElementById('product-list');
    const formContainer = document.getElementById('edit-form-container');
    const productForm = document.getElementById('product-form');
    const addNewProductBtn = document.getElementById('add-new-product-btn');
    const saveDataBtn = document.getElementById('save-data-btn');

    // --- STATE ---
    let productsDataStore = JSON.parse(JSON.stringify(products));

    // --- HELPER TO BIND EVENTS ---
    const bindFormEvents = () => {
        document.getElementById('close-form-btn').addEventListener('click', () => formContainer.style.display = 'none');
        document.getElementById('image-upload').addEventListener('change', handleImageUpload);
        document.getElementById('add-video-btn').addEventListener('click', handleAddVideo);
        document.getElementById('add-variant-btn').addEventListener('click', addVariantGroup);
        document.getElementById('add-review-btn').addEventListener('click', addReviewGroup);
    };

    // --- CORE LOGIC ---
    const handleLogin = (e) => {
        e.preventDefault();
        if (document.getElementById('password').value === ADMIN_PASSWORD) {
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            renderProductList();
        } else { alert('Incorrect password!'); }
    };

    const renderProductList = () => {
        productListContainer.innerHTML = '';
        productsDataStore.forEach(product => {
            const item = document.createElement('div');
            item.className = 'product-list-item';
            item.innerHTML = `<span class="product-name">${product.name}</span><div class="actions"><button class="btn btn-primary edit-btn">Edit</button><button class="btn btn-danger delete-btn">Delete</button></div>`;
            item.querySelector('.edit-btn').addEventListener('click', () => showForm(product.id));
            item.querySelector('.delete-btn').addEventListener('click', () => handleDeleteProduct(product.id));
            productListContainer.appendChild(item);
        });
    };

    const showForm = (productId = null) => {
        productForm.reset();
        document.getElementById('product-id').value = productId || '';
        const isEditing = !!productId;
        document.getElementById('form-title').textContent = isEditing ? 'Edit Product' : 'Add New Product';
        const product = isEditing ? productsDataStore.find(p => p.id === productId) : {};

        // Populate form with existing product data
        document.getElementById('product-name').value = product.name || '';
        document.getElementById('product-desc').value = product.description ? product.description.replace(/<br\s*\/?>/gi, "\n") : '';
        document.getElementById('product-price').value = product.price || '';
        document.getElementById('product-sale-price').value = product.salePrice || '';
        
        // Render existing data with delete functionality
        renderPreviews('#image-previews .preview-list', product.images || []);
        renderPreviews('#video-previews .preview-list', product.videoUrls || [], 'video');
        renderVariantInputs(product.variants || []);
        renderReviewInputs(product.reviews || []);
        
        formContainer.style.display = 'flex';
    };

    const handleDeleteProduct = (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            productsDataStore = productsDataStore.filter(p => p.id !== productId);
            renderProductList();
        }
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const productId = document.getElementById('product-id').value;
        const variants = Array.from(document.querySelectorAll('#variants-container .variant-group')).map(group => ({
            name: group.querySelector('.variant-name-input').value.trim(),
            options: Array.from(group.querySelectorAll('.variant-option-tag span')).map(span => span.textContent)
        })).filter(v => v.name && v.options.length > 0);
        
        const reviews = Array.from(document.querySelectorAll('#reviews-container .review-group')).map(group => ({
            author: group.querySelector('.review-author-input').value.trim(),
            rating: parseInt(group.querySelector('.review-rating-input').value),
            comment: group.querySelector('.review-comment-input').value.trim()
        })).filter(r => r.author && r.rating && r.comment);

        const productData = {
            id: productId || `prod_${Date.now()}`,
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-desc').value.replace(/\n/g, "<br>"),
            price: parseFloat(document.getElementById('product-price').value),
            salePrice: parseFloat(document.getElementById('product-sale-price').value) || null,
            images: Array.from(document.querySelectorAll('#image-previews .image-preview img')).map(img => img.src),
            videoUrls: Array.from(document.querySelectorAll('#video-previews .video-preview span')).map(span => span.textContent),
            variants: variants,
            reviews: reviews
        };
        
        const existingIndex = productsDataStore.findIndex(p => p.id === productData.id);
        if (existingIndex > -1) {
            productsDataStore[existingIndex] = productData;
        } else {
            productsDataStore.push(productData);
        }
        renderProductList();
        formContainer.style.display = 'none';
    };

    const saveAndDownloadData = () => {
        if (!confirm('This will generate a new data.js file. You MUST replace the old file in your project with this new one. Continue?')) return;
        const objectToString = (obj) => {
            if (obj === null) return 'null';
            if (typeof obj !== 'object') {
                if (typeof obj === 'string') return `'${obj.replace(/'/g, "\\'")}'`;
                return String(obj);
            }
            if (Array.isArray(obj)) return `[${obj.map(objectToString).join(', ')}]`;
            const props = Object.keys(obj).map(key => `${key}: ${objectToString(obj[key])}`).join(',\n    ');
            return `{\n    ${props}\n}`;
        };
        const fileContent = `const products = [\n  ${productsDataStore.map(p => objectToString(p).replace(/\n/g, '\n  ')).join(',\n  ')}\n];`;
        const blob = new Blob([fileContent], { type: 'text/javascript' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'data.js';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    };
    
    // --- HELPER FUNCTIONS ---
    function renderPreviews(containerSelector, urls, type = 'image') {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        container.innerHTML = ''; // Clear previous previews
        (urls || []).forEach(url => {
            const preview = document.createElement('div');
            preview.className = type === 'image' ? 'image-preview' : 'video-preview';
            preview.innerHTML = type === 'image' ? `<img src="${url}" alt="Preview"><button type="button" class="delete-btn-icon">×</button>` : `<span>${url}</span><button type="button" class="delete-btn-icon">×</button>`;
            preview.querySelector('button').addEventListener('click', () => preview.remove());
            container.appendChild(preview);
        });
    }

    function addVariantGroup() {
        const container = document.getElementById('variants-container');
        const group = document.createElement('div');
        group.className = 'variant-group';
        group.innerHTML = `<input type="text" class="variant-name-input" placeholder="Variant Name (e.g., Size)"><input type="text" class="variant-option-input" placeholder="Add option (e.g., Small) and press Enter"><div class="variant-options-list"></div><button type="button" class="btn btn-danger delete-group-btn">Remove Type</button>`;
        group.querySelector('.variant-option-input').addEventListener('keypress', handleAddVariantOption);
        group.querySelector('.delete-group-btn').addEventListener('click', () => group.remove());
        container.appendChild(group);
    }

    function handleAddVariantOption(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const input = e.target;
            const optionValue = input.value.trim();
            if (optionValue) {
                const list = input.nextElementSibling;
                const tag = document.createElement('span');
                tag.className = 'variant-option-tag';
                tag.innerHTML = `<span>${optionValue}</span><button type="button" class="delete-option-btn">×</button>`;
                tag.querySelector('.delete-option-btn').addEventListener('click', () => tag.remove());
                list.appendChild(tag);
                input.value = '';
            }
        }
    }

    function renderVariantInputs(variants) {
        const container = document.getElementById('variants-container');
        container.innerHTML = ''; // Clear previous
        (variants || []).forEach(variant => {
            const group = document.createElement('div');
            group.className = 'variant-group';
            group.innerHTML = `<input type="text" class="variant-name-input" placeholder="Variant Name" value="${variant.name || ''}"><input type="text" class="variant-option-input" placeholder="Add option and press Enter"><div class="variant-options-list"></div><button type="button" class="btn btn-danger delete-group-btn">Remove Type</button>`;
            const list = group.querySelector('.variant-options-list');
            (variant.options || []).forEach(opt => {
                const tag = document.createElement('span');
                tag.className = 'variant-option-tag';
                tag.innerHTML = `<span>${opt}</span><button type="button" class="delete-option-btn">×</button>`;
                tag.querySelector('.delete-option-btn').addEventListener('click', () => tag.remove());
                list.appendChild(tag);
            });
            group.querySelector('.variant-option-input').addEventListener('keypress', handleAddVariantOption);
            group.querySelector('.delete-group-btn').addEventListener('click', () => group.remove());
            container.appendChild(group);
        });
    }

    function addReviewGroup() {
        const container = document.getElementById('reviews-container');
        const group = document.createElement('div');
        group.className = 'review-group';
        group.innerHTML = `<input type="text" class="review-author-input" placeholder="Author Name"><input type="number" class="review-rating-input" placeholder="Rating (1-5)" min="1" max="5"><textarea class="review-comment-input" placeholder="Review Comment" rows="2"></textarea><button type="button" class="btn btn-danger delete-group-btn">Remove</button>`;
        group.querySelector('.delete-group-btn').addEventListener('click', () => group.remove());
        container.appendChild(group);
    }

    function renderReviewInputs(reviews) {
        const container = document.getElementById('reviews-container');
        container.innerHTML = ''; // Clear previous
        (reviews || []).forEach(review => {
            const group = document.createElement('div');
            group.className = 'review-group';
            group.innerHTML = `<input type="text" class="review-author-input" placeholder="Author Name" value="${review.author || ''}"><input type="number" class="review-rating-input" placeholder="Rating (1-5)" min="1" max="5" value="${review.rating || ''}"><textarea class="review-comment-input" placeholder="Review Comment" rows="2">${review.comment || ''}</textarea><button type="button" class="btn btn-danger delete-group-btn">Remove</button>`;
            group.querySelector('.delete-group-btn').addEventListener('click', () => group.remove());
            container.appendChild(group);
        });
    }

// In js/admin.js, replace the entire handleAddVideo function with this one.

function handleAddVideo() {
    const input = document.getElementById('video-url-input');
    const url = input.value.trim();

    if (url && url.includes('youtube.com/embed/')) {
        // **THE FIX IS HERE:** We target the correct container.
        const container = document.getElementById('video-previews'); 
        if (!container) {
            console.error("Error: Could not find the #video-previews container.");
            return;
        }

        const previewWrapper = document.createElement('div');
        previewWrapper.className = 'video-preview'; // Use the same class as the renderPreviews function
        previewWrapper.innerHTML = `<span>${url}</span><button type="button" class="delete-btn-icon">×</button>`;
        
        previewWrapper.querySelector('button').addEventListener('click', () => previewWrapper.remove());
        container.appendChild(previewWrapper);
        
        input.value = ''; // Clear the input after adding
    } else {
        alert('Please enter a valid YouTube Embed URL (it must contain "youtube.com/embed/").');
    }
}

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!IMGHIPPO_API_KEY || IMGHIPPO_API_KEY === "YOUR_IMGHIPPO_API_KEY") {
            alert("Error: Imghippo API key is not set.");
            return;
        }
        const uploadStatus = document.getElementById('upload-status');
        uploadStatus.textContent = 'Uploading...';
        const formData = new FormData();
        formData.append('api_key', IMGHIPPO_API_KEY);
        formData.append('file', file);
        try {
            const response = await fetch('https://api.imghippo.com/v1/upload', { method: 'POST', body: formData });
            if (!response.ok) throw new Error(`Server responded with ${response.status}`);
            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Unknown API error.');
            
            const container = document.querySelector('#image-previews .preview-list');
            const preview = document.createElement('div');
            preview.className = 'image-preview';
            preview.innerHTML = `<img src="${data.data.url}" alt="Preview"><button type="button" class="delete-btn-icon">×</button>`;
            preview.querySelector('button').addEventListener('click', () => preview.remove());
            container.appendChild(preview);
            uploadStatus.textContent = 'Upload successful!';
        } catch (error) {
            console.error('Upload Error:', error);
            uploadStatus.textContent = `Error: ${error.message}`;
        }
    }
    
    // --- INITIALIZATION ---
    if(loginForm) loginForm.addEventListener('submit', handleLogin);
    if(addNewProductBtn) addNewProductBtn.addEventListener('click', () => showForm());
    if(saveDataBtn) saveDataBtn.addEventListener('click', saveAndDownloadData);
    if(productForm) productForm.addEventListener('submit', handleFormSubmit);
    bindFormEvents();
});
