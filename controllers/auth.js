import { response } from 'express';
import bcrypjs from 'bcryptjs';

import { Usuario } from '../models/usuario.js';
import { generarJWT } from '../helpers/generarJWT.js';

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ msg: 'No tenemos alguna cuenta con estos datos' });
    }

    if (!usuario.estado) {
      return res.status(400).json({ msg: 'El usuario esta desactivado' });
    }

    if (!bcrypjs.compareSync(password, usuario.password)) {
      return res.status(400).json({ msg: 'Usuario / Password incorrectos' });
    }

    //Generar el jwt
    const token = await generarJWT(usuario.id);
    return res.status(200).json({ usuario, token });
  } catch (error) {
    return res.status(500).json({ msg: 'Hable con el administrador' });
  }
};

const renovarToken = async (req, res) => {
  const { usuario } = req;

  // Generar el jwt
  const token = await generarJWT(usuario.id);

  res.json({
    usuario,
    token,
  });
};

export { login, renovarToken };
