# Manual de Usuario - Sistema Hospital Huaycán

Este manual proporciona una guía detallada para la configuración, inicio y uso del **Sistema de Gestión Hospitalaria del Hospital Huaycán**. El sistema permite digitalizar y agilizar los procesos de admisión, triaje, consulta médica y archivo clínico.

---

## 1. Arquitectura y Stack Tecnológico

El sistema cuenta con una arquitectura dividida en tres capas principales:

*   **Frontend (Cliente Web):** Desarrollado con **React 19**, **Vite 8**, **Tailwind CSS 4** y **React Router DOM 7**. Utiliza interfaces modernas, limpias e intuitivas con navegación fluida y reactiva.
*   **Backend (Servidor de API):** Desarrollado con **Spring Boot (Java)** y Maven. Gestiona la lógica de negocio, autenticación mediante tokens JWT y validaciones de datos.
*   **Base de Datos y Almacenamiento (Supabase):**
    *   **PostgreSQL:** Para el almacenamiento de datos relacionales (citas, médicos, pacientes, historias clínicas, usuarios y roles).
    *   **Supabase Storage:** Bucket `historias_antiguas` dedicado a almacenar los archivos PDF escaneados de las historias clínicas físicas heredadas.

---

## 2. Requisitos Previos e Instalación

### Requisitos del Sistema
*   **Node.js:** Versión 20 o superior.
*   **Java JDK:** Versión 17 o superior.
*   **PostgreSQL:** Servidor local o conexión activa a Supabase.
*   **Powershell:** Con permisos para ejecutar scripts (en entornos Windows).

### Configuración del Frontend
1.  Navegar a la carpeta del frontend:
    ```bash
    cd HospitalHuaycan
    ```
2.  Instalar las dependencias del proyecto:
    ```bash
    npm install
    ```
3.  Asegurar la existencia del archivo `.env` en la raíz de `HospitalHuaycan` con las variables de conexión a Supabase y al Backend:
    ```env
    VITE_API_URL=http://localhost:8080/api
    VITE_SUPABASE_URL=https://<tu-id-supabase>.supabase.co
    VITE_SUPABASE_ANON_KEY=<tu-clave-anon-supabase>
    ```

### Configuración del Backend
1.  Navegar a la carpeta del backend:
    ```bash
    cd backend
    ```
2.  Asegurar que el archivo `src/main/resources/application.properties` (o variables de entorno correspondientes) apunte a la base de datos PostgreSQL de Supabase.

---

## 3. Inicio del Sistema

Para simplificar el inicio del sistema, se ha provisto el script automatizado **`start.ps1`** en la raíz del proyecto. Este script realiza las siguientes tareas de manera secuencial:

1.  **Levanta el Backend** en segundo plano ejecutando `mvnw spring-boot:run`.
2.  **Monitorea el puerto 8080** hasta recibir una respuesta exitosa (`pong`).
3.  **Realiza una prueba de inicio de sesión de prueba** mediante llamadas HTTP directas para validar que la conexión base de datos y la autenticación funcionen correctamente.
4.  **Levanta el servidor de desarrollo Frontend (Vite)** ejecutando `npm run dev`.

### Cómo ejecutar el sistema:
Abra una consola de PowerShell en la raíz del proyecto y ejecute:
```powershell
.\start.ps1
```

Una vez finalizado, acceda a través de las siguientes URLs:
*   **Frontend:** `http://localhost:5173`
*   **Backend API:** `http://localhost:8080`

---

## 4. Roles y Credenciales de Acceso

El sistema implementa un control de acceso basado en roles (**RBAC**). Cada rol tiene acceso exclusivo a su respectivo módulo de trabajo. A continuación, se detallan los usuarios de prueba sembrados de forma predeterminada:

| Usuario | Contraseña | Nombre Completo | Rol Asociado | Permisos / Acceso |
| :--- | :--- | :--- | :--- | :--- |
| **`admision1`** | `123456` | Personal de Admisión 1 | `ROLE_ADMISION` | Módulo de Admisión (`/admision`) |
| **`enfermera1`** | `123456` | Enfermera Principal 1 | `ROLE_ENFERMERIA` | Módulo de Triaje (`/triaje`) |
| **`medico1`** | `123456` | Médico de Guardia 1 | `ROLE_MEDICO` | Módulo de Consultorio Médico (`/medico`) |
| **`medico_rios`**| `123456` | Dr. Alejandro Ríos | `ROLE_MEDICO` | Módulo de Consultorio Médico (`/medico`) |
| **`archivo1`** | `123456` | Personal de Archivo 1 | `ROLE_ARCHIVO` | Módulo de Archivo Clínico (`/archivo` e `/test-migracion`) |
| **`admin`** | `123456` | Administrador Principal | `ROLE_ADMINISTRADOR` | Configuración Global y Auditoría |

