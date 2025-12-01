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
    id: "",
    title: "",
    columnId: "",
  });

  const [activeTask, setActiveTask] = useState(null);

  const handleNewTask = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const submitNewTask = (e) => {
    e.preventDefault();
    setTasks([...tasks, newTask]);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const draggedTask = tasks.find((t) => t.id === active.id);
    setActiveTask(draggedTask);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const draggedTaskId = active.id;
    const droppedOverId = over.id;

    // Cek apakah drop di atas kolom (bukan task lain)
    const targetColumn = columns.find((col) => col.id === droppedOverId);
    const targetColumnId = targetColumn
      ? targetColumn.id
      : tasks.find((t) => t.id === droppedOverId)?.columnId;

    if (
      targetColumnId &&
      targetColumnId !== active.data.current?.sortable?.containerId
    ) {
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

          <form onSubmit={submitNewTask}>
            <input
              type="text"
              name="id"
              value={newTask.id}
              placeholder="input new id"
              onChange={handleNewTask}
            />
            <input
              type="text"
              name="title"
              value={newTask.title}
              placeholder="input title"
              onChange={handleNewTask}
            />
            <input
              type="text"
              name="columnId"
              value={newTask.columnId}
              placeholder="input column id"
              onChange={handleNewTask}
            />
            <button type="submit">submit</button>
          </form>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((col) => {
              const columnTasks = tasks
                .filter((task) => task.columnId === col.id)
                .map((task) => task.id);

              return (
                <div
                  key={col.id}
                  className="bg-gray-100 rounded-xl p-4 min-w-80 shadow-sm"
                  id={col.id}
                >
                  <h2 className="font-bold text-lg text-gray-700 mb-4 px-2">
                    {col.title} ({columnTasks.length})
                  </h2>

                  <SortableContext
                    items={columnTasks}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3 min-h-96">
                      {tasks
                        .filter((task) => task.columnId === col.id)
                        .map((task) => (
                          <TaskItem key={task.id} task={task} />
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
