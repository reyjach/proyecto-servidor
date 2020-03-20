import mongoose from 'mongoose';
import { Clientes } from './db';
import { rejects } from 'assert';



export const resolvers = {
    Query: {
        getClientes : (root, {limite}) => {
            return Clientes.find({}).limit(limite)
        },
        getCliente : (root, {id}) => {
            return new Promise((resolvers, object) => {
                Clientes.findById(id, (error, cliente) => {
                    if(error) rejects(error)
                    else resolvers(cliente)
                });
            })
        }
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
                pedidos: input.pedidos
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
                Clientes.findOneAndRemove({_id : id}, (error) => {
                    if(error) rejects(error)
                    else resolvers("Se elimino Correctamente")
                });
            });
        }

    }
}

