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
                    <li><a href="admin-ordenes.html" class="${currentPage === 'admin-ordenes.html' ? 'active' : ''}">Órdenes de Usuarios</a></li>
                    <li><a href="admin-inventario.html" class="${currentPage === 'admin-inventario.html' ? 'active' : ''}">Gestión de Inventario</a></li>
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

    if (currentPage === 'admin-ordenes.html') {
        const orderListContainer = document.getElementById('order-list-container');
        let orders = JSON.parse(localStorage.getItem('orders')) || initialOrders;

        const renderOrderTable = () => {
            orderListContainer.innerHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID Orden</th>
                            <th>Email Usuario</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map(order => `
                            <tr data-order-id="${order.id}">
                                <td>${order.id}</td>
                                <td>${order.userEmail}</td>
                                <td>${order.date}</td>
                                <td>${order.total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                                <td>
                                    <select class="order-status-select" data-order-id="${order.id}">
                                        <option value="Pendiente" ${order.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                                        <option value="Completado" ${order.status === 'Completado' ? 'selected' : ''}>Completado</option>
                                        <option value="Enviado" ${order.status === 'Enviado' ? 'selected' : ''}>Enviado</option>
                                        <option value="Cancelado" ${order.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                                    </select>
                                </td>
                                <td>
                                    <button class="action-btn delete-btn" data-order-id="${order.id}">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        };

        orderListContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('order-status-select')) {
                const orderId = parseInt(e.target.dataset.orderId);
                const newStatus = e.target.value;
                const orderIndex = orders.findIndex(o => o.id === orderId);
                if (orderIndex !== -1) {
                    orders[orderIndex].status = newStatus;
                    localStorage.setItem('orders', JSON.stringify(orders));
                    alert('Estado de orden actualizado.');
                }
            }
        });

        orderListContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const orderIdToDelete = parseInt(e.target.dataset.orderId);
                if (confirm(`¿Estás seguro de que quieres eliminar la orden ${orderIdToDelete}?`)) {
                    orders = orders.filter(order => order.id !== orderIdToDelete);
                    localStorage.setItem('orders', JSON.stringify(orders));
                    renderOrderTable();
                    alert('Orden eliminada con éxito.');
                }
            }
        });

        renderOrderTable();
    }

    if (currentPage === 'admin-inventario.html') {
        const inventoryListContainer = document.getElementById('inventory-list-container');
        let products = JSON.parse(localStorage.getItem('products')) || [];

        const renderInventoryTable = () => {
            inventoryListContainer.innerHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Stock Actual</th>
                            <th>Nuevo Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => `
                            <tr data-product-id="${product.id}">
                                <td>${product.id}</td>
                                <td>${product.name}</td>
                                <td>${product.stock}</td>
                                <td><input type="number" class="stock-input" placeholder="${product.stock}"></td>
                                <td>
                                    <button class="action-btn save-btn">Actualizar Stock</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        };

        inventoryListContainer.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (!row) return;
            const productId = parseInt(row.dataset.productId);

            if (e.target.classList.contains('save-btn')) {
                const stockInput = row.querySelector('.stock-input');
                const newStock = parseInt(stockInput.value);
                if (!isNaN(newStock) && newStock >= 0) {
                    const productIndex = products.findIndex(p => p.id === productId);
                    if (productIndex !== -1) {
                        products[productIndex].stock = newStock;
                        localStorage.setItem('products', JSON.stringify(products));
                        renderInventoryTable();
                        alert('Stock actualizado con éxito.');
                    }
                } else {
                    alert('Por favor, ingrese un valor de stock válido.');
                }
            }
        });

        renderInventoryTable();
    }

    renderAdminLayout();
});