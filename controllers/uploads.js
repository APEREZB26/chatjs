import { response } from 'express';
import path from 'path';
import fs from 'fs';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL);

const __dirname = path.resolve();

import { subirArchivo } from '../helpers/subir-archivo.js';
import { Usuario } from '../models/usuario.js';
import { Producto } from '../models/producto.js';

const cargarArchivo = async (req, res = response) => {
  try {
    // Imagenes
    const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
    res.json({ msg: nombre });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;
  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: 'No existe el usuario con ese id' });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: 'No existe el producto con ese id' });
      }
      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    // Boramos la img del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }
  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();
  res.json(modelo);
};

const mostrarImagen = async (req, res) => {
  const { id, coleccion } = req.params;
  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: 'No existe el usuario con ese id' });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: 'No existe el producto con ese id' });
      }
      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }

  if (modelo.img) {
    // Boramos la img del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

    if (fs.existsSync(pathImagen)) {
      res.sendFile();
    }
  }

  const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathImagen);
};

const actualizarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;
  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: 'No existe el usuario con ese id' });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: 'No existe el producto con ese id' });
      }
      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;
  await modelo.save();
  res.json(modelo);
};

export { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary };
