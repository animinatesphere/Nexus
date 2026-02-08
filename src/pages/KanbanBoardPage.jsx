
import React from 'react'
import KanbanBoard from '../components/kanban/KanbanBoard'
import { motion } from 'framer-motion'

export default function KanbanBoardPage() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6 px-1">
        <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-foreground font-display"
        >
            Task Board
        </motion.h1>
        <p className="text-muted-foreground">Manage your tasks visually.</p>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-white/5 bg-background/50 shadow-inner">
         <KanbanBoard />
      </div>
    </div>
  )
}
