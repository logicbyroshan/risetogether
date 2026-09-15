from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler to normalize API error responses across the application:
    {
        "status": "error",
        "message": "...",
        "errors": {...},
        "status_code": 400
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            "status": "error",
            "status_code": response.status_code,
            "message": "An error occurred while processing your request.",
            "errors": response.data,
        }

        # If there is a top-level 'detail' field, promote it to 'message'
        if isinstance(response.data, dict) and "detail" in response.data:
            custom_data["message"] = str(response.data["detail"])

        response.data = custom_data

    return response
