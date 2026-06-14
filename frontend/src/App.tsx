import { useEffect, useState } from 'react';
import axios from 'axios';

export function ListaUsuariosAxios() {
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

  return (
    <ul>
      {/* Usamos cortocircuito por seguridad en caso de que tarde en cargar */}
      {usuarios && usuarios.map((u) => (
        <li key={u.id}>{u.nombre} - {u.cedula} - {u.telefono}</li>
      ))}
    </ul>
  );
}