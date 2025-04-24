CREATE TABLE IF NOT EXISTS Roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Metodo_Pago (
    id_metodo_pago SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    codigo_producto VARCHAR(50) UNIQUE NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    stock_minimo INT NOT NULL CHECK (stock_minimo >= 0),
    imagen VARCHAR(255),
    es_libro BOOLEAN NOT NULL DEFAULT FALSE,
    autor VARCHAR(100),
    fecha_lanzamiento DATE
);

CREATE TABLE IF NOT EXISTS Clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol)
);


CREATE TABLE IF NOT EXISTS Supervisor (
    id_supervisor SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    cui VARCHAR(20) UNIQUE NOT NULL,
    edad INT NOT NULL CHECK (edad > 18),
    estado BIT(1) NOT NULL DEFAULT B'1',
    genero VARCHAR(10) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_baja DATE NULL,
    razon_baja TEXT NULL
);


CREATE TABLE IF NOT EXISTS Empleado (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    cui VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    edad INT NOT NULL CHECK (edad > 18),
    genero VARCHAR(10) NOT NULL,
    fecha_contratacion DATE NOT NULL DEFAULT CURRENT_DATE,
    fotografia VARCHAR(255),
    estado BIT(1) NOT NULL DEFAULT B'1',
    razon_baja TEXT NULL,
    fecha_baja DATE NULL,
    id_supervisor INT NOT NULL,
    FOREIGN KEY (id_supervisor) REFERENCES Supervisor(id_supervisor)
);

CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    id_cliente INT NULL,
    id_supervisor INT NULL,
    id_empleado INT NULL,
    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol),
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_supervisor) REFERENCES Supervisor(id_supervisor),
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado)
);

CREATE TABLE IF NOT EXISTS Lista_Deseos (
    id_lista_deseos SERIAL PRIMARY KEY,
    fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);


CREATE TABLE IF NOT EXISTS Detalle_Lista_Deseos (
    id_detalle_lista_deseos SERIAL PRIMARY KEY,
    id_lista_deseos INT NOT NULL,
    id_producto INT NOT NULL,
    FOREIGN KEY (id_lista_deseos) REFERENCES Lista_Deseos(id_lista_deseos) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);


CREATE TABLE IF NOT EXISTS Comentario (
    id_comentario SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_producto INT NOT NULL,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_resena DATE NOT NULL DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);


CREATE TABLE IF NOT EXISTS Factura (
    id_factura SERIAL PRIMARY KEY,
    fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
    nombre_comprador VARCHAR(100) NOT NULL,
    direccion_entrega VARCHAR(255) NOT NULL,
    id_empleado INT,
    id_metodo_pago INT NOT NULL,
    id_cliente INT NOT NULL,
    total_venta DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado),
    FOREIGN KEY (id_metodo_pago) REFERENCES Metodo_Pago(id_metodo_pago),
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
);


