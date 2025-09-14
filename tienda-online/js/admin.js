document.addEventListener('DOMContentLoaded', () => {
    /* Revisa si el usuario actual es admin, si no, lo redirige. */
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.email !== 'admin@duoc.cl') {
        alert('Acceso denegado. Debes ser administrador para ver esta página.');
        window.location.href = 'index.html';
        return;
    }

    const sidebarContainer = document.getElementById('admin-sidebar');
    const currentPage = window.location.pathname.split('/').pop();

    /* Dibuja el menú lateral y marca el enlace de la página actual como activo. */
    const renderAdminLayout = () => {
        if (!sidebarContainer) return;
        sidebarContainer.innerHTML = `
            <div class="sidebar-header">
                <a href="admin-usuarios.html">Admin Panel</a>
            </div>
            <nav class="admin-nav">
                <ul>
                    <li><a href="admin-usuarios.html" class="${currentPage === 'admin-usuarios.html' ? 'active' : ''}">Gestión de Usuarios</a></li>
                    <li><a href="admin-productos.html" class="${currentPage === 'admin-productos.html' ? 'active' : ''}">Gestión de Productos</a></li>
                    <li><a href="index.html">Volver a la Tienda</a></li>
                </ul>
            </nav>
        `;
    };

    /* Lógica para la página de gestión de usuarios. */
    if (currentPage === 'admin-usuarios.html') {
        const userListContainer = document.getElementById('user-list-container');
        let users = JSON.parse(localStorage.getItem('users')) || [];

        const renderUserTable = () => {
            userListContainer.innerHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Email</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.filter(user => user.email !== 'admin@duoc.cl').map(user => `
                            <tr>
                                <td>${user.nombre}</td>
                                <td>${user.apellidos}</td>
                                <td>${user.email}</td>
                                <td>
                                    <button class="action-btn delete-btn" data-email="${user.email}">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        };

        /* Listener para el botón de eliminar. */
        userListContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const userEmailToDelete = e.target.dataset.email;
                if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${userEmailToDelete}?`)) {
                    users = users.filter(user => user.email !== userEmailToDelete);
                    localStorage.setItem('users', JSON.stringify(users));
                    renderUserTable();
                    alert('Usuario eliminado con éxito.');
                }
            }
        });

        renderUserTable();
    }

    /* Lógica para la página de gestión de productos. */
    if (currentPage === 'admin-productos.html') {
        const productListContainer = document.getElementById('product-list-container');
        let products = JSON.parse(localStorage.getItem('products')) || [];

        const renderProductTable = () => {
            productListContainer.innerHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio Actual</th>
                            <th>Nuevo Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => `
                            <tr data-product-id="${product.id}">
                                <td>${product.id}</td>
                                <td>${product.name}</td>
                                <td>${product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                                <td><input type="number" class="price-input" placeholder="${product.price}"></td>
                                <td>
                                    <button class="action-btn save-btn">Guardar</button>
                                    <button class="action-btn delete-btn">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        };

        /* Listeners para los botones de guardar y eliminar. */
        productListContainer.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (!row) return;
            const productId = parseInt(row.dataset.productId);

            if (e.target.classList.contains('save-btn')) {
                const priceInput = row.querySelector('.price-input');
                const newPrice = parseInt(priceInput.value);
                if (!isNaN(newPrice) && newPrice > 0) {
                    const productIndex = products.findIndex(p => p.id === productId);
                    if (productIndex !== -1) {
                        products[productIndex].price = newPrice;
                        localStorage.setItem('products', JSON.stringify(products));
                        renderProductTable();
                        alert('Precio actualizado con éxito.');
                    }
                } else {
                    alert('Por favor, ingrese un precio válido.');
                }
            }

            if (e.target.classList.contains('delete-btn')) {
                if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                    products = products.filter(p => p.id !== productId);
                    localStorage.setItem('products', JSON.stringify(products));
                    renderProductTable();
                    alert('Producto eliminado con éxito.');
                }
            }
        });

        renderProductTable();
    }

    renderAdminLayout();
});