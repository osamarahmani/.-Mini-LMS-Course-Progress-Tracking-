const BASE_URL = "https://mini-lms-course-progress-tracking-api.onrender.com";

// ✅ LOGIN
export const login = async (data) => {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ✅ REGISTER
export const register = async (data) => {
  const res = await fetch(`${BASE_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ✅ FETCH COURSES
export const fetchCourses = async () => {
  const res = await fetch(`${BASE_URL}/api/courses`);
  return res.json();
};
export const fetchCourseById = async (courseId) => {
  const res = await fetch(
    `${BASE_URL}/api/courses/${courseId}`
  );

  return res.json();
};

// ✅ FETCH PROGRESS
export const fetchProgress = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/progress/${userId}`);
    const data = await res.json();

    return Array.isArray(data) ? data : []; // ✅ FIX
  } catch {
    return [];
  }
};

// ✅ MARK LESSON COMPLETE
export const markLessonComplete = async (userId, courseId, lessonId) => {
  try {
    await fetch(`${BASE_URL}/api/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, courseId, lessonId }),
    });
  } catch (err) {
    console.error("❌ Error updating progress:", err);
  }
};