// lib/api.ts — unified API client

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

// Build a safe URL from a relative endpoint or pass-through absolute URLs
function buildUrl(endpoint: string) {
  if (/^https?:\/\//i.test(endpoint)) return endpoint; // already absolute
  if (!endpoint.startsWith("/")) endpoint = `/${endpoint}`;
  return `${API_BASE}${endpoint}`;
}

// Generic fetch wrapper
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = buildUrl(endpoint);

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Try to read error JSON if possible; otherwise throw generic
    let message = "حدث خطأ أثناء الاتصال بالخادم";
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response;
}

/* =========================
   AUTH
========================= */
export const authAPI = {
  signup: async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    major?: string;
    academic_year?: string;
  }) => {
    return fetchAPI("/users/signup/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  resendCode: async (email: string) => {
    return fetchAPI("/users/resend_code/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifySignup: async (email: string, code: string) => {
    return fetchAPI("/users/verify_signup/", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return fetchAPI("/users/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  resetPassword: async (email: string) => {
    return fetchAPI("/users/reset_password/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyResetCode: async (email: string, code: string) => {
    return fetchAPI("/users/verify_reset_password/", {
      method: "PUT",
      body: JSON.stringify({ email, code }),
    });
  },

  setNewPassword: async (email: string, code: string, password: string) => {
    return fetchAPI("/users/verify_reset_password/", {
      method: "POST",
      body: JSON.stringify({ email, code, password }),
    });
  },
};

/* =========================
   USER
========================= */
export const userAPI = {
  getConfidenceScore: async (token: string) => {
    return fetchAPI("/users/confidence_score/", {
      headers: { Authorization: `Token ${token}` },
    });
  },

  getAllAchievements: async (token: string) => {
    return fetchAPI("/users/achievements/", {
      headers: { Authorization: `Token ${token}` },
    });
  },

  getMyAchievements: async (token: string) => {
    return fetchAPI("/users/my_achievements/", {
      headers: { Authorization: `Token ${token}` },
    });
  },

  // Update profile extras (major, academic_year, sex, bio)
  changeProfile: async (
    token: string,
    data: {
      major?: string;
      academic_year?: string;
      sex?: "male" | "female" | "other";
      bio?: string;
    }
  ) => {
    return fetchAPI("/users/change_profile/", {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: JSON.stringify(data),
    });
  },

  getAgreementStatus: async (token: string) => {
    return fetchAPI("/users/agreement/", {
      headers: { Authorization: `Token ${token}` },
    });
  },

  getProfile: async (token: string) => {
    return fetchAPI("/users/my_profile/", {
      headers: { Authorization: `Token ${token}` },
    });
  },

  changeProfilePicture: async (token: string, picture: File) => {
    const formData = new FormData();
    formData.append("picture", picture);

    return fetchAPI("/users/change_profile_picture/", {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: formData, // don't set Content-Type manually
    });
  },

  getProfilePictureUrl: (userId: number) => {
    return buildUrl(`/users/profile_picture/${userId}/`);
  },

  changeEmail: async (token: string, email: string) => {
    return fetchAPI("/users/change_email/", {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: JSON.stringify({ email }),
    });
  },

  changePassword: async (
    token: string,
    oldPassword: string,
    newPassword: string
  ) => {
    return fetchAPI("/users/change_password/", {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
  },
};

/* =========================
   AGREEMENT
========================= */
export const agreementAPI = {
  get: async (token: string) => {
    return fetchAPI("/users/agreement/", {
      headers: { Authorization: `Token ${token}` },
    });
  },

  submit: async (
    token: string,
    data: {
      motivation_choices: string[];
      other_motivation: string;
      has_confidence_issues: boolean;
      confidence_issues: string[];
      other_issues: string;
      expectations: string[];
      other_expectations: string;
    }
  ) => {
    return fetchAPI("/users/agreement/", {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: JSON.stringify(data),
    });
  },
};

/* =========================
   SESSIONS / CHAT
========================= */
export const sessionAPI = {
  getSessions: async (token: string) => {
    return fetchAPI("/users/sessions/", {
      headers: { Authorization: `Token ${token}` },
    });
  },

  submitConfidenceScore: async (token: string, score: number) => {
    return fetchAPI("/users/submit_confidence_score/", {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: JSON.stringify({ score }),
    });
  },

  // Streaming must use the native fetch to access response.body
  initializeChatStream: async (
    token: string,
    sessionId: number,
    onMessage: (message: any) => void,
    onError: (error: any) => void
  ) => {
    try {
      const response = await fetch(buildUrl("/users/initialize_chat/"), {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonString = line.substring(6);
            if (!jsonString) continue;
            try {
              const messageData = JSON.parse(jsonString);
              if (messageData.error) {
                console.error("Stream error from backend:", messageData.error);
                onError(messageData.error);
              } else {
                onMessage(messageData);
              }
            } catch (e) {
              console.error(
                "Failed to parse JSON from stream chunk:",
                jsonString
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Error initializing chat stream:", error);
      onError(error);
    }
  },

  getChatMessages: async (token: string, sessionId: number) => {
    return fetchAPI(`/users/chat/?session_id=${sessionId}`, {
      headers: { Authorization: `Token ${token}` },
    });
  },

  sendChatMessage: async (token: string, sessionId: number, message: string) => {
    return fetchAPI("/users/chat/", {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: JSON.stringify({ session_id: sessionId, message }),
    });
  },

  resetSession: async (token: string, sessionId: number) => {
    return fetchAPI("/users/reset_session/", {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: JSON.stringify({ session_id: sessionId }),
    });
  },
};

/* =========================
   NOTES
========================= */
export const notesAPI = {
  getNotes: async (token: string) => {
    return fetchAPI("/users/notes/", {
      headers: { Authorization: `Token ${token}` },
    });
  },

  addNote: async (token: string, note: { content: string }) => {
    return fetchAPI("/users/notes/", {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: JSON.stringify(note),
    });
  },

  deleteNote: async (token: string, id: number) => {
    await fetchAPI(`/users/notes/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });
    return true;
  },
};
