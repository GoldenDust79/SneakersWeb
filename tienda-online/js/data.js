const initialProducts = [
    { id: 3, name: 'Converse Chuck Taylor', description: 'La silueta más reconocible del mundo.', price: 54990, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=500' },
    { id: 4, name: 'Vans Old Skool', description: 'La zapatilla de skate con la icónica sidestripe.', price: 64990, stock: 35, imageUrl: 'assets/Vans Old Skool.jfif' },
    { id: 9, name: 'Fila Disruptor II', description: 'La zapatilla "chunky" que define una era.', price: 69990, stock: 30, imageUrl: 'assets/Fila Disruptor II.jpg' },
    { id: 6, name: 'Puma Suede Classic', description: 'Un ícono de la cultura urbana desde 1968.', price: 74990, stock: 22, imageUrl: 'assets/Puma Suede Classic.jpg' },
    { id: 10, name: 'Skechers Go Walk', description: 'Máxima comodidad para caminar todo el día.', price: 59990, stock: 28, imageUrl: 'assets/Skechers Go Walk.jpg' },
    { id: 2, name: 'Adidas Stan Smith', description: 'El ícono del tenis llevado a las calles.', price: 79990, stock: 25, imageUrl: 'assets/Adidas Stan Smith.jpg' },
    { id: 1, name: 'Nike Air Force 1', description: 'Un clásico atemporal para el día a día.', price: 99990, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
    { id: 5, name: 'New Balance 574', description: 'Comodidad y estilo retro inigualables.', price: 84990, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500' },
    { id: 7, name: 'Reebok Club C 85', description: 'Diseño minimalista inspirado en el tenis.', price: 79990, stock: 18, imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500' },
    { id: 8, name: 'ASICS Gel-Lyte III', description: 'Famosa por su lengüeta dividida y comodidad.', price: 109990, stock: 15, imageUrl: 'assets/ASICS Gel-Lyte III.jpg' },
    { id: 13, name: 'Adidas Forum Low', description: 'El regreso de un ícono del baloncesto de los 80.', price: 89990, stock: 19, imageUrl: 'assets/Adidas Forum Low.jfif' },
    { id: 14, name: 'Nike Blazer Mid 77', description: 'Estilo vintage que nunca pasa de moda.', price: 94990, stock: 21, imageUrl: 'assets/Nike Blazer Mid 77.jpg' },
    { id: 11, name: 'Hoka Clifton 9', description: 'Amortiguación superior para corredores.', price: 129990, stock: 12, imageUrl: 'assets/Hoka Clifton 9.jpg' },
    { id: 12, name: 'Salomon XT-6', description: 'Del trail a la ciudad con un rendimiento superior.', price: 149990, stock: 10, imageUrl: 'assets/Salomon XT-6.jpg' },
    { id: 15, name: 'Nike Dunk Low Panda', description: 'El par más codiciado de los últimos años.', price: 139990, stock: 8, imageUrl: 'assets/Nike Dunk Low Panda.jpg' },
    { id: 16, name: 'Air Jordan 1 High', description: 'La zapatilla que lo cambió todo para siempre.', price: 179990, stock: 7, imageUrl: 'https://images.unsplash.com/photo-1524532787116-e70228437bbe?w=500' },
    { id: 17, name: 'Balenciaga Triple S', description: 'El epítome del lujo en zapatillas chunky.', price: 850000, stock: 5, imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500' },
    { id: 18, name: 'Adidas Yeezy Boost 350', description: 'Comodidad y estilo de la mano de Kanye West.', price: 220000, stock: 10, imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500' },
    { id: 19, name: 'Off-White x Nike Air Jordan 4', description: 'Una colaboración icónica y muy cotizada.', price: 1500000, stock: 3, imageUrl: 'https://images.unsplash.com/photo-1571601035754-5c927f2d7edc?w=500' },
    { id: 20, name: 'New Balance 990v5', description: 'El balance perfecto entre comodidad y estilo clásico.', price: 180000, stock: 15, imageUrl: 'assets/New Balance 990v5.jpg' },
    { id: 21, name: 'Common Projects Achilles Low', description: 'Minimalismo y lujo en una zapatilla de cuero.', price: 350000, stock: 8, imageUrl: 'assets/Common Projects Achilles Low.jpg' }
];

const initialUsers = [
    { run: '111111111', nombre: 'Admin', apellidos: 'User', email: 'admin@duoc.cl', fechaNacimiento: '1990-01-01', password: '1234' }
];