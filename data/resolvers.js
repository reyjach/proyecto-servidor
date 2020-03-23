import { Clientes, Productos } from './db';
import { rejects } from 'assert';



export const resolvers = {
    Query: {
        getClientes : (root, {limite,offset}) => {
            return Clientes.find({}).limit(limite).skip(offset)
        },
        getCliente : (root, {id}) => {
            return new Promise((resolvers, object) => {
                Clientes.findById(id, (error, cliente) => {
                    if(error) rejects(error)
                    else resolvers(cliente)
                });
            })
        },
        totalClientes : (root) => {
            return new Promise((resolve,object) => {
                Clientes.countDocuments({}, (error, count) =>{
                    if(error) rejects(error)
                    else resolve(count)
                })
            })
        },
        obtenerProductos : (root, {limite,offset}) => {
            return Productos.find({}).limit(limite).skip(offset)
        },
        obtenerProducto : (root, {id}) => {
            return new Promise((resolvers, object) => {
                Productos.findById(id, (error, producto) => {
                    if(error) rejects(error)
                    else resolvers(producto)
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
                Clientes.findOneAndDelete({_id : id}, (error) => {
                    if(error) rejects(error)
                    else resolvers("Se elimino Correctamente")
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
                    else resolvers("Se elimino Correctamente")
                });
            });
        }

    }
}

