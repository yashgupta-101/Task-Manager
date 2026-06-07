import { useState } from 'react';
import { Plus, ChevronDown, Save, Calendar, FileText, AlertCircle } from 'lucide-react';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    onAddTask({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null
    });
    
    // Clear form
    setTitle('');
    setDescription('');
    setDueDate('');
    setError('');
    setIsExpanded(false);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-yellow-500/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Plus className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-yellow-400">Add New Task</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-yellow-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <form onSubmit={handleSubmit} className="px-6 pb-6 animate-slideIn">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-yellow-400 font-medium mb-2 text-sm">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-modern"
              placeholder="What needs to be done?"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-yellow-400 font-medium mb-2 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-modern"
              rows="3"
              placeholder="Add details..."
            />
          </div>
          
          <div className="mb-5">
            <label className="block text-yellow-400 font-medium mb-2 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-modern"
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4"/>
            Create Task
          </button>
        </form>
      )}
    </div>
  );
}

export default TaskForm;