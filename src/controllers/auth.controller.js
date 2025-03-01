const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");
const transporter = require("../config/email");

const register = async (req, res) => {
    const { nombre, apellido, correo, password, telefono, rol } = req.body;

    try {
        let usuario = await prisma.usuarios.findUnique({ where: { correo } });
        if (usuario) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const token_verificacion = crypto.randomBytes(32).toString("hex");

        usuario = await prisma.usuarios.create({
            data: {
                nombre,
                apellido,
                correo,
                password: passwordHash,
                telefono,
                rol: rol || "cliente",
                token_verificacion,
            },
        });

        // Enviar correo de verificación
        const url = `${process.env.BASE_URL}/auth/verificar/${token_verificacion}`;
        await transporter.sendMail({
            from: `"AokEcommerce" <${process.env.EMAIL_USER}>`,
            to: correo,
            subject: "Verifica tu cuenta",
            html: `<p>Hola ${nombre}, haz clic en el siguiente enlace para verificar tu cuenta:</p>
             <a href="${url}">Verificar cuenta</a>`,
        });

        res.status(201).json({ mensaje: "Registro exitoso. Revisa tu correo para verificar tu cuenta." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        // Buscar usuario con el token de verificación
        const usuario = await prisma.usuarios.findFirst({
            where: { token_verificacion: token },
        });

        if (!usuario) {
            return res.status(400).json({ error: "Token inválido o expirado" });
        }

        // Marcar el correo como verificado y eliminar el token
        await prisma.usuarios.update({
            where: { id: usuario.id },
            data: {
                verificado: true,
                token_verificacion: null,
            },
        });

        res.json({ mensaje: "Correo verificado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};


const login = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const { correo, password } = req.body;

    try {
        // Buscar usuario en la BD
        let usuario = await prisma.usuarios.findUnique({
            where: { correo },
        });

        if (!usuario) {
            return res.status(401).json({ error: "Credenciales incorrectas" }); // 401 Unauthorized
        }


        // Verificar si el correo está verificado
        if (!usuario.verificado) {
            return res.status(403).json({ error: "Debes verificar tu correo antes de iniciar sesión." });
        }

        // Comparar contraseñas
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Credenciales incorrectas" }); // 401 Unauthorized
        }

        // Generar nuevo JWT
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};


const forgotPassword = async (req, res) => {
    const { correo } = req.body;

    try {
        const usuario = await prisma.usuarios.findUnique({ where: { correo } });
    
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }
    
        const token_recuperacion = crypto.randomBytes(32).toString("hex");
        const fecha_expiracion_token_recuperacion = new Date(Date.now() + 3600000); // 1 hora de expiración
    
        await prisma.usuarios.update({
            where: { id: usuario.id },
            data: { token_recuperacion, fecha_expiracion_token_recuperacion },
        });
    
        // Corrección: Elimina las barras invertidas
        const url = `${process.env.BASE_URL}/auth/restablecer-contrasena/${token_recuperacion}`;
    
        await transporter.sendMail({
            from: `"AokEcommerce" <${process.env.EMAIL_USER}>`,
            to: correo,
            subject: "Recuperación de contraseña",
            html: `<p>Hola ${usuario.nombre}, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                   <a href="${url}">Restablecer contraseña</a>`,
        });
    
        res.json({ mensaje: "Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const usuario = await prisma.usuarios.findUnique({ where: { token_recuperacion: token } });

        if (!usuario || usuario.fecha_expiracion_token_recuperacion < new Date()) {
            return res.status(400).json({ error: "Token inválido o expirado." });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await prisma.usuarios.update({
            where: { id: usuario.id },
            data: { password: passwordHash, token_recuperacion: null, fecha_expiracion_token_recuperacion: null },
        });

        res.json({ mensaje: "Contraseña restablecida con éxito." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};

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


module.exports = { register, verifyEmail, forgotPassword, resetPassword, login, getUser };