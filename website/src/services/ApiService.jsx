const apiUrl = import.meta.env.VITE_API_URL;

const getToken = () => sessionStorage.getItem('auth_token');
const getUserId = () => sessionStorage.getItem('userId');

console.log('UserId:', getUserId());

// Helper to construct endpoint with type (quiz/hr/technical)
const buildUrl = (type, endpoint = '') => `${apiUrl}/api/${type}${endpoint}`;

// Common headers with token, optionally content-type
const getHeaders = (json = true) => {
  const headers = {};
  if (json) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// 1. POST: Upload Questions
export const uploadQuestions = async (type, data) => {
  const res = await fetch(buildUrl(type), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// 2. GET: Get Questions by User ID
export const getUserQuestions = async (type) => {
  const userId = getUserId();
  if (!userId) throw new Error('User ID not found in sessionStorage');
  const res = await fetch(buildUrl(type, `/user/${userId}`), {
    headers: getHeaders(false),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// 3. PUT: Publish Result
export const publishResult = async (type, id, display_result) => {
  const res = await fetch(buildUrl(type, `/publish/${id}`), {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ display_result }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// 4. GET: Get Submitted Users List for a Question
export const getSubmittedUsers = async (type, id) => {
  const res = await fetch(buildUrl(type, `/answers/${id}`), {
    headers: getHeaders(false),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// 5. GET: Get Answers by Specific User
export const getUserAnswers = async (type, questionId) => {
  const userId = getUserId();
  if (!userId) throw new Error('User ID not found in sessionStorage');
  const res = await fetch(buildUrl(type, `/answers/${questionId}/${userId}`), {
    headers: getHeaders(false),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// 6. DELETE: Delete Question
export const deleteQuestion = async (type, questionId) => {
  const res = await fetch(buildUrl(type, `/${questionId}`), {
    method: 'DELETE',
    headers: getHeaders(false),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// --- Video APIs ---

// Upload video file (FormData, no Content-Type set)
export const uploadVideoFile = async (formData) => {
  try {
    const token = getToken();
    const response = await fetch(`${apiUrl}/api/videos/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const rawText = await response.text();
    console.log("UPLOAD RAW RESPONSE:", rawText);
    const json = JSON.parse(rawText);

    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Upload failed');
    }

    return json;
  } catch (err) {
    console.error("Video upload error:", err.message);
    return { success: false, message: err.message };
  }
};

// Add video metadata (JSON)
// Remove id if present to avoid duplicate PK error
export const addVideo = async (videoData) => {
  const token = getToken();
  if ('id' in videoData) delete videoData.id;

  try {
    const res = await fetch(`${apiUrl}/api/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(videoData)
    });

    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    console.error("Add video error:", err.message);
    return { success: false, message: err.message };
  }
};

// Get videos for the logged-in user
export const getUserVideos = async () => {
  const userId = getUserId();
  if (!userId) throw new Error('User ID not found in sessionStorage');
  const token = getToken();
  const res = await fetch(`${apiUrl}/api/videos/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};
