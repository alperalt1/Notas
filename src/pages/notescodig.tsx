    //localStorage codigo para guardar en memoria
    // const [datetask, setDateTask] = useState(() => {
    //     const defaultDate = dayjs();
    //     const saved = localStorage.getItem('datetask');
    //     if (saved !== null) {
    //         values.fecha = saved;
    //         return dayjs(saved);
    //     } else {
    //         return defaultDate?.format('DD/MM/YYYY');
    //     }
    // }
    // );

    // const [nametask, SetNameTask] = useState(() => {
    //     const saved = localStorage.getItem('nametask');
    //     return saved || "";
    // }
    // );

    // const [descriptiontask, SetDescriptionTask] = useState(() => {
    //     const saved = localStorage.getItem('descriptiontask');
    //     return saved || "";
    // }
    // );


    import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import { MdDone } from 'react-icons/md';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface Task {
  id: number;
  tarea: string;
  descripcion: string;
  fecha: Dayjs | null;
  state: boolean;
}

export default function InitPage() {
  const [values, setValues] = useState<Task>({
    id: 0,
    tarea: '',
    descripcion: '',
    fecha: null,
    state: false,
  });

  // Recuperar las tareas desde localStorage al cargar la página
  const [task, setTask] = useState<Array<Task>>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Guardar tareas en localStorage cada vez que el estado 'task' cambie
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(task));
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (values.id === 0) {
      // Crear tarea
      setTask((prevTasks) => [
        ...prevTasks,
        { ...values, id: prevTasks.length + 1, fecha: values.fecha || null },
      ]);
    } else {
      // Actualizar tarea
      setTask((prevTasks) =>
        prevTasks.map((t) => (t.id === values.id ? { ...t, ...values } : t))
      );
    }

    // Resetear valores después de crear o actualizar
    setValues({
      id: 0,
      tarea: '',
      descripcion: '',
      fecha: null,
      state: false,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleDelete = (id: number) => {
    setTask((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleEdit = (id: number) => {
    const taskToUpdate = task.find((task) => task.id === id);
    if (taskToUpdate) {
      setValues({
        ...taskToUpdate,
      });
    }
  };

  const handleToggleState = (id: number) => {
    setTask((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id ? { ...t, state: !t.state } : t
      )
    );
  };

  return (
    <div className="h-screen p-6">
      <div className="flex justify-center items-center w-full font-bold">Notas</div>
      <div className="flex flex-row p-8 h-full">
        <div className="border-2 rounded p-4 mr-5 h-2/3 w-1/2">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="font-semibold">Tarea</label>
            <input
              id="tarea"
              maxLength={60}
              required
              type="text"
              name="tarea"
              value={values.tarea}
              onChange={handleChange}
              className="border-2 rounded p-2 h-10 w-full"
            />
            <label className="font-semibold">Descripción de la Tarea</label>
            <textarea
              id="descripcion"
              maxLength={200}
              required
              name="descripcion"
              value={values.descripcion}
              onChange={handleChange}
              className="border-2 rounded resize-none p-2 h-24 w-full"
            />
            <label className="font-semibold">Fecha</label>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={{ textField: { size: 'small' } }}
                  value={values.fecha}
                  onChange={(newDate: Dayjs | null) => {
                    setValues((prevValue) => ({
                      ...prevValue,
                      fecha: newDate,
                    }));
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className="justify-center text-center">
              <button
                type="submit"
                className="border-2 rounded-md bg-slate-400 m-4 h-10 w-32"
              >
                {values.id === 0 ? 'Crear Tarea' : 'Actualizar Tarea'}
              </button>
            </div>
          </form>
        </div>
        <div className="border-2 rounded bg-scroll p-4 h-full max-h-screen overflow-y-auto flex flex-col flex-grow w-1/2">
          {task.map((tasks, index) => (
            <div key={index} className="border-2 rounded w-full h-44 mb-2 px-2 pb-3">
              <div className="flex flex-row justify-between font-semibold mt-2">
                {tasks.tarea}
                <div>
                  <button onClick={() => handleToggleState(tasks.id)}>
                    {tasks.state ? (
                      <MdDone className="bg-green-700 rounded-2xl w-5 h-5" />
                    ) : (
                      <IoIosCloseCircleOutline className="bg-red-600 rounded-2xl w-5 h-5" />
                    )}
                  </button>
                  <button onClick={() => handleEdit(tasks.id)} className="mr-2">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(tasks.id)} className="mr-2">
                    Eliminar
                  </button>
                </div>
              </div>
              <p className="text-wrap">{tasks.descripcion}</p>
              <p className="mt-2">
                {tasks.fecha ? tasks.fecha.format('DD/MM/YYYY') : 'Sin fecha'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}