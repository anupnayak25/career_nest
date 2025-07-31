import React from "react";

const StudentCard = ({ users, onViewAnswers }) => {
  // Safety check - ensure users is an array
  if (!users || !Array.isArray(users)) {
    console.error("StudentCard: users prop is not an array:", users);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-700">
          <span role="img" aria-label="error">⚠️</span>
          <span className="font-medium ml-2">Invalid data format received</span>
        </div>
      </div>
    );
  }

  // Function to extract USN from email
  const extractUSN = (email) => {
    if (!email) return "N/A";
    const usnMatch = email.match(/^([^@]+)@/);
    return usnMatch ? usnMatch[1].toUpperCase() : "N/A";
  };

  // Function to generate avatar initials
  const getInitials = (name, userId) => {
    if (name && name.trim()) {
      return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
    }
    return userId?.toString().charAt(0).toUpperCase() || 'U';
  };

  // Function to generate consistent colors based on user ID
  const getAvatarColor = (userId) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
    ];
    const index = userId ? userId % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                USN
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr 
                key={user.user_id || user.id || index} 
                className="hover:bg-blue-50 transition-colors duration-150 animate-slide-up"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full ${getAvatarColor(user.user_id || user.id)} flex items-center justify-center text-white font-semibold text-sm`}>
                      {getInitials(user.name, user.user_id || user.id)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {user.user_id || user.id || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-blue-800 bg-blue-100 px-2 py-1 rounded font-semibold">
                    {extractUSN(user.email_id || user.email)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {user.email_id || user.email || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onViewAnswers(user.user_id || user.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <span role="img" aria-label="view" className="mr-2">👁️</span>
                    View Answers
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table footer with summary */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {users.length} {users.length === 1 ? 'student' : 'students'}
          </span>
         
        </div>
      </div>
    </div>
  );
};

export default StudentCard;