import React, { useEffect, useState } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { TaskBoard } from './components/TaskBoard';
import { TaskForm } from './components/TaskForm';
import { AuthForm } from './components/AuthForm';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { useTaskStore } from './store/taskStore';
import { useAuth } from './lib/auth';
import type { Task } from './lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const { user, signOut } = useAuth();
  const { tasks, isLoading, fetchTasks, addTask, updateTask, deleteTask } = useTaskStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    if (user) {
      fetchTasks().catch(error => {
        toast.error('Failed to fetch tasks');
        console.error(error);
      });
    }
  }, [user, fetchTasks]);

  const handleSubmit = async (taskData: Omit<Task, 'id' | 'created_at'>) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        toast.success('Task updated successfully');
      } else {
        await addTask({ ...taskData, assignee_id: user?.id || 'default' });
        toast.success('Task created successfully');
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error(error);
    }
  };

  if (!user) {
    return (
      <AuthForm
        mode={authMode}
        onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Task Manager</h1>
              <p className="text-sm text-gray-600">Welcome, {user.full_name || user.email}</p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Task
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <TaskBoard
            tasks={tasks}
            onEditTask={(task) => {
              setEditingTask(task);
              setShowForm(true);
            }}
            onDeleteTask={deleteTask}
          />
        )}
      </main>

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTask(null);
        }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          onSubmit={handleSubmit}
          initialData={editingTask || undefined}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default App;