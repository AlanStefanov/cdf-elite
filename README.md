
# 🏋️‍♂️ CDF Elite - Sistema de Gestión de Gimnasio

## 📋 Descripción

**CDF Elite** es un sistema completo de gestión para gimnasios y centros deportivos. Permite administrar alumnos, membresías, planes, colaboradores y generar reportes de recaudación de manera eficiente y moderna.

## ✨ Características Principales

### 🎯 Gestión de Alumnos
- **Registro completo** de datos personales y contacto
- **Asignación automática** de planes de membresía
- **Control de vencimientos** y renovaciones
- **Seguimiento de pagos** y estado de membresías
- **Historial detallado** de cada alumno

### 💳 Sistema de Membresías
- **Planes personalizables** con diferentes duraciones y precios
- **Estados automáticos**: Activa, Vencida, Por Vencer
- **Notificaciones** de vencimientos próximos
- **Proceso automatizado** de actualización de estados

### 📊 Dashboard Inteligente
- **Métricas en tiempo real** de alumnos activos y vencidos
- **Recaudación mensual y diaria** automática
- **Alertas** de membresías por vencer (7 días)
- **Gráficos visuales** de distribución por planes

### 👥 Gestión de Colaboradores
- **Base de datos** completa del personal
- **Control de acceso** y permisos
- **Información de contacto** y roles

### 💰 Control Financiero
- **Seguimiento automático** de pagos
- **Reportes de recaudación** mensual y diaria
- **Cálculo automático** basado en precios de planes
- **Historial de transacciones**

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **Sequelize** - ORM para base de datos
- **SQLite** - Base de datos ligera y eficiente

### Frontend
- **EJS** - Motor de plantillas dinámicas
- **Tailwind CSS** - Framework de estilos modernos
- **Font Awesome** - Iconografía profesional
- **JavaScript vanilla** - Interactividad del cliente

### Seguridad
- **bcryptjs** - Encriptación de contraseñas
- **express-session** - Manejo de sesiones
- **connect-flash** - Mensajes flash seguros

### Automatización
- **Cron Jobs** - Tareas programadas automáticas
- **Middleware personalizado** - Autenticación y validaciones

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js >= 18.0.0
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/alanstefanov/cdf-crm.git
cd cdf-crm

# Instalar dependencias
npm install

# Inicializar la base de datos
npm run init-db

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en producción
npm start
```

### Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
PORT=3000
SESSION_SECRET=tu_clave_secreta_aqui
NODE_ENV=production
```

## 📂 Estructura del Proyecto

```
cdf-crm/
├── 📁 config/           # Configuración de base de datos
├── 📁 controllers/      # Lógica de negocio
├── 📁 middleware/       # Middleware personalizado
├── 📁 models/          # Modelos de Sequelize
├── 📁 routes/          # Rutas de la aplicación
├── 📁 views/           # Plantillas EJS
├── 📁 public/          # Archivos estáticos
├── 📁 jobs/            # Tareas automáticas
├── 📁 migrations/      # Migraciones de BD
└── 📄 server.js        # Punto de entrada
```

## 🎮 Uso del Sistema

### Acceso al Sistema
1. **URL**: `http://localhost:3000`
2. **Usuario por defecto**: `administrador`
3. **Contraseña por defecto**: `admin123`

### Navegación Principal
- **Dashboard** - Vista general y métricas
- **Alumnos** - Gestión completa de miembros
- **Planes** - Administración de membresías
- **Colaboradores** - Gestión de personal

### Funcionalidades Clave

#### 👤 Gestión de Alumnos
- **Agregar**: Formulario completo con validaciones
- **Editar**: Modificación de datos y reasignación de planes
- **Eliminar**: Borrado seguro con confirmación
- **Buscar**: Filtros por nombre, DNI, estado
- **Estados**: Visual por colores (Verde=Activo, Rojo=Vencido)

#### 💳 Control de Membresías
- **Renovación automática**: Al cambiar de plan
- **Cálculo de vencimiento**: Basado en duración del plan
- **Alertas visuales**: Membresías próximas a vencer
- **Historial de pagos**: Registro completo

#### 📈 Reportes y Métricas
- **Total de alumnos**: Conteo general
- **Membresías activas**: Estado actual
- **Membresías vencidas**: Requieren atención
- **Recaudación mensual**: Ingresos del mes
- **Recaudación diaria**: Ingresos del día
- **Por vencer**: Alertas de 7 días

## 🔧 API y Endpoints

### Autenticación
- `GET /login` - Página de inicio de sesión
- `POST /login` - Procesamiento de login
- `GET /logout` - Cerrar sesión

### Dashboard
- `GET /dashboard` - Panel principal con métricas

### Alumnos
- `GET /alumnos` - Lista de alumnos
- `GET /alumnos/add` - Formulario de nuevo alumno
- `POST /alumnos/add` - Crear alumno
- `GET /alumnos/edit/:id` - Formulario de edición
- `POST /alumnos/edit/:id` - Actualizar alumno
- `DELETE /alumnos/:id` - Eliminar alumno

### Planes
- `GET /planes` - Lista de planes
- `GET /planes/add` - Formulario de nuevo plan
- `POST /planes/add` - Crear plan
- `GET /planes/edit/:id` - Formulario de edición
- `POST /planes/edit/:id` - Actualizar plan
- `DELETE /planes/:id` - Eliminar plan

### Colaboradores
- `GET /colaboradores` - Lista de colaboradores
- `GET /colaboradores/add` - Formulario de nuevo colaborador
- `POST /colaboradores/add` - Crear colaborador
- `GET /colaboradores/edit/:id` - Formulario de edición
- `POST /colaboradores/edit/:id` - Actualizar colaborador
- `DELETE /colaboradores/:id` - Eliminar colaborador

