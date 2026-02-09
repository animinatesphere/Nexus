
import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import KanbanCard from './KanbanCard'

export default function KanbanColumn({ id, title, count, color, tasks }) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <SortableContext 
      id={id} 
      items={tasks.map(t => t.id)} 
      strategy={verticalListSortingStrategy}
    >
      <div 
        ref={setNodeRef}
        className="flex h-full w-80 shrink-0 flex-col rounded-none border-2 border-zinc-800 bg-black/50 backdrop-blur-sm"
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b-2 border-zinc-700 p-4 ${id === 'todo' ? 'bg-zinc-900' : id === 'in_progress' ? 'bg-blue-900/20' : 'bg-green-900/20'}`}>
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 ${color.replace('bg-', 'bg-')}`} />
            <h3 className="font-['Anton'] text-lg uppercase tracking-wider text-white">
                {title}
            </h3>
          </div>
          <span className="rounded bg-black px-2 py-0.5 text-xs font-mono font-bold text-zinc-500 border border-zinc-800">
            {count}
          </span>
        </div>

        {/* List */}
        <div className="flex-1 space-y-3 overflow-y-auto p-3 custom-scrollbar">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
             <div className="py-8 text-center border border-dashed border-zinc-800 opacity-50">
                <p className="text-xs uppercase tracking-widest text-zinc-600">No Intel</p>
             </div>
          )}
        </div>
      </div>
    </SortableContext>
  )
}
