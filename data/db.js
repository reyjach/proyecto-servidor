import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/clientes', {useNewUrlParser: true});

mongoose.set('useFindAndModify', false);

mongoose.set('useUnifiedTopology', true);


//DEFINIR SCHEMA DE CLIENTES

const clienteSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    empresa: String,
    emails: Array,
    edad: Number,
    tipo: String,
    pedidos: Array
});

const Clientes = mongoose.model('clientes', clienteSchema);

//PRODUCTOS

const productosSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    stock: Number
})

const Productos = mongoose.model('productos',productosSchema)

// PEDIDOS

const pedidosSchema = new mongoose.Schema({
    pedido: Array,
    total: Number,
    fecha: Date,
    cliente: mongoose.Types.ObjectId,
    estado: String
});

const Pedidos = mongoose.model('pedidos', pedidosSchema);

export { Clientes, Productos, Pedidos }

