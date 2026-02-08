
import React, { useState, useEffect } from 'react'
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core'
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable'
import { supabase } from '../../lib/supabase'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'
import { toast } from 'sonner'

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, projects(name)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  // Columns derived from status
  const columns = {
    todo: {
      id: 'todo',
      title: 'To Do',
      color: 'bg-zinc-500',
      items: tasks.filter(t => t.status === 'todo')
    },
    in_progress: {
      id: 'in_progress',
      title: 'In Progress',
      color: 'bg-blue-500',
      items: tasks.filter(t => t.status === 'in_progress')
    },
    done: { 
      id: 'done', 
      title: 'Done',
      color: 'bg-green-500',
      items: tasks.filter(t => t.status === 'done')
    }
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const activeId = active.id
    const overId = over.id

    // Find the task object
    const activeTask = tasks.find(t => t.id === activeId)
    // Find the container (column) we dropped over
    // It could be a container ID ('todo', etc.) OR a task ID
    let newStatus = null

    // If over a container directly
    if (['todo', 'in_progress', 'completed'].includes(overId)) {
        newStatus = overId
    } else {
        // Over another task? Find that task's status
        const overTask = tasks.find(t => t.id === overId)
        if (overTask) {
            newStatus = overTask.status
        }
    }

    if (activeTask && newStatus && activeTask.status !== newStatus) {
        // Optimistic UI Update
        setTasks((prev) => prev.map(t => 
            t.id === activeId ? { ...t, status: newStatus } : t
        ))

        // Supabase Update
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ status: newStatus })
                .eq('id', activeId)
            
            if (error) throw error
            toast.success(`Task moved to ${newStatus.replace('_', ' ')}`)
        } catch (err) {
            toast.error('Failed to move task')
            fetchTasks() // Revert on error
        }
    }

    setActiveId(null)
  }

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading Board...</div>

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-6 overflow-x-auto p-6 pb-12">
        {Object.keys(columns).map((colId) => (
            <KanbanColumn 
                key={colId} 
                id={columns[colId].id} 
                title={columns[colId].title} 
                count={columns[colId].items.length}
                color={columns[colId].color}
                tasks={columns[colId].items}
            />
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
            <KanbanCard task={tasks.find(t => t.id === activeId)} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