> [!NOTE]
> Las rutas internas están protegidas por el componente `ProtectedRoute`. Si un usuario intenta acceder a una ruta sin el rol correspondiente, será redirigido automáticamente a la página `/unauthorized`.

---

## 5. Guía de Uso por Módulo

### 5.1. Módulo de Admisión (`ROLE_ADMISION`)
*Propósito:* Búsqueda de pacientes existentes, registro de nuevos pacientes y asignación/generación de citas médicas.

```mermaid
graph TD
    A[Inicio: Buscar Paciente por DNI] --> B{¿Paciente Existe?}
    B -- Sí -- > C[Verificar Datos y Continuar]
    B -- No --> D[Formulario de Registro de Nuevo Paciente]
    D --> E[Guardar Paciente]
    E --> C
    C --> F[Seleccionar Especialidad y Médico]
    F --> G[Elegir Fecha, Turno y Hora]
    G --> H[Confirmar Cita]
    H --> I[Generar Ticket de Cita]
    I --> J[Imprimir Ticket o Volver al Panel]
```

#### Paso a Paso:
1.  **Búsqueda / Registro de Paciente:**
    *   Ingrese el DNI del paciente y presione **Buscar**.
    *   Si el paciente ya está registrado, el sistema mostrará sus datos básicos. Verifique la información y presione **Continuar**.
    *   Si el paciente **no existe**, se habilitará el formulario de registro rápido. Complete: *Nombres*, *Apellidos*, *Fecha de Nacimiento* y *Género*. Presione **Registrar Paciente** y continúe.
2.  **Asignación de Cita:**
    *   Seleccione la **Especialidad** (ej. Medicina General, Pediatría, Cardiología).
    *   Seleccione el **Médico** disponible para esa especialidad.
    *   Defina la **Fecha de la Cita** (no puede ser anterior al día de hoy) y el **Turno** (Mañana o Tarde).
    *   Presione **Confirmar y Programar Cita**.
3.  **Generación de Ticket:**
    *   Al guardarse la cita, el sistema mostrará un ticket visual con el código autogenerado (`TKT-XXXXXX`), el número de consultorio asignado, los datos del médico y la hora.
    *   El usuario de admisión puede imprimir el comprobante físico para entregárselo al paciente.

---

### 5.2. Módulo de Triaje y Enfermería (`ROLE_ENFERMERIA`)
*Propósito:* Toma de funciones vitales y antropometría del paciente antes de ingresar al consultorio médico.

#### Paso a Paso:
1.  **Bandeja de Entrada de Triaje:**
    *   El personal de enfermería visualiza una lista con las citas programadas para el día de hoy.
    *   Los pacientes que aún no tienen signos vitales registrados aparecerán en estado **Pendiente Triaje** con un botón verde **Registrar Triaje**.
2.  **Formulario de Triaje:**
    *   Haga clic en **Registrar Triaje** en el paciente correspondiente para abrir el formulario.
    *   Complete los signos vitales obligatorios con sus respectivas validaciones en tiempo real:
        *   **Frecuencia Respiratoria (rpm):** Rango de `1` a `100` rpm.
        *   **Frecuencia Cardíaca (lpm):** Rango de `1` a `300` lpm.
        *   **Temperatura (°C):** Rango de `30.0` a `45.0` °C.
        *   **Saturación de Oxígeno (%):** Rango de `0%` a `100%`.
        *   **Presión Arterial (mmHg):** Presión Sistólica (`50` a `250`) y Diastólica (`30` a `150`).
        *   **Antropometría:** Peso en kilogramos y Talla en centímetros.
    *   **Cálculo del IMC:** El Índice de Masa Corporal se **autocalcula en tiempo real** a medida que se ingresa el peso y la talla, mostrando el valor resultante.
3.  **Envío:**
    *   Haga clic en **Registrar Triaje**. Esto actualizará el estado de la cita a **Listo para Consulta** (o `EN_CONSULTA`), haciéndola visible en la bandeja del médico de turno.

---

### 5.3. Módulo de Consultorio Médico (`ROLE_MEDICO`)
*Propósito:* Evaluación diagnóstica del paciente, visualización de antecedentes y prescripción de recetas digitales.

