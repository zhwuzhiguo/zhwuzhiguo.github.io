# 022-Python-StandardLibrary02

## main.py

```python
# Python 标准库第二部分涵盖的模块
# 包含在高级编程中
# 这一部分所涉及的模块很少运用在脚本中

import decimal
import logging

logging.warning("This is a warning")
logging.error("This is an error")
logging.info("This is an info")
logging.log(logging.ERROR, "error..")

f = 1.12345678901234567890
d = decimal.Decimal("1.12345678901234567890")
print("f:", f)
print("d:", d)
print("f + f =", f + f)
print("d + d =", d + d)

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    WARNING:root:This is a warning
    ERROR:root:This is an error
    ERROR:root:error..
    f: 1.1234567890123457
    d: 1.12345678901234567890
    f + f = 2.2469135780246914
    d + d = 2.24691357802469135780


# 完