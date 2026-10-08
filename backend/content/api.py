from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .cache import get_payload


class ContentView(APIView):
    """GET /api/content/ — the whole site content in the shape of data.json."""

    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        response = Response(get_payload())
        response["Cache-Control"] = "no-store"
        return response
