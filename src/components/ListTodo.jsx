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
    <div className="mt-8">
      {/* <h1 className="text-2xl font-bold mb-4">Manage Todo List</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {columns.map((col) => {
          const columnTasks = tasks.filter((task) => task?.columnId === col.id);
          const columnTaskIds = columnTasks.map((t) => t.id);

          return (
            <DroppableColumn key={col.id} column={col}>
              <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="font-bold text-gray-700 text-lg">
                  {col.title}
                </h2>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                  {columnTasks.length}
                </span>
              </div>

              <SortableContext
                items={columnTaskIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[200px]">
                  {columnTasks.map((task, index) => (
                    <div key={task.id} className="relative group">
                      <TaskItem task={task} />

                      {/* Tombol delete & edit - only show on hover (group-hover) */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleEdit(task, index)}
                          className="text-gray-400 hover:text-blue-500 bg-white rounded-full p-1 shadow-sm border border-gray-200"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTodo(task.id)}
                          className="text-gray-400 hover:text-red-500 bg-white rounded-full p-1 shadow-sm border border-gray-200"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Form edit */}
                      {showEdit === index && (
                        <div className="absolute inset-0 z-10 bg-white p-3 rounded-lg border border-blue-200 shadow-md flex flex-col gap-2">
                          <input
                            type="text"
                            name="title"
                            value={editTask.title}
                            autoFocus
                            placeholder="Edit title"
                            onChange={handleEdit}
                            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit(task, editTask);
                                if (e.key === 'Escape') toggleEdit(null, null);
                            }}
                          />
                          <div className="flex gap-2 justify-end">
                             <button
                              className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-200"
                              onClick={() => toggleEdit(null, null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600"
                              onClick={() => saveEdit(task, editTask)}
                            >
                              Save
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
