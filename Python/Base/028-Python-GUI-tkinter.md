# 028-Python-GUI-tkinter

## main.py

```python
# tkinter应用由四个部分组成:
# 窗口
# 控件
# 布局
# 事件
# 一共有三种布局方式:
# pack 上下左右四个方向排列简单布局
# grid 按行和列指定组件位置的网格布局
# place 需要指定组件精确位置的布局
import tkinter as tk
import tkinter.messagebox as mb

# 创建一个Tk窗口对象
root = tk.Tk()

# 窗口标题
root.title("主窗口")
# 窗口大小
root.geometry("1000x400")
# 窗口背景色
root.config(background="green")

# 框架组件
# 给组件分组
frame1 = tk.Frame(root, background="red")
frame2 = tk.Frame(root, background="green")
frame3 = tk.Frame(root, background="blue")
# 从左到右布局
frame1.pack(side="left", fill="both", expand=True)
frame2.pack(side="left", fill="both", expand=True)
frame3.pack(side="left", fill="both", expand=True)


# 按钮事件
def frame1_button_on_click():
    message = frame1Entry.get()
    mb.showinfo(title="信息", message=message)


# 按钮事件
def frame2_button_on_click():
    message = frame2Entry.get()
    mb.showwarning(title="信息", message=message)


# 按钮事件
def frame3_button_on_click():
    message = frame3Entry.get()
    mb.showerror(title="信息", message=message)


# 框架1的组件
frame1Label = tk.Label(frame1, text="请输入：")
frame1Entry = tk.Entry(frame1)
frame1Button = tk.Button(frame1, text="确定", command=frame1_button_on_click)
# pack布局
# 自顶向下
# 自动居中
frame1Label.pack()
frame1Entry.pack()
frame1Button.pack()

# 框架2的组件
frame2Label = tk.Label(frame2, text="请输入：")
frame2Entry = tk.Entry(frame2)
frame2Button = tk.Button(frame2, text="确定", command=frame2_button_on_click)
# grid布局
frame2Label.grid(row=0, column=0)
frame2Entry.grid(row=0, column=1)
frame2Button.grid(row=1, column=0, columnspan=2)

# 框架3的组件
frame3Label = tk.Label(frame3, text="请输入：")
frame3Entry = tk.Entry(frame3)
frame3Button = tk.Button(frame3, text="确定", command=frame3_button_on_click)
# place布局
frame3Label.place(x=0, y=5, anchor="nw")
frame3Entry.place(x=0, y=50, anchor="nw")
frame3Button.place(x=0, y=100, anchor="nw")

# 创建一个新窗口
# 需要继承一个窗口
# 父窗口关闭子窗口关闭
# 子窗口关闭父窗口不关闭
top = tk.Toplevel(root)
top.title("子窗口")


# 按钮事件
def top_button_on_click():
    message = topEntry.get()
    mb.showerror(title="信息", message=message)


# 创建组件
topLabel = tk.Label(top, text="请输入：")
topEntry = tk.Entry(top)
topButton = tk.Button(top, text="确定", command=top_button_on_click)
# 摆放组件
topLabel.place(x=0, y=5, anchor="nw")
topEntry.place(x=0, y=50, anchor="nw")
topButton.place(x=0, y=100, anchor="nw")

# 消息主循环
root.mainloop()


```

## 运行程序

见界面。

