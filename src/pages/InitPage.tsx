import { SetStateAction, useEffect, useState } from 'react';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs, { Dayjs } from 'dayjs';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import { DatePicker } from "react-datepicker";
interface Task {
    id: number;
    tarea: string;
    descripcion: string;
    state: boolean;
    fecha: null;
}


export default function InitPage() {

    

    const [contadorID, setContadorID] = useState<number>(0);
    const [task, setTask] = useState<Task>({
        id: contadorID,
        tarea: '',
        descripcion: '',
        state: false,
        fecha: null,
    });

    const [tasklist, setTaskList] = useState<Task[]>([]);

    const getSavedTasks = () => {
        const storedTasks = localStorage.getItem("task");
        if (storedTasks) {
            try {
                const parsedTasks: Task[] = JSON.parse(storedTasks);
                setTaskList(parsedTasks);
                console.log('tasks',parsedTasks )
                // Establecer el siguiente ID a partir de las tareas almacenadas
                const lastTaskID = parsedTasks.length > 0 ? parsedTasks[parsedTasks.length - 1].id : 0;
                console.log('lastIndex', lastTaskID)
                setContadorID(lastTaskID + 1); // Sumar 1 para el siguiente ID
            } catch (error) {
                console.error("Error al leer el localStorage:", error);
            }
        }
    }

    useEffect(() => {
        getSavedTasks()
    }, []); 

    // Sincronizar el estado de tasklist con localStorage cada vez que cambie
    useEffect(() => {
        if (tasklist.length > 0) {
            localStorage.setItem("task", JSON.stringify(tasklist));
        }
    }, [tasklist]);

    //manejo de boton para enviar tarea y editar tarea
    const [editbutton, setEditButton] = useState<boolean>(false);

    const [startDate, setStartDate] = useState(new Date());

    //manejos de eventos para enviar formularios, editar tarea y eliminar tarea
    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (editbutton) {
            setTaskList(prevtasklist => prevtasklist.map(taskitem => taskitem.id === task.id ? { ...taskitem, ...task } : taskitem))

            setEditButton(false);
        } else {
            setTaskList(prevtasklist => [
                ...prevtasklist,
                {
                    ...task,
                    id: contadorID
                }
            ]);
            setContadorID(prevID => prevID + 1);
        }
        setTask(
            {
                id: 0,
                tarea: '',
                descripcion: '',
                state: false,
                fecha: null,
            }
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTask(prevtask => ({
            ...prevtask,
            [name]: value,
        }));
    };

    //boton eliminar
    const handleDelete = (id: number) => {
        setTaskList(prevTaskList => prevTaskList.filter(taskitem => taskitem.id !== id));
    };

    //boton editar
    const handleEdit = (id: number) => {
        let newtasklist = tasklist.find(taskitem => taskitem.id === id);
        setEditButton(true);
        if (newtasklist) {
            setTask({
                ...newtasklist,
            });
        }
    };

    const handleCheck = (id: number) => {
        setTaskList(prevtasklist =>
            prevtasklist.map(t =>
                t.id === id ? { ...t, state: !t.state } : t
            )
        );
    };

    

    


    return (
        <div className='h-screen p-6'>
            <div className='flex justify-center items-center w-full font-bold'>Notas</div>
            <div className='flex flex-row p-8 h-full'>
                <div className='border-2 rounded p-4 mr-5 h-2/3 w-1/2' >
                    <form onSubmit={handleSubmit} className='flex flex-col'>
                        <label className='font-semibold'>
                            Tarea
                        </label>
                        <input maxLength={60} required type='text' name='tarea' value={task.tarea} onChange={handleChange} className='border-2 rounded p-2 h-10 w-full'>
                        </input>
                        <label className='font-semibold'>
                            Descripción de la Tarea
                        </label>
                        <textarea maxLength={200} required name='descripcion' value={task.descripcion} onChange={handleChange} className='border-2 rounded resize-none p-2 h-24 w-full'>
                        </textarea>
                        <label className='font-semibold'>
                            Fecha
                        </label>
                        <div>
                            <DatePicker selected={startDate} onChange={(date: SetStateAction<Date>) => setStartDate(date)} />
                        </div>
                        {/* <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker name='fecha' slotProps={{ textField: { size: 'small' } }} value={task.fecha ? moment(task.fecha) : null} onChange={(newDate: moment.Moment | null) => {
                                    setTask(prevtask => ({
                                        ...prevtask,
                                        fecha: newDate
                                    }))
                                }} />
                            </LocalizationProvider>
                        </div> */}

                        <div className='justify-center text-center '>
                            <button type='submit' className='border-2 rounded-md bg-slate-400 m-4 h-10 w-32' >
                                {
                                    editbutton ? "Editar Tarea" : "Enviar Tarea"
                                }
                            </button>
                        </div>
                    </form>
                </div >
                <div className='border-2 rounded bg-scroll p-4 h-full max-h-screen overflow-y-auto flex flex-col flex-grow w-1/2'>

                    {tasklist.map((tasks, index) => (
                        <div key={index} className="border-2 rounded w-full h-44 mb-2 px-2 pb-3">
                            {/* <h3>{index}</h3> */}
                            <div className='flex flex-row justify-between font-semibold mt-2'>
                                <div>
                                    {tasks.id}
                                </div>
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
                            {/* <p className='mt-2'>{tasks.fecha ? tasks.fecha.format('DD/MM/YYYY') : "Sin Fecha"}
                            </p> */}
                            <div>
                                <button onClick={() => handleCheck(tasks.id)}>
                                    {tasks.state ? <MdDone className='bg-green-700 rounded-2xl w-5 h-5' /> : <IoIosCloseCircleOutline className='bg-red-600 rounded-2xl w-5 h-5' />}
                                </button>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    )
}


