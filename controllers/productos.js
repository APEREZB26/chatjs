import { request } from 'express';
import { Producto } from '../models/producto.js';

const obtenerProductos = async (req = request, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  try {
    const [total, productos] = await Promise.all([
      Producto.countDocuments(query),
      Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);
    return res.status(201).json({ total, productos });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

const obtenerProducto = async (req = request, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
    return res.status(201).json(producto);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

const crearProducto = async (req = request, res) => {
  const { estado, usuario, ...body } = req.body;

  try {
    const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });

    if (productoDB) {
      return res.status(400).json({ msg: `El producto ${body.nombre} ya existe` });
    }

    const data = {
      ...body,
      nombre: body.nombre.toUpperCase(),
      usuario: req.usuario._id,
    };

    const producto = new Producto(data);
    await producto.save();
    return res.status(201).json(producto);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

const actualizarProducto = async (req = request, res) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  try {
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    return res.status(201).json(producto);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

const eliminarProducto = async (req = request, res) => {
  const { id } = req.params;

  try {
    const productoBorrado = await Producto.findOneAndUpdate(id, { estado: false }, { new: true });
    return res.status(201).json(productoBorrado);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

export { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto };
