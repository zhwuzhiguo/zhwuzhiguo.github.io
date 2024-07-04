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

# 获取系统字体
font = pygame.font.SysFont("Arial Unicode", 30)
font.bold = True
font.italic = True
# 使用字体渲染文本
# 返回文本表面对象
text = font.render("你好GG", True, (0, 255, 0))
# 在窗口表面的指定位置绘制文本表面对象
screen.blit(text, (0, 0))

# 载入图片
# 返回图片表面对象
image = pygame.image.load('image/xiaoxin.png')
# 通过矩形对象让图片表面对象居中绘制
# 获取图片的矩形对象
rect = image.get_rect()
# 设置矩形的中心坐标为窗口表面的中心坐标
rect.center = (400, 300)
# 在窗口表面的指定矩形位置绘制另一个表面
screen.blit(image, rect)

while True:
    # pygame.key模块提供处理按键操作
    # 返回字典包含每个键的按下情况
    # 字典的键是按键常量
    # 字典的值是布尔值表示键是否持续按下
    keys = pygame.key.get_pressed()
    # print(keys)

    # 获取组合键
    mods = pygame.key.get_mods()
    # print(mods)

    if mods == pygame.KMOD_NONE:
        # print("没有按下组合键")
        pass
    elif mods & pygame.KMOD_SHIFT:
        print("按下组合键SHIFT")
        if keys[pygame.K_LEFT]:
            rect.x -= 1
        elif keys[pygame.K_RIGHT]:
            rect.x += 1
        elif keys[pygame.K_UP]:
            rect.y -= 1
        elif keys[pygame.K_DOWN]:
            rect.y += 1

    # 刷新显示
    screen.fill((0, 0, 0))
    screen.blit(image, rect)

    # 鼠标处理
    # 设置光标
    pygame.mouse.set_cursor(pygame.SYSTEM_CURSOR_CROSSHAIR)
    # 获取鼠标位置
    pos = "鼠标位置:" + str(pygame.mouse.get_pos())
    text = font.render(pos, True, (255, 255, 255))
    screen.blit(text, (0, 0))

    # 获取鼠标按键的按下状态
    button1, button2, button3 = pygame.mouse.get_pressed()
    if button1 or button2 or button3:
        print("button1:", button1)
        print("button2:", button2)
        print("button3:", button3)

    for event in pygame.event.get():
        # 退出事件
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # 刷新窗口表面
    pygame.display.flip()
