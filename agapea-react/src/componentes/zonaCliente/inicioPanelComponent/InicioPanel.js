import ModalDirecciones from './ModalDirecciones';
import { useState } from 'react'
 
function InicioPanel(  ) {
        //#region --------------- state manejado por el componente (global por context-api o local) ------------------
        const [AvatarUsuario, setAvatarUsuario] = useState()
        //#endregion

        //#region --------------- efectos del componente -------------------------------------------------------------
        //#endregion

        //#region --------------- funciones manejadoras de eventos ----------------------------------------------------
        function InputImageOnChange(ev){
            let _imagen = ev.target.files[0]
            let _lector = new FileReader()

            _lector.addEventListener('load', (evt)=>{
                let _contenidoFichSerializado = evt.target.result
                document.getElementById('botonUploadImagen').remove('disabled')
                setAvatarUsuario(_contenidoFichSerializado)
            })
            _lector.readAsDataURL(_imagen)
        }

        function BotonUploadImagenClickHandler(ev){
            // crear FormData, añadir contenido fichero imagen y mediante ajax subirlo a servicio de nodejs

        }
        //#endregion


        return (
<div className="container">
    <div className="row">
        <div className="col">
            <h2>Mi perfil</h2>
            <div></div>            
                <div className="alert alert-secondary" data-bs-toggle="collapse" href="#collapseDatos">Datos de perfil</div>          
                <div className="collapse" id="collapseDatos">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="row text-muted">Correo electrónico</div>
                            <div className="row"><input type="text" id="inputEmail" className="input-group-text" style={{width:"90%"}} /></div>
                            <div className="row text-muted">Contraseña</div>
                            <div className="row"><input type="password" id="inputPass" className="input-group-text" style={{width:"90%"}}  /></div>
                            <div className="row text-muted">Nombre</div>
                            <div className="row"><input type="text" id="inputNombre" className="input-group-text" style={{width:"90%"}}   /></div>

                        </div>

                        <div className="col-sm-6">
                            <div className="row text-muted">Teléfono</div>
                            <div className="row"><input type="text" id="inputTlfn" className="input-group-text" style={{width:"90%"}}  /></div>
                            <div className="row text-muted">Repetir la contraseña</div>
                            <div className="row"><input type="password" id="inputPassRep" className="input-group-text" style={{width:"90%"}} /></div>
                            <div className="row text-muted">Apellidos</div>
                            <div className="row"><input type="text" id="inputApellidos" className="input-group-text" style={{width:"90%"}}  /></div>

                        </div>
                    </div>
                    <div className="row"><span></span></div>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="text-muted">Foto</div>
                            <div id="avatarPerfil" className="card" style={{width:"200px",height:"250px", backgroundColor:"aliceblue"}}>
                                <input type="file" accept="image/*" id="selectorImagen"  style={{visibility:"hidden"}} />
                                <a onClick={ ()=> document.getElementById('selectorImagen').click() }>
                                    <img id="imagenUsuario" style={{height:"250px",width:"200px"}} alt="..." />
                                </a>
                            </div>
                            <button type="button" 
                                    className="btn btn-link btn-sm"
                                    id="botonUploadImagen" 
                                    disabled
                                    
                                    > + Sube una foto</button>
                            <div id="mensajeServicioREST"></div>
                        </div>
                        <div className="col-sm-8">
                            <div className="row text-muted">Usuario</div>
                            <div className="row"><input type="text" id="inputUsuario" className="input-group-sm"  /></div>
                            <div className="row text-muted">Genero</div>
                            <div className="row">
                                <select className="form-select" id="genero" aria-label="Elige genero" >
                                    <option value="0" selected>Elige genero</option>
                                    <option value="Hombre">Hombre</option>
                                    <option value="Mujer">Mujer</option>
                                </select>
                            </div>
                            <div className="row text-muted">Fecha de nacimiento</div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <select  id="dia" className="form-select">
                                        <option value="-1" defaultValue={true}>Elige día</option>
                                    </select>
                                </div>
                                <div className="col-sm-4">
                                    <select  id="mes" className="form-select">
                                        <option value="-1" defaultValue={true}>Elige mes</option>
                                    </select>
                                </div>
                                <div className="col-sm-4">
                                    <select  id="anio" className="form-select">
                                        <option value="-1" defaultValue={true}>Elige año</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row text-muted">Descripcion</div>
                            <div className="row"><textarea id="textArea"></textarea> </div>
                            <div className="ro2 align-text-top m-2">
                                    <a href=""> Darme de baja</a>
                                    <button type="submit" className="m-10 btn btn-primary">Modificar Datos</button>
                            </div>

                        </div>
                    </div>
                </div>              

            <div className="alert alert-secondary" data-bs-toggle="collapse" href="#collapseDirecciones">Direcciones</div>
            <div className="collapse" id="collapseDirecciones">
                <div>
                    <p> Guarda todas tus direcciones de envío y elige la que usarás por defecto donde llegarán tus pedidos.</p>

                   <p> Estas son las direcciones a las que puedes hacer tus envíos. Las direcciones de envío serán las que elijas mientras que la
                        facturación será la misma en todas las direcciones:
                    </p>
                </div>
                <hr/>
                {/*-- listado de direcciones del cliente para borrar/modificar --*/}

                {/*-- Button trigger modal --*/}
                <button  type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                  + Nueva Direccion
                </button>

                {/*-- Modal --*/}
                <ModalDirecciones></ModalDirecciones>

            </div>
        </div>
    </div>
</div> 
        );
}

export default InicioPanel;