import sys

import pygame

# 初始化
pygame.init()

# 设置窗口标题
pygame.display.set_caption('主窗口')

# 设置窗口大小
# 返回对应的表面对象
# 多次调用不会新建表面对象
screen = pygame.display.set_mode((800, 600))

# 用黑色填充表面对象
screen.fill((0, 0, 0))

# 载入图片
# 返回图片表面对象
image = pygame.image.load('image/xiaoxin.png')

# 在窗口表面的指定位置绘制另一个表面
screen.blit(image, (50, 50))

# 定义矩形对象
# x, y, width, height
# 矩形对象表示坐标系中的一个矩形
# 矩形对象有很多虚拟参数
# 可以获取和设置位置和大小
# rect = pygame.Rect(10, 10, 200, 100)

# 通过矩形对象让图片表面对象居中绘制
# 获取图片的矩形对象
rect = image.get_rect()
# 设置矩形的中心坐标为窗口表面的中心坐标
rect.center = (400, 300)
# 在窗口表面的指定矩形位置绘制另一个表面
screen.blit(image, rect)

# 控制FPS
# 创建Clock对象
clock = pygame.time.Clock()

# 定期发送事件
event = pygame.event.Event(pygame.USEREVENT, value="自定义事件")
pygame.time.set_timer(event, 1000)

# 定期发送事件
MY_EVENT = pygame.event.custom_type()
my_event = pygame.event.Event(MY_EVENT, value="我的自定义事件")
pygame.time.set_timer(my_event, 1000)

while True:
    # 处理事件
    for event in pygame.event.get():
        # 退出事件
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        # 键盘事件
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_LEFT:
                rect.x -= 1
            elif event.key == pygame.K_RIGHT:
                rect.x += 1
            elif event.key == pygame.K_UP:
                rect.y -= 1
            elif event.key == pygame.K_DOWN:
                rect.y += 1
        elif event.type == pygame.USEREVENT:
            print("USER EVENT:", event.value)
        elif event.type == MY_EVENT:
            print("MY EVENT:", event.value)

    # 刷新显示
    screen.fill((0, 0, 0))
    screen.blit(image, rect)

    # 控制FPS
    # 帧率不超过每秒60帧
    clock.tick(60)

    # 实际帧率
    print("实际帧率:", clock.get_fps())

    # 游戏运行时间
    print("游戏运行时间:", pygame.time.get_ticks())

    # 刷新窗口表面
    pygame.display.flip()
