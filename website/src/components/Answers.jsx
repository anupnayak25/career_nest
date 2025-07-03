// Answers.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';

function Answers() {
  const { type, id, userid } = useParams();
  const { attemptedData } = useData();

  const data = attemptedData[`${type}_${id}`];
  const answers = data?.answersByUserId?.[userid];

  if (!answers) return <p>No data available for this user.</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Answers of User: {userid}</h2>
      {answers.map((ans, index) => (
        <div key={index} className="border-b py-2">
          <p><strong>Q{ans.qno}:</strong> {ans.question}</p>
          <p><strong>Answer:</strong> {ans.answer}</p>
          <p><strong>Marks Awarded:</strong> {ans.marks_awarded}</p>
        </div>
      ))}
    </div>
  );
}

export default Answers;