## 🤖 Automatización

### Sistema de Actualización Automática
- **Frecuencia**: Cada 30 minutos
- **Función**: Actualiza automáticamente el estado de membresías vencidas
- **Ubicación**: `jobs/membershipUpdater.js`
- **Inicio**: Automático al iniciar el servidor

### Proceso de Actualización
1. **Busca** membresías con fecha de vencimiento pasada
2. **Actualiza** estado a "Vencida"
3. **Marca** como no pagada
4. **Registra** en logs del sistema

## 💾 Base de Datos

### Modelos Principales

#### Alumnos
```sql
- id (Primary Key)
- nombre, apellido
- dni (Único)
- email, telefono
- fecha_nacimiento
- id_plan (Foreign Key)
- fecha_vencimiento_membresia
- membresia_pagada
- fecha_pago
- estado_membresia
- direccion, observaciones
```

#### Planes
```sql
- id (Primary Key)
- nombre_plan
- precio
- descripcion
- duracion_dias
```

#### Colaboradores
```sql
- id (Primary Key)
- nombre, apellido
- dni (Único)
- email, telefono
- puesto
- fecha_contratacion
- salario
```

#### Usuarios
```sql
- id (Primary Key)
- username (Único)
- password_hash
```

## 🔒 Seguridad

### Autenticación
- **Hashing**: bcryptjs para contraseñas
- **Sesiones**: express-session seguras
- **Middleware**: Protección de rutas

### Validaciones
- **Frontend**: Validación en tiempo real
- **Backend**: Validación de datos críticos
- **Base de datos**: Constraints y tipos de datos

### Protecciones
- **CSRF**: Protección contra ataques
- **SQL Injection**: Prevención con Sequelize ORM
- **XSS**: Escape automático en plantillas EJS

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Tablet Friendly**: Adaptación para tablets
- **Desktop**: Experiencia completa en escritorio
- **Grid System**: Tailwind CSS Grid responsive

## 🎨 Interfaz de Usuario

### Características de Diseño
- **Tema moderno**: Colores vibrantes y profesionales
- **Gradientes**: Efectos visuales atractivos
- **Iconografía**: Font Awesome icons
- **Tipografía**: Fuentes legibles y modernas
- **Feedback visual**: Estados de éxito, error, advertencia

### Paleta de Colores
- **Primario**: Azules y verdes para acciones principales
- **Secundario**: Grises para elementos neutros
- **Estados**: Verde (éxito), Rojo (error), Amarillo (advertencia)
- **Gradientes**: Combinaciones armoniosas

## 📊 Métricas y Reportes

### Dashboard Metrics
- **Total Alumnos**: Conteo completo
- **Membresías Activas**: Estado vigente
- **Membresías Vencidas**: Requieren renovación
- **Planes Disponibles**: Opciones de membresía
- **Recaudación Mensual**: Ingresos del mes actual
- **Recaudación Diaria**: Ingresos del día
- **Por Vencer**: Alertas de vencimiento (7 días)

### Visualización
- **Tarjetas informativas**: Métricas principales
- **Colores indicativos**: Estados visuales
- **Iconografía**: Representación visual clara
- **Números formateados**: Separadores de miles

## 🚀 Despliegue en Replit

### Configuración
1. **Fork** del repositorio en Replit
2. **Ejecutar** `npm run init-db` para inicializar
3. **Click** en el botón "Run"
4. **Acceder** via URL proporcionada por Replit

### Ventajas de Replit
- **Hosting gratuito**: Sin costos adicionales
- **Base de datos incluida**: SQLite integrada
- **SSL automático**: HTTPS por defecto
- **Escalabilidad**: Fácil upgrade a plan pago

## 🔧 Mantenimiento

### Tareas Regulares
- **Backup de base de datos**: Exportar `database.sqlite`
- **Verificación de logs**: Revisar `server.log`
- **Actualización de dependencias**: `npm update`
- **Limpieza de sesiones**: Reinicio periódico

### Monitoreo
- **Logs del servidor**: Console output
- **Estados de membresías**: Dashboard alerts
- **Performance**: Tiempos de respuesta
- **Errores**: Flash messages y logs

## 🤝 Contribuciones

### Para Desarrolladores
1. **Fork** del repositorio
2. **Crear** feature branch
3. **Implementar** mejoras
4. **Testing** completo
5. **Pull Request** con descripción detallada

### Áreas de Mejora
- **API REST**: Endpoints para móvil
- **Reportes PDF**: Exportación de datos
- **Notificaciones**: Email/SMS automáticos
- **Backup automático**: Copias de seguridad
- **Multi-tenant**: Soporte múltiples gimnasios

## 📞 Soporte

### Información de Contacto
- **Desarrollador**: Alan Stefanov
- **Email**: alan.stefanov@example.com
- **GitHub**: [@alanstefanov](https://github.com/alanstefanov)

### Reportar Bugs
1. **GitHub Issues**: Crear issue detallado
2. **Información del entorno**: Versión, OS, browser
3. **Pasos para reproducir**: Secuencia exacta
4. **Screenshots**: Si es problema visual

## 📄 Licencia

**ISC License** - Uso libre para proyectos personales y comerciales.

---

## 🎯 Próximas Funcionalidades

- [ ] **Sistema de notificaciones** automáticas
- [ ] **Reportes en PDF** exportables
- [ ] **API REST** para aplicaciones móviles
- [ ] **Sistema de citas** y reservas
- [ ] **Control de acceso** por huella dactilar
- [ ] **Integración de pagos** online
- [ ] **Dashboard analítico** avanzado
- [ ] **Backup automático** en la nube

---

**¡Bienvenido a CDF Elite - La solución completa para la gestión de tu gimnasio! 🏋️‍♂️**
