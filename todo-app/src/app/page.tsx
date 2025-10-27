'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('todo-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('todo-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('todo-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('todo-theme', 'light');
    }
  }, [isDarkMode]);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toLocaleString()
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-4xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              To-Do List
          </h1>
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                isDarkMode
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
          
          {/* Stats */}
          <div className={`inline-flex items-center gap-4 px-6 py-3 rounded-full ${
            isDarkMode 
              ? 'bg-gray-800/50 backdrop-blur-sm' 
              : 'bg-white/70 backdrop-blur-sm'
          }`}>
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
               {completedCount} of {totalCount} completed
            </span>
            {totalCount > 0 && (
              <div className={`w-24 h-2 rounded-full ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Add Task Form */}
        <div className={`mb-8 p-6 rounded-2xl shadow-lg ${
          isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
            : 'bg-white/70 backdrop-blur-sm border border-gray-200'
        }`}>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="What needs to be done?"
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            <button
              onClick={addTask}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              ➕ Add
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className={`text-center py-12 rounded-2xl ${
              isDarkMode 
                ? 'bg-gray-800/30 backdrop-blur-sm' 
                : 'bg-white/50 backdrop-blur-sm'
            }`}>
              <div className="text-6xl mb-4">📝</div>
              <h3 className={`text-xl font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                No tasks yet
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Add your first task above to get started!
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                  task.completed
                    ? isDarkMode
                      ? 'bg-gray-800/40 backdrop-blur-sm border border-gray-700'
                      : 'bg-white/50 backdrop-blur-sm border border-gray-200'
                    : isDarkMode
                    ? 'bg-gray-800/60 backdrop-blur-sm border border-gray-600'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : isDarkMode
                        ? 'border-gray-500 hover:border-green-500'
                        : 'border-gray-400 hover:border-green-500'
                    }`}
                  >
                    {task.completed && '✓'}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`font-medium transition-all duration-300 ${
                      task.completed
                        ? isDarkMode
                          ? 'text-gray-500 line-through'
                          : 'text-gray-400 line-through'
                        : isDarkMode
                        ? 'text-white'
                        : 'text-gray-800'
                    }`}>
                      {task.text}
                    </p>
                    <p className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      📅 Created: {task.createdAt}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                      isDarkMode
                        ? 'text-red-400 hover:bg-red-500/20'
                        : 'text-red-500 hover:bg-red-100'
                    }`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            © 2025 To-Do List. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
