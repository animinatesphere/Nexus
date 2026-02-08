
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
    opacity: isDragging ? 0.3 : 1,
  }

  const priorityColor = {
    high: 'text-red-400 bg-red-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    low: 'text-blue-400 bg-blue-400/10',
  }

  if (isOverlay) {
    return (
        <div className="cursor-grabbing rounded-lg border border-primary/50 bg-zinc-800 p-4 shadow-2xl rotate-3">
             <h4 className="font-medium text-white">{task.title}</h4>
        </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group cursor-grab rounded-lg border border-white/5 bg-zinc-800/80 p-4 shadow-sm transition-all hover:border-white/10 hover:shadow-md active:cursor-grabbing"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
         <h4 className="text-sm font-medium text-zinc-100 line-clamp-2">{task.title}</h4>
      </div>

      <div className="flex items-center gap-2 mt-3">
        {task.priority && (
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${priorityColor[task.priority] || priorityColor.medium}`}>
                {task.priority}
            </span>
        )}
        {task.due_date && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
        )}
      </div>
      
      {task.projects && (
           <div className="mt-2 flex items-center gap-1 text-[10px] text-zinc-500 border-t border-white/5 pt-2">
                <Tag className="h-3 w-3" />
                <span className="truncate">{task.projects.name}</span>
           </div>
      )}
    </div>
  )
}
