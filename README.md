# sispostal

## funcionalidades
- Conexion a base de datos postgres
- funciones para hacer consultas a las bases de datos
- Manejo de Log
- Consumo del web service
- Creacion de web service Rest

## prerequisitos
- Tener instalado nodejs:         Servidor de la aplicacion
- Que el servidor tenga permisos para ver la base de datos

## Comando para instalar las despendencias del proyecto
npm install

## Comando para compilar la aplicacion, despues de haber hecho alguna mejora o ajuste al desarrollo
## Este comando genera el codigo que se necesita ejecutar ubicado en la carpeta /dist
$ npm run build

##compilar cambios
tcs

## instalar complemento para que se actualice automaticamente los cambios.
npm install nodemon -g

## Para correr la aplicacion
$ node dist/index

## Para correr la aplicacion
$ nodemon dist/index



## SERVICIOS WEB

## end-points de prueba
localhost:3002/sispostal-one
localhost:3002/sispostal-two