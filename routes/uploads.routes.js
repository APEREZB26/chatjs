import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos } from '../middlewares/validar-campos.js';
import { coleccionesPermitidas } from '../helpers/db-validators.js';
import { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } from '../controllers/uploads.js';
import { validarArchivo } from '../middlewares/validar.archivo.js';

const router = Router();

router.post('/', validarArchivo, cargarArchivo);

router.put(
  '/:coleccion/:id',
  [
    validarArchivo,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos,
  ],
  actualizarImagenCloudinary
  // actualizarImagen
);

router.get(
  '/:coleccion/:id',
  [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos,
  ],
  mostrarImagen
);

export default router;
