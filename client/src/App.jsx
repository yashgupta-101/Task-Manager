import { useState, useEffect } from 'react';
import { LayoutList, CheckCircle2, Circle, Plus, RefreshCw, Sparkles } from 'lucide-react';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import FilterButtons from './components/FilterButtons';
import { fetchTasks, createTask, updateTask, deleteTask } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [animation, setAnimation] = useState(false);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const createdTask = await createTask(newTask);
      setTasks([createdTask, ...tasks]);
      // Trigger animation
      setAnimation(true);
      setTimeout(() => setAnimation(false), 500);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const updatedTask = await updateTask(id, { completed });
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleEditTask = async (id, updates) => {
    try {
      const updatedTask = await updateTask(id, updates);
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      setError('Failed to edit task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  // Calculate counts
  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-8 animate-slideIn">
          <div className="flex items-center justify-center gap-2 mb-2">
            <LayoutList className="w-10 h-10 text-yellow-500" />
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.2] pb-3 bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
              Task Master
            </h1>
          </div>
          <p className="text-yellow-300/60 text-lg">Organize your tasks</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105 hover:border-yellow-500/50">
            <LayoutList className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-500">{totalCount}</div>
            <div className="text-yellow-300/60 text-sm">Total Tasks</div>
          </div>
          
          <div className="glass-card rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105 hover:border-yellow-500/50">
            <Circle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">{activeCount}</div>
            <div className="text-yellow-300/60 text-sm">Active Tasks</div>
          </div>
          
          <div className="glass-card rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105 hover:border-yellow-500/50">
            <CheckCircle2 className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-500">{completedCount}</div>
            <div className="text-yellow-300/60 text-sm">Completed</div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="glass-card rounded-xl p-4 mb-4 border-red-500/50 bg-red-500/10 animate-slideIn">
            <div className="flex items-center justify-between">
              <span className="text-red-400">{error}</span>
              <button 
                onClick={loadTasks} 
                className="px-3 py-1 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30 transition flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        )}
        
        {/* Add Task Form */}
        <div className="animate-slideIn">
          <TaskForm onAddTask={handleAddTask} />
        </div>
        
        {/* Filter Buttons */}
        <div className="my-6 animate-slideIn">
          <FilterButtons currentFilter={filter} onFilterChange={setFilter} />
        </div>
        
        {/* Task List */}
        {loading ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-3"></div>
            <div className="text-yellow-300/60">Loading your tasks...</div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center animate-slideIn">
            <Sparkles className="w-16 h-16 text-yellow-500/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">
              {tasks.length === 0 ? 'No tasks yet' : `No ${filter.toLowerCase()} tasks found`}
            </h3>
            <p className="text-yellow-300/60">
              {tasks.length === 0 
                ? 'Create your first task to get started' 
                : 'Try changing the filter or add new tasks'}
            </p>
          </div>
        ) : (
          <div className={`space-y-3 ${animation ? 'animate-pulse-fast' : ''}`}>
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;