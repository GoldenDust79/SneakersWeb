document.addEventListener('DOMContentLoaded', () => {

    
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(initialProducts));
    }
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify(initialOrders));
    }

    const products = JSON.parse(localStorage.getItem('products'));
    let users = JSON.parse(localStorage.getItem('users'));

    const correctAdmin = initialUsers.find(user => user.email === 'admin@duoc.cl');
    const usersWithoutAdmin = users.filter(user => user.email !== 'admin@duoc.cl');
    if (correctAdmin) {
        usersWithoutAdmin.push(correctAdmin);
    }
    localStorage.setItem('users', JSON.stringify(usersWithoutAdmin));
    users = JSON.parse(localStorage.getItem('users'));

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    const discountCodes = {
        "SNEAKER5": 0.05,
        "PROMO10": 0.10,
        "WEB15": 0.15
    };
    let appliedDiscount = null;

    
    const updateCartCounter = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.innerText = totalItems;
        }
    };

    
    const addToCart = (productId) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productToAdd = products.find(p => p.id === productId);
        if (!productToAdd) return;
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        alert(`'${productToAdd.name}' ha sido añadido al carrito.`);
    };

    /* Dibuja la grilla de productos en el contenedor especificado. */
    const renderProducts = (gridContainer, productsArray) => {
        gridContainer.innerHTML = '';
        if (productsArray.length === 0) {
            gridContainer.innerHTML = '<p>No se encontraron productos que coincidan con los filtros.</p>';
            return;
        }
        productsArray.forEach(product => {
            const formattedPrice = product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
            gridContainer.innerHTML += `
                <div class="product-item">
                    <div class="product-image" style="background-image: url('${product.imageUrl}');"></div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${formattedPrice}</p>
                        <div class="product-buttons">
                            <button class="add-to-cart-btn" data-id="${product.id}">Añadir</button>
                            <a href="detalle-producto.html?id=${product.id}" class="view-detail-btn">Ver detalle</a>
                        </div>
                    </div>
                </div>`;
        });
    };

    /* Dibuja el header, mostrando enlaces diferentes si el usuario es admin o ha iniciado sesión. */
    const renderHeader = () => {
        const headerContainer = document.getElementById('main-header');
        if (!headerContainer) return;
        const adminLinkHtml = (currentUser && currentUser.email === 'admin@duoc.cl') ? `<li><a href="admin-usuarios.html">Admin</a></li>` : '';
        const sessionLinksHtml = currentUser
            ? `<li><a href="#" id="logout-link">Cerrar Sesión</a></li>`
            : `<li><a href="login.html">Iniciar Sesión</a></li><li><a href="registro.html">Registrarse</a></li>`;
        headerContainer.innerHTML = `
            <nav>
                <div class="site-name"><a href="index.html">SneakersWeb</a></div>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="productos.html">Productos</a></li>
                    <li><a href="blogs.html">Blogs</a></li>
                    <li><a href="contacto.html">Contacto</a></li>
                    ${adminLinkHtml}
                </ul>
                <div class="nav-right">
                    <ul>${sessionLinksHtml}</ul>
                    <a href="carrito.html" class="cart-link">Cart (<span id="cart-count">0</span>)</a>
                </div>
            </nav>`;
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('currentUser');
                alert('Has cerrado la sesión.');
                window.location.href = 'index.html';
            });
        }
    };

    

    const pageId = document.body.id;

    /* Lógica para la página de inicio. */
    if (pageId === 'home-page') {
        const featuredGrid = document.getElementById('featured-product-grid');
        if (featuredGrid) {
            const featuredProducts = products.slice(0, 8);
            renderProducts(featuredGrid, featuredProducts);
            featuredGrid.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-to-cart-btn')) {
                    addToCart(parseInt(e.target.dataset.id));
                }
            });
        }
    }
    

    /* Lógica para la página de productos, incluyendo filtros y ordenamiento. */
    if (pageId === 'productos-page') {
        const allProductsGrid = document.getElementById('all-products-grid');
        const filterContainer = document.getElementById('price-filter-container');
        const sortSelect = document.getElementById('sort-select');

        let currentFilter = 'all';
        let currentSort = 'default';

        const applyFiltersAndSort = () => {
            let filteredProducts = [...products];

            if (currentFilter === 'low') {
                filteredProducts = filteredProducts.filter(p => p.price < 80000);
            } else if (currentFilter === 'medium') {
                filteredProducts = filteredProducts.filter(p => p.price >= 80000 && p.price <= 120000);
            } else if (currentFilter === 'high') {
                filteredProducts = filteredProducts.filter(p => p.price > 120000);
            }

            switch (currentSort) {
                case 'price-asc':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'name-asc':
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                    break;
            }

            renderProducts(allProductsGrid, filteredProducts);
        };

        if (allProductsGrid && filterContainer && sortSelect) {
            filterContainer.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    filterContainer.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');
                    currentFilter = e.target.dataset.filter;
                    applyFiltersAndSort();
                }
            });

            sortSelect.addEventListener('change', (e) => {
                currentSort = e.target.value;
                applyFiltersAndSort();
            });

            allProductsGrid.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-to-cart-btn')) {
                    addToCart(parseInt(e.target.dataset.id));
                }
            });

            applyFiltersAndSort();
        }
    }

    /* Lógica para la página de detalle de producto. */
    if (pageId === 'detalle-producto-page') {
        const productDetailContainer = document.getElementById('product-detail-container');
        const relatedProductsGrid = document.getElementById('related-products-grid');

        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get('id'));
        const product = products.find(p => p.id === productId);

        if (product) {
            const formattedPrice = product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
            document.title = `SneakersWeb - ${product.name}`;

            productDetailContainer.innerHTML = `
                <div class="product-gallery">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <h1>${product.name}</h1>
                    <p class="price">${formattedPrice}</p>
                    <p class="description">${product.description}</p>
                    <div class="detail-actions">
                        <button class="add-to-cart-btn" data-id="${product.id}">Añadir al Carrito</button>
                    </div>
                </div>
            `;

            productDetailContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-to-cart-btn')) {
                    addToCart(parseInt(e.target.dataset.id));
                }
            });

            const relatedProducts = products.filter(p => p.id !== productId).slice(0, 4);
            renderProducts(relatedProductsGrid, relatedProducts);

            relatedProductsGrid.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-to-cart-btn')) {
                    addToCart(parseInt(e.target.dataset.id));
                }
            });

        } else {
            productDetailContainer.innerHTML = '<p>Producto no encontrado. <a href="productos.html">Volver a la tienda</a>.</p>';
        }
    }

    /* Lógica para la página del carrito. */
    if (pageId === 'carrito-page') {
        const cartContainer = document.getElementById('cart-container');
        
        const renderCart = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                cartContainer.innerHTML = '<p>Tu carrito de compras está vacío. <a href="productos.html">Ver productos</a></p>';
                cartContainer.classList.remove('cart-layout');
                return;
            }

            let subtotal = 0;
            let itemsHTML = cart.map(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                return `
                    <div class="cart-item">
                        <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>Precio: ${item.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
                            <p>Cantidad: ${item.quantity}</p>
                        </div>
                        <div class="cart-item-actions">
                            <span class="cart-item-total">${itemTotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
                            <button class="remove-from-cart-btn" data-id="${item.id}">Eliminar</button>
                        </div>
                    </div>`;
            }).join('');

            const discountAmount = appliedDiscount ? subtotal * appliedDiscount.discount : 0;
            const total = subtotal - discountAmount;

            let discountHTML = '';
            if (appliedDiscount) {
                discountHTML = `
                    <div class="summary-line">
                        <span>Descuento (${appliedDiscount.code}):</span>
                        <span>-${discountAmount.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
                    </div>
                `;
            }

            cartContainer.innerHTML = `
                <div class="cart-items-list">${itemsHTML}</div>
                <div class="cart-summary">
                    <h3>Resumen de Compra</h3>
                    <div class="summary-line">
                        <span>Subtotal:</span>
                        <span>${subtotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
                    </div>
                    ${discountHTML}
                    <div class="summary-line total">
                        <span>Total:</span>
                        <span>${total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
                    </div>
                    <div class="discount-section">
                        <input type="text" id="discount-code-input" placeholder="Código de descuento">
                        <button class="apply-discount-btn">Aplicar</button>
                    </div>
                    <button id="pay-button" class="btn-submit">Pagar</button>
                </div>`;
        };

        cartContainer.addEventListener('click', (e) => {
            if (e.target.id === 'pay-button') {
                if (!currentUser) {
                    alert('Debes iniciar sesión para poder pagar.');
                    window.location.href = 'login.html';
                } else {
                    alert('Proceso de pago no implementado. ¡Gracias por tu compra!');
                    localStorage.removeItem('cart');
                    appliedDiscount = null;
                    window.location.href = 'index.html';
                }
            }
            if (e.target.classList.contains('remove-from-cart-btn')) {
                const productId = parseInt(e.target.dataset.id);
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const updatedCart = cart.filter(item => item.id !== productId);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                renderCart(); 
                updateCartCounter();
            }
            if (e.target.classList.contains('apply-discount-btn')) {
                const codeInput = document.getElementById('discount-code-input');
                const code = codeInput.value.trim().toUpperCase();
                if (discountCodes[code]) {
                    appliedDiscount = { code: code, discount: discountCodes[code] };
                    alert(`¡Código "${code}" aplicado!`);
                    renderCart();
                } else {
                    alert('El código de descuento no es válido.');
                }
            }
        });

        renderCart();
    }

    /* Lógica para la página de registro. */
    if (pageId === 'registro-page') {
        const registerForm = document.getElementById('register-form');
        const regionSelect = document.getElementById('region');
        const comunaSelect = document.getElementById('comuna');

        locations.regiones.forEach(region => {
            const option = document.createElement('option');
            option.value = region.region;
            option.textContent = region.region;
            regionSelect.appendChild(option);
        });

        regionSelect.addEventListener('change', () => {
            const selectedRegion = locations.regiones.find(r => r.region === regionSelect.value);
            comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
            if (selectedRegion) {
                const sortedComunas = selectedRegion.comunas.sort((a, b) => a.localeCompare(b, 'es-CL'));
                sortedComunas.forEach(comuna => {
                    const option = document.createElement('option');
                    option.value = comuna;
                    option.textContent = comuna;
                    comunaSelect.appendChild(option);
                });
            }
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newUser = {
                run: e.target.run.value,
                nombre: e.target.nombre.value,
                apellidos: e.target.apellidos.value,
                email: e.target.email.value.toLowerCase(),
                fechaNacimiento: e.target.fechaNacimiento.value,
                password: e.target.password.value,
                region: e.target.region.value,
                comuna: e.target.comuna.value
            };
            const emailExists = users.some(user => user.email === newUser.email);
            if (emailExists) {
                alert('El correo electrónico ya está registrado.');
                return;
            }
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            alert('¡Registro exitoso! Serás redirigido para iniciar sesión.');
            window.location.href = 'login.html';
        });
    }

    /* Lógica para la página de login. */
    if (pageId === 'login-page') {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.email.value.toLowerCase();
            const password = e.target.password.value;

            const allowedDomains = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
            if (!allowedDomains.test(email)) {
                alert('El correo no es válido. Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com.');
                return;
            }

            const foundUser = users.find(u => u.email === email && u.password === password);

            if (foundUser) {
                alert(`Bienvenido, ${foundUser.nombre}!`);
                sessionStorage.setItem('currentUser', JSON.stringify(foundUser));

                if (foundUser.email === 'admin@duoc.cl') {
                    window.location.href = 'admin-usuarios.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                alert('Correo o contraseña incorrectos.');
            }
        });
    }

    
    if (pageId === 'blogs-page') {
        const modal = document.getElementById('blog-modal');
        const modalTextContainer = document.getElementById('modal-text-container');
        const closeButton = document.querySelector('.close-button');
        const blogButtons = document.querySelectorAll('.blog-button');

        blogButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const blogPost = e.target.closest('.blog-post');
                const hiddenContent = blogPost.querySelector('.modal-hidden-content');
                if (hiddenContent) {
                    modalTextContainer.innerHTML = hiddenContent.innerHTML;
                    modal.style.display = 'block';
                }
            });
        });

        const closeModal = () => {
            modal.style.display = 'none';
            modalTextContainer.innerHTML = '';
        };

        closeButton.addEventListener('click', closeModal);

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                closeModal();
            }
        });
    }

    /* Ejecución de funciones iniciales. */
    renderHeader();
    updateCartCounter();
});
