//modulo donde exporto funciones javascript para hacer pet.ajax al servicio RESTFULL montado sobre NODEJS....
// export async function RegistrarCliente( { nombre,apellidos,email,password,login,telefono} ){
//     if (login==='') login=email;


// //#region -----------------  pet.Ajax con XMLHTTPREQUEST ----------------

//     //envolvemos pet.ajax en un objeto PROMISE....
//     //en el prototipo, el argumento pasado es una funcion con dos parametros:
//     // - resolve:  una funcion q va a devolver los datos de la promesia si se ejecuta de forma correcta
//     //              es lo q se recoje en el .then()
//     // - reject:  una funcion q va a devolver los datos cuando quieres q la promesa se ejecute de forma
//     //          incorrecta, estos datos los recogeria el catch()

//     // var _promiseResult=new Promise(
//     //     (resolve,reject)=>{
//     //         var petAjax=new XMLHttpRequest();
//     //         petAjax.open('POST','http://localhost:3003/api/Cliente/Registro');
//     //         petAjax.setRequestHeader('Content-Type','application/json');
        
//     //         petAjax.addEventListener('readystatechange',()=>{
//     //             if( petAjax.readyState === 4){
//     //                 console.log(petAjax);
        
//     //                 switch (petAjax.status) {
//     //                     case 200:
//     //                         //la respuesta del server esta en petAjax.responseText
//     //                         var respuesta=JSON.parse(petAjax.responseText);
//     //                         resolve(respuesta);                                                        
//     //                         break;

//     //                     default:
//     //                         reject( { codigo: 1, mensaje:'algo ha ido mal en pet.ajax al servicio de registrar cliente...' });
//     //                         break;
//     //                 }
//     //             }
//     //         });
        
//     //         petAjax.send(JSON.stringify( { nombre,apellidos,login,telefono,email,password} ));  
//     //     }
//     // );

//     // return _promiseResult;


// //#endregion

// //#region -----------------  pet.Ajax con FETCH-API -----------------------
// try {
//         var _petAjax=await fetch('http://localhost:3003/api/Cliente/Registro',
//                                  {
//                                     method: 'POST',
//                                     body: JSON.stringify({ nombre,apellidos,email,password,login,telefono}),
//                                     headers: { 'Content-Type': 'application/json '}
//                                  }
//                                 );
//         return await _petAjax.json();

//     } catch (error) {
//         return { codigo: 1, mensaje:'algo ha ido mal en pet.ajax al servicio de registrar cliente...' };
//     }
// //#endregion
   
// }


// export async function LoginCliente( datoslogin ){
//     try {
//         var _petAjax=await fetch('http://localhost:3003/api/Cliente/Login',
//                                 {
//                                 method: 'POST',
//                                 body: JSON.stringify(datoslogin) ,
//                                 headers: { 'Content-Type': 'application/json '}
//                                 }
//                            );
//         return await _petAjax.json();  
          
//     } catch (error) {
//         return JSON.parse(error);
//     }

// }


var clienteRESTService={
    LoginCliente: async function(datoslogin){
        try {
            var _petAjax=await fetch('http://localhost:3003/api/Cliente/Login',
                                    {
                                    method: 'POST',
                                    body: JSON.stringify(datoslogin) ,
                                    headers: { 'Content-Type': 'application/json '}
                                    }
                               );
            return await _petAjax.json();  
              
        } catch (error) {
            return JSON.parse(error);
        }
    
    },
    RegistrarCliente: async function( { nombre,apellidos,email,password,login,telefono} ){
        try {
            if (login==='') login=email;
            var _petAjax=await fetch('http://localhost:3003/api/Cliente/Registro',
                                     {
                                        method: 'POST',
                                        body: JSON.stringify({ nombre,apellidos,email,password,login,telefono}),
                                        headers: { 'Content-Type': 'application/json '}
                                     }
                                    );
            return await _petAjax.json();
    
        } catch (error) {
            return { codigo: 1, mensaje:'algo ha ido mal en pet.ajax al servicio de registrar cliente...' };
        }        
    },
    ObtenerDatosCliente: async function(idcliente,jwtUnUso){
        try {
            let _respServer=await fetch(
                'http://localhost:3003/api/Cliente/ObtenerDatosCliente',
                {
                    method: 'POST',
                    body: JSON.stringify( { idcliente } ),
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtUnUso}` 

                    }
                }
            );

            if (! _respServer.ok) throw new Error('error al intentar obtener datos del cliente tras finalizar pago por paypal...');
            return _respServer.json();

        } catch (error) {
            console.log('error al intentar obtener datos del cliente tras finalizar pago por paypal...', error);
            return null;
        }
    }
}

export default clienteRESTService;