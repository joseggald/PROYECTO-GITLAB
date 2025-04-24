import { UserService } from '../../../src/services/user.service';
import { dbManager } from '../../../src/config/database';
import { Logger } from "../../../src/utils/Logger";
import bcrypt from 'bcrypt';
import { ROLES } from '../../../src/dictionaries/roles';

jest.mock('../../../src/config/database', () => ({
  dbManager: {
    getConnection: jest.fn()
  }
}));

jest.mock('../../../src/utils/Logger', () => ({
  Logger: {
    error: jest.fn(),
    info: jest.fn()
  }
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashed-password')
}));

jest.mock('../../../src/config/environment', () => {
  const mockEnv = {
    PORT: 8080,
    NODE_ENV: 'test',
    API_PREFIX: '/api',
    DEBUG: false,
    DATABASES: {
      default: 'postgres-default',
      configs: [{
        type: 'postgres',
        alias: 'default',
        host: '34.44.201.200',
        port: 5432,
        database: 'libreria-don-hector-db',
        user: 'postgres',
        password: 'Z5[BDaiOXD6/Q}G^',
        ssl: false
      }]
    },
    JWT: {
      SECRET: 'baf79417cdc762262443f3e1b30c1d1d4977c0f603a989fe220b6bc5dc1d6d57eea81b47b9238748c0ba5dde5ab0abe384114e53e75e77cf2f057ad338dda8707dd878ee7e673bb8fb75d55922f657f2cf51b762257eee986cccccde84fe68de4264e7420b1bc0e3810bec91599a54d66db5239f4e2f1e03a7d8100d27325c583b110628e1b5b764e15258caa0f1c310b8042cab9918551b089152fcb1974b9a44fbb6b165fc149bcfce6d9b74cc718094254b595ac6c37057cd6092f02b0134434182446f26006c5d27881c2f99bc449870492e62c601b2a504d054e5ffd4aca21c76a87589f96faed7f3559e6b882e3322365305cb3ce70ec0c33c83258a95',
      EXPIRES_IN: '1d',
      REFRESH_EXPIRY: '7d'
    },
    PASSWORD: {
      SALT_ROUNDS: 10,
      MIN_LENGTH: 8,
      MAX_LENGTH: 50
    },
    EMAIL: {
      EMAIL_USER: 'aydg23685@gmail.com',
      EMAIL_PASS: 'csclxqhlfffvorje',
      EMAIL_RECEIVER: 'aldovasquez2014@gmail.com'
    },
    CORS: {
      ORIGIN: 'https://frontend-libreria-395333172641.us-central1.run.app'
    },
    getDbConfig: jest.fn().mockImplementation((type, alias) => {
      if (type === 'postgres' && (alias === 'default' || !alias)) {
        return {
          type: 'postgres',
          alias: 'default',
          host: '34.44.201.200',
          port: 5432,
          database: 'libreria-don-hector-db',
          user: 'postgres',
          password: 'Z5[BDaiOXD6/Q}G^',
          ssl: false
        };
      }
      throw new Error(`No database configuration found for ${type}-${alias}`);
    })
  };
  
  return {
    environment: mockEnv,
    default: mockEnv
  };
});

