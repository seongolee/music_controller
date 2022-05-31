from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response


# 모든 방 정보 확인
class RoomView(generics.ListAPIView, generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        # request.GET[] 데이터가 없을 경우 오류를 발생,
        # request.GET.get() 은 데이터가 없을 경우 None 을 반환해준다. / get('code', defaultValue)
        code = request.GET.get(self.lookup_url_kwarg)
        if code is not None:
            # code 에 맞는 방이 있는지 확인
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)

            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


# 방 참가
class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        # 세션을 가지고있는지 체크
        if not self.request.session.exists(self.request.session.session_key):
            # 세션을 만듬
            self.request.session.create()

        # post 방식 이기때문에 request.data.get
        code = request.data.get(self.lookup_url_kwarg)
        if code != '':
            room_result = Room.objects.filter(code=code)
            # 현재 참여하고있는 방 위치를 위해 저장
            self.request.session['room_code'] = code
            if room_result:
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)
            else:
                return Response({'Bad Request': 'Invalid Room Code'},
                                status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'Bad Request': 'Invalid post data, did not find a code key'},
                            status=status.HTTP_400_BAD_REQUEST)


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

            room = None
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

            self.request.session['room_code'] = room.code
            data = RoomSerializer(room).data
            data['is_host'] = True

            # 생성된 정보 반환
            return Response(data, status=room_status)


# 유저가 참여중인 방확인
class UserInRoom(APIView):
    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code': self.request.session.get('room_code')
        }
        return Response(data, status=status.HTTP_200_OK)


# 방 나가기
class LeaveRoom(APIView):
    def post(self, request):
        if 'room_code' in self.request.session:
            code = self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if room_results:
                room = room_results[0]
                room.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)


# 방 정보 업데이트
class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)

            # 방을 찾기 못함
            if not queryset.exists():
                return Response({'errorMsg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)
            else:
                room = queryset[0]
                user_id = self.request.session.session_key
                if room.host != user_id:
                    return Response({'errorMsg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)
                else:
                    room.guest_can_pause = guest_can_pause
                    room.votes_to_skip = votes_to_skip
                    room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                    data = RoomSerializer(room).data
                    data["successMsg"] = "Room updated successfully!"
                    return Response(data, status=status.HTTP_200_OK)

        # 유효하지 않은 데이터
        return Response({'errorMsg': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)