const apiUrl = import.meta.env.VITE_API_URL;

// --- Auth Helpers ---
const getAuthToken = () => sessionStorage.getItem("auth_token");
const getUserId = () => sessionStorage.getItem("userId");

// --- Helper Functions ---
const buildUrl = (type, endpoint = "") =>
  `${apiUrl}/api/${type}${endpoint ? endpoint : ""}`;

const getHeaders = (json = true) => {
  const token = getAuthToken();
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// --- Question APIs ---

export const uploadQuestions = async (type, data) => {
  const res = await fetch(buildUrl(type), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const getUserQuestions = async (type) => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in sessionStorage");

  const res = await fetch(buildUrl(type, `/user/${userId}`), {
    headers: getHeaders(false),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const publishResult = async (type, id, display_result) => {
  const res = await fetch(buildUrl(type, `/publish/${id}`), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ display_result }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const getSubmittedUsers = async (type, id) => {
  const res = await fetch(buildUrl(type, `/answers/${id}`), {
    headers: getHeaders(false),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const getUserAnswers = async (type, questionId) => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in sessionStorage");

  const res = await fetch(buildUrl(type, `/answers/${questionId}/${userId}`), {
    headers: getHeaders(false),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const updateUserMarks = async (type, questionId, userId, updates) => {
  const res = await fetch(buildUrl(type, `/answers/${questionId}/${userId}/marks`), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ updates }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const deleteQuestion = async (type, questionId) => {
  const res = await fetch(buildUrl(type, `/${questionId}`), {
    method: "DELETE",
    headers: getHeaders(false),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// --- Video APIs ---

export const uploadVideoFile = async (formData) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Auth token missing");

    const response = await fetch(`${apiUrl}/api/videos/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type for FormData
      },
      body: formData,
    });

    // First, check if the response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error("UPLOAD RESPONSE NOT OK:", response.status, errorText);
      
      // Try to parse as JSON, fallback to text if it fails
      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || `Upload failed with status ${response.status}`;
      } catch {
        errorMessage = errorText.includes('<!DOCTYPE') 
          ? "Server returned HTML instead of JSON. Check your authentication token." 
          : errorText || `Upload failed with status ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    const text = await response.text();
    console.log("UPLOAD RAW RESPONSE:", text);
    
    if (!text) {
      throw new Error("Empty response from server");
    }

    // Check if response is HTML (which indicates an error page)
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      throw new Error("Server returned HTML page instead of JSON. Please check your authentication.");
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", parseError);
      throw new Error("Invalid JSON response from server: " + text.substring(0, 100));
    }

    if (!json.success) {
      throw new Error(json.message || "Upload failed");
    }

    return json;
  } catch (err) {
    console.error("Video upload error:", err.message);
    throw err; // Re-throw to be handled by caller
  }
};

// Upload multiple video files
export const uploadMultipleVideoFiles = async (formData) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Auth token missing");

    const response = await fetch(`${apiUrl}/api/videos/upload-multiple`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type for FormData
      },
      body: formData,
    });

    // First, check if the response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error("MULTIPLE UPLOAD RESPONSE NOT OK:", response.status, errorText);
      
      // Try to parse as JSON, fallback to text if it fails
      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || `Upload failed with status ${response.status}`;
      } catch {
        errorMessage = errorText.includes('<!DOCTYPE') 
          ? "Server returned HTML instead of JSON. Check your authentication token." 
          : errorText || `Upload failed with status ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    const text = await response.text();
    console.log("MULTIPLE UPLOAD RAW RESPONSE:", text);
    
    if (!text) {
      throw new Error("Empty response from server");
    }

    // Check if response is HTML (which indicates an error page)
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      throw new Error("Server returned HTML page instead of JSON. Please check your authentication.");
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", parseError);
      throw new Error("Invalid JSON response from server: " + text.substring(0, 100));
    }

    if (!json.success) {
      throw new Error(json.message || "Upload failed");
    }

    return json;
  } catch (err) {
    console.error("Multiple video upload error:", err.message);
    throw err; // Re-throw to be handled by caller
  }
};

export const addVideo = async (videoData) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();
    if (!token || !userId) throw new Error("Auth token or user ID missing");

    const { title, description, url, category } = videoData;

    if (!title || !description || !url || !category) {
      throw new Error("Missing required video fields.");
    }

    const body = JSON.stringify({
      title,
      description,
      url,
      category,
      user_id: userId,
    });

    const res = await fetch(`${apiUrl}/api/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to add video metadata");
    }

    return data;
  } catch (err) {
    console.error("Add video error:", err.message);
    return { success: false, message: err.message };
  }
};

// Add multiple videos metadata (batch)
export const addMultipleVideos = async (videosData) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();
    if (!token || !userId) throw new Error("Auth token or user ID missing");

    // Add user_id to each video
    const videosWithUserId = videosData.map(video => ({
      ...video,
      user_id: userId
    }));

    const res = await fetch(`${apiUrl}/api/videos/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ videos: videosWithUserId }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to add multiple videos metadata");
    }

    return data;
  } catch (err) {
    console.error("Add multiple videos error:", err.message);
    return { success: false, message: err.message };
  }
};

export const getUserVideos = async () => {
  const token = getAuthToken();
  const userId = getUserId();
  if (!token || !userId) throw new Error("User credentials not found in sessionStorage");

  const res = await fetch(`${apiUrl}/api/videos/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const deleteVideo = async (videoId) => {
  const token = getAuthToken();
  if (!token) throw new Error("Auth token not found in sessionStorage");

  const res = await fetch(`${apiUrl}/api/videos/${videoId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const updateVideo = async (videoId, updateData) => {
  const token = getAuthToken();
  if (!token) throw new Error("Auth token not found in sessionStorage");

  try {
    const res = await fetch(`${apiUrl}/api/videos/${videoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to update video");
    }

    return data;
  } catch (err) {
    console.error("Update video error:", err.message);
    return { success: false, message: err.message };
  }
};
