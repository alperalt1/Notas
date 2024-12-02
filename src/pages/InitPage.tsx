import { useEffect, useState } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import axios from 'axios';

interface Task {
    id: number;
    tarea: string;
    descripcion: string;
    status: boolean;
    fecha: string;
}

export default function InitPage() {
    const [contadorID, setContadorID] = useState<number>(0);
    const [task, setTask] = useState<Task>({
        id: contadorID,
        tarea: '',
        descripcion: '',
        status: false,
        fecha: '',
    });

    const [tasklist, setTaskList] = useState<Task[]>([]);

    // const getSavedTasks = () => {
    //     const storedTasks = localStorage.getItem("task");
    //     if (storedTasks) {
    //         try {
    //             const parsedTasks: Task[] = JSON.parse(storedTasks);
    //             setTaskList(parsedTasks);
    //             console.log('tasks', parsedTasks)
    //             const lastTaskID = parsedTasks.length > 0 ? parsedTasks[parsedTasks.length - 1].id : 0;
    //             console.log('lastIndex', lastTaskID)
    //             setContadorID(lastTaskID + 1); // Sumar 1 para el siguiente ID
    //         } catch (error) {
    //             console.error("Error al leer el localStorage:", error);
    //         }
    //     }
    // }

    const sendTaskToServer = async (newTask: Omit<Task, 'id'>) => {
        try {
            const response = await axios.post('http://localhost:5053/api/notas', newTask, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Tarea enviada correctamente:', response.data);
        } catch (error: any) {
            console.error('Error de red al enviar tarea:', error.response?.data || error.message);
        }
    };

    const getTaskToServer = async () => {
        try {
            const response = await axios.get('http://localhost:5053/api/notas/GetNotas');
            const maxId = response.data.length > 0 
                ? Math.max(...response.data.map((task: Task) => task.id)) 
                : 0; 
            setContadorID(maxId + 1);
            setTaskList(response.data);
        } catch (error: any) {
            console.error('Error al obtener las tareas:', error.response?.data || error.message);
        }
    }
    useEffect(() => {
        getTaskToServer();  // Llamamos a la función cuando el componente se monta
    }, []);
    const [editbutton, setEditButton] = useState<boolean>(false);
    // Manejo de formulario
    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (editbutton) {
            setTaskList(prevtasklist => prevtasklist.map(taskitem => taskitem.id === task.id ? { ...taskitem, ...task } : taskitem));
            setEditButton(false);
        } else {
            const { id, ...newTask } = task;
            const newTaskWithId = { id: contadorID, ...newTask };

            // Incrementamos el contadorID para el próximo id
            setContadorID(prevID => prevID + 1);

            // Agregamos la nueva tarea a la lista
            setTaskList(prevtasklist => [
                ...prevtasklist,
                newTaskWithId,
            ]);

            // Enviamos la tarea al servidor
            sendTaskToServer(newTaskWithId);
        }
        setTask({
            id: 0,
            tarea: '',
            descripcion: '',
            status: false,
            fecha: '',
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTask(prevtask => ({
            ...prevtask,
            [name]: value,
        }));
    };

    // Botón eliminar
    const handleDelete = (id: number) => {
        setTaskList(prevTaskList => prevTaskList.filter(taskitem => taskitem.id !== id));
    };

    // Botón editar
    const handleEdit = (id: number) => {
        const newTask = tasklist.find(taskitem => taskitem.id === id);
        setEditButton(true);
        if (newTask) {
            setTask({ ...newTask });
        }
    };

    // Botón marcar tarea como completada
    const handleCheck = (id: number) => {
        setTaskList(prevtasklist =>
            prevtasklist.map(t =>
                t.id === id ? { ...t, status: !t.status } : t
            )
        );
    };

    // useEffect(() => {
    //     getSavedTasks()


    // }, []);

    // useEffect(() => {
    //     if (tasklist.length > 0) {
    //         localStorage.setItem("task", JSON.stringify(tasklist));
    //     }
    // }, [tasklist]);

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
                    {tasklist.map((tasks, index) => (
                        <div key={index} className="border-2 rounded w-full h-44 mb-2 px-2 pb-3">
                            <div className='flex flex-row justify-between font-semibold mt-2'>
                                <div>{tasks.id}</div>
                                {tasks.tarea}
                                <div>
                                    <button onClick={() => handleEdit(tasks.id)} className='mr-2'>
                                        <FaRegEdit />
                                    </button>
                                    <button onClick={() => handleDelete(tasks.id)} className='mr-2'>
                                        <FaRegTrashCan />
                                    </button>
                                </div>
                            </div>
                            <p className='text-wrap'>{tasks.descripcion}</p>
                            <p className='mt-2'>
                                {tasks.fecha}

                            </p>
                            <div>
                                <button onClick={() => handleCheck(tasks.id)}>
                                    {tasks.status ?
                                        <MdDone className='bg-green-700 rounded-2xl w-5 h-5' /> :
                                        <IoIosCloseCircleOutline className='bg-red-600 rounded-2xl w-5 h-5' />
                                    }
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}