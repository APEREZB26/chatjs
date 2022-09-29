import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.resolve();

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extensión
    if (!extensionesValidas.includes(extension)) {
      return reject(`La extensión ${extension} no es permitida`);
    }

    const nombreTemporal = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '/uploads/', carpeta, nombreTemporal);
    archivo.mv(uploadPath, function (err) {
      if (err) {
        return reject(`La extensión ${err} no es permitida`);
      }

      return resolve(nombreTemporal);
    });
  });
};

export { subirArchivo };
