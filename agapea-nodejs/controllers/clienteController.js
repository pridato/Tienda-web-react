//modulo de nodejs donde exporto objeto javascript puro q tiene como propiedades las funciones middleware
//q necesita el objeto router express de zona cliente....

const bcrypt=require('bcrypt'); //<----- paquete para cifrar y comprobar hashes de passswords
const jsonwebtoken=require('jsonwebtoken'); // <---- paquete para generar JWT o tokens de sesion para cada cliente....

var Cliente=require('../modelos/cliente');
var Categoria=require('../modelos/categoria');
var Direccion=require('../modelos/direccion');
var Pedido=require('../modelos/pedido');
var Libro=require('../modelos/libro');

module.exports={
    login: async (req, res, next)=>{
        try {
                //en req.body esta el objeto q me manda el componente Login.js de REACT... { email:'...', password: '....' }
                let { email, password }=req.body;
    
                //1º comprobar q existe un cliente con el email q me mandan en coleccion clientes de Mongodb
                let _cliente = await Cliente.findOne( {'cuenta.email': email } )
                                             .populate(
                                                [
                                                   { path: 'direcciones', model: 'Direccion' },
                                                   { path: 'pedidos', model: 'Pedido', populate: [ { path: 'elementosPedido.libroElemento', model: 'Libro' } ] }
                                                ]
                                             );
                if (! _cliente ) throw new Error('no existe una cuenta con ese email....');
    
                //2º comprobar q el hash de la password concuerda con la password q me mandan y su hash
                if (bcrypt.compareSync(password, _cliente.cuenta.password)) {
                    //3º comprobar q la cuenta esta ACTIVADA...
                    if (! _cliente.cuenta.cuentaActiva) throw new Error('debes activar tu cuenta....comprueba el email'); //<----deberiamos reenviar email de activacion...
    
                    //4º si todo ok... devolver datos del cliente con pedidos y direcciones expandidos (no los _id)
                    //                 devolver token de sesion JWT    
                    let _jwt=jsonwebtoken.sign(
                        { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idcliente: _cliente._id }, //<--- payload jwt
                        process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
                        { expiresIn: '1h', issuer: 'http://localhost:3003' } //opciones o lista de cliams predefinidos
                    );
    
                    res.status(200).send(
                        {
                            codigo: 0,
                            mensaje: 'login OKS...',
                            error: '',
                            datoscliente: _cliente,
                            tokensesion: _jwt,
                            otrosdatos: null
                        }
                    );
                        
    
                } else {
                    throw new Error('password incorrecta....');
                }
    
    
        
    
    
    
        } catch (error) {
            console.log('error en el login....', error);
            res.status(200).send(
                {
                    codigo: 1,
                    mensaje: 'login fallido',
                    error: error.message,
                    datoscliente: null,
                    tokensesion: null,
                    otrosdatos: null
                }
            );
    
        }   
    },
    registro: async (req,res,next)=>{ 
        try {
                console.log('datos recibidos por el cliente react en componente registro, por ajax...', req.body);
    
                //1º paso:con los datos mandados por el componente de react, tenemos que insertarlos en la coleccion clientes de la bd de mongo
                var __resultInsertCliente=await new Cliente(
                    {
                        nombre: req.body.nombre,
                        apellidos: req.body.apellidos,
                        telefono: req.body.telefono,
                        cuenta: {
                            email: req.body.email,
                            login: req.body.login,
                            password: bcrypt.hashSync(req.body.password,10),
                            cuentaActiva: false,
                            imagenAvatarBASE64:''
                        }
                    }
                ).save()
    
                console.log('resultado del insert en la coleccion clientes de mongodb...', __resultInsertCliente);
    
                //2º paso: mandar email de activacion con mailjet (instalar paquete node-mailjet) --------------
    
    
                //3º paso: mandar respuesta----------------------------------------------------------------------
                res.status(200)
                    .send(
                            {
                                codigo:0,
                                mensaje:'datos del cliente insertados ok'
                            }
                        )
            
        } catch (error) {
            console.log('error al hacer el insert en coleccion clientes...', error);
            res.status(200).send(
                {
                    codigo:1,
                    mensaje:`error a la hora de insertar datos del cliente: ${JSON.stringify(error)}`
                }
    
            )
        }
    },
    obtenerDatosCliente: async (req,res, next)=>{
        try {
            console.log('payload en el jwt de un solo uso...', req.payload);
            console.log('datos mandados en el body por el servicio de react restClienteService...', req.body);
    
            let { idcliente, idpedido, idpago }=req.payload;
            let _idcliente=req.body.idcliente;
    
            if( _idcliente !== idcliente) {
                throw new Error('alguien ha manipulado los datos mandados en el body de la pet.post, no coincide con lo almacenado en el JWT...ojito');
            } else {
                
                let _cliente=await Cliente.findById(idcliente).populate(
                        [
                            { path: 'direcciones', model: 'Direccion' },
                            { path: 'pedidos', model: 'Pedido', populate: [ { path: 'elementosPedido.libroElemento', model: 'Libro' } ] }
                         ]
                );

                //token de sesion para datos del cliente actualizados....
                let _jwt=jsonwebtoken.sign(
                    { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idcliente: _cliente._id }, //<--- payload jwt
                    process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
                    { expiresIn: '1h', issuer: 'http://localhost:3003' } //opciones o lista de cliams predefinidos
                );

                res.status(200).send(
                    {
                        codigo: 0,
                        mensaje: 'datos cliente recuperados ok con nuevo pedido metido y nuevo JWT de sesion creado',
                        error: null,
                        datoscliente: _cliente,
                        tokensesion: _jwt,
                        otrosdatos: null
                    }
                   ) 
        
            }
                
        } catch (error) {
           console.log('error al obtener datos cliente...', error);
           res.status(401).send(
            {
                codigo: 1,
                mensaje: 'error al obtener datos cliente y generar nuevo JWT de sesion tras pago con paypal...',
                error: error.message,
                datoscliente: null,
                tokensesion: null,
                otrosdatos: null
            }
           ) 
        }


    }   
}