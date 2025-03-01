const express = require("express");
const { check, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener perfil del usuario
const getUser = async (req, res) => {
  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id: req.usuario.id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        telefono: true,
        rol: true,
        fecha_registro: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

// Actualizar perfil
const updateUser = async (req, res) => {
  // Validar datos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { nombre, apellido, telefono } = req.body;

  try {
    const usuarioActualizado = await prisma.usuarios.update({
      where: { id: req.usuario.id },
      data: { nombre, apellido, telefono },
      select: { id: true, nombre: true, apellido: true, telefono: true },
    });

    res.json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

// Eliminar perfil
const deleteUser = async (req, res) => {
  try {
    await prisma.usuarios.delete({
      where: { id: req.usuario.id },
    });

    res.json({ mensaje: "Cuenta eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

const getUsers = async (req, res) => {
  try {
      const usuarios = await prisma.usuarios.findMany({
          select: {
              id: true,
              nombre: true,
              apellido: true,
              correo: true,
              telefono: true,
              rol: true,
              fecha_registro: true,
          },
      });

      res.json(usuarios);
  } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
  }
};


module.exports = { getUser, updateUser, deleteUser, getUsers };
