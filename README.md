# 💪 ProgresoGym

Aplicación web para llevar un registro personal de entrenamientos en el gimnasio. Permite añadir ejercicios por sesión y generar un informe en Excel con todo el historial.

---

## 🛠️ Tecnologías utilizadas

- **HTML5 / CSS3 / JavaScript** — Frontend
- **Node.js + Express** — Servidor backend
- **sql.js** — Base de datos SQLite en el servidor
- **SheetJS (xlsx)** — Generación de informes Excel
- **Render** — Despliegue en la nube

---

## 📁 Estructura del proyecto

```
ProgresoGym/
├── html/
│   ├── index.html
│   └── entrenamiento.html
├── js/
│   ├── index.js
│   └── entrenamiento.js
├── styles/
│   ├── styleIndex.css
│   └── styleEntrenamiento.css
├── server.js
├── package.json
└── .gitignore
```

---

## ⚙️ Instalación y uso en local

### 1. Clona el repositorio

```bash
git clone https://github.com/tuusuario/ProgresoGym.git
cd ProgresoGym
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Arranca el servidor

```bash
node server.js
```

### 4. Abre la app en el navegador

```
http://localhost:3000
```

---

## 🗄️ Base de datos

La app usa SQLite a través de `sql.js`. La base de datos se genera automáticamente al arrancar el servidor en un archivo `progresogym.db` en la raíz del proyecto.

### Estructura de tablas

**usuarios**
| id | nombre |
|----|--------|
| 1 | alejandrogalan |

**entrenamientos**
| id | fecha | id_usuario |
|----|-------|------------|
| 1 | 2026-06-03 | 1 |

**ejercicios**
| id | nombre | peso | series | repeticiones | id_entrenamiento |
|----|--------|------|--------|--------------|-----------------|
| 1 | Press banca | 80kg | 4 | 10 | 1 |

---

## 📱 Cómo usar la aplicación

### Pantalla principal (Index)

1. Introduce tu **nombre de usuario** — se guardará en la base de datos automáticamente. Si ya existe no se duplica.
2. La **fecha** se rellena automáticamente con el día actual.
3. Pulsa **Empezar Entrenamiento** para ir a la pantalla de registro.
4. Pulsa **Generar Informe** para descargar un Excel con todo tu historial.

### Pantalla de entrenamiento

1. Introduce el **nombre del ejercicio**, **peso**, **número de series** y **número de repeticiones**.
2. Pulsa **Añadir** — el ejercicio se guarda en la base de datos y el contador se actualiza.
3. Repite para cada ejercicio de la sesión.
4. Pulsa **Terminar Entrenamiento** cuando hayas acabado — vuelve al index.

### Informe Excel

El informe se genera por usuario e incluye todos sus entrenamientos en una sola hoja, organizados así:

```
ENTRENAMIENTO : 2026-06-03
Ejercicio      Peso    Series    Repeticiones
Press banca    80kg    4         10
Sentadilla     100kg   5         8

ENTRENAMIENTO : 2026-06-05
Ejercicio      Peso    Series    Repeticiones
Peso muerto    120kg   4         6
```

---

## 🚀 Despliegue

La app está desplegada en **Render** en el plan gratuito. Al estar inactiva más de 15 minutos el servidor se duerme — la primera visita puede tardar unos segundos en cargar.

---

## 🔮 Próximas mejoras

- Migración de SQLite a MySQL para mayor robustez
- Historial de entrenamientos visible desde la propia app
- Gráficas de progreso por ejercicio
