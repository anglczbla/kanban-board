import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListTodo from "./ListTodo";

import { SortableContext } from "@dnd-kit/sortable";
import axiosInstance from "../auth/api";
function TodoForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BE_URL;
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

    // Cek apakah drop ke column langsung
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

  // Gabungkan column IDs dengan task IDs untuk droppable areas
  const allDroppableIds = [
    ...columns.map((col) => col.id),
    ...tasks.map((task) => task.id),
  ];

  const logoutUser = useMutation({
    mutationFn: () => {
      return axiosInstance.post("/users/logout");
    },
    onSuccess: () => {
      alert("logout success");
      navigate("/");
      queryClient.invalidateQueries({ queryKey: ["logout"] });
    },
    onError: (error) => {
      console.error(error);
      alert("logout failed");
    },
  });

  const logout = () => {
    logoutUser.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          My Kanban Board
        </h1>

        <button onClick={logout}>Logout</button>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <DragOverlay>
            {activeTask ? (
              <div className="bg-white p-4 rounded-lg shadow-2xl border border-gray-300 rotate-3 opacity-95">
                <p className="font-semibold text-gray-800">
                  {activeTask.title}
                </p>
              </div>
            ) : null}
          </DragOverlay>

          {/* Form tambah task */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <div className="flex gap-2">
              <input
                type="text"
                name="title"
                value={newTask.title}
                placeholder="Add new task..."
                onChange={handleNewTask}
                onKeyDown={(e) => e.key === "Enter" && submitNewTask()}
                className="border p-2 flex-1 rounded"
              />
              <select
                name="columnId"
                value={newTask.columnId}
                onChange={handleNewTask}
                className="border p-2 rounded"
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
              <button
                onClick={submitNewTask}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
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
