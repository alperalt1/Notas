import axios from "axios";
import { useState } from "react"
import { useNavigate } from 'react-router-dom';


interface Usuario {
    id: number,
    correo: string,
    contrasena: string
}


export default function LogintPage() {
    const [usuario, setUsuario] = useState<Usuario>({
        id: 0,
        correo: '',
        contrasena: ''
    });
    const navigate = useNavigate(); 
    // const [users, setUsers] = useState<UserNota[]>([])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUsuario(prevUsuario => ({ ...prevUsuario, [name]: value, })); // Corregir paréntesis
    };

    const LoginUser = async (newUsuari: Omit<Usuario, 'id'>)=>{
        try {
            const response = await axios.post('http://localhost:5053/api/usuarios', newUsuari, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data)
            console.log()
            navigate(`/home/${response.data.usuarioId}`)
        } catch (error: any) {
            console.error('Error al obtener las tareas:', error.response?.data || error.message);
        }
    }

    const handleSubmit =async (e: { preventDefault: () => void; })=>{
        e.preventDefault();
        LoginUser(usuario)
    }

    return (
        <div className="flex items-center justify-center w-screen h-screen">
                <form onSubmit={handleSubmit} className="flex flex-col rounded-lg p-4 w-1/2 h-64 bg-slate-500">
                    <label className="m-1 font-bold">Usuario</label>
                    <input type="text" name="correo" value={usuario.correo} onChange={handleChange} className="m-1 p-1 rounded-sm">
                    </input>
                    <label className="m-1 font-bold">Contraseña</label>
                    <input type="password" name="contrasena" value={usuario.contrasena} onChange={handleChange} className="m-1 p-1 rounded-sm">
                    </input>
                    <div className="flex items-center justify-center p-5">
                        <button type="submit" className="rounded-md w-24 h-10 bg-slate-300">Ingresar</button>
                    </div>
                </form>
        </div>
    )
};