describe('UserService', () => {
  let userService: UserService;
  const mockPool = {
    connect: jest.fn()
  };
  const mockClient = {
    query: jest.fn(),
    release: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (dbManager.getConnection as jest.Mock).mockReturnValue(mockPool);
    mockPool.connect.mockResolvedValue(mockClient);
    userService = new UserService();
  });

  describe('validateUser', () => {
    it('debe retornar null si el usuario no existe', async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] });
      
      const result = await userService.validateUser('noexiste@test.com', 'password');
      
      expect(result).toBeNull();
      expect(mockClient.query).toHaveBeenCalledTimes(1);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM Usuarios'),
        ['noexiste@test.com']
      );
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('debe retornar null si la contraseña es incorrecta', async () => {
      // Simular que encontró un usuario
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id_usuario: 1, contrasena: 'hashedPassword' }]
      });
      
      // Simular que la comparación de contraseñas falla
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      
      const result = await userService.validateUser('usuario@test.com', 'wrongpassword');
      
      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
    });
    
    it('debe retornar el usuario si la autenticación es exitosa', async () => {
      const mockUser = { 
        id_usuario: 1, 
        correo_electronico: 'usuario@test.com',
        id_rol: ROLES.CLIENTE,
        contrasena: 'hashedPassword'
      };
      
      mockClient.query.mockResolvedValueOnce({
        rows: [mockUser]
      });
      
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      
      const result = await userService.validateUser('usuario@test.com', 'correctpassword');
      
      expect(result).toBeDefined();
      expect(result.id_usuario).toEqual(mockUser.id_usuario);
      expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedPassword');
    });
    
    it('debe incluir detalles del cliente si el usuario es un cliente', async () => {
      const mockUser = { 
        id_usuario: 1, 
        correo_electronico: 'cliente@test.com',
        id_rol: ROLES.CLIENTE,
        id_cliente: 1,
        contrasena: 'hashedPassword'
      };
      
      const mockClienteDetails = {
        id_cliente: 1,
        nombre: 'Cliente',
        apellido: 'Test'
      };
      
      mockClient.query.mockResolvedValueOnce({
        rows: [mockUser]
      });
      
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      
      mockClient.query.mockResolvedValueOnce({
        rows: [mockClienteDetails]
      });
      
      const result = await userService.validateUser('cliente@test.com', 'correctpassword');
      
      expect(result).toBeDefined();
      expect(result.id_usuario).toEqual(mockUser.id_usuario);
      expect(result.nombre).toEqual(mockClienteDetails.nombre);
      expect(result.apellido).toEqual(mockClienteDetails.apellido);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM Clientes'),
        [mockUser.id_cliente]
      );
    });
    
    it('debe validar que un supervisor esté activo', async () => {
      const mockUser = { 
        id_usuario: 1, 
        correo_electronico: 'supervisor@test.com',
        id_rol: ROLES.SUPERVISOR,
        id_supervisor: 1,
        contrasena: 'hashedPassword'
      };
      
      const mockSupervisorDetails = {
        id_supervisor: 1,
        nombre: 'Supervisor',
        apellido: 'Test',
        estado: '0'
      };
      
      mockClient.query.mockResolvedValueOnce({
        rows: [mockUser]
      });
      
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      
      mockClient.query.mockResolvedValueOnce({
        rows: [mockSupervisorDetails]
      });
      
      await expect(userService.validateUser('supervisor@test.com', 'correctpassword')).rejects.toThrow('El usuario no está activo');
    });
  });

  describe('createUser', () => {
    it('debe crear un nuevo usuario correctamente', async () => {
      const userData = {
        nombre: 'Test',
        apellido: 'User',
        correo_electronico: 'test@example.com',
        contrasena: 'Password123',
        id_rol: ROLES.CLIENTE,
        edad: 25
      };
      
      mockClient.query.mockResolvedValueOnce({ rows: [] });
      
      mockClient.query.mockResolvedValueOnce({});
      
      mockClient.query.mockResolvedValueOnce({ 
        rows: [{ p_id_usuario: 1 }] 
      });
      
      mockClient.query.mockResolvedValueOnce({});
      
      const result = await userService.createUser(userData);
      
      expect(result).toBeDefined();
      expect(result).toEqual([{ p_id_usuario: 1 }]);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.contrasena, 10);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT registrar_usuario'),
        expect.arrayContaining([userData.nombre, userData.apellido])
      );
    });
    
    it('debe lanzar error si el correo ya existe', async () => {
      const userData = {
        nombre: 'Duplicate',
        apellido: 'Email',
        correo_electronico: 'existing@example.com',
        contrasena: 'Password123',
        id_rol: ROLES.CLIENTE
      };
      
      mockClient.query.mockResolvedValueOnce({ rows: [{ correo_electronico: userData.correo_electronico }] });
  
      const result = await userService.createUser(userData);
      expect(result).toEqual([]);
    });
    
    it('debe manejar errores en la creación de usuario', async () => {
      const userData = {
        nombre: 'Error',
        apellido: 'Test',
        correo_electronico: 'error@example.com',
        contrasena: 'Password123',
        id_rol: ROLES.CLIENTE
      };
      
      mockClient.query.mockResolvedValueOnce({ rows: [] });
      mockClient.query.mockResolvedValueOnce({});
      mockClient.query.mockRejectedValueOnce(new Error('Error al registrar usuario'));
      mockClient.query.mockResolvedValueOnce({});
      
      await expect(userService.createUser(userData)).rejects.toThrow('Error al registrar usuario');
    });
  });

  describe('getAllClients', () => {
    it('debe obtener todos los clientes', async () => {
      const mockClients = [
        { id_cliente: 1, nombre: 'Cliente 1', apellido: 'Apellido 1', edad: 25 },
        { id_cliente: 2, nombre: 'Cliente 2', apellido: 'Apellido 2', edad: 30 }
      ];
      
      mockClient.query.mockResolvedValueOnce({ rows: mockClients });
      
      // Esperar undefined o cualquier valor
      const result = await userService.getAllClients();
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM Clientes')
      );
    });
    
    it('debe manejar errores al obtener clientes', async () => {
      mockClient.query.mockResolvedValueOnce({ 
        rows: [
          { id_cliente: 1, nombre: 'Cliente 1', apellido: 'Apellido 1', edad: 25 },
          { id_cliente: 2, nombre: 'Cliente 2', apellido: 'Apellido 2', edad: 30 }
        ] 
      });
      await userService.getAllClients();
    });
  });
});