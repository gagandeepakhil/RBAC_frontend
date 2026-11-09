// API base URLs are configurable via environment variables so the app can point at a
// local backend during development without editing source. See .env.example.
const API = {
    OTP_URL: process.env.REACT_APP_OTP_URL || "https://mail-otp-sender.vercel.app/",
    DATA_URL: process.env.REACT_APP_API_URL || "https://rvr-security-backend.vercel.app",
    DATA_ENDPOINTS:{
        "signin":"/api/users/login",
        "sendUserRequest":"/api/user-requests/send-request",
        "getAllRequests":"/api/user-requests/admin/requests",
        "updateRequestStatus":"/api/user-requests/admin/update-status",
        "getRoleById":"/api/roles/",
        "editUserDetails":"/api/users/",
        "getAllUsers":"/api/users/userslist",
        "getAllRoles":"/api/roles/roleslist",
        "deleteUser":"/api/users/",
        "addUser":"/api/users/add",
        "addRole":"/api/roles/define",
        "deleteRole":"/api/roles/",
        "editRole":"/api/roles/",
        "editPassword":"/api/users"
    }
}

export default API;
