import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskItem from "./DragnDrop";
import { DroppableColumn } from "./DropableColumn";

function ListTodo({
  columns,
  tasks,
  deleteTodo,
  editTask,
  saveEdit,
  toggleEdit,
  handleEdit,
  showEdit,
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Todo List</h1>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((col) => {
          const columnTasks = tasks.filter((task) => task?.columnId === col.id);
          const columnTaskIds = columnTasks.map((t) => t.id);

          return (
            <DroppableColumn key={col.id} column={col}>
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

                      {/* Tombol delete & edit */}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => toggleEdit(task, index)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTodo(task.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Form edit */}
                      {showEdit === index && (
                        <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-300">
                          <input
                            type="text"
                            name="title"
                            value={editTask.title}
                            placeholder="Edit title"
                            onChange={handleEdit}
                            className="border p-2 mr-2 w-full mb-2 rounded"
                          />
                          <div className="flex gap-2">
                            <button
                              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                              onClick={() => saveEdit(task, editTask)}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                              onClick={() => toggleEdit(null, null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DroppableColumn>
          );
        })}
      </div>
    </div>
  );
}

export default ListTodo;
