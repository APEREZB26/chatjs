import { request } from 'express';
import { Categoria } from '../models/categoria.js';

const obtenerCategorias = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  try {
    const [total, categorias] = await Promise.all([
      Categoria.countDocuments(query),
      Categoria.find(query).skip(Number(desde)).limit(Number(limite)).populate('usuario', 'nombre'),
    ]);
    res.status(201).json({ total, categorias });
  } catch ({ message }) {
    return request.status(400).json({ msg: message });
  }
};

const obtenerCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    if (!categoria.estado) {
      return res.status(401).json({ msg: `Esta categoria actualmente se encuentra desactivada` });
    }
    res.status(201).json(categoria);
  } catch ({ message }) {
    return request.status(400).json({ msg: message });
  }
};

const crearCateogria = async (req, res) => {
  const nombre = req.body.nombre.toUpperCase();

  try {
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
      return res.status(400).json({ msg: `La categoria ${categoriaDB} ya existe` });
    }

    const data = {
      nombre,
      usuario: req.usuario._id,
    };

    const categoria = new Categoria(data);
    await categoria.save();
    return res.status(201).json({ msg: 'Creado con exito' });
  } catch ({ message }) {
    return res.status(500).json({ msg: message });
  }
};

const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  try {
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
    return res.status(201).json(categoria);
  } catch ({ message }) {
    return res.status(400).json({ msg: message });
  }
};

const borrarCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
    return res.status(201).json(categoriaBorrada);
  } catch ({ message }) {
    return res.status(400).json({ msg: message });
  }
};

export { obtenerCategorias, obtenerCategoria, crearCateogria, actualizarCategoria, borrarCategoria };
