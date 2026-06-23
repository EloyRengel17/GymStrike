import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
const Input = () => {
  // 1. Cambiamos el estado a un string vacío, ya que la cédula es un texto, no un arreglo []
  const [cedula, setCedula] = useState('');

  // 2. Esta es la función que procesa el envío
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // evita que la página se recargue al presionar Enter

    if (!cedula.trim()) {
      alert("Por favor, ingrese una cédula válida.");
      console.log("POr favor, INgrese una cedula Valida.")
      return;
    }

    verificarCedula(cedula); // 3. Enviamos la cédula directamente a tu función
  };

  // Tu función para verificar la cédula (aquí harías tu petición al backend o validación)
  const verificarCedula = async (cedulaAEnviar: string) => {
  try {
    // Pasamos un objeto con la cédula como segundo argumento
    const respuesta = await axios.post('http://localhost:3000/actividad', {
      cedula: String(cedulaAEnviar).trim() //El backend recibirá esto en el req.body
    });
    
    // Si tu backend responde con la data del usuario, la guardas en el estado
    alert(respuesta.data.usuario); 
    
  } catch (error) {
   if (error.response?.status === 403) {
    alert(error.response.data.message);
  }
  }
};

  

  return (
    <PantallaCentrada>
      <StyledWrapper>
        {/* Asignamos el evento onSubmit al formulario */}
        <form onSubmit={handleSubmit}>
          <input 
            placeholder="Ingrese su cedula para ingresar" 
            type="text" 
            name="cedula" 
            className="input"
            value={cedula} // Controlamos el input con el estado
            onChange={(e) => setCedula(e.target.value)} // Guardamos lo que escribe el usuario paso a paso
          />
        </form>
      </StyledWrapper>
    </PantallaCentrada>
  );
}

// Tus mismos componentes de estilos (sin cambios)
const PantallaCentrada = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 50vh;
`;

const StyledWrapper = styled.div`
  width: 100%; 
  display: flex;
  justify-content: center; 

  .input {
    width: 100%;
    max-width: 220px;
    height: 45px;
    padding: 12px;
    border-radius: 12px;
    border: 1.5px solid lightgrey;
    outline: none;
    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    box-shadow: 0px 0px 20px -18px;
  }

  .input:hover { border: 2px solid lightgrey; box-shadow: 0px 0px 20px -17px; }
  .input:active { transform: scale(0.95); }
  .input:focus { border: 2px solid grey; }
`;

export default Input;
/*
 const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const respuesta = await axios.get('http://localhost:3000/usuarios');
        
        // CORRECCIÓN: Accedemos a la propiedad .usuario del JSON
        setUsuarios(respuesta.data.usuario); 
      } catch (error) {
        console.error('Error en la petición con Axios:', error);
      }
    };

    obtenerUsuarios();
  }, []);
*/

/*
Tengo que empezar a hacer la pagina del login y tambien del ingreso, y tambein tengo que utilizar recursos propios de stripe para poder hacerf el froneted del apgo
*/