import { useState } from 'react';
import { Check, X, Edit2, Trash2, Calendar, AlertTriangle, Save } from 'lucide-react';

function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onEdit(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        dueDate: editDueDate || null
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  if (isEditing) {
    return (
      <div className="glass-card rounded-xl p-4 animate-slideIn">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="input-modern mb-2"
          placeholder="Title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="input-modern mb-2"
          rows="2"
          placeholder="Description"
        />
        <input
          type="date"
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
          className="input-modern mb-3"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSaveEdit}
            className="flex-1 bg-yellow-600/80 hover:bg-yellow-600 text-white py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-card glass-card-hover ${isOverdue ? 'border-red-500/50 bg-red-500/5' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(task.id, !task.completed)}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 
            ${task.completed 
              ? 'bg-yellow-500 border-yellow-500' 
              : 'border-yellow-500/50 hover:border-yellow-500 hover:scale-110'}`}
        >
          {task.completed && <Check className="w-4 h-4 text-white" />}
        </button>
        
        <div className="flex-1">
          <h3 className={`font-semibold text-lg transition-all duration-300 ${task.completed ? 'line-through text-yellow-500/40' : 'text-white'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-yellow-300/60 text-sm mt-1 transition-all duration-300 ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
          {task.dueDate && (
            <div className={`flex items-center gap-2 mt-2 text-xs ${isOverdue ? 'text-red-400' : 'text-yellow-500/50'}`}>
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
              {isOverdue && (
                <span className="bg-red-500/30 px-2 py-0.5 rounded-full text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Overdue
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-yellow-400 hover:text-yellow-300 transition-all duration-300 hover:scale-110 p-1"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-400 transition-all duration-300 hover:scale-110 p-1"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;