CREATE TABLE IF NOT EXISTS Detalle_Factura (
    id_detalle_factura SERIAL PRIMARY KEY,
    id_factura INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES Factura(id_factura),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

INSERT INTO Roles (nombre) VALUES
('Gerente'),
('Supervisor'),
('Empleado'),
('Cliente');

INSERT INTO Metodo_Pago (tipo) VALUES
('Contra Entrega'),
('Recoger en Tienda');

CREATE OR REPLACE FUNCTION registrar_usuario (
    p_nombre VARCHAR(50),
    p_apellido VARCHAR(50),
    p_correo_electronico VARCHAR(100),
    p_contrasena VARCHAR(255),
    p_id_rol INT,
    p_cui VARCHAR(20) DEFAULT NULL,
    p_edad INT DEFAULT NULL,
    p_genero VARCHAR(10) DEFAULT NULL,
    p_telefono VARCHAR(20) DEFAULT NULL,
    p_fecha_ingreso DATE DEFAULT NULL,
    p_fotografia VARCHAR(255) DEFAULT NULL,
    p_fecha_baja DATE DEFAULT NULL,
    p_razon_baja TEXT DEFAULT NULL,
    p_id_supervisor INT DEFAULT NULL,
    OUT p_id_usuario INT
) RETURNS INT AS $$
DECLARE
    -- Definición de los roles
    id_rol_supervisor INT := 2;
    id_rol_empleado INT := 3;
    id_rol_cliente INT := 4;

    -- Variables para almacenar los ID de las inserciones
    r_id_supervisor INT DEFAULT NULL;
    r_id_empleado INT DEFAULT NULL;
    r_id_cliente INT DEFAULT NULL;
BEGIN
    p_id_usuario := NULL;

    BEGIN
        IF p_id_rol = id_rol_supervisor THEN
            INSERT INTO Supervisor (nombre, apellido, cui, edad, genero, telefono, fecha_ingreso, fecha_baja, razon_baja)
            VALUES (p_nombre, p_apellido, p_cui, p_edad, p_genero, p_telefono, p_fecha_ingreso, p_fecha_baja, p_razon_baja)
            RETURNING id_supervisor INTO r_id_supervisor;

        ELSIF p_id_rol = id_rol_empleado THEN
            INSERT INTO Empleado (nombre, apellido, cui, telefono, edad, genero, fecha_contratacion, fotografia, razon_baja, fecha_baja, id_supervisor)
            VALUES (p_nombre, p_apellido, p_cui, p_telefono, p_edad, p_genero, p_fecha_ingreso, p_fotografia, p_razon_baja, p_fecha_baja, p_id_supervisor)
            RETURNING id_empleado INTO r_id_empleado;

        ELSIF p_id_rol = id_rol_cliente THEN
            INSERT INTO Clientes (nombre, apellido, edad, id_rol)
            VALUES (p_nombre, p_apellido, p_edad, id_rol_cliente)
            RETURNING id_cliente INTO r_id_cliente;
        ELSE
            RAISE EXCEPTION 'ID de rol inválido';
        END IF;

        INSERT INTO usuarios (correo_electronico, contrasena, id_rol, id_cliente, id_supervisor, id_empleado)
        VALUES (
            p_correo_electronico,
            p_contrasena,
            p_id_rol,
            r_id_cliente,
            r_id_supervisor,
            r_id_empleado
        )
        RETURNING id_usuario INTO p_id_usuario;

    EXCEPTION
        WHEN OTHERS THEN
            RAISE;
    END;
END;
$$ LANGUAGE plpgsql;


INSERT INTO public.producto (id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento) VALUES (3, 'Harry Potter y el Prisionero de Azkaban 2', 'Tercera entrega de la saga de Harry Potter.', 'HP-PA-2000', 'Locura', 21.00, 32.00, 10, null, true, 'J.K. Rowling', '1999-07-08');
INSERT INTO public.producto (id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento) VALUES (1, 'Harry Potter y el Prisionero de Azkaban', 'Tercera entrega de la saga de Harry Potter.', 'HP-PA-1999', 'Fantasía', 18.00, 28.00, 38, null, true, 'J.K. Rowling', '1999-07-08');
INSERT INTO public.producto (id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento) VALUES (4, 'Cien Años de Soledad', 'Historia épica de la familia Buendía en el pueblo ficticio de Macondo.', 'CAS-1967', 'Realismo Mágico', 15.50, 24.99, 25, null, true, 'Gabriel García Márquez', '1967-05-30');
INSERT INTO public.producto (id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento) VALUES (5, '1984', 'Novela distópica sobre un régimen totalitario y la vigilancia gubernamental.', 'ORW-1984', 'Ciencia Ficción', 12.00, 19.95, 30, null, true, 'George Orwell', '1949-06-08');
INSERT INTO public.producto (id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento) VALUES (6, 'El Hobbit', 'Aventura de Bilbo Bolsón en búsqueda del tesoro custodiado por el dragón Smaug.', 'HOB-1937', 'Fantasía', 14.25, 22.50, 35, null, true, 'J.R.R. Tolkien', '1937-09-21');
INSERT INTO public.producto (id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento) VALUES (8, 'Orgullo y Prejuicio', 'Novela de costumbres sobre las cinco hermanas Bennet y su búsqueda de matrimonio.', 'OYP-1813', 'Romance', 13.50, 21.95, 28, null, true, 'Jane Austen', '1813-01-28');
INSERT INTO public.producto (id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento) VALUES (9, 'Crónica de una Muerte Anunciada', 'Novela sobre un asesinato que todos conocían que iba a ocurrir pero nadie evitó.', 'CMA-1981', 'Novela', 11.75, 18.50, 15, null, true, 'Gabriel García Márquez', '1981-04-07');
INSERT INTO public.producto (id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento) VALUES (10, 'Los Juegos del Hambre', 'Distopía sobre una competición mortal televisada entre jóvenes.', 'JDH-2008', 'Ciencia Ficción', 16.25, 25.00, 45, null, true, 'Suzanne Collins', '2008-09-14');
INSERT INTO public.producto (id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento) VALUES (11, 'El Código Da Vinci', 'Thriller sobre una conspiración relacionada con la obra de Leonardo da Vinci.', 'CDA-2003', 'Suspense', 14.50, 23.75, 38, null, true, 'Dan Brown', '2003-03-18');
INSERT INTO public.producto (id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento) VALUES (12, 'Rayuela', 'Novela experimental que puede leerse de múltiples formas.', 'RAY-1963', 'Literatura Experimental', 15.00, 26.50, 18, null, true, 'Julio Cortázar', '1963-06-28');
INSERT INTO public.producto (id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento) VALUES (13, 'Crimen y Castigo', 'Novela psicológica sobre un estudiante que comete un asesinato y su posterior tormento moral.', 'CYC-1866', 'Clásico', 16.50, 27.95, 22, null, true, 'Fiódor Dostoyevski', '1866-12-22');
INSERT INTO public.producto (id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento) VALUES (14, 'El Principito', 'Fábula poética sobre un príncipe que viaja por diversos planetas.', 'PRI-1943', 'Fábula', 10.00, 16.99, 50, null, true, 'Antoine de Saint-Exupéry', '1943-04-06');
INSERT INTO public.producto (id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento) VALUES (15, 'Fahrenheit 451', 'Distopía sobre un futuro donde los libros están prohibidos y los bomberos los queman.', 'F451-1953', 'Ciencia Ficción', 13.25, 20.50, 27, null, true, 'Ray Bradbury', '1953-10-19');

INSERT INTO public.usuarios (id_usuario, correo_electronico, contrasena, id_rol, id_cliente, id_supervisor, id_empleado) VALUES (4, 'us3@example.com', '$2b$10$XLZJ7BaqAcRv2zJFwCG.ce3vS97NhiYHCdClfqNC0pV/11qu7Wuqe', 1, null, null, null);
INSERT INTO public.usuarios (id_usuario, correo_electronico, contrasena, id_rol, id_cliente, id_supervisor, id_empleado) VALUES (1, 'usuario@example.com', '$2b$10$T6U.IOWfDEc4GyBNo95dXOC0ThEJdSSWWoh6.eHgiEmH1tzaAOkcG', 4, 2, null, null);
INSERT INTO public.usuarios (id_usuario, correo_electronico, contrasena, id_rol, id_cliente, id_supervisor, id_empleado) VALUES (8, 'jose@gmail.com', '$2b$10$niknpnAKRQQb4J0f4pWb7OZt3zE.E8QJY5dL/wEtMpDMlxc3Iplu2', 4, 3, null, null);
INSERT INTO public.usuarios (id_usuario, correo_electronico, contrasena, id_rol, id_cliente, id_supervisor, id_empleado) VALUES (2, 'us1@example.com', '$2b$10$T6U.IOWfDEc4GyBNo95dXOC0ThEJdSSWWoh6.eHgiEmH1tzaAOkcG', 2, null, 1, null);
INSERT INTO public.usuarios (id_usuario, correo_electronico, contrasena, id_rol, id_cliente, id_supervisor, id_empleado) VALUES (3, 'us2@example.com', '$2b$10$T6U.IOWfDEc4GyBNo95dXOC0ThEJdSSWWoh6.eHgiEmH1tzaAOkcG', 3, null, null, 1);
INSERT INTO public.supervisor (id_supervisor, nombre, apellido, cui, edad, genero, telefono, fecha_ingreso, fecha_baja, razon_baja) VALUES (1, 'Manuel', 'Galvez', '285267846121', 19, 'Masculino', '24587132', '2020-02-02', '2020-02-02', '-');
INSERT INTO public.empleado (id_empleado, nombre, apellido, cui, telefono, edad, genero, fecha_contratacion, fotografia, estado, razon_baja, fecha_baja, id_supervisor) VALUES (1, 'Marcos Daniel', 'González Perez', '2852328990301', '43840597', 22, 'Masculino', '2025-03-18', null, 'Activo', null, null, 1);
INSERT INTO public.clientes (id_cliente, nombre, apellido, edad, fecha_registro, id_rol) VALUES (1, 'María', 'González', 28, '2025-03-15', 4);
INSERT INTO public.clientes (id_cliente, nombre, apellido, edad, fecha_registro, id_rol) VALUES (2, 'José ', 'Galdámez', 18, '2025-03-15', 4);
INSERT INTO public.clientes (id_cliente, nombre, apellido, edad, fecha_registro, id_rol) VALUES (3, 'José ', 'Marquez', 18, '2025-03-18', 4);


CREATE TABLE Ticket (
    id_ticket serial4 PRIMARY KEY,
    codigo_seguimiento VARCHAR(50) UNIQUE NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL, -- ejemplo: 'producto', 'pagina', 'reembolso'
    estado VARCHAR(20) DEFAULT 'Pendiente',
    archivo_adjunto TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_cliente serial4,
    id_empleado serial4,
    id_producto serial4,
    

    -- Relaciones
    FK_id_cliente INT REFERENCES Clientes(id_cliente),
    FK_id_empleado INT REFERENCES Empleado(id_empleado), -- puede ser NULL
    FK_id_producto INT REFERENCES Producto(id_producto)   -- puede ser NULL
);

CREATE TABLE Mensaje_Ticket (
    id_mensaje SERIAL PRIMARY KEY,
    remitente_tipo VARCHAR(20) NOT NULL, -- 'cliente', 'empleado'
    remitente_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    archivo_adjunto TEXT,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FK_id_ticket INT NOT NULL,
    FOREIGN KEY (FK_id_ticket) REFERENCES Ticket(id_ticket)
);