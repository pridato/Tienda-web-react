 
function ModalDirecciones(  ) {
        //#region --------------- state manejado por el componente (global por context-api o local) ------------------
        //#endregion

        //#region --------------- efectos del componente -------------------------------------------------------------
        //#endregion

        //#region --------------- funciones manejadoras de eventos ----------------------------------------------------
        //#endregion


        return (
                <div  className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Nueva Direccion</h5>
                        <button  type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row">
                                    <p>Si desea que enviemos el pedido a una dirección distinta de la de facturación, modifique los campos a </p>
                                    <p>continuación según proceda.</p>
                                </div>
                                <div className="row">
                                    
                                        <div className="col-12">
                                        <label htmlFor="inputCalle" className="form-label">Direccion de Envio:</label>
                                        <input type="text" className="form-control" id="inputCalle" placeholder="Mi Direccion" />
                                        </div>

                                        <div className="col-6">
                                        <label htmlFor="inputCP" className="form-label">Codigo Postal:</label>
                                        <input type="text" className="form-control" id="inputCP" placeholder="Codigo Postal: 28803" />
                                        </div>
                                        <div className="col-6">
                                        <label htmlFor="inputPais" className="form-label">Pais:</label>
                                        <input type="text" className="form-control" id="inputPais" placeholder="España" />
                                        </div>
                                        
                                        
                                        <div className="col-6">
                                        <label htmlFor="inputProvincia" className="form-label">Provincia:</label>
                                        <select id="inputProvincia" className="form-select">
                                            <option value="0" defaultValue={true}> - Seleccionar Provincia - </option>
                                        </select>
                                        </div>
                                        <div className="col-6">
                                        <label htmlFor="inputMunicipio" className="form-label">Municipio:</label>
                                        <select id="inputMunicipio" className="form-select">
                                            <option value="0" defaultValue={true}> - Selecciona un Municipio -</option>
                                        </select>
                                        </div>

                                        <hr/>  
                                        <div className="col-12">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary" id="btnCrearDireccion"> Crear/Modificar direccion</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
        );
}

export default ModalDirecciones;