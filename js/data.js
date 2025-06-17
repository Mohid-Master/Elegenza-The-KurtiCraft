// js/data.js

// This file acts as our local database.
const products = [
    { 
        id: 1, name: 'Azure Blue Anarkali', price: 2499,
        description: 'A flowing Anarkali in a serene azure blue, perfect for festive occasions. Made with pure georgette and intricate thread work.',
        images: ['https://picsum.photos/id/102/800/1200', 'https://picsum.photos/id/103/800/1200', 'https://picsum.photos/id/104/800/1200'],
        video: null,
        sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue', 'White'] 
    },
    { 
        id: 2, name: 'Crimson Silk Kurti', price: 3199,
        description: 'Feel regal in this luxurious crimson silk kurti. Features a classic straight cut with golden zari embroidery.',
        images: ['https://picsum.photos/id/102/800/1200', 'https://picsum.photos/id/103/800/1200', 'https://picsum.photos/id/104/800/1200'],
        sizes: ['M', 'L'], colors: ['Red', 'Gold']
    },
    { 
        id: 3, name: 'Emerald Green Straight', price: 1999,
        description: 'A chic and modern straight-fit kurti in a stunning emerald green. Crafted from breathable cotton for all-day comfort.',
       images: ['https://picsum.photos/id/102/800/1200', 'https://picsum.photos/id/103/800/1200', 'https://picsum.photos/id/104/800/1200'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Green', 'Black'] 
    },
    { 
        id: 4, name: 'Sunshine Yellow Cotton', price: 1599,
        description: 'Brighten up your day with this cheerful yellow kurti. Simple, elegant, and perfect for casual outings.',
        images: ['https://picsum.photos/id/102/800/1200', 'https://picsum.photos/id/103/800/1200', 'https://picsum.photos/id/104/800/1200'],
        video: null,
        sizes: ['S', 'M'], colors: ['Yellow', 'White'] 
    },
    { 
        id: 5, name: 'Classic Black Elegance', price: 2999,
        description: 'An essential for any wardrobe. This classic black kurti features subtle silver embroidery for a touch of class.',
        images: ['https://i.pinimg.com/564x/f3/d3/18/f3d318458f27915155f042637c569f45.jpg', 'https://i.pinimg.com/564x/05/c3/91/05c391307f9c84e1b52a5c4e9d6d39d6.jpg'],
        sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Silver'] 
    }
];
 const products2 = [
        { 
            id: 1, name: 'Azure Blue Anarkali', price: 2499,
            description: 'A flowing Anarkali in a serene azure blue, perfect for festive occasions. Made with pure georgette and intricate thread work.',
            images: ['https://picsum.photos/id/102/800/1200', 'https://picsum.photos/id/103/800/1200', 'https://picsum.photos/id/104/800/1200'],
            video: 'videos/product-video.mp4', // Example video
            sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue', 'White'] 
        },
        { 
            id: 2, name: 'Crimson Silk Kurti', price: 3199,
            description: 'Feel regal in this luxurious crimson silk kurti. Features a classic straight cut with golden zari embroidery.',
            images: ['https://picsum.photos/id/201/800/1200', 'https://picsum.photos/id/202/800/1200', 'https://picsum.photos/id/203/800/1200'],
            sizes: ['M', 'L'], colors: ['Red', 'Gold']
        },
        { 
            id: 3, name: 'Emerald Green Straight', price: 1999,
            description: 'A chic and modern straight-fit kurti in a stunning emerald green. Crafted from breathable cotton for all-day comfort.',
            images: ['https://picsum.photos/id/305/800/1200', 'https://picsum.photos/id/306/800/1200'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Green', 'Black'] 
        },
        { 
            id: 4, name: 'Sunshine Yellow Cotton', price: 1599,
            description: 'Brighten up your day with this cheerful yellow kurti. Simple, elegant, and perfect for casual outings.',
            images: ['https://picsum.photos/id/401/800/1200', 'https://picsum.photos/id/402/800/1200', 'https://picsum.photos/id/404/800/1200'],
            video: 'videos/product-video.mp4', // Example video
            sizes: ['S', 'M'], colors: ['Yellow', 'White'] 
        },
    ];