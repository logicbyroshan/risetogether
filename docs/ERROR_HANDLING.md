# Error Handling & Normalization

This document outlines the standardized error handling pipeline spanning backend exception processing, HTTP transport, and frontend presentation.

---

## 1. Backend Exception Normalization

All exceptions in Django REST Framework pass through `config.exceptions.custom_exception_handler`.

### Handled Cases
1. **DRF ValidationError**: Converted into `{ "status_code": 400, "error": "Validation Error", "errors": { ... } }`.
2. **Authentication / Permission Denied (401 / 403)**: Normalized to `{ "status_code": 401|403, "error": "Authentication Failed"|"Permission Denied", "message": "..." }`.
3. **Http404**: Normalized to `{ "status_code": 404, "error": "Not Found", "message": "The requested resource was not found." }`.
4. **Unhandled Server Exceptions (500)**: Masked to prevent internal stack trace leakage in production while logging detailed traces to the backend server log.

---

## 2. Frontend Error Processing

- **Axios Interceptor**: `frontend/src/api/client.ts` intercepts rejected promises and extracts human-readable error messages from the normalized JSON payload.
- **Form Error Binding**: Form inputs display inline red validation messages underneath invalid inputs using the `Input` and `FormField` components.
- **Toast Notifications**: Server operation errors dispatch instant red error toast alerts through `useToast().error(...)`.
- **View-Level Error States**: When page queries fail, the `ErrorState` component renders a centered alert with an actionable "Retry" button.
