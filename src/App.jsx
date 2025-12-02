import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

function TaskItem({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <p className="text-gray-800 font-medium">{task.title}</p>
    </div>
  );
}

function App() {
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
    setEditTask(item);
  };

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setEditTask({ ...editTask, [name]: value });
  };

  const handleNewTask = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const submitNewTask = (e) => {
    e.preventDefault();
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        ...newTask,
      },
    ]);
    setNewTask({
      title: "",
    });
  };

  const saveEditTask = (task, newTask) => {
    const findTask = tasks.some((tas) => tas?.id == task?.id);

    if (findTask) {
      const updateTask = tasks.map((tas) => {
        return task.id == tas.id
          ? {
              ...tas,
              ...newTask,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          My Kanban Board
        </h1>

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
          <form onSubmit={submitNewTask} className="mb-6">
            <input
              type="text"
              name="title"
              value={newTask.title}
              placeholder="input title"
              onChange={handleNewTask}
              className="border p-2 mr-2"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">
              submit
            </button>
          </form>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((col) => {
              const columnTasks = tasks.filter(
                (task) => task?.columnId === col.id
              );
              const columnTaskIds = columnTasks.map((t) => t.id);

              return (
                <div
                  key={col.id}
                  className="bg-gray-100 rounded-xl p-4 min-w-80 shadow-sm"
                >
                  <h2 className="font-bold text-lg text-gray-700 mb-4 px-2">
                    {col.title} ({columnTasks.length})
                  </h2>

                  <SortableContext
                    items={columnTaskIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3 min-h-96">
                      {columnTasks.map((task, index) => (
                        <div key={task.id} className="relative">
                          <TaskItem task={task} />

                          {/* Tombol delete */}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="absolute top-2 right-2 text-red-500"
                          >
                            ✕
                          </button>
                          <button
                            onClick={() => toggleEdit(task, index)}
                            className="absolute top-2 right-2 text-red-500"
                          >
                            Edit
                          </button>
                          {showEdit == index ? (
                            <div>
                              <input
                                type="text"
                                name="id"
                                value={editTask.id}
                                placeholder="input new id"
                                onChange={handleEdit}
                                className="border p-2 mr-2"
                              />
                              <input
                                type="text"
                                name="title"
                                value={editTask.title}
                                placeholder="input title"
                                onChange={handleEdit}
                                className="border p-2 mr-2"
                              />
                              <button
                                className="bg-blue-500 text-white px-4 py-2"
                                onClick={() => saveEditTask(task, editTask)}
                              >
                                Save Edit
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>
        </DndContext>
      </div>
    </div>
  );
}

export default App;
