from django.db import models
import string
import random


# unique code 생성
def generate_unique_code() -> string:
    length = 6

    while True:
        # 임의의 6자리 문자
        code = "".join(random.choices(string.ascii_uppercase, k=length))
        # Room database code 가 존재하는지 확인
        if Room.objects.filter(code=code).count() == 0:
            break

    return code


# Create your models here.
class Room(models.Model):
    # 방 번호
    code = models.CharField(max_length=8, default="", unique=True)
    # 방의 호스트
    host = models.CharField(max_length=50, unique=True)
    # 게스트가 음악을 정지하거나 실행
    guest_can_pause = models.BooleanField(null=False, default=False)
    # skip
    votes_to_skip = models.IntegerField(null=False, default=1)
    # 방 생성 시간, auto_now_add: 최초 저장 시에만 현재 날짜 생성, auto_now: model 이 save 될때마다 현재날자로 갱신한다.
    created_at = models.DateTimeField(auto_now_add=True)