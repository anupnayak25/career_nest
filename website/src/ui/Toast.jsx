import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const toastTypes = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-500",
    textColor: "text-white",
    borderColor: "border-green-600",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-500",
    textColor: "text-white",
    borderColor: "border-red-600",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-yellow-500",
    textColor: "text-white",
    borderColor: "border-yellow-600",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500",
    textColor: "text-white",
    borderColor: "border-blue-600",
  },
};

const Toast = ({ toast, onRemove }) => {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  
  const config = toastTypes[toast.type];
  const Icon = config.icon;

  // Single useEffect to handle animation and auto-removal
  useEffect(() => {
    let animationId;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const newProgress = Math.min((elapsed / toast.duration) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        onRemove(toast.id);
        return;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    // Start animation immediately
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={`relative flex items-start p-4 mb-3 rounded-lg shadow-lg border-l-4 ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
      <div className="flex-shrink-0 mr-3">
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium break-words">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 ml-3 opacity-70 hover:opacity-100 transition-opacity">
        <X size={16} />
      </button>
      <div className="absolute bottom-0 left-0 h-1 bg-black bg-opacity-20 w-full">
        <div
          className="h-full bg-white bg-opacity-60 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextIdRef = useRef(1);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info", duration = 5000) => {
    const id = nextIdRef.current++;
    
    const newToast = {
      id,
      message,
      type,
      duration,
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 w-full max-w-sm">
        {toasts.map((toast) => (
          <Toast 
            key={toast.id} 
            toast={toast} 
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};