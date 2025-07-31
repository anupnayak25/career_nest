import React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

const Alert = ({ text, onResult, isVisible = false, type = "warning" }) => {
  if (!isVisible) return null;

  const handleYes = () => {
    onResult(true);
  };

  const handleNo = () => {
    onResult(false);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-600 drop-shadow-lg" />;
      case "error":
        return <X className="w-8 h-8 text-red-600 drop-shadow-lg" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-blue-600 drop-shadow-lg" />;
    }
  };

  // Create portal to render at document body level
  const alertDialog = (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-500 scale-100 animate-slideUp border border-gray-100 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-60"></div>

        {/* Top accent bar with gradient */}
        <div
          className={`h-1 w-full bg-gradient-to-r ${
            type === "success"
              ? "from-green-400 to-emerald-500"
              : type === "error"
              ? "from-red-400 to-rose-500"
              : "from-blue-500 to-purple-600"
          }`}></div>

        <div className="relative z-10 p-8">
          {/* Icon with animated background */}
          <div className="flex justify-center mb-6">
            <div
              className={`p-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 ${
                type === "success"
                  ? "bg-gradient-to-r from-green-100 to-emerald-100"
                  : type === "error"
                  ? "bg-gradient-to-r from-red-100 to-rose-100"
                  : "bg-gradient-to-r from-blue-100 to-purple-100"
              }`}>
              {getIcon()}
            </div>
          </div>

          {/* Title with gradient text */}
          <div className="text-center mb-4">
            <h3
              className={`text-2xl font-bold bg-gradient-to-r ${
                type === "success"
                  ? "from-green-600 to-emerald-600"
                  : type === "error"
                  ? "from-red-600 to-rose-600"
                  : "from-blue-600 to-purple-600"
              } bg-clip-text text-transparent mb-2`}>
              Confirmation Required
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
          </div>

          {/* Message text */}
          <div className="text-gray-700 text-center text-lg leading-relaxed mb-8 font-medium">{text}</div>

          {/* Buttons with modern styling */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleNo}
              className="group relative px-8 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-full hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
              <span className="relative z-10">No</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={handleYes}
              className={`group relative px-8 py-3 text-sm font-semibold text-white rounded-full focus:outline-none focus:ring-4 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 ${
                type === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-200"
                  : type === "error"
                  ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 focus:ring-red-200"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:ring-blue-200"
              }`}>
              <span className="relative z-10">Yes</span>
              <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-60"></div>
        <div className="absolute bottom-4 left-4 w-3 h-3 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full opacity-40"></div>
        <div className="absolute top-1/2 left-2 w-1 h-1 bg-gradient-to-br from-indigo-300 to-blue-300 rounded-full opacity-50"></div>
      </div>
    </div>
  );

  // Render the dialog at the document body level to escape stacking context issues
  return createPortal(alertDialog, document.body);
};

// Add these CSS animations to your global styles or use Tailwind's arbitrary values
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  .animate-slideUp {
    animation: slideUp 0.4s ease-out;
  }
`;
document.head.appendChild(style);

export default Alert;