# 第02章-认识Java虚拟机的基本结构

## 2.1 Java虚拟机的架构

- 类加载子系统  
  负责从文件系统或者网络中加载Class信息，加载的类信息存放于一块称为方法区的内存空间中。除了类的信息，方法区中可能还会存放运行时常量池信息。

- Java堆  
  在虚拟机启动的时候建立，它是Java程序最主要的内存工作区域。堆空间是所有线程共享的。

- 直接内存  
  Java的NIO库允许Java程序使用直接内存。直接内存是在Java堆外的、直接向系统申请的内存区域。

- 垃圾回收系统  
  Java虚拟机的重要组成部分，垃圾回收器可以对方法区、Java堆和直接内存进行回收。其中，Java堆是垃圾收集器的工作重点。

- Java栈  
  每一个Java虚拟机线程都有一个私有的Java栈。一个线程的Java栈在线程创建的时候被创建。

- 本地方法栈  
  和Java栈非常类似，最大的不同在于Java栈用于Java方法的调用，而本地方法栈则用于本地方法的调用。

- PC寄存器  
  也是每个线程私有的空间，Java虚拟机会为每一个Java线程创建PC寄存器。  
  在任意时刻，一个Java线程总是在执行一个方法，这个正在被执行的方法称为当前方法。  
  如果当前方法不是本地方法，PC寄存器就会指向当前正在被执行的指令。  
  如果当前方法是本地方法，那么PC寄存器的值就是undefined。  

- 执行引擎  
  是Java虚拟机的最核心组件之一，它负责执行虚拟机的字节码。

## 2.2 设置Java虚拟机的参数

    java [-options] class [args...]
    java [-options] -jar jarfile [args...]

示例:

    public class SimpleArgs {

        public static void main(String[] args) {
            System.out.println(String.format("-Xmx: %sM", Runtime.getRuntime().maxMemory()/1024/1024));
            System.out.println(String.format("-Xmx: %s", Runtime.getRuntime().maxMemory()));
            for (int i = 0; i < args.length; i++) {
                System.out.println(String.format("args[%s]: %s", i, args[i]));
            }
        }
    }

执行:

    java -Xmx32M SimpleArgs aa bb cc
    -Xmx: 31M
    -Xmx: 32505856
    args[0]: aa
    args[1]: bb
    args[2]: cc

## 2.3 Java堆

- 新生代
  - eden
  - s0(from)
  - s1(to)
- 老年代(tenured)
    
根据垃圾回收机制的不同，Java堆有可能拥有不同的结构。  
最为常见的一种构成是将整个Java堆分为新生代和老年代。  
其中，新生代存放新生对象或者年龄不大的对象，老年代则存放老年对象。  
新生代有可能分为eden、s0、s1，其中s0和s1也被称为from和to区域，它们是两块大小相等、可以互换角色的内存空间。

在绝大多数情况下，对象首先在eden区分配，在一次新生代回收后，如果对象还存活，则会进入s0或者s1，之后，每经过一次新生代回收，对象如果存活，它的年龄就会加1。当对象的年龄达到一定条件后，就会被认为是老年对象，从而进入老年代。


## 2.4 Java栈

Java栈是一块线程私有的内存空间。  
线程执行的基本行为是函数调用，每次函数调用的数据都是通过Java栈传递的。

在Java栈中保存的主要内容为栈帧。  
每一次函数调用，都会有一个对应的栈帧被压入Java栈，每一次函数调用结束，都会有一个栈帧被弹出Java栈。  
在一个栈帧中，至少要包含局部变量表、操作数栈和帧数据区几部分。

每次函数调用都会生成对应的栈帧，从而占用一定的栈空间。当请求的栈深度大于最大可用栈深度时，系统就会抛出 **StackOverflowError** 栈溢出错误。

Java虚拟机提供了参数-Xss来指定线程的最大栈空间，这个参数也直接决定了函数调用的最大深度。

示例:

    public class TestStackDeep {

        private static int count = 0;

        public static void recursion() {
            count++;
            recursion();
        }

        public static void main(String[] args) {
            try {
                recursion();
            } catch (Throwable ex) {
                ex.printStackTrace();
                System.out.println(String.format("deep of calling = %s", count));
            }
        }
    }

执行:

    java -Xss160K TestStackDeep
    java.lang.StackOverflowError
            at TestStackDeep.recursion(TestStackDeep.java:6)
            at TestStackDeep.recursion(TestStackDeep.java:7)
            ...
    deep of calling = 850

    java -Xss200K TestStackDeep
    java.lang.StackOverflowError
            at TestStackDeep.recursion(TestStackDeep.java:6)
            at TestStackDeep.recursion(TestStackDeep.java:7)
            ...
    deep of calling = 1362

### 2.4.1 局部变量表

局部变量表是栈帧的重要组成部分之一。它用于保存函数的参数及局部变量。  
局部变量表中的变量只在当前函数调用中有效，当函数调用结束后，函数栈帧销毁，局部变量表也会随之销毁。  
由于局部变量表在栈帧之中，因此，如果函数的参数和局部变量较多，会使局部变量表膨胀，从而每一次函数调用就会占用更多的栈空间，最终导致函数的嵌套调用次数减少。

### 2.4.2 操作数栈

操作数栈也是栈帧中重要的内容之一，它主要用于保存计算过程的中间结果，同时作为计算过程中变量临时的存储空间。  
操作数栈也是一个先进后出的数据结构，只支持入栈和出栈两种操作。许多Java字节码指令都需要通过操作数栈进行参数传递。

### 2.4.3 帧数据区

除了局部变量表和操作数栈，Java栈帧还需要一些数据来支持常量池解析、正常方法返回和异常处理等。  
大部分Java字节码指令需要进行常量池访问，在帧数据区中保存着访问常量池的指针，方便程序访问常量池。  
当函数返回或者出现异常时，虚拟机必须恢复调用者函数的栈帧，并让调用者函数继续执行。  
对于异常处理，虚拟机必须有一个异常处理表，方便在发生异常的时候找到处理异常的代码，因此，异常处理表也是帧数据区中重要的一部分。

### 2.4.4 栈上分配

栈上分配是Java虚拟机提供的一项优化技术，它的基本思想是，对于那些线程私有的对象，可以将它们打散分配在栈上，而不是分配在堆上。  
分配在栈上的好处是可以在函数调用结束后自行销毁，而不需要垃圾回收器的介入，从而提高系统的性能。

## 2.5 方法区

方法区是一块所有线程共享的内存区域。它用于保存系统的类信息，比如类的字段、方法、常量池等。方法区的大小决定了系统可以保存多少个类，如果系统定义了太多的类，导致方法区溢出，虚拟机同样会抛出内存溢出错误。

在JDK 1.6、JDK 1.7中，方法区可以理解为永久区（Perm）。  
永久区可以使用参数-XX:PermSize和-XX:MaxPermSize指定，默认情况下，-XX:MaxPermSize为64MB。  
一个大的永久区可以保存更多的类信息。  
如果系统使用了一些动态代理，那么有可能会在运行时生成大量的类，这时就需要设置一个合理的永久区大小，确保不发生永久区内存溢出。

在JDK 1.8、JDK1.9、JDK1.10中，永久区已经被彻底移除。  
取而代之的是元数据区，元数据区大小可以使用参数-XX:MaxMetaspaceSize指定，这是一块堆外的直接内存。  
与永久区不同，如果不指定大小，默认情况下，虚拟机会耗尽所有的可用系统内存。

## 完