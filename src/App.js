import './App.css';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast'
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function App() {
  const [openCard,setOpenCard] = useState(false)
  const [editId, setEditId] = useState(null)

  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [status, setStatus] = useState("Active")

  const [filter, setFilter] = useState("All")

  const [data,setData] = useState([])
  
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

  const handleDelete = (item) => {
    setData((prev) => prev.filter((task) => task.id !== item.id))
  }

  const handleNew = () => {
    setTitle("")
    setDescription("")
    setStatus("Active")
    setOpenCard(true)
    setEditId(null)
  }

  const filteredData = filter === "All" ? data : data.filter((item) => item.status === filter)

  const handleClearCompleted = () => {
    const completedTasks = data.filter((item) => item.status === "Completed")

    if(completedTasks.length === 0) {
      return toast.error("No completed tasks to clear")
    }

    setData((prev) => prev.filter((item) => item.status !== "Completed"))

    toast.success("Completed tasks cleared!");
  }

  return (
    <div className='min-h-screen bg-gray-100 p-6 select-none'>
      <Toaster position="top-center"/>
      <div className='flex flex-col items-center justify-center'>
          <header>
            <h1 className='text-5xl font-bold mt-10 select-none'>Todo List App</h1>
          </header>
          <div className='mt-5 bg-blue-200 w-1/2 p-5 rounded-full'>
        <div className='flex justify-end mr-10'>
          <p onClick={() => handleNew()} className='bg-blue-400 text-3xl px-4 py-2 rounded-full cursor-pointer select-none'>
            New
          </p>
        </div>
        {
          openCard && 
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 select-none p-4">
  <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-xl">
    <h2 className="mb-6 text-2xl font-bold text-gray-800">
      Create Task
    </h2>

    <div className="mb-5">
      <label className="mb-2 block text-lg font-medium text-gray-700">
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
      <label className="mb-2 block text-lg font-medium text-gray-700">
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
      <label className="mb-3 block text-lg font-medium text-gray-700">
        Status
      </label>

      <div className="flex gap-3">
        <button
          value={status}
          onClick={() => setStatus("Active")}
          className={`rounded-full border px-5 py-2 ${status === "Active" ? "border-red-500 bg-red-100  text-red-700" : ""}`}
        >
          Active
        </button>

        <button
          value={status}
          onClick={() => setStatus("Completed")}
          className={`rounded-full border px-5 py-2 ${status === "Completed" ? "border-green-500 bg-green-100  text-green-700" : ""} `}>
          Completed
        </button>
      </div>
    </div>

    <div className="flex justify-end gap-3">
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
      </div>
      <div className='flex gap-5'>
        <p onClick={() => setFilter("All")} className='border px-5 py-2 border-rounded rounded-full mt-5 shadow-md text-2xl select-none cursor-pointer'>All</p>
        <p onClick={() => setFilter("Active")} className='border px-5 py-2 border-rounded rounded-full mt-5 shadow-md text-2xl select-none cursor-pointer'>Active</p>
        <p onClick={() => setFilter("Completed")} className='border px-5 py-2 border-rounded rounded-full mt-5 shadow-md text-2xl select-none cursor-pointer'>Completed</p>
        <p onClick={() => handleClearCompleted()} className='border px-5 py-2 border-rounded rounded-full mt-5 shadow-md text-2xl select-none cursor-pointer bg-red-200 text-red-800'>Clear Completed</p>
        <p className='border px-5 py-2 border-rounded rounded-full mt-5 shadow-md text-2xl select-none cursor-pointer '>{filteredData.length}</p>  
      </div>

      { filteredData.length === 0 &&
        <>
         <p className="mt-10 text-gray-500 text-2xl select-none">
        Add a new task and get things done!
      </p>

      <button
        onClick={handleNew}
        className="mt-10 rounded-lg bg-blue-600 px-5 py-2 text-white select-none text-2xl"
      >
        + Add Task
      </button>
        </>
      }
      <div className="mt-10 w-1/2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((item) => (
            <div
              key={item.id}
              onDoubleClick={() => handleEdit(item)}
              className="rounded-xl border bg-white p-6 shadow-md"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-gray-800">
                  {item.title}
                </h3>

                <span className={`rounded-full px-3 py-1 text-xs font-medium  ${item.status === "Active" ? "text-red-700 bg-red-100" : "text-green-700 bg-green-100"}`}>
                  {item.status}
                </span>
              </div>

              <p className="text-gray-500">
                {item.description}
              </p>

              <div className='mt-5 flex items-center justify-between'>
              <FaPencilAlt onClick={() => handleEdit(item)} className='cursor-pointer' size={18} />
              <MdDelete onClick={() => handleDelete(item)} className='cursor-pointer' size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
