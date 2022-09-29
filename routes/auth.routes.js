import { Router } from 'express';
import { check } from 'express-validator';
import { login, renovarToken } from '../controllers/auth.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.post(
  '/login',
  [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  login
);

router.get('/', validarJWT, renovarToken);

export default router;
