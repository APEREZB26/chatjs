import { response } from 'express';
import mongoose from 'mongoose';

import { Usuario } from '../models/usuario.js';
import { Categoria } from '../models/categoria.js';
import { Producto } from '../models/producto.js';

const coleccionesPermitidas = ['usuarios', 'categoria', 'productos', 'roles'];

const buscarUsuarios = async (termino = '', res = response) => {
  const esMongoID = mongoose.isValidObjectId(termino);

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, 'i');
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });
  return res.json({
    results: usuarios,
  });
};

const buscarCategoria = async (termino = '', res = response) => {
  const esMongoID = mongoose.isValidObjectId(termino);

  if (esMongoID) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }

  const regex = new RegExp(termino, 'i');
  const categorias = await Categoria.find({ nombre: regex, estado: true });
  return res.json({
    results: categorias,
  });
};

const buscarProducto = async (termino = '', res = response) => {
  const esMongoID = mongoose.isValidObjectId(termino);

  if (esMongoID) {
    const producto = await Producto.findById(termino).populate("categoria", "nombre");
    return res.json({
      results: producto ? [producto] : [],
    });
  }

  const regex = new RegExp(termino, 'i');
  const productos = await Producto.find({ nombre: regex, estado: true });
  return res.json({
    results: productos,
  });
};

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({ msg: 'La coleccion no es permitida' });
  }

  switch (coleccion) {
    case 'usuarios':
      return buscarUsuarios(termino, res);

    case 'cateogoria':
      return buscarCategoria(termino, res);

    case 'productos':
      return buscarProducto(termino, res);

    case 'roles':
      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido hacer esta busqueda' });
  }
};

export { buscar };
