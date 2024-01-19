# 002-Python模块-shutil-模块

## main.py

```python
# shutil 模块提供了一些针对文件和文件夹的高级操作
# shutil 模块是对 os 模块的补充
import os
import shutil

print("文件和文件夹操作:")

# 复制文件内容
fa = open("data/fa.txt", "r")
fb = open("data/fb.txt", "w")
shutil.copyfileobj(fa, fb)
fa.close()
fb.close()

# 复制文件内容
shutil.copyfile("data/fa.txt", "data/fc.txt")

# 复制文件内容和权限
shutil.copy("data/fa.txt", "data/fd.txt")

# 复制文件内容和权限
# 保留源文件的所有元数据(如创建时间、修改时间等)到目标文件
shutil.copy2("data/fa.txt", "data/fe.txt")

# 递归复制目录
# 创建忽略文件
shutil.copyfile("data/fa.txt", "data/temp.txt")
# 创建忽略模板
ignore_patterns = shutil.ignore_patterns('temp*')
# 递归复制目录
shutil.copytree("data", "data_copy", ignore=ignore_patterns)

# 移动文件或目录
shutil.move("data_copy", "data_copy_move")

# 改变所有者和所属组
shutil.chown("data_copy_move", "wuzhiguo", "staff")

# 删除目录(只能删除目录)
shutil.rmtree("data_copy_move")
# 删除文件
os.remove("data/fb.txt")
os.remove("data/fc.txt")
os.remove("data/fd.txt")
os.remove("data/fe.txt")
os.remove("data/temp.txt")

# 返回可执行文件路径
print(shutil.which("python3"))

# 磁盘使用信息
print(shutil.disk_usage("."))
print(shutil.disk_usage("/"))

print("归档操作:")

# 支持的归档格式列表
print(shutil.get_archive_formats())
# 支持的解压格式列表
print(shutil.get_unpack_formats())

# 创建归档文件
shutil.make_archive("temp/data", "zip", "data")

# 解压归档文件
shutil.unpack_archive("temp/data.zip", "temp/data", "zip")

# 删除临时目录
shutil.rmtree("temp")

print("查询终端大小:")
print(shutil.get_terminal_size())

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    文件和文件夹操作:
    /Users/wuzhiguo/py/pydemo/.venv/bin/python3
    usage(total=250656219136, used=228998246400, free=21657972736)
    usage(total=250656219136, used=228998246400, free=21657972736)
    归档操作:
    [('bztar', "bzip2'ed tar-file"), ('gztar', "gzip'ed tar-file"), ('tar', 'uncompressed tar file'), ('xztar', "xz'ed tar-file"), ('zip', 'ZIP file')]
    [('bztar', ['.tar.bz2', '.tbz2'], "bzip2'ed tar-file"), ('gztar', ['.tar.gz', '.tgz'], "gzip'ed tar-file"), ('tar', ['.tar'], 'uncompressed tar file'), ('xztar', ['.tar.xz', '.txz'], "xz'ed tar-file"), ('zip', ['.zip'], 'ZIP file')]
    查询终端大小:
    os.terminal_size(columns=80, lines=24)


# 完