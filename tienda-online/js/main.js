document.addEventListener('DOMContentLoaded', () => { // Espera a que cargue el DOM.

    // Función para validar el correo electrónico
    const validateEmail = (email) => { // Valida el correo electrónico.
        const allowedDomains = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        return allowedDomains.test(email);
    };

    if (!localStorage.getItem('products')) { // Carga productos si no existen.
        localStorage.setItem('products', JSON.stringify(initialProducts));
    }
    if (!localStorage.getItem('users')) { // Carga usuarios si no existen.
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem('orders')) { // Carga órdenes si no existen.
        localStorage.setItem('orders', JSON.stringify(initialOrders));
    }

    const products = JSON.parse(localStorage.getItem('products')); // Obtiene productos del almacenamiento.
    let users = JSON.parse(localStorage.getItem('users')); // Obtiene usuarios del almacenamiento.

    const correctAdmin = initialUsers.find(user => user.email === 'admin@duoc.cl'); // Busca al administrador inicial.
    const usersWithoutAdmin = users.filter(user => user.email !== 'admin@duoc.cl'); // Filtra usuarios sin administrador.
    if (correctAdmin) { // Si existe el admin correcto.
        usersWithoutAdmin.push(correctAdmin); // Agrega el administrador correcto.
    }
    localStorage.setItem('users', JSON.stringify(usersWithoutAdmin)); // Actualiza usuarios en almacenamiento.
    users = JSON.parse(localStorage.getItem('users')); // Recarga los usuarios actualizados.

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')); // Obtiene el usuario actual.

    const discountCodes = { // Define códigos de descuento.
        "SNEAKER5": 0.05,
        "PROMO10": 0.10,
        "WEB15": 0.15
    };
    let appliedDiscount = null; // Descuento aplicado inicialmente nulo.

    const updateCartCounter = () => { // Actualiza el contador del carrito.
        const cart = JSON.parse(localStorage.getItem('cart')) || []; // Obtiene el carrito o array vacío.
        const cartCountElement = document.getElementById('cart-count'); // Obtiene el elemento contador.
        if (cartCountElement) { // Si el contador existe.
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Suma la cantidad de items.
            cartCountElement.innerText = totalItems; // Muestra el total de items.
        }
    };

    const addToCart = (productId) => { // Añade un producto al carrito.
        let cart = JSON.parse(localStorage.getItem('cart')) || []; // Obtiene el carrito o array vacío.
        const productToAdd = products.find(p => p.id === productId); // Busca el producto a añadir.
        if (!productToAdd) return; // Si no hay producto, termina.
        const existingItem = cart.find(item => item.id === productId); // Busca si el item ya existe.
        if (existingItem) { // Si el item ya existe.
            existingItem.quantity++; // Aumenta la cantidad.
        } else { // Si no existe el item.
            cart.push({ ...productToAdd, quantity: 1 }); // Añade nuevo item al carrito.
        }
        localStorage.setItem('cart', JSON.stringify(cart)); // Guarda el carrito actualizado.
        updateCartCounter(); // Actualiza el contador del carrito.
        alert(`'${productToAdd.name}' ha sido añadido al carrito.`); // Muestra alerta de producto añadido.
    };

    const renderProducts = (gridContainer, productsArray) => { // Muestra productos en una grilla.
        gridContainer.innerHTML = ''; // Limpia el contenedor de la grilla.
        if (productsArray.length === 0) { // Si no hay productos.
            gridContainer.innerHTML = '<p>No se encontraron productos que coincidan con los filtros.</p>'; // Muestra mensaje de no encontrados.
            return; // Termina la función.
        }
        productsArray.forEach(product => { // Itera sobre cada producto.
            const formattedPrice = product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }); // Formatea el precio a CLP.
            gridContainer.innerHTML += ` // Añade el HTML del producto.
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

    const renderHeader = () => { // Muestra el encabezado de la página.
        const headerContainer = document.getElementById('main-header'); // Obtiene el contenedor del encabezado.
        if (!headerContainer) return; // Si no hay contenedor, termina.
        const adminLinkHtml = (currentUser && currentUser.email === 'admin@duoc.cl') ? `<li><a href="admin-usuarios.html">Admin</a></li>` : ''; // Muestra enlace de admin si es admin.
        const sessionLinksHtml = currentUser // Muestra enlaces de sesión.
            ? `<li><a href="#" id="logout-link">Cerrar Sesión</a></li>`
            : `<li><a href="login.html">Iniciar Sesión</a></li><li><a href="registro.html">Registrarse</a></li>`;
        headerContainer.innerHTML = ` // Añade el HTML del encabezado.
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
        const logoutLink = document.getElementById('logout-link'); // Obtiene el enlace de cerrar sesión.
        if (logoutLink) { // Si existe el enlace.
            logoutLink.addEventListener('click', (e) => { // Añade evento al hacer clic.
                e.preventDefault(); // Previene la acción por defecto.
                sessionStorage.removeItem('currentUser'); // Elimina el usuario actual.
                alert('Has cerrado la sesión.'); // Muestra alerta de sesión cerrada.
                window.location.href = 'index.html'; // Redirige a la página de inicio.
            });
        }
    };

    const pageId = document.body.id; // Obtiene el ID del body.

    if (pageId === 'home-page') { // Si es la página de inicio.
        const featuredGrid = document.getElementById('featured-product-grid'); // Obtiene la grilla de destacados.
        if (featuredGrid) { // Si la grilla existe.
            const featuredProducts = products.slice(0, 8); // Obtiene los primeros 8 productos.
            renderProducts(featuredGrid, featuredProducts); // Muestra los productos destacados.
            featuredGrid.addEventListener('click', (e) => { // Añade evento al hacer clic.
                if (e.target.classList.contains('add-to-cart-btn')) { // Si se presiona añadir al carrito.
                    addToCart(parseInt(e.target.dataset.id)); // Añade el producto al carrito.
                }
            });
        }
    }

    if (pageId === 'productos-page') { // Si es la página de productos.
        const allProductsGrid = document.getElementById('all-products-grid'); // Obtiene la grilla de productos.
        const filterContainer = document.getElementById('price-filter-container'); // Obtiene el contenedor de filtros.
        const sortSelect = document.getElementById('sort-select'); // Obtiene el selector de orden.

        let currentFilter = 'all'; // Filtro actual es "todos".
        let currentSort = 'default'; // Orden actual es "por defecto".

        const applyFiltersAndSort = () => { // Aplica filtros y orden.
            let filteredProducts = [...products]; // Copia los productos.

            if (currentFilter === 'low') { // Si el filtro es "bajo".
                filteredProducts = filteredProducts.filter(p => p.price < 80000); // Filtra productos de precio bajo.
            } else if (currentFilter === 'medium') { // Si el filtro es "medio".
                filteredProducts = filteredProducts.filter(p => p.price >= 80000 && p.price <= 120000); // Filtra productos de precio medio.
            } else if (currentFilter === 'high') { // Si el filtro es "alto".
                filteredProducts = filteredProducts.filter(p => p.price > 120000); // Filtra productos de precio alto.
            }

            switch (currentSort) { // Según el tipo de orden.
                case 'price-asc': // Orden ascendente por precio.
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc': // Orden descendente por precio.
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'name-asc': // Orden ascendente por nombre.
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc': // Orden descendente por nombre.
                    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                    break;
            }

            renderProducts(allProductsGrid, filteredProducts); // Muestra los productos filtrados.
        };

        if (allProductsGrid && filterContainer && sortSelect) { // Si existen los elementos.
            filterContainer.addEventListener('click', (e) => { // Añade evento al hacer clic.
                if (e.target.tagName === 'BUTTON') { // Si se presiona un botón.
                    filterContainer.querySelector('.active').classList.remove('active'); // Quita la clase activa.
                    e.target.classList.add('active'); // Añade la clase activa.
                    currentFilter = e.target.dataset.filter; // Actualiza el filtro actual.
                    applyFiltersAndSort(); // Aplica filtros y orden.
                }
            });

            sortSelect.addEventListener('change', (e) => { // Añade evento al cambiar.
                currentSort = e.target.value; // Actualiza el orden actual.
                applyFiltersAndSort(); // Aplica filtros y orden.
            });

            allProductsGrid.addEventListener('click', (e) => { // Añade evento al hacer clic.
                if (e.target.classList.contains('add-to-cart-btn')) { // Si se presiona añadir al carrito.
                    addToCart(parseInt(e.target.dataset.id)); // Añade el producto al carrito.
                }
            });

            applyFiltersAndSort(); // Aplica filtros y orden.
        }
    }

    if (pageId === 'detalle-producto-page') { // Si es la página de detalle.
        const productDetailContainer = document.getElementById('product-detail-container'); // Obtiene el contenedor de detalle.
        const relatedProductsGrid = document.getElementById('related-products-grid'); // Obtiene la grilla de relacionados.

        const params = new URLSearchParams(window.location.search); // Obtiene los parámetros de la URL.
        const productId = parseInt(params.get('id')); // Obtiene el ID del producto.
        const product = products.find(p => p.id === productId); // Busca el producto por ID.

        if (product) { // Si el producto existe.
            const formattedPrice = product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }); // Formatea el precio a CLP.
            document.title = `SneakersWeb - ${product.name}`; // Actualiza el título de la página.

            productDetailContainer.innerHTML = ` // Añade el HTML del detalle.
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

            productDetailContainer.addEventListener('click', (e) => { // Añade evento al hacer clic.
                if (e.target.classList.contains('add-to-cart-btn')) { // Si se presiona añadir al carrito.
                    addToCart(parseInt(e.target.dataset.id)); // Añade el producto al carrito.
                }
            });

            const relatedProducts = products.filter(p => p.id !== productId).slice(0, 4); // Obtiene 4 productos relacionados.
            renderProducts(relatedProductsGrid, relatedProducts); // Muestra los productos relacionados.

            relatedProductsGrid.addEventListener('click', (e) => { // Añade evento al hacer clic.
                if (e.target.classList.contains('add-to-cart-btn')) { // Si se presiona añadir al carrito.
                    addToCart(parseInt(e.target.dataset.id)); // Añade el producto al carrito.
                }
            });

        } else { // Si el producto no existe.
            productDetailContainer.innerHTML = '<p>Producto no encontrado. <a href="productos.html">Volver a la tienda</a>.</p>'; // Muestra mensaje de no encontrado.
        }
    }

    if (pageId === 'carrito-page') { // Si es la página del carrito.
        const cartContainer = document.getElementById('cart-container'); // Obtiene el contenedor del carrito.
        
        const renderCart = () => { // Muestra el contenido del carrito.
            const cart = JSON.parse(localStorage.getItem('cart')) || []; // Obtiene el carrito o array vacío.
            if (cart.length === 0) { // Si el carrito está vacío.
                cartContainer.innerHTML = '<p>Tu carrito de compras está vacío. <a href="productos.html">Ver productos</a></p>'; // Muestra mensaje de carrito vacío.
                cartContainer.classList.remove('cart-layout'); // Quita la clase de layout.
                return; // Termina la función.
            }

            let subtotal = 0; // Subtotal inicial es 0.
            let itemsHTML = cart.map(item => { // Itera sobre cada item.
                const itemTotal = item.price * item.quantity; // Calcula el total del item.
                subtotal += itemTotal; // Suma al subtotal.
                return ` // Retorna el HTML del item.
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
            }).join(''); // Une todo el HTML.

            const discountAmount = appliedDiscount ? subtotal * appliedDiscount.discount : 0; // Calcula el monto de descuento.
            const total = subtotal - discountAmount; // Calcula el total.

            let discountHTML = ''; // HTML de descuento vacío.
            if (appliedDiscount) { // Si hay descuento aplicado.
                discountHTML = ` // Añade el HTML del descuento.
                    <div class="summary-line">
                        <span>Descuento (${appliedDiscount.code}):</span>
                        <span>-${discountAmount.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
                    </div>
                `;
            }

            cartContainer.innerHTML = ` // Añade el HTML del carrito.
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

        cartContainer.addEventListener('click', (e) => { // Añade evento al hacer clic.
            if (e.target.id === 'pay-button') { // Si se presiona pagar.
                if (!currentUser) { // Si no hay usuario actual.
                    alert('Debes iniciar sesión para poder pagar.'); // Muestra alerta de iniciar sesión.
                    window.location.href = 'login.html'; // Redirige a la página de login.
                } else { // Si hay usuario actual.
                    alert('Proceso de pago no implementado. ¡Gracias por tu compra!'); // Muestra alerta de pago no implementado.
                    localStorage.removeItem('cart'); // Elimina el carrito.
                    appliedDiscount = null; // Reinicia el descuento aplicado.
                    window.location.href = 'index.html'; // Redirige a la página de inicio.
                }
            }
            if (e.target.classList.contains('remove-from-cart-btn')) { // Si se presiona eliminar del carrito.
                const productId = parseInt(e.target.dataset.id); // Obtiene el ID del producto.
                let cart = JSON.parse(localStorage.getItem('cart')) || []; // Obtiene el carrito o array vacío.
                const updatedCart = cart.filter(item => item.id !== productId); // Filtra el producto a eliminar.
                localStorage.setItem('cart', JSON.stringify(updatedCart)); // Guarda el carrito actualizado.
                renderCart(); // Muestra el carrito actualizado.
                updateCartCounter(); // Actualiza el contador del carrito.
            }
            if (e.target.classList.contains('apply-discount-btn')) { // Si se presiona aplicar descuento.
                const codeInput = document.getElementById('discount-code-input'); // Obtiene el input del código.
                const code = codeInput.value.trim().toUpperCase(); // Obtiene el código y lo formatea.
                if (discountCodes[code]) { // Si el código existe.
                    appliedDiscount = { code: code, discount: discountCodes[code] }; // Aplica el descuento.
                    alert(`¡Código "${code}" aplicado!`); // Muestra alerta de código aplicado.
                    renderCart(); // Muestra el carrito actualizado.
                } else { // Si el código no existe.
                    alert('El código de descuento no es válido.'); // Muestra alerta de código no válido.
                }
            }
        });

        renderCart(); // Muestra el carrito.
    }

    if (pageId === 'registro-page') { // Si es la página de registro.
        const registerForm = document.getElementById('register-form'); // Obtiene el formulario de registro.
        const regionSelect = document.getElementById('region'); // Obtiene el selector de región.
        const comunaSelect = document.getElementById('comuna'); // Obtiene el selector de comuna.

        locations.regiones.forEach(region => { // Itera sobre cada región.
            const option = document.createElement('option'); // Crea un elemento de opción.
            option.value = region.region; // Asigna el valor de la región.
            option.textContent = region.region; // Asigna el texto de la región.
            regionSelect.appendChild(option); // Añade la opción al selector.
        });

        regionSelect.addEventListener('change', () => { // Añade evento al cambiar.
            const selectedRegion = locations.regiones.find(r => r.region === regionSelect.value); // Busca la región seleccionada.
            comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>'; // Limpia el selector de comuna.
            if (selectedRegion) { // Si hay región seleccionada.
                const sortedComunas = selectedRegion.comunas.sort((a, b) => a.localeCompare(b, 'es-CL')); // Ordena las comunas.
                sortedComunas.forEach(comuna => { // Itera sobre cada comuna.
                    const option = document.createElement('option'); // Crea un elemento de opción.
                    option.value = comuna; // Asigna el valor de la comuna.
                    option.textContent = comuna; // Asigna el texto de la comuna.
                    comunaSelect.appendChild(option); // Añade la opción al selector.
                });
            }
        });

        registerForm.addEventListener('submit', (e) => { // Añade evento al enviar.
            e.preventDefault(); // Previene la acción por defecto.
            const email = e.target.email.value.toLowerCase(); // Obtiene el email y lo formatea.
            if (!validateEmail(email)) { // Si el email no es válido.
                alert('El correo no es válido. Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com.'); // Muestra alerta de email no válido.
                return; // Termina la función.
            }

            const newUser = { // Crea un nuevo usuario.
                run: e.target.run.value,
                nombre: e.target.nombre.value,
                apellidos: e.target.apellidos.value,
                email: email,
                fechaNacimiento: e.target.fechaNacimiento.value,
                password: e.target.password.value,
                region: e.target.region.value,
                comuna: e.target.comuna.value
            };
            const emailExists = users.some(user => user.email === newUser.email); // Verifica si el email ya existe.
            if (emailExists) { // Si el email ya existe.
                alert('El correo electrónico ya está registrado.'); // Muestra alerta de email ya registrado.
                return; // Termina la función.
            }
            users.push(newUser); // Añade el nuevo usuario.
            localStorage.setItem('users', JSON.stringify(users)); // Guarda los usuarios actualizados.
            alert('¡Registro exitoso! Serás redirigido para iniciar sesión.'); // Muestra alerta de registro exitoso.
            window.location.href = 'login.html'; // Redirige a la página de login.
        });
    }

    if (pageId === 'login-page') { // Si es la página de login.
        const loginForm = document.getElementById('login-form'); // Obtiene el formulario de login.
        loginForm.addEventListener('submit', (e) => { // Añade evento al enviar.
            e.preventDefault(); // Previene la acción por defecto.
            const email = e.target.email.value.toLowerCase(); // Obtiene el email y lo formatea.
            const password = e.target.password.value; // Obtiene la contraseña.

            if (!validateEmail(email)) { // Si el email no es válido.
                alert('El correo no es válido. Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com.'); // Muestra alerta de email no válido.
                return; // Termina la función.
            }

            const foundUser = users.find(u => u.email === email && u.password === password); // Busca al usuario.

            if (foundUser) { // Si se encuentra al usuario.
                alert(`Bienvenido, ${foundUser.nombre}!`); // Muestra alerta de bienvenida.
                sessionStorage.setItem('currentUser', JSON.stringify(foundUser)); // Guarda el usuario actual.

                if (foundUser.email === 'admin@duoc.cl') { // Si es el administrador.
                    window.location.href = 'admin-usuarios.html'; // Redirige a la página de admin.
                } else { // Si no es el administrador.
                    window.location.href = 'index.html'; // Redirige a la página de inicio.
                }
            } else { // Si no se encuentra al usuario.
                alert('Correo o contraseña incorrectos.'); // Muestra alerta de datos incorrectos.
            }
        });
    }

    if (pageId === 'contacto-page') { // Si es la página de contacto.
        const contactForm = document.getElementById('contact-form'); // Obtiene el formulario de contacto.
        const emailInput = document.getElementById('contact-email'); // Obtiene el input de email.
        const emailError = document.getElementById('email-error'); // Obtiene el mensaje de error.

        contactForm.addEventListener('submit', (e) => { // Añade evento al enviar.
            e.preventDefault(); // Previene la acción por defecto.
            const email = emailInput.value; // Obtiene el valor del email.

            if (validateEmail(email)) { // Si el email es válido.
                emailError.style.display = 'none'; // Oculta el mensaje de error.
                alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.'); // Muestra alerta de agradecimiento.
                contactForm.reset(); // Limpia el formulario.
            } else { // Si el email no es válido.
                emailError.style.display = 'block'; // Muestra el mensaje de error.
            }
        });
    }

    if (pageId === 'blogs-page') { // Si es la página de blogs.
        const modal = document.getElementById('blog-modal'); // Obtiene el modal.
        const modalTextContainer = document.getElementById('modal-text-container'); // Obtiene el contenedor de texto.
        const closeButton = document.querySelector('.close-button'); // Obtiene el botón de cerrar.
        const blogButtons = document.querySelectorAll('.blog-button'); // Obtiene todos los botones de blog.

        blogButtons.forEach(button => { // Itera sobre cada botón.
            button.addEventListener('click', (e) => { // Añade evento al hacer clic.
                const blogPost = e.target.closest('.blog-post'); // Obtiene el post de blog más cercano.
                const hiddenContent = blogPost.querySelector('.modal-hidden-content'); // Obtiene el contenido oculto.
                if (hiddenContent) { // Si hay contenido oculto.
                    modalTextContainer.innerHTML = hiddenContent.innerHTML; // Muestra el contenido en el modal.
                    modal.style.display = 'block'; // Muestra el modal.
                }
            });
        });

        const closeModal = () => { // Cierra el modal.
            modal.style.display = 'none'; // Oculta el modal.
            modalTextContainer.innerHTML = ''; // Limpia el contenido del modal.
        };

        closeButton.addEventListener('click', closeModal); // Añade evento al hacer clic.

        window.addEventListener('click', (event) => { // Añade evento al hacer clic.
            if (event.target == modal) { // Si se hace clic fuera del modal.
                closeModal(); // Cierra el modal.
            }
        });
    }

    renderHeader(); // Muestra el encabezado.
    updateCartCounter(); // Actualiza el contador del carrito.
});