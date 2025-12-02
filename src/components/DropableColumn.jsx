import { useSortable } from "@dnd-kit/sortable";
export function DroppableColumn({ column, children }) {
  const { setNodeRef } = useSortable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 rounded-xl p-4 min-w-80 shadow-sm"
    >
      {children}
    </div>
  );
}
