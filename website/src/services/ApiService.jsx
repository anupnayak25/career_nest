const apiUrl = import.meta.env.VITE_API_URL;
const userId = sessionStorage.getItem('userId');
const token = sessionStorage.getItem('auth_token'); // ✅ centralized
console.log(userId);

// Helper to construct endpoint with type (quiz/hr/technical)
const buildUrl = (type, endpoint = '') => `${apiUrl}/api/${type}${endpoint}`;

// Common headers with token
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

// 1. POST: Upload Questions
export const uploadQuestions = async (type, data) => {
  const res = await fetch(buildUrl(type), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// 2. GET: Get Questions by User ID
export const getUserQuestions = async (type) => {
  const res = await fetch(buildUrl(type, `/user/user123`), {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// 3. PUT: Publish Result
export const publishResult = async (type, id, display_result) => {
  const res = await fetch(buildUrl(type, `/publish/${id}`), {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ display_result })
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// 4. GET: Get Submitted Users List for a Question
export const getSubmittedUsers = async (type, id) => {
  const res = await fetch(buildUrl(type, `/answers/${id}`), {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// 5. GET: Get Answers by Specific User
export const getUserAnswers = async (type, questionId) => {
  const res = await fetch(buildUrl(type, `/answers/${questionId}/${userId}`), {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// 6. DELETE: Delete Question
export const deleteQuestion = async (type, questionId) => {
  const res = await fetch(buildUrl(type, `/${questionId}`), {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};
