export function toArray(obj: any) {
  let array: any = [];
  Object.keys(obj).forEach(key => {
    array.push(obj[key]);
  });
  return array;
}


// private crearCarpetaUsuario( userId: string ) {

//   const pathUser = path.resolve(  __dirname, '../uploads/', userId );
//   const pathUserTemp = pathUser + '/temp';
//   // console.log(pathUser);

//   const existe = fs.existsSync( pathUser );

//   if ( !existe ) {
//       fs.mkdirSync( pathUser );
//       fs.mkdirSync( pathUserTemp );
//   }

//   return pathUserTemp;

// }