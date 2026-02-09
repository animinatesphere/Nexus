
import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, Tag } from 'lucide-react'

export default function KanbanCard({ task, isOverlay }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group relative flex cursor-grab flex-col gap-3 border-l-4 bg-zinc-900 p-4 shadow-md transition-all
        ${isOverlay ? 'rotate-2 scale-105 shadow-xl ring-2 ring-yellow-400 z-50 cursor-grabbing' : 'hover:border-yellow-400 hover:bg-zinc-800'}
        ${isDragging ? 'opacity-30' : 'opacity-100'}
        ${task.status === 'done' ? 'border-green-600 opacity-60' : 'border-zinc-700'}
      `}
    >
      <div className="flex items-start justify-between">
         <h4 className={`font-bold uppercase tracking-wide text-sm text-white ${task.status === 'done' && 'line-through'}`}>
            {task.title}
         </h4>

         <span className={`px-1.5 py-0.5 text-[10px] font-black uppercase ${
            task.priority === 'high' ? 'text-red-500 bg-red-900/20' :
            task.priority === 'medium' ? 'text-yellow-500 bg-yellow-900/20' :
            'text-blue-500 bg-blue-900/20'
         }`}>
            {task.priority}
         </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 font-mono">
        <span className="truncate max-w-[120px] uppercase">
             {task.projects?.name || 'No Ops'}
        </span>
        {task.due_date && (
            <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(task.due_date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
            </span>
        )}
      </div>
    </div>
  )
}
