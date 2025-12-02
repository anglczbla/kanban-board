import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// TaskItem Component
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

export default TaskItem;
