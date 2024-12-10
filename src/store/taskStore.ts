import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Task } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,
  
  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      set({ tasks: data || [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  addTask: async (task) => {
    try {
      set({ error: null });
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();
        
      if (error) throw error;
      
      set((state) => ({
        tasks: [data, ...state.tasks]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },
  
  updateTask: async (id, updates) => {
    try {
      if (!id) throw new Error('Task ID is required for updates');
      set({ error: null });
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id ? { ...task, ...data } : task
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },
  
  deleteTask: async (id) => {
    try {
      if (!id) throw new Error('Task ID is required for deletion');
      set({ error: null });
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },
}));