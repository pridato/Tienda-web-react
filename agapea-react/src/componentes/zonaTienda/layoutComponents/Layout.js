import { Outlet, useLoaderData, Link, useLocation } from "react-router-dom"; 

import Footer from "./Footer";
//import Header from "./Header";
import Headerv2 from "./Headerv2";

function Layout(){
    
    let _listacategorias=useLoaderData(); //<---- el hook useLoaderData recupear del loader asociado los datos....
    let _location=useLocation(); //<------------- hook para obtener objeto Location actual
    console.log('objeto location...', _location);

    console.log('categorias recuperadas desde nodejs...', _listacategorias);

    return (
        <>
            <Headerv2 />

            <div className="container">
                <div className="row">
                    {/* ----- columna para categorias ------ */}
                    <div className="col-3">
                        {
                            ! new RegExp("/Cliente/Panel/.*").test(_location.pathname) ? 
                            (
                                <>
                                    <h6>Categorias</h6>
                                    <div className="list-group">
                                    {

                                            _listacategorias.map(
                                                (cat) => <Link key={cat.IdCategoria} to={"/Tienda/Libros" + cat.IdCategoria} 
                                                            className="list-group-item list-group-item-action">
                                                                    {cat.NombreCategoria}
                                                        </Link>
                                            )
                                    }
                                    </div>                                
                                </>
                            )
                            :
                            (
                                <>
                                    <h6 className="text-dark mt-4 ms-3">PANEL PERSONAL DEL CLIENTE</h6>
                                    <div className="container">
                                        <div className="row" style={{background:"#ededed"}}>
                                            <div className="col text-center mt-3">
                                                <img src="/images/imagen_usuario_sinavatar.jpg" style={{width:"115px", height:"140px"}} alt="..."/>
                                            </div>
                                        </div>

                                        <div className="row" style={{background:"#ededed"}}>
                                            <div className="col">
                                                <p className="text-muted"><small>Bienvenido nombre apellidos ( email )</small></p>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col">
                                                <div className="list-group">
                                                    {
                                                        _listacategorias.map(
                                                            cat => <Link className="list-group-item list-group-item-action border border-end-0 border-start-0 text-dark">
                                                                        {cat}
                                                                    </Link>
                                                        )
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>                               
                                </>
                            )
                        }

                    </div>

                    {/* ------ columna para mostrar en funcion del path, el componente segun REACT-ROUTER ---- */}
                    <div className="col-9">
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Layout;