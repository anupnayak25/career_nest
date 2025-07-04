import React from 'react';

const Vedio = () => {
  const handleClick = (action) => {
    alert(`${action} clicked`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🎬 Video Management</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => handleClick('Add Event')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow"
        >
          Add Event
        </button>

        <button
          onClick={() => handleClick('New Video')}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg shadow"
        >
          New Video
        </button>

        <button
          onClick={() => handleClick('Add Video')}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow"
        >
          Add Video
        </button>

        <button
          onClick={() => handleClick('Form')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg shadow"
        >
          Form
        </button>
      </div>
    </div>
  );
};

export default Vedio;
