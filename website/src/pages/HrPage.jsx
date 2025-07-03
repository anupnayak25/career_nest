import React, { useState, useEffect } from 'react';
import { Plus ,Users, Eye, Calendar, FileText,  ChevronLeft, CheckCircle } from 'lucide-react';
import {
  getUserQuestions,
  publishResult,
} from '../services/ApiService';
import { useNavigate } from 'react-router-dom';

const HRQuestionsManager = () => {
  const [questions, setQuestions] = useState([]);// 'questions', 'people', 'answers'
  const navigate=useNavigate();
  const [loading, setLoading] = useState(false);

  // Load questions on component mount
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await getUserQuestions("hr");
      setQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };



  const handlePublishToggle = async (id, currentStatus) => {
    setLoading(true);
    try {
      await publishResult(id, !currentStatus);
      loadQuestions();
    } catch (error) {
      console.error('Error updating publish status:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className=" mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              
              <h1 className="text-2xl font-bold text-gray-800">
               HR Questions Manager
              </h1>
            </div>
              <button
                onClick={() => {navigate('/dashboard/add-question/hr');}}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Questions View */}
            <div className="space-y-4">
              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No questions created yet</p>
                  <p className="text-gray-400">Create your first HR question to get started</p>
                </div>
              ) : (
                questions.map((question) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 cursor-pointer" 
                      
                          onClick={() => navigate(`/answers/hr/dd60ebe0-bca8-48c4-a63c-34b596d58338`)}>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">{question.title}</h3>
                            <span className={`px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center ${question.display_result ? '' : ' hidden'}`}>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Published
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4">{question.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due: {new Date(question.due_date).toLocaleDateString()}
                          </div>
                          <div>Total Marks: {question.totalMarks}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          View Answers
                        </button>
                        <button
                          onClick={() => handlePublishToggle(question.id, question.display_result)}
                          className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                            question.display_result
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {question.display_result ? 'Unpublish' : 'Publish'}
                        </button>
                       
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

        
        </div>
      </div>
    </div>
  );
};

export default HRQuestionsManager;
