// Products data
const products = [
    {
        id: 1,
        name: "Smash Cheddar",
        description: "Blend da casa 150g, queijo cheddar derretido, cebola caramelizada, molho especial, pão brioche artesanal",
        price: 28.90,
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
        id: 2,
        name: "Bacon Master",
        description: "Blend 180g, bacon crocante, queijo gouda, alface americana, tomate, molho barbecue, pão australiano",
        price: 32.90,
        image: "https://images.pexels.com/photos/3738730/pexels-photo-3738730.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
        id: 3,
        name: "Truffle Supreme",
        description: "Blend premium 200g, queijo brie, cogumelos trufados, rúcula, cebola roxa, molho trufa, pão ciabatta",
        price: 45.90,
        image: "https://images.pexels.com/photos/1552238/pexels-photo-1552238.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
        id: 4,
        name: "Classic Double",
        description: "Dois blends 120g cada, queijo american cheese, picles, cebola, ketchup, mostarda, pão sesamo",
        price: 35.90,
        image: "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
        id: 5,
        name: "Spicy Fire",
        description: "Blend 160g, queijo pepper jack, jalapeños, pimenta chipotle, alface, molho picante, pão brioche",
        price: 30.90,
        image: "https://images.pexels.com/photos/1556698/pexels-photo-1556698.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
        id: 6,
        name: "Veggie Gourmet",
        description: "Hambúrguer de quinoa e grão-de-bico, queijo vegano, abacate, brotos, molho tahine, pão integral",
        price: 26.90,
        image: "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    }
];

// Cart state
let cart = [];

// DOM elements
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const cartEmpty = document.getElementById('cartEmpty');
const cartItems = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const productsGrid = document.getElementById('productsGrid');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupEventListeners();
});

// Render products
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    <button class="btn-add" onclick="addToCart(${product.id})">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    // Close cart with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showCartNotification();
}

// Update cart quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Update cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart count
    cartCount.textContent = totalItems;
    cartCount.classList.toggle('show', totalItems > 0);
    
    // Update cart content
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItems.style.display = 'none';
        cartFooter.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartItems.style.display = 'block';
        cartFooter.style.display = 'block';
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-content">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="btn-quantity" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14"/>
                            </svg>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="btn-quantity" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 5v14M5 12h14"/>
                            </svg>
                        </button>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m18 6-12 12M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
        
        cartTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    }
}

// Open cart
function openCart() {
    cartOverlay.classList.add('show');
    cartSidebar.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close cart
function closeCart() {
    cartOverlay.classList.remove('show');
    cartSidebar.classList.remove('show');
    document.body.style.overflow = '';
}

// Show cart notification (visual feedback)
function showCartNotification() {
    const btn = cartBtn;
    btn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        btn.style.transform = '';
    }, 200);
}

// Scroll to menu
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({
        behavior: 'smooth'
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    }
});

// Add loading animation to products
function animateProducts() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe product cards for animation
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            observer.observe(card);
        });
    }, 100);
});