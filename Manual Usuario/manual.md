# MANUAL DE USUARIO

## Libreria Don Héctor

---

## Índice

- [MANUAL DE USUARIO](#manual-de-usuario)
  - [Libreria Don Héctor](#libreria-don-héctor)
  - [Índice](#índice)
  - [Login](#login)
  - [](#)
  - [Registro](#registro)
  - [](#-1)
  - [Modulo Cliente](#modulo-cliente)
  - [](#-2)
  - [Modulo Empleado](#modulo-empleado)
  - [](#-3)
  - [Modulo Supervisor](#modulo-supervisor)
  - [](#-4)
  - [Modulo Gerente](#modulo-gerente)
    - [Gestion de Supervisores](#gestion-de-supervisores)

---

## Login

- Se inicia sesion segun las credenciales de los usuarios
  - Se dirige al dashboard de cliente si es un cliente
  - Se dirige al dashboard de empleados si es un empleado.
  - Se dirige al dashboard de supervisor si es un supervisor.
  - Se dirige al dashboard de gerente si es un gerente.
    ![Dashboard Gerente](./img/Login.png)

---

## Registro

- Se llena la informacion requerida para nuevos usuarios
  ![Dashboard Gerente](./img/Registro.png)

---

---

## Modulo Cliente

![Dashboard Gerente](./img/ClienteDestacados.png)
![Dashboard Gerente](./img/AgregarCarrito.png)
![Dashboard Gerente](./img/FinalizarCompra.png)
![Dashboard Gerente](./img/ListaDeseoss.png)

#### Creación de tickets

![1745293238243](img/1745293238243.png)

#### Formulario de datos para el ticket

![1745293315248](img/1745293315248.png)

#### Vista del ticket creado

![1745293360130](img/1745293360130.png)

#### Al darle clic el Boton "Mensaje"  aparece la conversacion del ticket seleccionado

![1745293398415](img/1745293398415.png)

---

## Modulo Empleado

![Dashboard Gerente](./img/Empleado.png)

#### Vista de tickets

![1745294030088](img/1745294030088.png)

#### Al seleccionar Detalles se muestra los mensajes intercambiados con el cliente

![1745294060914](img/1745294060914.png)

#### Al datle clic al boton Solicitar Aprobacion se cambia el estado del ticket a Aprobacion y no se permite intercambiar mensajes

![1745294104176](img/1745294104176.png)

---

## Modulo Supervisor

![Dashboard Gerente](./img/GestionEmpleados.png)
![Dashboard Gerente](./img/GestionProductos.png)
![Dashboard Gerente](./img/VerFacturas.png)![Dashboard Gerente](./img/ListaAlertas.png)

#### Tickets pendientes: La lista de los tickets para asignarle a un empleado y los tickets en la lista de aprobacio se muestra la lista de tickets puedan ser Resueltos y tickets en la lista de proceso lista los tickets que ya estan asignados a un empleado

![1745293582017](img/1745293582017.png)

#### Al seleccionar el Boton Asignar se muestra los empleados disponiblesotra cosa

![1745293729917](img/1745293729917.png)

#### Al seleccionar un empleado se cambia de estado el ticket a En Procesootra cosa

![1745293778051](img/1745293778051.png)

---

## Modulo Gerente

### Gestion de Supervisores

- Tablablero de Supervisores Registrados: Se muestra en este panel a todos los supervisores que se han registrado, asi mismo las opciones de "Administracion" y "Factura".
  ![Dashboard Gerente](./img/Gerentes_Supervisor.png)
- Agregar Nuevo Supervisor: Al seleccionar el Boton "Nuevo Supervisor" se debe desplegara un formulario con la infomacion requerida para crear un nuevo supervisor.

  - Al completar los campos se almacenara el nuevo supervisor y se le notificara por correo la contraseña para ingresar a la plataforma.
  - Todos los cambos deben de ser llenados.
  - Al finaliza exitosamente el nuevo supervisor aparecera en el dashboard.
    ![Nuevo Supervisor](./img/NuevoSupervisor.png).
- Modificar Supervisor: Al seleccionar el boton de "Editar" de la card de un supervisor de desplegara un form en el cual podra cambiar solamente el correo y el numero de telefono.

  - Para guardar los nuevos cambios de debe presionar "Actualizar Supervisor"
  - Si no se quiere realizar cambios se debe presionar "Cancelar"
    ![Modificar Supervisor](./img/ModificarSupervisor.png).
- Desactivar Supervisor: Si se selecciona la opcion "Desactivar" de un supervisor se desplegara un form el cual solicitara el motivo.

  - Si se quiere proceder se presiona "Desactivar Supervisore"
  - Si se quiere cancelar se debe presionar "Cancelar"

![Desactivar Supervisor](./img/ModificarSupervisor.png).
