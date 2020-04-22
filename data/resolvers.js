import { Clientes, Productos, Pedidos, Usuarios } from './db';
import { rejects } from 'assert';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const ObjectId = mongoose.Types.ObjectId;

// generar token

import dotenv from 'dotenv';



dotenv.config({path: 'variables.env'});

import jwt from 'jsonwebtoken';

const crearToken = (usuarioLogin, secreto, expiresIn) => {
    const {usuario} = usuarioLogin;

    return jwt.sign({usuario}, secreto, {expiresIn});
}

export const resolvers = {
    Query: {
        getClientes : (root, {limite, offset, vendedor}) => {
            let filtro;
            if(vendedor){
                filtro = { vendedor : new ObjectId(vendedor)}
            }
            return Clientes.find(filtro).limit(limite).skip(offset)
        },
        getCliente : (root, {id}) => {
            return new Promise((resolvers, object) => {
                Clientes.findById(id, (error, cliente) => {
                    if(error) rejects(error)
                    else resolvers(cliente)
                });
            })
        },
        totalClientes : (root,{vendedor}) => {
            return new Promise((resolve,object) => {
                let filtro;
                if(vendedor){
                    filtro = { vendedor : new ObjectId(vendedor)}
                }
                Clientes.countDocuments(filtro, (error, count) =>{
                    if(error) rejects(error)
                    else resolve(count)
                })
            })
        },
        obtenerProductos : (root, {limite,offset ,stock}) => {
            let filtro;
            if(stock) {
                filtro = {stock: {$gt: 0 } }
            }
            return Productos.find(filtro).limit(limite).skip(offset)
        },
        obtenerProducto : (root, {id}) => {
            return new Promise((resolvers, object) => {
                Productos.findById(id, (error, producto) => {
                    if(error) rejects(error)
                    else resolvers(producto)
                });
            })
        },
        totalProductos : (root) => {
            return new Promise((resolve,object) => {
                Productos.countDocuments({}, (error, count) =>{
                    if(error) rejects(error)
                    else resolve(count)
                })
            })
        },
        obtenerPedidos: (root, {cliente}) => {
            return new Promise((resolve,object) => {
                Pedidos.find({ cliente: cliente}, (error, pedido) => {
                    if(error) rejects(error)
                    else resolve(pedido)
                })
            })
        },
        topClientes: (root) => {
            return new Promise((resolve,object) => {
                Pedidos.aggregate([

                    {
                        $match : {estado: "COMPLETADO"}
                    },
                    {
                        $group : {
                                _id: "$cliente", 
                                total: { $sum : "$total"}
                            }
                    },
                    
                    {
                        $lookup : {
                            from: "clientes",
                            localField : '_id',
                            foreignField: '_id',
                            as: 'cliente'
                        }
                    },
                    {
                        $sort : {total: -1}
                    },
                    {
                        $limit: 10
                    }
                ], (error, resultado) => {
                    if(error) rejects(error)
                    else resolve(resultado)
                })
            })
        },
        obtenerUsuario: (root, args, {usuarioActual}) => {
            if(!usuarioActual){
                return null;
            }
            
            //obtener usuario actual del request JWT verificado
            const usuario = Usuarios.findOne({usuario: usuarioActual.usuario});

            return usuario;
        },
        topVendedores: (root) => {
            return new Promise((resolve,object) => {
                Pedidos.aggregate([

                    {
                        $match : {estado: "COMPLETADO"}
                    },
                    {
                        $group : {
                                _id: "$vendedor", 
                                total: { $sum : "$total"}
                            }
                    },
                    
                    {
                        $lookup : {
                            from: "usuarios",
                            localField : '_id',
                            foreignField: '_id',
                            as: 'vendedor'
                        }
                    },
                    {
                        $sort : {total: -1}
                    },
                    {
                        $limit: 10
                    }


                ], (error, resultado) => {
                    if(error) rejects(error)
                    else resolve(resultado)
                })
            })
        },
    },
    Mutation: {
        crearCliente : (root, {input}) => {
            
            const nuevoCliente = new Clientes({
                nombre: input.nombre,
                apellido: input.apellido,
                empresa: input.empresa,
                emails: input.emails,
                edad: input.edad,
                tipo: input.tipo,
                pedidos: input.pedidos,
                vendedor: input.vendedor
            });

            nuevoCliente.id = nuevoCliente._id;

            return new Promise((resolvers, object) => {
                nuevoCliente.save((error) => {
                    if(error) rejects(error)
                    else resolvers(nuevoCliente)
                })
            });

        },

        actualizarCliente: (root, {input}) => {
            return new Promise((resolvers, object) => {
                Clientes.findOneAndUpdate({ _id : input.id }, input , {new: true}, (error, cliente) => {
                    if(error) rejects(error)
                    else resolvers(cliente)
                });
            });
        },
        eliminarCliente: (root, {id}) => {
            return new Promise((resolvers, object) => {
                Clientes.findOneAndDelete({_id : id}, (error) => {
                    if(error) rejects(error)
                    else resolvers("El Cliente se elimino correctamente")
                });
            });
        },
        nuevoProducto: (root, {input}) => {
            const nuevoProducto = new Productos({
                nombre: input.nombre,
                precio: input.precio,
                stock: input.stock
            });

            //mongodb crea el id
            nuevoProducto.id = nuevoProducto._id;

            return new Promise((resolvers, object) =>{
                nuevoProducto.save((error) =>{
                    if(error) rejects(error)
                    else resolvers(nuevoProducto)
                })
            })

        },
        actualizarProducto: (root, {input}) =>{
            return new Promise((resolvers, producto) =>{
                Productos.findOneAndUpdate({ _id : input.id }, input , {new: true}, (error, producto) =>{
                    if(error) rejects(error)
                    else resolvers(producto)
                })
            })
        },
        eliminarProducto: (root, {id}) =>{
            return new Promise((resolvers, object) => {
                Productos.findOneAndDelete({_id : id}, (error) => {
                    if(error) rejects(error)
                    else resolvers("El Producto se elimino correctamente")
                });
            });
        },
        nuevoPedido: (root, {input}) =>{
            const nuevoPedido = new Pedidos({
                pedido: input.pedido,
                total: input.total,
                fecha: new Date(),
                cliente: input.cliente,
                estado: "PENDIENTE",
                vendedor: input.vendedor
            });

            nuevoPedido.id = nuevoPedido._id;

            return new Promise((resolvers, object)=>{
                
                

                nuevoPedido.save((error) =>{
                    if(error) rejects(error)
                    else resolvers(nuevoPedido)
                });
            
            });

        },
        actualizarEstado: (root, {input}) => {
            return new Promise((resolvers, object) => {

                const {estado} = input;

                let instruccion;

                if(estado === 'COMPLETADO'){
                    instruccion = '-';
                }else if(estado === 'CANCELADO'){
                    instruccion = '+';
                }

                // recorre y actualiza la cantidad de productos en base al estado del pedido
                input.pedido.forEach(pedido => {
                    Productos.updateOne({_id : pedido.id}, 
                        { "$inc" : 
                            { "stock" : `${instruccion}${pedido.cantidad}` }
                        }, function(error) {
                            if(error) return new Error(error)
                        }
                    )
                })

                Pedidos.findOneAndUpdate({_id: input.id}, input , {new: true}, (error, producto) =>{
                    if(error) rejects(error)
                    else resolvers('Se actualizo correctamente')
                })
            })
        },
        crearUsuario: async (root, {usuario, nombre, password, rol}) => {
            //revisar si un usuario contiene este password
            const existeUsuario = await Usuarios.findOne({usuario});
            if(existeUsuario){
                throw new Error('El usuario ya existe');
            }
            const nuevoUsuario = await new Usuarios({
                usuario,
                nombre,
                password,
                rol
            }).save();
           
            return "Creado Correctamente"
        },
        autenticarUsuario: async (root, {usuario, password}) => {
            const nombreUsuario = await Usuarios.findOne({usuario});

            if(!nombreUsuario){
                throw new Error('Usuario no encontrado');
            }

            const passwordCorrecto = await bcrypt.compare(password, nombreUsuario.password);

            //si el password es incorrecto

            if(!passwordCorrecto){
                throw new Error('Password Incorrecto');
            }

            return{
                token: crearToken(nombreUsuario, process.env.SECRETO, '4hr')
            }

        }

    }
}

