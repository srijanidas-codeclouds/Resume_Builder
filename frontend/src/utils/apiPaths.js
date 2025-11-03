export const BASE_API_URL = 'http://localhost:5000';

// Routes used in the application
export const API_PATHS = {
    AUTH:{
        REGISTER: `/api/auth/register`,
        LOGIN: `/api/auth/login`,
        GET_PROFILE: `/api/auth/profile`,
        LOGOUT: `/api/auth/logout`,
        VERIFY: `/api/auth/verify`,
        CONTACT: `/api/auth/contact`,
    },
    RESUME:{
        CREATE: `api/resumes`,
        GET_ALL: `api/resumes`,
        GET_BY_ID: (id) => `api/resumes/${id}`,
        UPDATE: (id) => `api/resumes/${id}`,
        DELETE: (id) => `api/resumes/${id}`,
        UPLOAD_IMAGES: (id) => `api/resumes/${id}/upload-images`,
    },
    image:{
        UPLOAD_IMAGE: 'api/auth/upload-image',
    }
}