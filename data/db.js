import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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

//USUARIOS

const UsuariosSchema = new mongoose.Schema({
    usuario: String,
    password: String
});

//Hashear los password antes de guardarlos en la base de datos

UsuariosSchema.pre('save', function(next){
    //si el password no esta modificado ejecutar la siguiente funcion.
    if(!this.isModified('password')){
        return next();
    }
    bcrypt.genSalt(11, (err, salt) => {
        if(err) return next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) return next(err);
            this.password = hash;
            next();
        });
    })
});

const Usuarios = mongoose.model('usuarios', UsuariosSchema);

export { Clientes, Productos, Pedidos, Usuarios }

