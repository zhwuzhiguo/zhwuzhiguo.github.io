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

surface = pygame.Surface((400, 400))
surface.fill((255, 255, 255))

# 绘制矩形
# pygame.draw.rect(surface, (0, 255, 0), (0, 0, 200, 200))
pygame.draw.rect(surface, (0, 255, 0), (0, 0, 200, 200), width=2, border_radius=10)

# 绘制圆
# pygame.draw.circle(surface, (0, 0, 255), (200, 200), radius=100)
# pygame.draw.circle(surface, (0, 0, 255), (200, 200), radius=100, width=2)
pygame.draw.circle(surface, (0, 0, 255), (200, 200), radius=100, width=2, draw_top_right=True)

# 绘制多边形
pygame.draw.polygon(surface, (255, 0, 0), [(200, 200), (400, 200), (300, 300)], width=2)

while True:
    screen.fill((0, 0, 0))
    screen.blit(surface, (0, 0))

    for event in pygame.event.get():
        # 退出事件
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # 刷新窗口表面
    pygame.display.flip()
