import { Router } from 'express';
import { check } from 'express-validator';

import { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } from '../controllers/usuarios.js';
import { esRoleValido, existeEmail, existeUsuarioPorId } from '../helpers/db-validators.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminRole, tieneRole } from '../middlewares/validar-roles.js';

const router = Router();

router.get('/', usuariosGet);

router.put(
  '/:id',
  [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('password', 'El password debe ser mas de 6 letras').isLength({ min: 6 }),
    check('rol').custom(esRoleValido),
    check('correo').custom(existeEmail),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mas de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido), // custom(rol => esRoleValido(rol))
    check('correo').custom(existeEmail),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  '/:id',
  [
    validarJWT,
    // esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

export default router;
