import './App.css';
import { useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast'
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TiTick } from "react-icons/ti";

function App() {
  const [openCard,setOpenCard] = useState(false)
  const [editId, setEditId] = useState(null)

  const draggedId = useRef(null);

  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [status, setStatus] = useState("Active")

  const [filter, setFilter] = useState("All")

  const [data,setData] = useState([])

  const [openDeleteCard, setOpenDeleteCard] = useState(false)
  const [deleteId,setDeleteId] = useState(null)
  
  const handleSave = () => {
    if(!title.trim()){
      return toast.error("Please enter the title")
    }

    if(!description.trim()){
      return toast.error("Please enter the description")
    }

    if(editId !== null){
      setData((prev) => prev.map((item) => 
        item.id === editId ? {...item, title, description, status} : item
      ))

      toast.success("Task updated successfully")
    } else {
    const newTask = {
      id : Date.now(),
      title : title,
      description : description,
      status : status
    }

    setData((prev) => [...prev,newTask])

    toast.success("Task created successfully")
    }

    setTitle("")
    setDescription("")
    setStatus("Active")
    setOpenCard(false)
    setEditId(null)
  }

  const handleEdit = (item) => {
    setOpenCard(true)
    setEditId(item.id)
    setTitle(item.title)
    setDescription(item.description)
    setStatus(item.status)

  }

  const handleDelete = () => {
    setData((prev) => prev.filter((task) => task.id !== deleteId))

    setOpenDeleteCard(false)
    setDeleteId(null)

    toast.success("Task deleted sucessfully")
  }

  const handleNew = () => {
    setTitle("")
    setDescription("")
    setStatus("Active")
    setOpenCard(true)
    setEditId(null)
  }

  const filteredData = filter === "All" ? data : data.filter((item) => item.status === filter)

  const allCount = data.length

  const activeCount = data.filter((item) => item.status === "Active").length

  const completedCount = data.filter((item) => item.status === "Completed").length

  const handleClearCompleted = () => {
    const completedTasks = data.filter((item) => item.status === "Completed")

    if(completedTasks.length === 0) {
      return toast.error("No completed tasks to clear")
    }

    setData((prev) => prev.filter((item) => item.status !== "Completed"))

    toast.success("Completed tasks cleared!");
  }

  const handleComplete = (item) => {
    if (item.status === "Completed") {
    return toast.error("Task is already completed");
  }

    setData((prev) => prev.map((task) => task.id === item.id ? {...task, status : "Completed"} : task))
    toast.success("Task completed successfully")
  }

  return (
    <div className='min-h-screen bg-gray-100 px-3 py-5 sm:px-6 sm:py-6 lg:px-10 select-none'>
      <Toaster position="top-center"/>
      <div className='mx-auto flex w-full max-w-6xl flex-col items-center justify-center'>
          <header className="text-center">
            <h1 className="mt-6 text-3xl font-bold sm:mt-10 sm:text-4xl lg:text-5xl">Todo List App</h1>
          </header>
          <div className='mt-5 w-full rounded-2xl bg-blue-200 p-3 sm:p-5'>
        <div className='flex justify-end'>
          <p onClick={() => handleNew()} className='bg-blue-400 text-xl px-4 py-2 rounded-full cursor-pointer select-none sm:text-2xl'>
            New
          </p>
        </div>
        {
          openCard && 
          <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/50 select-none p-3 sm:p-4">
  <div className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-4 shadow-xl sm:p-8">
    <h2 className="mb-6 text-xl font-bold text-gray-800 sm:text-2xl">
      Create Task
    </h2>

    <div className="mb-5">
      <label className="mb-2 block text-base font-medium text-gray-700 sm:text-lg">
        Title
      </label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        placeholder="Enter title"
        className="w-full rounded-lg border border-gray-300 p-3 text-black outline-none"
      />
    </div>

    <div className="mb-5">
      <label className="mb-2 block text-base font-medium text-gray-700 sm:text-lg">
        Description
      </label>
      <textarea
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full resize-none rounded-lg border border-gray-300 p-3 text-black outline-none"
      />
    </div>

    <div className="mb-7">
      <label className="mb-3 block text-base font-medium text-gray-700 sm:text-lg">
        Status
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          value={status}
          onClick={() => setStatus("Active")}
          className={`rounded-full border px-4 py-2 sm:px-5 ${status === "Active" ? "border-red-500 bg-red-100 text-red-700" : ""}`}
        >
          Active
        </button>

        <button
          value={status}
          onClick={() => setStatus("Completed")}
          className={`rounded-full border px-4 py-2 sm:px-5 ${status === "Completed" ? "border-green-500 bg-green-100 text-green-700" : ""} `}>
          Completed
        </button>
      </div>
    </div>

    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        onClick={() => setOpenCard(false)}
        className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100"
      >
        Cancel
      </button>

      <button
        onClick={() => handleSave()}
        className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
      >
        {editId ? "Update" : "Save"}
      </button>
    </div>
  </div>
</div>
  }
{openDeleteCard && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
    <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl sm:p-6">
      <h2 className="text-xl font-bold text-gray-800">
        Delete Task
      </h2>

      <p className="mt-3 text-gray-600">
        Are you sure you want to delete this task?
      </p>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          onClick={() => {
            setOpenDeleteCard(false);
            setDeleteId(null);
          }}
          className="rounded-lg border px-4 py-2 text-gray-700"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
      </div>
      <div className='mt-5 flex w-full flex-wrap justify-center gap-3 sm:gap-5'>
        <p onClick={() => setFilter("All")} className='border px-4 py-2 rounded-full shadow-md text-base sm:px-5 sm:text-xl lg:text-2xl select-none cursor-pointer'>All {allCount}</p>
        <p onClick={() => setFilter("Active")} className='border px-4 py-2 rounded-full shadow-md text-base sm:px-5 sm:text-xl lg:text-2xl select-none cursor-pointer'>Active {activeCount}</p>
        <p onClick={() => setFilter("Completed")} className='border px-4 py-2 rounded-full shadow-md text-base sm:px-5 sm:text-xl lg:text-2xl select-none cursor-pointer'>Completed {completedCount}</p>
        <p onClick={() => handleClearCompleted()} className='border px-4 py-2 rounded-full shadow-md text-base sm:px-5 sm:text-xl lg:text-2xl select-none cursor-pointer bg-red-200 text-red-800'>Clear Completed</p>
      </div>

      { filteredData.length === 0 &&
        <>
         <p className="mt-8 px-2 text-center text-lg text-gray-500 sm:mt-10 sm:text-xl lg:text-2xl select-none">
        {
          filter === "Completed" ?  "No completed tasks" : filter === "Active" ? "No active tasks" : "No tasks yet. Add a new task and get things done!"
        }
      </p>

      <button
        onClick={handleNew}
        className="mt-6 rounded-lg bg-blue-600 px-5 py-2 text-lg text-white select-none sm:mt-10 sm:text-xl lg:text-2xl"
      >
        + Add Task
      </button>
        </>
      }
      <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {filteredData.map((item) => (
            <div
              key={item.id}
              draggable={true}
            onDragStart={() => { draggedId.current = item.id }}
            onDragOver={(event) => { event.preventDefault();}}
            onDrop={() => { const oldIndex = data.findIndex(
                (task) => task.id === draggedId.current
              );

              const newIndex = data.findIndex(
                (task) => task.id === item.id
              );

              if (oldIndex === -1 || newIndex === -1) return;

              const updatedData = [...data];

              const [draggedTask] = updatedData.splice(oldIndex, 1);

              updatedData.splice(newIndex, 0, draggedTask);

              setData(updatedData);

              draggedId.current = null;
            }}
            onDragEnd={() => {
              draggedId.current = null;
            }}
              className="min-w-0 rounded-xl border bg-white p-4 shadow-md sm:p-6"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="min-w-0 break-words text-lg font-bold text-gray-800 sm:text-xl">
                  {item.title}
                </h3>

                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${item.status === "Active" ? "text-red-700 bg-red-100" : "text-green-700 bg-green-100"}`}>
                  {item.status === "Active" ? "Active" : "Completed"}
                </span>
              </div>

              <p className="break-words whitespace-pre-wrap text-sm text-gray-500 sm:text-base">
                {item.description}
              </p>

              <div className='mt-5 flex items-center justify-between'>
              <FaPencilAlt onClick={() => handleEdit(item)} className='cursor-pointer' size={18} />
              <TiTick onClick={() => handleComplete(item)} size={30} className={`cursor-pointer ${
              item.status === "Completed" ? "text-green-500" : "text-gray-500" }`}/>
              <MdDelete onClick={() => {
                setDeleteId(item.id)
                setOpenDeleteCard(true)
              }} className='cursor-pointer' size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;