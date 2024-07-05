# 004-pygame学习笔记四

## main.py

```python
import random
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


# 精灵
class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        # 精灵的表面和位置
        self.image = pygame.image.load("image/xiaoxin.png")
        self.rect = self.image.get_rect(center=(random.randint(0, 800), random.randint(0, 600)))

    def update(self):
        # 设置透明度
        self.image.set_alpha(random.randint(0, 255))
        # 设置位置
        self.rect.center = (random.randint(0, 800), random.randint(0, 600))
        # 当游戏启动3秒后杀死精灵
        if pygame.time.get_ticks() > 3000:
            self.kill()


# 精灵组
group = pygame.sprite.Group()
group.add(Player())
group.add(Player())

while True:
    screen.fill((0, 0, 0))

    # 绘制当前组中的精灵
    group.draw(screen)
    # 调用当前组中的每个精灵的update方法
    # 每次调用时还会检查当前精灵是否已被杀死
    # 已被杀死的精灵自动移出组
    group.update()

    for event in pygame.event.get():
        # 退出事件
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # 刷新窗口表面
    pygame.display.flip()

```

## main2.py

```python
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


# 玩家
class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.image.load("image/xiaoxin.png")
        self.rect = self.image.get_rect()


# 弹丸
class Bullet(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.image.load("image/bullet.png")
        self.rect = self.image.get_rect(center=(500, 500))


# 精灵组
player = Player()
bullet = Bullet()
player_group = pygame.sprite.Group(player)
bullet_group = pygame.sprite.Group(bullet)

while True:
    screen.fill((0, 0, 0))
    player_group.draw(screen)
    bullet_group.draw(screen)

    # 碰撞检测
    pygame.sprite.groupcollide(player_group, bullet_group, False, True)

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        bullet.rect.x -= 1
    elif keys[pygame.K_RIGHT]:
        bullet.rect.x += 1
    elif keys[pygame.K_UP]:
        bullet.rect.y -= 1
    elif keys[pygame.K_DOWN]:
        bullet.rect.y += 1

    for event in pygame.event.get():
        # 退出事件
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # 刷新窗口表面
    pygame.display.flip()

```

## main3.py

```python
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

# 定义图片表面
player = pygame.image.load("image/xiaoxin.png")
bullet = pygame.image.load("image/bullet.png")

# 将白色设置为透明色
player.set_colorkey((255, 255, 255))
bullet.set_colorkey((255, 255, 255))

# 掩码对象
player_mask = pygame.mask.from_surface(player)
bullet_mask = pygame.mask.from_surface(bullet)

# 位置
player_rect = player.get_rect()
bullet_rect = bullet.get_rect()

while True:
    screen.fill((0, 0, 0))
    screen.blit(player, (0, 0))
    screen.blit(bullet, bullet_rect)

    # 不规则图形碰撞检测
    offset = (bullet_rect.x - player_rect.x,
              bullet_rect.y - player_rect.y)
    result = player_mask.overlap(bullet_mask, offset)
    if result:
        pygame.display.set_caption("发生碰撞: " + str(result))
    else:
        pygame.display.set_caption("没有碰撞:" + str(result))

    # 随鼠标移动
    bullet_rect.center = pygame.mouse.get_pos()

    for event in pygame.event.get():
        # 退出事件
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # 刷新窗口表面
    pygame.display.flip()

```

