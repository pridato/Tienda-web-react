//modulo js para definir el state-global con context-api clienteLogged
//usando un reducer....no el state
import { createContext, useContext, useReducer } from 'react';

const ClienteLoggedContext=createContext();

//funcion REDUCER para usar en el hook useReducer....
//requisitos q tiene tener:
// - 2 parametros:
//                  - 1º el valor del state que quieres modificar 
//                  - 2º la accion q te mandan desde los comp.hijos: 
//                          { type: 'nombre_accion_disparada_componente', payload: 'nuevo_valor_incluir_State'}
//
// - la funcion DEBE SER PURA!!!! 

const clienteLoggedReducer=(state, action)=>{
    // en action.payload va a ir un objeto asi: { datoscliente: ...., jwt: ..... } o {}
    switch (action.type) {
        case 'CLIENTE_LOGGED':
            return action.payload;
   
        case 'CLIENTE_LOGOUT':
            return null;

        default:
            return state;
    }
    

}


//a EXPORTAR: componente con codigo JSX q defina el provider del contexto y pase valores
//del reducer:
function ClienteLoggedProvider( {children} ){

    const [clienteLogged, dispatch]=useReducer(clienteLoggedReducer, null);
    return (
        <ClienteLoggedContext.Provider value={ { clienteLogged, dispatch } }>
            {children}
        </ClienteLoggedContext.Provider>
    )
}

//a EXPORTAR: hook personalizado para usar los valores del contexto creado...
function useClienteLoggedContext(){
    const _clienteLoggedProvider=useContext(ClienteLoggedContext);
    return _clienteLoggedProvider;
}


export { ClienteLoggedProvider, useClienteLoggedContext };