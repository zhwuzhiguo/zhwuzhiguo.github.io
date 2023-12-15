# 001-Python-环境搭建

[https://www.python.org/](https://www.python.org/)

[https://docs.python.org/zh-cn/3/](https://docs.python.org/zh-cn/3/)


## Mac

下载 Mac 安装包直接安装即可：

    python-3.12.1-macos11.pkg

安装目录：

    Python.framework pwd
    /Library/Frameworks/Python.framework
    
    Python.framework ll
    total 0
    lrwxr-xr-x  1 root  wheel    24B 12 12 11:58 Headers -> Versions/Current/Headers
    lrwxr-xr-x  1 root  wheel    23B 12 12 11:58 Python -> Versions/Current/Python
    lrwxr-xr-x  1 root  wheel    26B 12 12 11:58 Resources -> Versions/Current/Resources
    drwxrwxr-x  4 root  wheel   128B 12 12 11:58 Versions

可执行文件的符号链接位置：

    bin pwd
    /usr/local/bin
    
    bin ll /usr/local/bin/p*
    lrwxrwxr-x  1 root  admin    67B 12 12 11:59 /usr/local/bin/pip3 -> ../../../Library/Frameworks/Python.framework/Versions/3.12/bin/pip3
    lrwxrwxr-x  1 root  admin    70B 12 12 11:59 /usr/local/bin/pip3.12 -> ../../../Library/Frameworks/Python.framework/Versions/3.12/bin/pip3.12
    lrwxr-xr-x  1 root  wheel    69B 12 12 11:58 /usr/local/bin/pydoc3 -> ../../../Library/Frameworks/Python.framework/Versions/3.12/bin/pydoc3
    lrwxr-xr-x  1 root  wheel    72B 12 12 11:58 /usr/local/bin/pydoc3.12 -> ../../../Library/Frameworks/Python.framework/Versions/3.12/bin/pydoc3.12
    lrwxr-xr-x  1 root  wheel    70B 12 12 11:58 /usr/local/bin/python3 -> ../../../Library/Frameworks/Python.framework/Versions/3.12/bin/python3
    lrwxr-xr-x  1 root  wheel    77B 12 12 11:58 /usr/local/bin/python3-config -> ../../../Library/Frameworks/Python.framework/Versions/3.12/bin/python3-config
    lrwxr-xr-x  1 root  wheel    78B 12 12 11:58 /usr/local/bin/python3-intel64 -> ../../../Library/Frameworks/Python.framework/Versions/3.12/bin/python3-intel64
    lrwxr-xr-x  1 root  wheel    73B 12 12 11:58 /usr/local/bin/python3.12 -> ../../../Library/Frameworks/Python.framework/Versions/3.12/bin/python3.12
    lrwxr-xr-x  1 root  wheel    80B 12 12 11:58 /usr/local/bin/python3.12-config -> ../../../Library/Frameworks/Python.framework/Versions/3.12/bin/python3.12-config
    lrwxr-xr-x  1 root  wheel    81B 12 12 11:58 /usr/local/bin/python3.12-intel64 -> ../../../Library/Frameworks/Python.framework/Versions/3.12/bin/python3.12-intel64

验证安装成功：

    which python3
    /usr/local/bin/python3
    
    python3 --version
    Python 3.12.1

# 完