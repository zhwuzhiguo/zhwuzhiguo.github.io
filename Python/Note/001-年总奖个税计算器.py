import sys

# 年终奖个税税率表
table = [(3000, 0.03, 0),
         (12000, 0.10, 210),
         (25000, 0.20, 1410),
         (35000, 0.25, 2660),
         (55000, 0.30, 4410),
         (80000, 0.35, 7160),
         (sys.maxsize, 0.45, 15160)]

# 计算年总奖
def calculate(money):
    if money >= 0:
        month = money / 12
        for upper, rate, deduct in table:
            if month <= upper:
                tax = money * rate - deduct
                return upper, rate, deduct, tax

    print("金额不在个税税率表范围内..")
    return 0, 0, 0, 0

# 执行
print("年总奖个税计算器")
money = int(input("请输入年终奖:"))
upper, rate, deduct, tax = calculate(money)
print("个税金额: {:.2f}".format(tax),
      "月纳税档: <={:d}".format(upper),
      "适用税率: {:d}%".format(int(rate * 100)),
      "速算扣除: {:d}".format(deduct),
      sep="\n",
      end="\n")
