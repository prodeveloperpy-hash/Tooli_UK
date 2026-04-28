from rest_framework import viewsets

from tooli_uk_app.models import User
from tooli_uk_app.serializers.user import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    