import { useSortable } from "@dnd-kit/sortable";

export function DroppableColumn({ column, children }) {
  const { setNodeRef } = useSortable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100/80 rounded-xl p-4 w-full h-full flex flex-col"
    >
      {children}
    </div>
  );
}
