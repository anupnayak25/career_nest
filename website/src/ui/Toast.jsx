import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const toastTypes = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    borderColor: 'border-green-600'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    borderColor: 'border-red-600'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-500',
    textColor: 'text-white',
    borderColor: 'border-yellow-600'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    borderColor: 'border-blue-600'
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [nextId, setNextId] = useState(1);

  const showToast = (message, type = 'info', duration = 5000) => {
    const newToast = {
      id: nextId,
      message,
      type,
      duration,
      timeRemaining: duration,
      isPaused: false
    };
    setToasts(prev => [...prev, newToast]);
    setNextId(prev => prev + 1);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const pauseToast = (id) => {
    setToasts(prev =>
      prev.map(t => (t.id === id ? { ...t, isPaused: true } : t))
    );
  };

  const resumeToast = (id) => {
    setToasts(prev =>
      prev.map(t => (t.id === id ? { ...t, isPaused: false } : t))
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setToasts(prev =>
        prev.map(t => {
          if (!t.isPaused && t.timeRemaining > 0) {
            const newTimeRemaining = t.timeRemaining - 100;
            if (newTimeRemaining <= 0) {
              setTimeout(() => removeToast(t.id), 0);
              return { ...t, timeRemaining: 0 };
            }
            return { ...t, timeRemaining: newTimeRemaining };
          }
          return t;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const Toast = ({ toast }) => {
    const config = toastTypes[toast.type];
    const Icon = config.icon;
    const progress = ((toast.duration - toast.timeRemaining) / toast.duration) * 100;

    return (
      <div
        className={`relative flex items-start p-4 mb-3 rounded-lg shadow-lg border-l-4 ${config.bgColor} ${config.textColor} ${config.borderColor} transform transition-all duration-300 hover:scale-105`}
        onMouseEnter={() => pauseToast(toast.id)}
        onMouseLeave={() => resumeToast(toast.id)}
      >
        <div className="flex-shrink-0 mr-3">
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium break-words">{toast.message}</p>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 ml-3 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
        <div className="absolute bottom-0 left-0 h-1 bg-black bg-opacity-20 w-full">
          <div
            className="h-full bg-white bg-opacity-60 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 w-full max-w-sm">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
