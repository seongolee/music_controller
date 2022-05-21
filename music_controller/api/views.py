from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response


# 방 정보 확인
class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


# 방 생성
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # 세션을 가지고있는지 체크
        if not self.request.session.exists(self.request.session.session_key):
            # 세션을 만듬
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        # 값이 정상적으로 들어왔는지 체크
        if serializer.is_valid():
            room_status = None
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)

            # 방이 있는지 체크, if: 업데이트, else: 방생성
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                room_status = status.HTTP_200_OK
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                room_status = status.HTTP_201_CREATED

            # 생성된 정보, 생성 성공 응답 코드인 201 을 반환
            return Response(RoomSerializer(room).data, status=room_status)
