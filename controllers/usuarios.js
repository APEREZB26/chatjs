import { response, request } from 'express';
import bcryptjs from 'bcryptjs';

import { Usuario } from '../models/usuario.js';

/**
  This function returns a list of users from the database, with a limit of 5 users per page, and a
  default of 0 users per page.
  @returns An array of two elements.
*/
const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  try {
    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
    ]);
    res.status(200).json({ total, usuarios });
  } catch ({ message }) {
    return res.status(400).json({ message });
  }
};

/**
  This function is used to update a user's information in the database.
  @returns The user object.
*/
const usuariosPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { password, google, correo, ...resto } = req.body;

  try {
    if (password) {
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    return res.status(202).json({ usuario });
  } catch ({ message }) {
    return res.status(400).json({ message });
  }
};

/**
  It takes a request and a response, and then it creates a new user with the data from the request
  body, and then it checks if the email exists, and if it doesn't, it encrypts the password and saves
  the user to the database.
  @returns The response object.
*/
const usuariosPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;

  try {
    const usuario = new Usuario({ nombre, correo, password, rol });
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    await usuario.save();
    return res.status(201).json({ usuario });
  } catch ({ message }) {
    return res.status(400).json({ message });
  }
};

/**
  It deletes a user from the database.
  @returns The user is being deleted from the database.
*/
const usuariosDelete = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    // const usuario = await Usuario.findByIdAndDelete(id); // No recomendado en usuarios
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    return res.status(202).json({ usuario });
  } catch ({ message }) {
    return res.status(400).json({ message });
  }
};

export { usuariosGet, usuariosPut, usuariosPost, usuariosDelete };
