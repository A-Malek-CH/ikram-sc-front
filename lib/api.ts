// API client for interacting with the backend

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function for making API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  // Set default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle non-2xx responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "حدث خطأ أثناء الاتصال بالخادم")
  }

  // Return JSON response for everything except image responses
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  return response
}

// Authentication APIs
export const authAPI = {
  // Sign up - send email, password, first_name, last_name
  signup: async (userData: { email: string; password: string; first_name: string; last_name: string ;major: string; 
  academic_year: string; }) => {
    return fetchAPI("/users/signup/", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  // Resend verification code
  resendCode: async (email: string) => {
    return fetchAPI("/users/resend_code/", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },

  // Verify signup with code
  verifySignup: async (email: string, code: string) => {
    return fetchAPI("/users/verify_signup/", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    })
  },

  // Login - get token and role
  login: async (credentials: { email: string; password: string }) => {
    return fetchAPI("/users/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  // Request password reset
  resetPassword: async (email: string) => {
    return fetchAPI("/users/reset_password/", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },

  // Verify password reset code
  verifyResetCode: async (email: string, code: string) => {
    return fetchAPI("/users/verify_reset_password/", {
      method: "PUT",
      body: JSON.stringify({ email, code }),
    })
  },

  // Set new password after reset
  setNewPassword: async (email: string, code: string, password: string) => {
    return fetchAPI("/users/verify_reset_password/", {
      method: "POST",
      body: JSON.stringify({ email, code, password }),
    })
  },
}

// Fix the Authorization header format in all API functions
// User profile APIs
export const userAPI = {

  getConfidenceScore: async (token: string) => {
  return fetchAPI("/users/confidence_score/", {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
},


    // Change major and academic year
  changeProfile: async (
    token: string,
    data: { major?: string; academic_year?: string }
  ) => {
    return fetchAPI("/users/change_profile/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    });
  },
    getAgreementStatus: async (token: string) => {
  return fetchAPI("/users/agreement/", {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
},

  // Get user profile
  getProfile: async (token: string) => {
    return fetchAPI("/users/my_profile/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },

  // Change profile picture
  changeProfilePicture: async (token: string, picture: File) => {
    const formData = new FormData()
    formData.append("picture", picture)

    return fetchAPI("/users/change_profile_picture/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        // Don't set Content-Type here, it will be set automatically with the boundary
      },
      body: formData,
    })
  },

  // Get profile picture URL
  getProfilePictureUrl: (userId: number) => {
    return `${API_BASE_URL}/users/profile_picture/${userId}/`
  },

  // Change email
  changeEmail: async (token: string, email: string) => {
    return fetchAPI("/users/change_email/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ email }),
    })
  },

  // Change password
  changePassword: async (token: string, oldPassword: string, newPassword: string) => {
    return fetchAPI("/users/change_password/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    })
  },
}

export const agreementAPI = {
  // GET agreement status or data
  get: async (token: string) => {
    return fetchAPI("/users/agreement/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },

  // POST to submit the agreement
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
      headers: {
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    });
  },
};
// Sessions and chat APIs
export const sessionAPI = {
  

  // Get all sessions
  getSessions: async (token: string) => {
    return fetchAPI("/users/sessions/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },
  submitConfidenceScore: async (token: string, score: number) => {
return fetchAPI("/users/submit_confidence_score/", {
method: "POST",
headers: {
Authorization: `Token ${token}`,
},
body: JSON.stringify({ score }),
});
},
  

  // Initialize chat for a session
  initializeChat: async (token: string, sessionId: number) => {
  try {
    const response = await fetchAPI("/users/initialize_chat/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ session_id: sessionId }),
    });

    // Ensure the response is an array
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Error initializing chat:", error);
    return [];
  }
},

  // Get chat messages for a session
  getChatMessages: async (token: string, sessionId: number) => {
    return fetchAPI(`/users/chat/?session_id=${sessionId}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },
  

  // Send a chat message
  sendChatMessage: async (token: string, sessionId: number, message: string) => {
    return fetchAPI("/users/chat/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ session_id: sessionId, message }),
    })
  },
  
  resetSession: async (token: string, sessionId: number) => {
  const response = await fetch(`${API_BASE_URL}/users/reset_session/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ session_id: sessionId }),
  });

  if (!response.ok) {
    throw new Error("Failed to reset session");
  }

  return response.json();
},
};
