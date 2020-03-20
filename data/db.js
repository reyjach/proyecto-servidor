import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/clientes', {useNewUrlParser: true});

mongoose.set('useFindAndModify', false);

mongoose.set('useUnifiedTopology', true);

//DEFINIR CHEMA DE CLIENTES

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

export { Clientes }