#### Paso a Paso:
1.  **Bandeja del Día:**
    *   El médico visualiza en tiempo real el total de sus citas programadas para hoy, clasificadas en *Pendientes*, *En Atención* y *Atendidos*.
    *   Haga clic en **Iniciar Consulta** en un paciente de la lista.
2.  **Interfaz de Consulta Médica (Consultorio):**
    *   **Visualización de Vitals (Cabecera):** En la parte superior se muestran los signos vitales tomados en triaje (Temperatura, Presión Arterial, Ritmo Cardiaco, SatO2 e IMC).
    *   **Anamnesis y Examen Físico (Campos de Texto):** El médico debe redactar los síntomas subjetivos expresados por el paciente (anamnesis) y los hallazgos clínicos objetivos (examen físico). Ambos campos son requeridos.
    *   **Línea de Tiempo Histórica (Lado Derecho):** Permite ver en orden cronológico inverso todas las atenciones previas de este paciente para entender su evolución clínica.
3.  **Buscador CIE-10 Integrado:**
    *   Escriba en el buscador de diagnósticos (ej.: "Hipertensión" o "I10"). El sistema buscará en la base de datos de manera dinámica aplicando un *debounce* automático para evitar sobrecargas.
    *   Seleccione el diagnóstico de los resultados de búsqueda:
        *   **Principal:** Define el diagnóstico primario de la consulta.
        *   **+ Secundario:** Agrega diagnósticos secundarios opcionales a la lista de antecedentes.
4.  **Receta Médica Digital Dinámica:**
    *   Ingrese el medicamento a recetar (Nombre, concentración, dosis, frecuencia, días de duración e indicaciones especiales).
    *   Haga clic en **Agregar**. El medicamento se añadirá a una lista dinámica interactiva donde el médico puede verificar y eliminar items si lo requiere.
5.  **Finalización de la Consulta:**
    *   Haga clic en **Finalizar Consulta**. El sistema guardará el diagnóstico y la receta, y cambiará el estado de la cita a **Atendido**. El paciente es liberado de la bandeja del día.

---

### 5.4. Módulo de Archivo Clínico (`ROLE_ARCHIVO`)
*Propósito:* Custodia y digitalización de documentos clínicos físicos antiguos (Ficha HU08).

#### Paso a Paso:
1.  **Búsqueda de Paciente / Historia Clínica:**
    *   En el panel de búsqueda, ingrese el DNI, número de historia clínica o nombre del paciente.
    *   El sistema recuperará la ficha del paciente si se encuentra registrado en el sistema.
2.  **Digitalización de Documento Físico (Anexar PDF):**
    *   Seleccione el archivo PDF correspondiente al expediente físico escaneado.
    *   Indique el ID de la Historia Clínica del Paciente.
    *   Presione **Subir y Anexar**.
    *   **Flujo Técnico:** El archivo se cargará directamente a **Supabase Storage** (dentro del bucket `historias_antiguas`) y el backend de Spring Boot guardará la referencia de la URL pública en la tabla `documento_escaneado`.
3.  **Vista del Médico:**
    *   El médico, durante la consulta o revisión de antecedentes, puede ingresar el ID de la Historia Clínica y consultar la lista completa de documentos físicos digitalizados. Al hacer clic en **Ver Documento**, el PDF se abrirá en una pestaña del navegador para su revisión inmediata.

---

## 6. Solución de Problemas Comunes (Troubleshooting)

### El backend no inicia o arroja errores de base de datos
*   **Causa:** No hay conexión a internet o las credenciales de Supabase PostgreSQL en `application.properties` son incorrectas.
*   **Solución:** Verifique la conexión a internet. Intente realizar un ping al host de base de datos provisto en la configuración del backend.

### Conflicto de Puertos
*   **Causa:** El puerto `8080` (Backend) o el puerto `5173` (Vite) están ocupados por otro proceso.
*   **Solución:** Cierre las aplicaciones que utilicen dichos puertos o modifique el puerto del backend en `application.properties` (`server.port=NUEVO_PUERTO`) y del frontend en su `vite.config.js`.

### Error 404 al recargar páginas internas en el navegador (Despliegue)
*   **Causa:** El servidor web no está redirigiendo todas las peticiones al `index.html` (comportamiento típico de aplicaciones Single Page Applications).
*   **Solución:**
    *   **En Local (Vite):** El servidor dev lo gestiona por defecto.
    *   **En Vercel:** Asegúrese de tener el archivo [vercel.json](file:///c:/Users/draco/OneDrive/Escritorio/Huaycan-Hospital/HospitalHuaycan/vercel.json) configurado con los rewrites hacia el `index.html`.
