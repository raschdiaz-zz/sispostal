# SISPOSTAL


# Funcionalidades
- Conexión a base de datos PostgreSQL.
- Funciones para hacer consultas a las bases de datos.
- Manejo de Log.
- Consumo del web service.
- Creación de web service Rest.

# Prerrequisitos
- Tener instalado NodeJS: Servidor de la aplicacion.
- Que el servidor tenga permisos para ver la base de datos.

# Comando para instalar las dependencias del proyecto
npm install

- Instalar JVM (Java Virtual Machine) y JDK (Java Development Kit)

# Comando para compilar la aplicación, despues de haber hecho alguna mejora o ajuste al desarrollo (este comando genera el codigo que se necesita ejecutar ubicado en la carpeta /dist)
npm run build

# Comando para solo compilar cambios
tsc

# Instalar complemento para que se actualicen automaticamente los cambios
npm install nodemon -g

# Comando para correr la aplicacion
node dist/index
nodemon dist/index


## SERVICIOS WEB

# End-points de prueba
localhost:3002/sispostal-one
localhost:3002/sispostal-two