import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListTodo from "./ListTodo";

function TodoForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [columns] = useState([
    { id: "col-1", title: "To Do" },
    { id: "col-2", title: "Doing" },
    { id: "col-3", title: "Done" },
  ]);

  const [tasks, setTasks] = useState([
    { id: "task-1", title: "Belajar dnd-kit", columnId: "col-1" },
    { id: "task-2", title: "Bikin Kanban Board", columnId: "col-1" },
    { id: "task-3", title: "Nonton tutorial", columnId: "col-2" },
    { id: "task-4", title: "Selesai & bangga", columnId: "col-3" },
    { id: "task-5", title: "Minum kopi", columnId: "col-1" },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    columnId: "col-1",
  });

  const [editTask, setEditTask] = useState({
    id: "",
    title: "",
  });

  const [showEdit, setShowEdit] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const toggleEdit = (item, index) => {
    setShowEdit(index);
    if (item) {
      setEditTask(item);
    }
  };

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setEditTask({ ...editTask, [name]: value });
  };

  const handleNewTask = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const submitNewTask = () => {
    if (!newTask.title.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        ...newTask,
      },
    ]);
    setNewTask({
      title: "",
      columnId: "col-1",
    });
  };

  const saveEditTask = (task, newTask) => {
    const findTask = tasks.some((tas) => tas?.id === task?.id);

    if (findTask) {
      const updateTask = tasks.map((tas) => {
        return task.id === tas.id
          ? {
              ...tas,
              title: newTask.title,
            }
          : tas;
      });
      setTasks(updateTask);
      setShowEdit(null);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = ({ active }) => {
    const draggedTask = tasks.find((t) => t.id === active.id);
    setActiveTask(draggedTask);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const draggedTaskId = active.id;
    const droppedOverId = over.id;

    // cek apakah drop ke column langsung
    const targetColumn = columns.find((col) => col.id === droppedOverId);
    const targetColumnId = targetColumn
      ? targetColumn.id
      : tasks.find((t) => t.id === droppedOverId)?.columnId;

    if (targetColumnId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === draggedTaskId
            ? { ...task, columnId: targetColumnId }
            : task
        )
      );
    }

    setActiveTask(null);
  };

  // gabungkan column IDs dengan task IDs untuk droppable areas
  const allDroppableIds = [
    ...columns.map((col) => col.id),
    ...tasks.map((task) => task.id),
  ];

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert("logout success");
    navigate("/");
    queryClient.clear();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">My Kanban Board</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <DragOverlay>
            {activeTask ? (
              <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 rotate-2 cursor-grabbing">
                <p className="font-medium text-gray-800">{activeTask.title}</p>
              </div>
            ) : null}
          </DragOverlay>

          {/* Form tambah task */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Add New Task
            </h3>
            <div className="flex gap-4">
              <input
                type="text"
                name="title"
                value={newTask.title}
                placeholder="What needs to be done?"
                onChange={handleNewTask}
                onKeyDown={(e) => e.key === "Enter" && submitNewTask()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <select
                name="columnId"
                value={newTask.columnId}
                onChange={handleNewTask}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
              <button
                onClick={submitNewTask}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>

          <SortableContext items={allDroppableIds}>
            <ListTodo
              columns={columns}
              tasks={tasks}
              deleteTodo={deleteTask}
              editTask={editTask}
              saveEdit={saveEditTask}
              toggleEdit={toggleEdit}
              handleEdit={handleEdit}
              showEdit={showEdit}
            />
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default TodoForm;
