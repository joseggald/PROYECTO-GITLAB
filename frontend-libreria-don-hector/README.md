# celulares-service-IA-FT

Sistema de servicio backend en golang.

### Estandar de ramificacion:

#### Estructura de ramas:

- `main`: Producción
- `develop`: Desarrollo principal
- `feature/*`: Funcionalidades
  - feature/{username}//[modulo]-[funcionalidad]
- `hotfix/*`: Correcciones urgentes
  - hotfix/{username}/[issue]-[descripcion]

#### Como crear un feature o hotfix para una tarea:

```git
git pull origin develop
git checkout -b feature/jgaldamez/init-project

git pull origin develop
git checkout -b hotfix/jgaldamez/init-project
```

#### Convenciones de commits:

```
Tipo: descripción
- feat: nueva función
- fix: corrección
- docs: documentación
- style: formato
- refactor: restructuración
- test: pruebas
- chore: mantenimiento
```

### Flujo de trabajo:

1. Crear rama feature o hotfix desde develop
2. Commits frecuentes siguiendo convención
3. Pull request a develop
4. Code review por al menos 1 persona
5. Merge a develop

### Recomendaciones para cambios por feature:

Tamaño ideal por commit:

- 1 commit = 1 cambio lógico completo
- Máximo 200-300 líneas modificadas
- Entre 3-8 commits por feature

Estructura feature:

```
feature/jgaldamez/user-login/
├── commit 1: "feat: base login structure"
├── commit 2: "feat: form validation" 
├── commit 3: "feat: API integration"
└── commit 4: "test: login test cases"
```

Pull request:

- Review cuando feature está completa
- Máximo 500-1000 líneas totales
- Si excede, dividir en sub-features

Tiempo sugerido:

- Feature: 1-3 días máximo
- Hotfix: 1 día máximo


# Ejemplo de PR:

## Módulo Login de Usuarios

### Cambios Realizados

Commit 1 - `feat: base login structure`

- Estructura inicial del formulario
- Rutas base configuradas

Commit 2 - `feat: form validation`

- Validaciones de email y contraseña
- Mensajes de error

Commit 3 - `feat: API integration`

- Conexión con endpoints
- Manejo de respuestas

Commit 4 - `test: login test cases`

- Tests unitarios
- Cobertura básica

#### Captura de compilación:

{captura}

## Revisión

- [ ]  Código revisado
- [ ]  Captura de compilación exitosa
- [ ]  Aprobación de encargado
