import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, title, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between bg-white border rounded-lg p-3 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 select-none"
        >
          ⠿
        </span>
        <span>{title}</span>
      </div>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Delete
      </button>
    </div>
  );
};

export default SortableItem;