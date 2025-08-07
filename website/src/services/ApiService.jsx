// --- Health Check ---
export const checkServerHealth = async () => {
  try {
    const res = await fetch(`${apiUrl}/`, {
      method: "GET",
    });
    // Accept any 2xx as up
    if (res.status >= 200 && res.status < 300) return true;
    // If status is 200 but response is HTML/text, still treat as up
    if (res.status === 200) return true;
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};
const apiUrl = import.meta.env.VITE_API_URL;

// --- Cached Auth State ---
let authToken = sessionStorage.getItem("auth_token");
let userId = sessionStorage.getItem("userId");
console.log(authToken);

export const refresh = () => {
  authToken = sessionStorage.getItem("auth_token");
  userId = sessionStorage.getItem("userId");
};

console.log("UserId:", userId);

// --- Helper Functions ---
const buildUrl = (type, endpoint = "") => `${apiUrl}/api/${type}${endpoint ? endpoint : ""}`;

const getHeaders = (json = true) => {
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";
  headers["Authorization"] = `Bearer ${authToken}`;
  return headers;
};

// --- Question APIs ---

export const uploadQuestions = async (type, data) => {
  refresh();
  const res = await fetch(buildUrl(type), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const getUserQuestions = async (type) => {
  refresh();
  if (!userId) throw new Error("User ID not found in sessionStorage");

  const res = await fetch(buildUrl(type, `/user/${userId}`), {
    headers: getHeaders(false),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const publishResult = async (type, id, display_result) => {
  refresh();
  const res = await fetch(buildUrl(type, `/publish/${id}`), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ display_result }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const getSubmittedUsers = async (type, id) => {
  try {
    refresh();
    const res = await fetch(buildUrl(type, `/answers/${id}`), {
      headers: getHeaders(false),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} ${res.error}`);
    }

    const data = await res.json();

    // Handle "No answers yet" as a valid response, not an error
    if (data && data.message === "No answers yet") {
      return { message: "No answers yet" };
    }

    // Return the data as is (could be array or object with users array)
    return data;
  } catch (error) {
    console.error("Error fetching submitted users:", error);

    // Don't throw for "No answers yet" - return it as valid data
    if (error.message && error.message.includes("No answers yet")) {
      return { message: "No answers yet" };
    }

    // Only throw for actual errors
    throw error;
  }
};

export const getUserAnswers = async (type, questionId) => {
  refresh();
  if (!userId) throw new Error("User ID not found in sessionStorage");

  const res = await fetch(buildUrl(type, `/answers/${questionId}/${userId}`), {
    headers: getHeaders(false),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const updateUserMarks = async (type, questionId, userId, updates) => {
  refresh();
  const res = await fetch(buildUrl(type, `/answers/${questionId}/${userId}/marks`), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ updates }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const deleteQuestion = async (type, questionId) => {
  refresh();
  const res = await fetch(buildUrl(type, `/${questionId}`), {
    method: "DELETE",
    headers: getHeaders(false),
  });

  let responseText;
  try {
    responseText = await res.text();
  } catch (err) {
    console.error("Failed to read response text:", err.message);
    throw new Error("Failed to read response from server.");
  }

  if (!res.ok) {
    console.error("DELETE RESPONSE NOT OK:", res.status, responseText);
    throw new Error(responseText);
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
};

// --- Video APIs ---

export const uploadVideoFile = async (formData) => {
  refresh();
  try {
    refresh();

    const response = await fetch(`${apiUrl}/api/videos/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
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
        errorMessage = errorText.includes("<!DOCTYPE")
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
    if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
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
    const response = await fetch(`${apiUrl}/api/videos/upload-multiple`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
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
        errorMessage = errorText.includes("<!DOCTYPE")
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
    if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
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
  refresh();
  const token = authToken;
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
  if ("id" in videoData) delete videoData.id; // Prevent duplicate primary key error

  try {
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
    // Add user_id to each video
    const videosWithUserId = videosData.map((video) => ({
      ...video,
      user_id: userId,
    }));

    const res = await fetch(`${apiUrl}/api/videos/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
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
  refresh();
  if (!userId) throw new Error("User ID not found in sessionStorage");
  if (!authToken) throw new Error("Auth token not found in sessionStorage");
  const res = await fetch(`${apiUrl}/api/videos/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const getVideos = async () => {
  refresh();
  if (!authToken) throw new Error("Auth token not found in sessionStorage");
  const res = await fetch(`${apiUrl}/api/videos`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const deleteVideo = async (videoId) => {
  refresh();
  if (!authToken) throw new Error("Auth token not found in sessionStorage");
  const res = await fetch(`${apiUrl}/api/videos/${videoId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const updateVideo = async (videoId, updateData) => {
  refresh();
  if (!authToken) throw new Error("Auth token not found in sessionStorage");
  try {
    const res = await fetch(`${apiUrl}/api/videos/${videoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
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
