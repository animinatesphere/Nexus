
import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import KanbanCard from './KanbanCard'

export default function KanbanColumn({ id, title, tasks, count, color }) {
  const { setNodeRef } = useDroppable({
    id: id,
  })

  return (
    <div className="flex h-full w-80 min-w-[20rem] flex-col rounded-xl bg-zinc-900/50 border border-white/5">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${color}`} />
            <h3 className="font-semibold text-zinc-100">{title}</h3>
        </div>
        <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-zinc-400">{count}</span>
      </div>

      {/* Droppable Area */}
      <div ref={setNodeRef} className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        <SortableContext id={id} items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
          {/* Placeholder for empty columns to make them easier to drop into */}
          {tasks.length === 0 && (
             <div className="h-full w-full opacity-0 min-h-[50px]" />
          )}
        </SortableContext>
      </div>
    </div>
  )
}
