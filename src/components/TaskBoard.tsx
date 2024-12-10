import React from 'react';
import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import type { Task } from '../lib/supabase';

interface TaskBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onEditTask, onDeleteTask }) => {
  const columns = {
    TODO: tasks.filter(task => task.status === 'TODO'),
    IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
    DONE: tasks.filter(task => task.status === 'DONE'),
  };

  const columnTitles = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {(Object.keys(columns) as Array<keyof typeof columns>).map((status) => (
        <div key={status} className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {columnTitles[status]} ({columns[status].length})
          </h3>
          <div className="space-y-4">
            {columns[status].map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <TaskCard
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};