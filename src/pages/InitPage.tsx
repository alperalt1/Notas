import { useEffect, useState } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import axios from 'axios';
import { useParams } from "react-router-dom";

interface Task {
    id: number;
    tarea: string;
    descripcion: string;
    status: boolean;
    fecha: string;
}

export interface NotaDto {
    notaId: number;
    tarea: string;
    descripcion: string;
    status: boolean;
    fecha: string;
    usuarioId: number;
}

export default function InitPage() {
    const { usuarioId } = useParams<{ usuarioId: string }>();
    const [contadorID, setContadorID] = useState<number>(0);
    const [task, setTask] = useState<NotaDto>({
        notaId: 0, 
        tarea: '',
        descripcion: '',
        status: false,
        fecha: '',
        usuarioId: parseInt(usuarioId?? "0") || 0  // UsuarioId puede ser undefined, asegurate de que siempre esté presente
    });

    const [tasklist, setTaskList] = useState<NotaDto[]>([]);

    const sendTaskToServer = async (newTask: NotaDto) => {
        console.log(newTask)
        try {
            const response = await axios.post('http://localhost:5053/api/notas', {...newTask, notaId: 0}, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Tarea enviada correctamente:', response.data);
        } catch (error: any) {
            console.error('Error de red al enviar tarea:', error.response?.data || error.message);
            throw new Error;
        }
    };

    const getTaskToServer = async () => {
        try {
            const response = await axios.get(`http://localhost:5053/api/notas/${usuarioId}`);
            console.log(response.data);
            const maxId = response.data.length > 0
                ? Math.max(...response.data.map((task: Task) => task.id))
                : 0;
            setContadorID(maxId + 1);
            setTaskList(response.data);
        } catch (error: any) {
            console.error('Error al obtener las tareas:', error.response?.data || error.message);
        }
    }

    const deletefunc = async (id: number) => {
        try {
            const response = await axios.delete(`http://localhost:5053/api/notas/${id}`);
            console.log('Tarea eliminada:', response.data);
        } catch (error: any) {
            console.error('Error al eliminar la tarea:', error.response?.data || error.message);
        }
    };

    const putfun = async (id: number, task: NotaDto) => {
        try {
            const response = await axios.put(`http://localhost:5053/api/notas/${id}`, task);
            console.log('Tarea actualizada:', response.data);
        } catch (error: any) {
            console.error('Error al actualizar la tarea:', error.response?.data || error.message);
        }
    }

    const putstatusfun = async (id: number, status: boolean) => {
        try {
            const response = await axios.put(`http://localhost:5053/api/notas/status/${id}`, { status }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Tarea actualizada:', response.data);
        } catch (error: any) {
            console.error('Error al actualizar la tarea:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        getTaskToServer();
    }, []);

    const [editbutton, setEditButton] = useState<boolean>(false);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (editbutton) {
            setTaskList(prev => prev.map(taskItem => taskItem.notaId === task.notaId ? { ...taskItem, ...task } : taskItem));
            putfun(task.notaId, task);
            setEditButton(false);
        } else {
            const { notaId, ...newTask } = task;
            const newTaskWithId = { notaId: contadorID, ...newTask };
            setContadorID(prevID => prevID + 1);
            await sendTaskToServer(newTaskWithId).then(() =>
                setTaskList(prev => [...prev, newTaskWithId])
            );
        }
        setTask({ notaId: 0, tarea: '', descripcion: '', status: false, fecha: '', usuarioId: parseInt(usuarioId ?? "0") || 0 });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTask(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = (id: number) => {
        setTaskList(prev => prev.filter(task => task.notaId !== id));
        deletefunc(id);
    };

    const handleEdit = (id: number) => {
        const taskToEdit = tasklist.find(task => task.notaId === id);
        if (taskToEdit) {
            setEditButton(true);
            setTask({ ...taskToEdit });
        }
    };

    const handleCheck = async (id: number) => {
        const taskToUpdate = tasklist.find(task => task.notaId === id);
        if (!taskToUpdate) return;

        const updatedStatus = !taskToUpdate.status;
        await putstatusfun(id, updatedStatus);

        setTaskList(prev =>
            prev.map(t => t.notaId === id ? { ...t, status: updatedStatus } : t)
        );
    };

    return (
        <div className='h-screen p-6'>
            <div className='flex justify-center items-center w-full font-bold'>Notas</div>
            <div className='flex flex-row p-8 h-full'>
                <div className='border-2 rounded p-4 mr-5 h-2/3 w-1/2'>
                    <form onSubmit={handleSubmit} className='flex flex-col'>
                        <label className='font-semibold'>Tarea</label>
                        <input
                            maxLength={60}
                            required
                            type='text'
                            name='tarea'
                            value={task.tarea}
                            onChange={handleChange}
                            className='border-2 rounded p-2 h-10 w-full'
                        />
                        <label className='font-semibold'>Descripción de la Tarea</label>
                        <textarea
                            maxLength={200}
                            required
                            name='descripcion'
                            value={task.descripcion}
                            onChange={handleChange}
                            className='border-2 rounded resize-none p-2 h-24 w-full'
                        />
                        <label className='font-semibold'>Fecha</label>
                        <input
                            required
                            type='date'
                            name='fecha'
                            value={task.fecha}
                            onChange={handleChange}
                            className='border-2 rounded p-2 h-10 w-full'
                        />
                        <div className='justify-center text-center'>
                            <button
                                type='submit'
                                className='border-2 rounded-md bg-slate-400 m-4 h-10 w-32'
                            >
                                {editbutton ? "Editar Tarea" : "Enviar Tarea"}
                            </button>
                        </div>
                    </form>
                </div>
                <div className='border-2 rounded bg-scroll p-4 h-full max-h-screen overflow-y-auto flex flex-col flex-grow w-1/2'>
                    {tasklist.map((task, index) => (
                        <div key={index} className="border-2 rounded w-full h-44 mb-2 px-2 pb-3">
                            <div className='flex flex-row justify-between font-semibold mt-2'>
                                <div>{task.notaId}</div>
                                {task.tarea}
                                <div>
                                    <button onClick={() => handleEdit(task.notaId)} className='mr-2'>
                                        <FaRegEdit />
                                    </button>
                                    <button onClick={() => handleDelete(task.notaId)} className='mr-2'>
                                        <FaRegTrashCan />
                                    </button>
                                </div>
                            </div>
                            <p className='text-wrap'>{task.descripcion}</p>
                            <p className='mt-2'>{task.fecha}</p>
                            <div>
                                <button onClick={() => handleCheck(task.notaId)}>
                                    {task.status ? <MdDone className='bg-green-700 rounded-2xl w-5 h-5' /> :
                                    <IoIosCloseCircleOutline className='bg-red-600 rounded-2xl w-5 h-5' />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
