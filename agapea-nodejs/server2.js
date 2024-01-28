//modulo principal de entrada del proyecto de nodejs
require('dotenv').config(); //<---- paquete para definir como variables de entorno en fichero .env valores criticos, y recuperarlos con: process.env.nombre_variable

//instalar EXPRESS:  npm install express
// funciona con una pipeline de modules middleware que van procesando la pet.del cliente, la modifican y se la pasan
//al siguiente modulo middleware. Estos modulos middleware pueden ser de TERCEROS (modulos externos preconfigurados) o modulos
//autogenerados, como el de ENRUTAMIENTO
//todos los modulos middleware son funciones javascript con tres parametros (req, res, next)

const express=require('express'); //<---en la variable express se almacena la funcion q genera el servidor web, exportada por el modulo 'express'
var serverExpress=express();

const mongoose=require('mongoose'); //<---- en la variable mongoose almacenamos objeto para manejar MONGODB como un ORM

const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const cors=require('cors');

const bcrypt=require('bcrypt'); //<----- paquete para cifrar y comprobar hashes de passswords
const jsonwebtoken=require('jsonwebtoken'); // <---- paquete para generar JWT o tokens de sesion para cada cliente....

var Cliente=require('./modelos/cliente');
var Categoria=require('./modelos/categoria');
var Direccion=require('./modelos/direccion');
var Pedido=require('./modelos/pedido');
var Libro=require('./modelos/libro');

//----configuracion de la pipeline ------
//middleware de terceros:
// - cookie-parser: extrae de la pet.del cliente http-request, la cabecera Cookie, extrae su valor y lo mete en una prop.del objeto req.cookie
// - body-parser: extrae de la pet.del cliente http-rerquest, del body los datos mandados en formato x-www-form-urlenconded o json extrae su valor y los mete en una prop.del objeto req.body
// - cors: para evitar errores cross-origin-resouce-sharing
serverExpress.use( cookieParser() );
serverExpress.use( bodyParser.json() );
serverExpress.use( bodyParser.urlencoded( { extended:true } ) ); 
serverExpress.use(cors());

/*middleware propios:
  - enrutamiento <---- rutas o endpoints del servicio REST(FULL) montado en el servidor express, siempre devuelven datos formato JSON
                    el foramto de estas rutas:   /api/....

    cliente react                                           servidor nodejs                                         servidor MONGODB
                                                            express: PIPELINE                                   (local o bien mongodb-atlas)
                         HTTP-REQUEST(AJAX:url)        middle-1 ..... middle-N(enrutamiento) ---------------->  AgapeaDB (bd-nosql)
        Registro.js ------------------------------->                    |                   <-----------------
                    <-------------------------------      respuesta formato JSON

desde powershell, invocando servicio rest:

    Invoke-RestMethod -Method post -Uri 'http://localhost:3000/api/Cliente/Registro' -Body @{ nombre='pablo'; apellidos='martin';  email='mio@mio.es' }

o atraves de POSTMAN

*/  


//#region //////////////////////////////// endpoints REST-CLIENTE ///////////////////////////////////////////
serverExpress.post('/api/Cliente/Registro', async (req,res,next)=>{ 
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
    }}
);

serverExpress.post('/api/Cliente/Login', async (req, res, next)=>{
    try {
            //en req.body esta el objeto q me manda el componente Login.js de REACT... { email:'...', password: '....' }
            let { email, password }=req.body;

            //1º comprobar q existe un cliente con el email q me mandan en coleccion clientes de Mongodb
            let _cliente = await Cliente.findOne( {'cuenta.email': email } )
                                         .populate(
                                            [
                                               { path: 'direcciones', model: 'Direccion' },
                                               { path: 'pedidos', model: 'Pedido' }
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


});
//#endregion



//#region ///////////////////////////////// endpoints REST-TIENDA /////////////////////////////////////////////
serverExpress.get('/api/Tienda/RecuperarCategorias/:idcategoria', async (req,res,next)=>{
    try {
            //si en parametro idcategoria va 'padres' tengo q recuperar categorias raices...
            //si va otro valor, p.e: 2-10 tendria q recuperar subcategorias hijas....
            var _idcategoria=req.params.idcategoria;
            //console.log('categoria mandada desde react...', _idcategoria);

            var _patron=_idcategoria==='padres' ?  new RegExp("^\\d{1,}$") : new RegExp("^" + _idcategoria + "-\\d{1,}$");
            var _cats=await Categoria.find( { IdCategoria: { $regex: _patron }  } );

           //console.log('categorias recuperadas...', _cats);

            res.status(200).send(_cats);

            
    } catch (error) {
        console.log('error al recuperar categorias...',error);
        res.status(200).send( [] );
    }    

});

serverExpress.get('/api/Tienda/RecuperarLibros/:idcategoria', async (req,res,next)=>{
    try {
        //si en parametro idcategoria va 'padres' tengo q recuperar categorias raices...
        //si va otro valor, p.e: 2-10 tendria q recuperar subcategorias hijas....
        var _idcategoria=req.params.idcategoria;
        //console.log('categoria mandada desde react...', _idcategoria);

        var _patron=_idcategoria==='padres' ?  new RegExp("^\\d{1,}$") : new RegExp("^" + _idcategoria + "-\\d{1,}$");
        var _libros=await Libro.find( { IdCategoria: { $regex: _patron }  } );

        //console.log('libros recuperadas...', _libros);

        res.status(200).send(_libros);

        
} catch (error) {
    console.log('error al recuperar categorias...',error);
    res.status(200).send( [] );
}    

});

serverExpress.get('/api/Tienda/RecuperarLibro/:isbn13', async (req,res,next) => {
    try {
        var _isbn13=req.params.isbn13;
        var _libro=await Libro.findOne({ ISBN13: _isbn13 });
        console.log('libro recuperado...', _libro);

        res.status(200).send(_libro);

    } catch (error) {
        console.log('error al recuperar libro...', error);
        res.status(200).send({});
    }
});

//#endregion






//-----------------------------------------
serverExpress.listen(3003, ()=>console.log('...servidor web express escuchando por puerto 3003...') );


//------------ conexion al servidor MONGODB----------
//OJO!! cadenas de conexion al servidor de BD van en variables de entorno del sistema op. donde se ejecuta el server
// instalar paquete npm:  dotenv
mongoose.connect(process.env.CONNECTION_MONGODB)
        .then(
            ()=> console.log('...conexion al servidor de BD mongo establecido de forma correcta....')
        )
        .catch(
          (err) => console.log('fallo al conectarnos al sevidor de bd de mongo:', err)  
        )