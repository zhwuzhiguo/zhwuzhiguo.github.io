# 第03章-常用Java虚拟机参数

## 3.1 跟踪调试参数

### 3.1.1 跟踪垃圾回收

示例:

    public class Example {

        public static void main(String[] args) {
            try {
                int n = 0;
                List<byte[]> bufferList = new ArrayList<>();
                while (true) {
                    byte[] buffer = new byte[1024 * 1024];
                    bufferList.add(buffer);
                    Thread.sleep(1000);
                    System.out.println(n++);
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

1. -XX:+PrintGC  
   打印简单GC日志

        java -Xmx16M -XX:+PrintGC Example
        0
        1
        2
        [GC (Allocation Failure)  3686K->3544K(15872K), 0.0031678 secs]
        3
        4
        5
        [GC (Allocation Failure)  6696K->6640K(15872K), 0.0028649 secs]
        6
        7
        8
        [GC (Allocation Failure)  9874K->9664K(15872K), 0.0030002 secs]
        [Full GC (Ergonomics)  9664K->9496K(15872K), 0.0061931 secs]
        9
        10
        11
        [Full GC (Ergonomics)  12648K->12557K(15872K), 0.0053136 secs]
        12
        [Full GC (Ergonomics)  13660K->13581K(15872K), 0.0028099 secs]
        [Full GC (Allocation Failure)  13581K->13581K(15872K), 0.0021486 secs]
        Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
            at Example.main(Example.java:11)

2. -XX:+PrintGCDetails  
   打印详细GC日志，并在虚拟机退出时打印堆的详细信息

        java -Xmx16M -XX:+PrintGCDetails Example
        0
        1
        2
        [GC (Allocation Failure) [PSYoungGen: 3686K->432K(4608K)] 3686K->3512K(15872K), 0.0030049 secs] [Times: user=0.01 sys=0.01, real=0.00 secs]
        3
        4
        5
        [GC (Allocation Failure) [PSYoungGen: 3584K->480K(4608K)] 6664K->6632K(15872K), 0.0031244 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        6
        7
        8
        [GC (Allocation Failure) [PSYoungGen: 3714K->400K(4608K)] 9866K->9624K(15872K), 0.0025028 secs] [Times: user=0.01 sys=0.00, real=0.01 secs]
        [Full GC (Ergonomics) [PSYoungGen: 400K->0K(4608K)] [ParOldGen: 9224K->9496K(11264K)] 9624K->9496K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0050699 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        9
        10
        11
        [Full GC (Ergonomics) [PSYoungGen: 3151K->2048K(4608K)] [ParOldGen: 9496K->10508K(11264K)] 12648K->12557K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0052673 secs] [Times: user=0.02 sys=0.01, real=0.01 secs]
        12
        [Full GC (Ergonomics) [PSYoungGen: 3151K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13660K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0028205 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        [Full GC (Allocation Failure) [PSYoungGen: 3072K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13581K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0020407 secs] [Times: user=0.00 sys=0.00, real=0.01 secs]
        Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
            at Example.main(Example.java:11)
        Heap
        PSYoungGen      total 4608K, used 3215K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 78% used [0x00000007bfb00000,0x00000007bfe23dc8,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 10508K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 93% used [0x00000007bf000000,0x00000007bfa433b8,0x00000007bfb00000)
        Metaspace       used 2673K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 289K, capacity 386K, committed 512K, reserved 1048576K

3. -XX:+PrintHeapAtGC  
   每次GC前后分别打印堆的详细信息

        java -Xmx16M -XX:+PrintGCDetails -XX:+PrintHeapAtGC Example
        0
        1
        2
        {Heap before GC invocations=1 (full 0):
        PSYoungGen      total 4608K, used 3686K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 89% used [0x00000007bfb00000,0x00000007bfe99808,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        to   space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        ParOldGen       total 11264K, used 0K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 0% used [0x00000007bf000000,0x00000007bf000000,0x00000007bfb00000)
        Metaspace       used 2642K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        [GC (Allocation Failure) [PSYoungGen: 3686K->464K(4608K)] 3686K->3544K(15872K), 0.0029769 secs] [Times: user=0.01 sys=0.01, real=0.00 secs]
        Heap after GC invocations=1 (full 0):
        PSYoungGen      total 4608K, used 464K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 0% used [0x00000007bfb00000,0x00000007bfb00000,0x00000007bff00000)
        from space 512K, 90% used [0x00000007bff00000,0x00000007bff74010,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 3080K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 27% used [0x00000007bf000000,0x00000007bf302030,0x00000007bfb00000)
        Metaspace       used 2642K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        }
        3
        4
        5
        {Heap before GC invocations=2 (full 0):
        PSYoungGen      total 4608K, used 3616K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 76% used [0x00000007bfb00000,0x00000007bfe140a0,0x00000007bff00000)
        from space 512K, 90% used [0x00000007bff00000,0x00000007bff74010,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 3080K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 27% used [0x00000007bf000000,0x00000007bf302030,0x00000007bfb00000)
        Metaspace       used 2642K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        [GC (Allocation Failure) [PSYoungGen: 3616K->480K(4608K)] 6696K->6632K(15872K), 0.0028242 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        Heap after GC invocations=2 (full 0):
        PSYoungGen      total 4608K, used 480K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 0% used [0x00000007bfb00000,0x00000007bfb00000,0x00000007bff00000)
        from space 512K, 93% used [0x00000007bff80000,0x00000007bfff8020,0x00000007c0000000)
        to   space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        ParOldGen       total 11264K, used 6152K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 54% used [0x00000007bf000000,0x00000007bf602060,0x00000007bfb00000)
        Metaspace       used 2642K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        }
        6
        7
        8
        {Heap before GC invocations=3 (full 0):
        PSYoungGen      total 4608K, used 3714K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 78% used [0x00000007bfb00000,0x00000007bfe288d8,0x00000007bff00000)
        from space 512K, 93% used [0x00000007bff80000,0x00000007bfff8020,0x00000007c0000000)
        to   space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        ParOldGen       total 11264K, used 6152K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 54% used [0x00000007bf000000,0x00000007bf602060,0x00000007bfb00000)
        Metaspace       used 2643K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        [GC (Allocation Failure) [PSYoungGen: 3714K->352K(4608K)] 9866K->9576K(15872K), 0.0028015 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        Heap after GC invocations=3 (full 0):
        PSYoungGen      total 4608K, used 352K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 0% used [0x00000007bfb00000,0x00000007bfb00000,0x00000007bff00000)
        from space 512K, 68% used [0x00000007bff00000,0x00000007bff58000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 9224K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 81% used [0x00000007bf000000,0x00000007bf902090,0x00000007bfb00000)
        Metaspace       used 2643K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        }
        {Heap before GC invocations=4 (full 1):
        PSYoungGen      total 4608K, used 352K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 0% used [0x00000007bfb00000,0x00000007bfb00000,0x00000007bff00000)
        from space 512K, 68% used [0x00000007bff00000,0x00000007bff58000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 9224K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 81% used [0x00000007bf000000,0x00000007bf902090,0x00000007bfb00000)
        Metaspace       used 2643K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        [Full GC (Ergonomics) [PSYoungGen: 352K->0K(4608K)] [ParOldGen: 9224K->9496K(11264K)] 9576K->9496K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0061515 secs] [Times: user=0.03 sys=0.00, real=0.01 secs]
        Heap after GC invocations=4 (full 1):
        PSYoungGen      total 4608K, used 0K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 0% used [0x00000007bfb00000,0x00000007bfb00000,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 9496K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 84% used [0x00000007bf000000,0x00000007bf9463f0,0x00000007bfb00000)
        Metaspace       used 2643K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        }
        9
        10
        11
        {Heap before GC invocations=5 (full 2):
        PSYoungGen      total 4608K, used 3151K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 76% used [0x00000007bfb00000,0x00000007bfe13dc0,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 9496K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 84% used [0x00000007bf000000,0x00000007bf9463f0,0x00000007bfb00000)
        Metaspace       used 2643K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        [Full GC (Ergonomics) [PSYoungGen: 3151K->2048K(4608K)] [ParOldGen: 9496K->10508K(11264K)] 12648K->12557K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0054302 secs] [Times: user=0.02 sys=0.01, real=0.00 secs]
        Heap after GC invocations=5 (full 2):
        PSYoungGen      total 4608K, used 2048K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 50% used [0x00000007bfb00000,0x00000007bfd00070,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 10508K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 93% used [0x00000007bf000000,0x00000007bfa433b8,0x00000007bfb00000)
        Metaspace       used 2643K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        }
        12
        {Heap before GC invocations=6 (full 3):
        PSYoungGen      total 4608K, used 3151K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 76% used [0x00000007bfb00000,0x00000007bfe13ec0,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 10508K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 93% used [0x00000007bf000000,0x00000007bfa433b8,0x00000007bfb00000)
        Metaspace       used 2643K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        [Full GC (Ergonomics) [PSYoungGen: 3151K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13660K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0029247 secs] [Times: user=0.01 sys=0.00, real=0.01 secs]
        Heap after GC invocations=6 (full 3):
        PSYoungGen      total 4608K, used 3072K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 75% used [0x00000007bfb00000,0x00000007bfe00080,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 10508K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 93% used [0x00000007bf000000,0x00000007bfa433b8,0x00000007bfb00000)
        Metaspace       used 2643K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        }
        {Heap before GC invocations=7 (full 4):
        PSYoungGen      total 4608K, used 3072K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 75% used [0x00000007bfb00000,0x00000007bfe00080,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 10508K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 93% used [0x00000007bf000000,0x00000007bfa433b8,0x00000007bfb00000)
        Metaspace       used 2643K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        [Full GC (Allocation Failure) [PSYoungGen: 3072K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13581K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0020134 secs] [Times: user=0.00 sys=0.00, real=0.00 secs]
        Heap after GC invocations=7 (full 4):
        PSYoungGen      total 4608K, used 3072K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 75% used [0x00000007bfb00000,0x00000007bfe00080,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 10508K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 93% used [0x00000007bf000000,0x00000007bfa433b8,0x00000007bfb00000)
        Metaspace       used 2643K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 285K, capacity 386K, committed 512K, reserved 1048576K
        }
        Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
            at Example.main(Example.java:11)
        Heap
        PSYoungGen      total 4608K, used 3215K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 78% used [0x00000007bfb00000,0x00000007bfe23dc8,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 10508K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 93% used [0x00000007bf000000,0x00000007bfa433b8,0x00000007bfb00000)
        Metaspace       used 2673K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 289K, capacity 386K, committed 512K, reserved 1048576K

4. -XX:+PrintGCTimeStamps  
   每次GC时输出发生时间，该时间为虚拟机启动后的时间偏移量(秒)  
   补充:
   -XX:+PrintGCDateStamps
   每次GC时输出发生日期时间

        java -Xmx16M -XX:+PrintGCDetails -XX:+PrintGCTimeStamps Example
        0
        1
        2
        3.090: [GC (Allocation Failure) [PSYoungGen: 3686K->464K(4608K)] 3686K->3544K(15872K), 0.0030157 secs] [Times: user=0.01 sys=0.01, real=0.01 secs]
        3
        4
        5
        6.103: [GC (Allocation Failure) [PSYoungGen: 3616K->448K(4608K)] 6696K->6600K(15872K), 0.0028802 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        6
        7
        8
        9.117: [GC (Allocation Failure) [PSYoungGen: 3682K->400K(4608K)] 9834K->9624K(15872K), 0.0019963 secs] [Times: user=0.00 sys=0.00, real=0.00 secs]
        9.119: [Full GC (Ergonomics) [PSYoungGen: 400K->0K(4608K)] [ParOldGen: 9224K->9496K(11264K)] 9624K->9496K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0043771 secs] [Times: user=0.03 sys=0.00, real=0.01 secs]
        9
        10
        11
        12.130: [Full GC (Ergonomics) [PSYoungGen: 3151K->2048K(4608K)] [ParOldGen: 9496K->10508K(11264K)] 12648K->12557K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0037435 secs] [Times: user=0.01 sys=0.00, real=0.01 secs]
        12
        13.135: [Full GC (Ergonomics) [PSYoungGen: 3151K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13660K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0018951 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        13.136: [Full GC (Allocation Failure) [PSYoungGen: 3072K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13581K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0013839 secs] [Times: user=0.00 sys=0.00, real=0.00 secs]
        Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
            at Example.main(Example.java:11)
        Heap
        PSYoungGen      total 4608K, used 3215K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 78% used [0x00000007bfb00000,0x00000007bfe23dc8,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 10508K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 93% used [0x00000007bf000000,0x00000007bfa433b8,0x00000007bfb00000)
        Metaspace       used 2673K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 289K, capacity 386K, committed 512K, reserved 1048576K
   

        java -Xmx16M -XX:+PrintGCDetails -XX:+PrintGCDateStamps Example
        0
        1
        2
        2022-02-05T12:24:30.892-0800: [GC (Allocation Failure) [PSYoungGen: 3686K->464K(4608K)] 3686K->3544K(15872K), 0.0033831 secs] [Times: user=0.01 sys=0.01, real=0.00 secs]
        3
        4
        5
        2022-02-05T12:24:33.902-0800: [GC (Allocation Failure) [PSYoungGen: 3616K->464K(4608K)] 6696K->6624K(15872K), 0.0031104 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        6
        7
        8
        2022-02-05T12:24:36.919-0800: [GC (Allocation Failure) [PSYoungGen: 3698K->416K(4608K)] 9858K->9648K(15872K), 0.0029916 secs] [Times: user=0.01 sys=0.00, real=0.01 secs]
        2022-02-05T12:24:36.922-0800: [Full GC (Ergonomics) [PSYoungGen: 416K->0K(4608K)] [ParOldGen: 9232K->9496K(11264K)] 9648K->9496K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0062963 secs] [Times: user=0.04 sys=0.00, real=0.00 secs]
        9
        10
        11
        2022-02-05T12:24:39.940-0800: [Full GC (Ergonomics) [PSYoungGen: 3151K->2048K(4608K)] [ParOldGen: 9496K->10508K(11264K)] 12648K->12557K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0054828 secs] [Times: user=0.02 sys=0.01, real=0.00 secs]
        12
        2022-02-05T12:24:40.951-0800: [Full GC (Ergonomics) [PSYoungGen: 3151K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13660K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0028183 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        2022-02-05T12:24:40.953-0800: [Full GC (Allocation Failure) [PSYoungGen: 3072K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13581K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0022320 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
            at Example.main(Example.java:11)
        Heap
        PSYoungGen      total 4608K, used 3215K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 78% used [0x00000007bfb00000,0x00000007bfe23dc8,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 10508K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 93% used [0x00000007bf000000,0x00000007bfa433b8,0x00000007bfb00000)
        Metaspace       used 2673K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 289K, capacity 386K, committed 512K, reserved 1048576K

5. -XX:+PrintGCApplicationConcurrentTime  
   打印程序的执行时间

6. -XX:+PrintGCApplicationStoppedTime  
   打印程序的停顿时间

        java -Xmx16M -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCApplicationConcurrentTime -XX:+PrintGCApplicationStoppedTime Example
        0
        1
        2
        3.089: Application time: 3.0240762 seconds
        3.089: [GC (Allocation Failure) [PSYoungGen: 3686K->496K(4608K)] 3686K->3576K(15872K), 0.0031226 secs] [Times: user=0.02 sys=0.01, real=0.01 secs]
        3.092: Total time for which application threads were stopped: 0.0033339 seconds, Stopping threads took: 0.0000254 seconds
        3
        4.094: Application time: 1.0015815 seconds
        4.094: Total time for which application threads were stopped: 0.0001364 seconds, Stopping threads took: 0.0000212 seconds
        4
        5
        6.098: Application time: 2.0035680 seconds
        6.098: [GC (Allocation Failure) [PSYoungGen: 3648K->480K(4608K)] 6728K->6632K(15872K), 0.0032441 secs] [Times: user=0.01 sys=0.00, real=0.01 secs]
        6.101: Total time for which application threads were stopped: 0.0034739 seconds, Stopping threads took: 0.0000188 seconds
        6
        7
        8
        9.108: Application time: 3.0072146 seconds
        9.109: [GC (Allocation Failure) [PSYoungGen: 3714K->432K(4608K)] 9866K->9656K(15872K), 0.0029418 secs] [Times: user=0.01 sys=0.00, real=0.01 secs]
        9.112: [Full GC (Ergonomics) [PSYoungGen: 432K->0K(4608K)] [ParOldGen: 9224K->9496K(11264K)] 9656K->9496K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0061786 secs] [Times: user=0.04 sys=0.00, real=0.00 secs]
        9.118: Total time for which application threads were stopped: 0.0093366 seconds, Stopping threads took: 0.0000267 seconds
        9
        10
        11
        12.126: Application time: 3.0077382 seconds
        12.126: [Full GC (Ergonomics) [PSYoungGen: 3151K->2048K(4608K)] [ParOldGen: 9496K->10508K(11264K)] 12648K->12557K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0054486 secs] [Times: user=0.02 sys=0.01, real=0.01 secs]
        12.131: Total time for which application threads were stopped: 0.0055909 seconds, Stopping threads took: 0.0000191 seconds
        12
        13.134: Application time: 1.0024007 seconds
        13.134: [Full GC (Ergonomics) [PSYoungGen: 3151K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13660K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0028855 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        13.137: [Full GC (Allocation Failure) [PSYoungGen: 3072K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13581K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0021156 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        13.139: Total time for which application threads were stopped: 0.0052156 seconds, Stopping threads took: 0.0000164 seconds
        Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
            at Example.main(Example.java:11)
        Heap
        PSYoungGen      total 4608K, used 3215K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 78% used [0x00000007bfb00000,0x00000007bfe23dc8,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 10508K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 93% used [0x00000007bf000000,0x00000007bfa433b8,0x00000007bfb00000)
        Metaspace       used 2673K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 289K, capacity 386K, committed 512K, reserved 1048576K
        13.140: Application time: 0.0014468 seconds

7. -XX:+PrintReferenceGC  
   打印软引用、弱引用、虚引用和Finallize队列

        java -Xmx16M -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintReferenceGC Example
        0
        1
        2
        3.086: [GC (Allocation Failure) 3.089: [SoftReference, 0 refs, 0.0000330 secs]3.089: [WeakReference, 9 refs, 0.0000122 secs]3.089: [FinalReference, 11 refs, 0.0000267 secs]3.089: [PhantomReference, 0 refs, 0 refs, 0.0000146 secs]3.089: [JNI Weak Reference, 0.0000167 secs][PSYoungGen: 3686K->464K(4608K)] 3686K->3544K(15872K), 0.0034884 secs] [Times: user=0.01 sys=0.01, real=0.00 secs]
        3
        4
        5
        6.102: [GC (Allocation Failure) 6.104: [SoftReference, 0 refs, 0.0000697 secs]6.104: [WeakReference, 8 refs, 0.0000126 secs]6.104: [FinalReference, 6 refs, 0.0000415 secs]6.104: [PhantomReference, 0 refs, 0 refs, 0.0000169 secs]6.104: [JNI Weak Reference, 0.0000113 secs][PSYoungGen: 3616K->416K(4608K)] 6696K->6568K(15872K), 0.0030646 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        6
        7
        8
        9.118: [GC (Allocation Failure) 9.121: [SoftReference, 0 refs, 0.0000361 secs]9.121: [WeakReference, 8 refs, 0.0000129 secs]9.121: [FinalReference, 5 refs, 0.0000098 secs]9.121: [PhantomReference, 0 refs, 0 refs, 0.0000089 secs]9.121: [JNI Weak Reference, 0.0000058 secs][PSYoungGen: 3650K->432K(4608K)] 9802K->9656K(15872K), 0.0027102 secs] [Times: user=0.01 sys=0.01, real=0.00 secs]
        9.121: [Full GC (Ergonomics) 9.122: [SoftReference, 0 refs, 0.0000164 secs]9.122: [WeakReference, 2 refs, 0.0000071 secs]9.122: [FinalReference, 0 refs, 0.0000071 secs]9.122: [PhantomReference, 0 refs, 0 refs, 0.0000077 secs]9.122: [JNI Weak Reference, 0.0000048 secs][PSYoungGen: 432K->0K(4608K)] [ParOldGen: 9224K->9496K(11264K)] 9656K->9496K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0054174 secs] [Times: user=0.03 sys=0.00, real=0.01 secs]
        9
        10
        11
        12.140: [Full GC (Ergonomics) 12.140: [SoftReference, 37 refs, 0.0000407 secs]12.140: [WeakReference, 7 refs, 0.0000498 secs]12.141: [FinalReference, 0 refs, 0.0000143 secs]12.141: [PhantomReference, 0 refs, 0 refs, 0.0000119 secs]12.141: [JNI Weak Reference, 0.0000075 secs][PSYoungGen: 3151K->2048K(4608K)] [ParOldGen: 9496K->10508K(11264K)] 12648K->12557K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0055450 secs] [Times: user=0.02 sys=0.00, real=0.01 secs]
        12
        13.148: [Full GC (Ergonomics) 13.148: [SoftReference, 19 refs, 0.0000418 secs]13.149: [WeakReference, 2 refs, 0.0000161 secs]13.149: [FinalReference, 0 refs, 0.0000094 secs]13.149: [PhantomReference, 0 refs, 0 refs, 0.0000114 secs]13.149: [JNI Weak Reference, 0.0000074 secs][PSYoungGen: 3151K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13660K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0029914 secs] [Times: user=0.01 sys=0.01, real=0.00 secs]
        13.151: [Full GC (Allocation Failure) 13.151: [SoftReference, 19 refs, 0.0000288 secs]13.151: [WeakReference, 2 refs, 0.0000088 secs]13.151: [FinalReference, 0 refs, 0.0000111 secs]13.151: [PhantomReference, 0 refs, 0 refs, 0.0000140 secs]13.151: [JNI Weak Reference, 0.0000086 secs][PSYoungGen: 3072K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13581K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0022215 secs] [Times: user=0.01 sys=0.00, real=0.00 secs]
        Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
            at Example.main(Example.java:11)
        Heap
        PSYoungGen      total 4608K, used 3215K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 78% used [0x00000007bfb00000,0x00000007bfe23dc8,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 10508K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 93% used [0x00000007bf000000,0x00000007bfa433b8,0x00000007bfb00000)
        Metaspace       used 2673K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 289K, capacity 386K, committed 512K, reserved 1048576K

8. -Xloggc:log/gc.log  
   将GC日志以文件的形式输出
   
        java -Xmx16M \
        -XX:+PrintGCDetails \
        -XX:+PrintGCDateStamps \
        -XX:+PrintGCTimeStamps \
        -XX:+PrintGCApplicationConcurrentTime \
        -XX:+PrintGCApplicationStoppedTime \
        -Xloggc:log/gc.log \
        Example
        0
        1
        2
        3
        4
        5
        6
        7
        8
        9
        10
        11
        12
        Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
            at Example.main(Example.java:11)

    gc.log

        Java HotSpot(TM) 64-Bit Server VM (25.201-b09) for bsd-amd64 JRE (1.8.0_201-b09), built on Dec 15 2018 18:35:23 by "java_re" with gcc 4.2.1 (Based on Apple Inc. build 5658) (LLVM build 2336.11.00)
        Memory: 4k page, physical 16777216k(281224k free)

        /proc/meminfo:

        CommandLine flags: -XX:InitialHeapSize=16777216 -XX:MaxHeapSize=16777216 -XX:+PrintGC -XX:+PrintGCApplicationConcurrentTime -XX:+PrintGCApplicationStoppedTime -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC 
        2022-02-05T12:28:30.718-0800: 3.084: Application time: 3.0219232 seconds
        2022-02-05T12:28:30.718-0800: 3.084: [GC (Allocation Failure) [PSYoungGen: 3686K->448K(4608K)] 3686K->3528K(15872K), 0.0035462 secs] [Times: user=0.01 sys=0.01, real=0.01 secs] 
        2022-02-05T12:28:30.722-0800: 3.088: Total time for which application threads were stopped: 0.0038202 seconds, Stopping threads took: 0.0000321 seconds
        2022-02-05T12:28:31.732-0800: 4.098: Application time: 1.0103256 seconds
        2022-02-05T12:28:31.732-0800: 4.098: Total time for which application threads were stopped: 0.0000625 seconds, Stopping threads took: 0.0000171 seconds
        2022-02-05T12:28:33.734-0800: 6.100: Application time: 2.0018285 seconds
        2022-02-05T12:28:33.734-0800: 6.100: [GC (Allocation Failure) [PSYoungGen: 3600K->464K(4608K)] 6680K->6624K(15872K), 0.0026998 secs] [Times: user=0.01 sys=0.00, real=0.00 secs] 
        2022-02-05T12:28:33.737-0800: 6.103: Total time for which application threads were stopped: 0.0028806 seconds, Stopping threads took: 0.0000187 seconds
        2022-02-05T12:28:36.744-0800: 9.110: Application time: 3.0068361 seconds
        2022-02-05T12:28:36.744-0800: 9.110: [GC (Allocation Failure) [PSYoungGen: 3698K->416K(4608K)] 9858K->9648K(15872K), 0.0023350 secs] [Times: user=0.01 sys=0.01, real=0.00 secs] 
        2022-02-05T12:28:36.746-0800: 9.112: [Full GC (Ergonomics) [PSYoungGen: 416K->0K(4608K)] [ParOldGen: 9232K->9496K(11264K)] 9648K->9496K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0055267 secs] [Times: user=0.03 sys=0.00, real=0.01 secs] 
        2022-02-05T12:28:36.752-0800: 9.118: Total time for which application threads were stopped: 0.0080914 seconds, Stopping threads took: 0.0000156 seconds
        2022-02-05T12:28:39.761-0800: 12.127: Application time: 3.0091740 seconds
        2022-02-05T12:28:39.761-0800: 12.127: [Full GC (Ergonomics) [PSYoungGen: 3151K->2048K(4608K)] [ParOldGen: 9496K->10508K(11264K)] 12648K->12557K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0052832 secs] [Times: user=0.02 sys=0.00, real=0.00 secs] 
        2022-02-05T12:28:39.766-0800: 12.132: Total time for which application threads were stopped: 0.0054568 seconds, Stopping threads took: 0.0000182 seconds
        2022-02-05T12:28:40.770-0800: 13.137: Application time: 1.0043150 seconds
        2022-02-05T12:28:40.771-0800: 13.137: [Full GC (Ergonomics) [PSYoungGen: 3151K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13660K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0028461 secs] [Times: user=0.01 sys=0.01, real=0.00 secs] 
        2022-02-05T12:28:40.774-0800: 13.140: [Full GC (Allocation Failure) [PSYoungGen: 3072K->3072K(4608K)] [ParOldGen: 10508K->10508K(11264K)] 13581K->13581K(15872K), [Metaspace: 2643K->2643K(1056768K)], 0.0020123 secs] [Times: user=0.01 sys=0.00, real=0.00 secs] 
        2022-02-05T12:28:40.776-0800: 13.142: Total time for which application threads were stopped: 0.0051158 seconds, Stopping threads took: 0.0000147 seconds
        Heap
        PSYoungGen      total 4608K, used 3215K [0x00000007bfb00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4096K, 78% used [0x00000007bfb00000,0x00000007bfe23dc8,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        to   space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        ParOldGen       total 11264K, used 10508K [0x00000007bf000000, 0x00000007bfb00000, 0x00000007bfb00000)
        object space 11264K, 93% used [0x00000007bf000000,0x00000007bfa433b8,0x00000007bfb00000)
        Metaspace       used 2673K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 289K, capacity 386K, committed 512K, reserved 1048576K
        2022-02-05T12:28:40.777-0800: 13.143: Application time: 0.0013801 seconds

### 3.1.2 跟踪类加载/卸载

1. -verbose:class  
   跟踪类的加载/卸载

        java -verbose:class Example
        [Opened /Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home/jre/lib/rt.jar]
        [Loaded java.lang.Object from /Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home/jre/lib/rt.jar]
        [Loaded java.io.Serializable from /Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home/jre/lib/rt.jar]
        [Loaded java.lang.Comparable from /Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home/jre/lib/rt.jar]
        [Loaded java.lang.CharSequence from /Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home/jre/lib/rt.jar]
        [Loaded java.lang.String from /Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home/jre/lib/rt.jar]
        ...
        [Loaded Example from file:/Users/wuzhiguo/IdeaProjects/sample/out/production/sample/]
        [Loaded sun.launcher.LauncherHelper$FXHelper from /Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home/jre/lib/rt.jar]
        [Loaded java.lang.Class$MethodArray from /Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home/jre/lib/rt.jar]
        [Loaded java.lang.Void from /Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home/jre/lib/rt.jar]
        0
        1

2. -XX:+TraceClassLoading  
   跟踪类的加载

3. -XX:+TraceClassUnloading  
   跟踪类的卸载

### 3.1.3 查看系统参数

1. -XX:+PrintVMOptions  
   在程序运行时打印虚拟机接收到的命令行显示参数

        java -Xmx16M \
        -XX:+PrintGCDetails \
        -XX:+PrintGCDateStamps \
        -XX:+PrintGCTimeStamps \
        -XX:+PrintVMOptions \
        Example
        VM option '+PrintGCDetails'
        VM option '+PrintGCDateStamps'
        VM option '+PrintGCTimeStamps'
        VM option '+PrintVMOptions'
        0
        1
        2

2. -XX:+PrintCommandLineFlags  
   在程序运行时打印虚拟机接收到的命令行显示参数和隐式参数

        java -Xmx16M \
        -XX:+PrintGCDetails \
        -XX:+PrintGCDateStamps \
        -XX:+PrintGCTimeStamps \
        -XX:+PrintCommandLineFlags \
        Example
        -XX:InitialHeapSize=16777216 -XX:MaxHeapSize=16777216 -XX:+PrintCommandLineFlags -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC
        0
        1
        2


        java \
        -XX:InitialHeapSize=1024000000 \
        -XX:MaxHeapSize=2048000000 \
        -XX:+PrintGCDetails \
        -XX:+PrintGCDateStamps \
        -XX:+PrintGCTimeStamps \
        -XX:+PrintCommandLineFlags \
        Example
        -XX:InitialHeapSize=1024000000 -XX:MaxHeapSize=2048000000 -XX:+PrintCommandLineFlags -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC
        0
        1
        2

3. -XX:+PrintFlagsFinal  
   打印所有的系统参数

        java -Xmx16M \
        -XX:+PrintGCDetails \
        -XX:+PrintGCDateStamps \
        -XX:+PrintGCTimeStamps \
        -XX:+PrintFlagsFinal \
        Example
        [Global flags]
            intx ActiveProcessorCount                      = -1                                  {product}
            uintx AdaptiveSizeDecrementScaleFactor          = 4                                   {product}
            uintx AdaptiveSizeMajorGCDecayTimeScale         = 10                                  {product}
            uintx AdaptiveSizePausePolicy                   = 0                                   {product}
            uintx AdaptiveSizePolicyCollectionCostMargin    = 50                                  {product}
            uintx AdaptiveSizePolicyInitializingSteps       = 20                                  {product}
            uintx AdaptiveSizePolicyOutputInterval          = 0                                   {product}
            uintx AdaptiveSizePolicyWeight                  = 10                                  {product}
            uintx AdaptiveSizeThroughPutPolicy              = 0                                   {product}
            uintx AdaptiveTimeWeight                        = 25                                  {product}
            bool AdjustConcurrency                         = false                               {product}
            bool AggressiveHeap                            = false                               {product}
            bool AggressiveOpts                            = false                               {product}
            intx AliasLevel                                = 3                                   {C2 product}
            bool AlignVector                               = false                               {C2 product}
            intx AllocateInstancePrefetchLines             = 1                                   {product}
            intx AllocatePrefetchDistance                  = 192                                 {product}
            intx AllocatePrefetchInstr                     = 0                                   {product}
            intx AllocatePrefetchLines                     = 4                                   {product}
            intx AllocatePrefetchStepSize                  = 64                                  {product}
            intx AllocatePrefetchStyle                     = 1                                   {product}
            bool AllowJNIEnvProxy                          = false                               {product}
            bool AllowNonVirtualCalls                      = false                               {product}
            bool AllowParallelDefineClass                  = false                               {product}
            bool AllowUserSignalHandlers                   = false                               {product}
            bool AlwaysActAsServerClassMachine             = false                               {product}
            bool AlwaysCompileLoopMethods                  = false                               {product}
            bool AlwaysLockClassLoader                     = false                               {product}
            bool AlwaysPreTouch                            = false                               {product}
            bool AlwaysRestoreFPU                          = false                               {product}
            bool AlwaysTenure                              = false                               {product}
            bool AssertOnSuspendWaitFailure                = false                               {product}
            bool AssumeMP                                  = false                               {product}
            intx AutoBoxCacheMax                           = 128                                 {C2 product}
            uintx AutoGCSelectPauseMillis                   = 5000                                {product}
            intx BCEATraceLevel                            = 0                                   {product}
            intx BackEdgeThreshold                         = 100000                              {pd product}
            bool BackgroundCompilation                     = true                                {pd product}
            uintx BaseFootPrintEstimate                     = 268435456                           {product}
            intx BiasedLockingBulkRebiasThreshold          = 20                                  {product}
            intx BiasedLockingBulkRevokeThreshold          = 40                                  {product}
            intx BiasedLockingDecayTime                    = 25000                               {product}
            intx BiasedLockingStartupDelay                 = 4000                                {product}
            bool BindGCTaskThreadsToCPUs                   = false                               {product}
            bool BlockLayoutByFrequency                    = true                                {C2 product}
            intx BlockLayoutMinDiamondPercentage           = 20                                  {C2 product}
            bool BlockLayoutRotateLoops                    = true                                {C2 product}
            bool BranchOnRegister                          = false                               {C2 product}
            bool BytecodeVerificationLocal                 = false                               {product}
            bool BytecodeVerificationRemote                = true                                {product}
            bool C1OptimizeVirtualCallProfiling            = true                                {C1 product}
            bool C1ProfileBranches                         = true                                {C1 product}
            bool C1ProfileCalls                            = true                                {C1 product}
            bool C1ProfileCheckcasts                       = true                                {C1 product}
            bool C1ProfileInlinedCalls                     = true                                {C1 product}
            bool C1ProfileVirtualCalls                     = true                                {C1 product}
            bool C1UpdateMethodData                        = true                                {C1 product}
            intx CICompilerCount                          := 4                                   {product}
            bool CICompilerCountPerCPU                     = true                                {product}
            bool CITime                                    = false                               {product}
            bool CMSAbortSemantics                         = false                               {product}
            uintx CMSAbortablePrecleanMinWorkPerIteration   = 100                                 {product}
            intx CMSAbortablePrecleanWaitMillis            = 100                                 {manageable}
            uintx CMSBitMapYieldQuantum                     = 10485760                            {product}
            uintx CMSBootstrapOccupancy                     = 50                                  {product}
            bool CMSClassUnloadingEnabled                  = true                                {product}
            uintx CMSClassUnloadingMaxInterval              = 0                                   {product}
            bool CMSCleanOnEnter                           = true                                {product}
            bool CMSCompactWhenClearAllSoftRefs            = true                                {product}
            uintx CMSConcMarkMultiple                       = 32                                  {product}
            bool CMSConcurrentMTEnabled                    = true                                {product}
            uintx CMSCoordinatorYieldSleepCount             = 10                                  {product}
            bool CMSDumpAtPromotionFailure                 = false                               {product}
            bool CMSEdenChunksRecordAlways                 = true                                {product}
            uintx CMSExpAvgFactor                           = 50                                  {product}
            bool CMSExtrapolateSweep                       = false                               {product}
            uintx CMSFullGCsBeforeCompaction                = 0                                   {product}
            uintx CMSIncrementalDutyCycle                   = 10                                  {product}
            uintx CMSIncrementalDutyCycleMin                = 0                                   {product}
            bool CMSIncrementalMode                        = false                               {product}
            uintx CMSIncrementalOffset                      = 0                                   {product}
            bool CMSIncrementalPacing                      = true                                {product}
            uintx CMSIncrementalSafetyFactor                = 10                                  {product}
            uintx CMSIndexedFreeListReplenish               = 4                                   {product}
            intx CMSInitiatingOccupancyFraction            = -1                                  {product}
            uintx CMSIsTooFullPercentage                    = 98                                  {product}
        double CMSLargeCoalSurplusPercent                = 0.950000                            {product}
        double CMSLargeSplitSurplusPercent               = 1.000000                            {product}
            bool CMSLoopWarn                               = false                               {product}
            uintx CMSMaxAbortablePrecleanLoops              = 0                                   {product}
            intx CMSMaxAbortablePrecleanTime               = 5000                                {product}
            uintx CMSOldPLABMax                             = 1024                                {product}
            uintx CMSOldPLABMin                             = 16                                  {product}
            uintx CMSOldPLABNumRefills                      = 4                                   {product}
            uintx CMSOldPLABReactivityFactor                = 2                                   {product}
            bool CMSOldPLABResizeQuicker                   = false                               {product}
            uintx CMSOldPLABToleranceFactor                 = 4                                   {product}
            bool CMSPLABRecordAlways                       = true                                {product}
            uintx CMSParPromoteBlocksToClaim                = 16                                  {product}
            bool CMSParallelInitialMarkEnabled             = true                                {product}
            bool CMSParallelRemarkEnabled                  = true                                {product}
            bool CMSParallelSurvivorRemarkEnabled          = true                                {product}
            uintx CMSPrecleanDenominator                    = 3                                   {product}
            uintx CMSPrecleanIter                           = 3                                   {product}
            uintx CMSPrecleanNumerator                      = 2                                   {product}
            bool CMSPrecleanRefLists1                      = true                                {product}
            bool CMSPrecleanRefLists2                      = false                               {product}
            bool CMSPrecleanSurvivors1                     = false                               {product}
            bool CMSPrecleanSurvivors2                     = true                                {product}
            uintx CMSPrecleanThreshold                      = 1000                                {product}
            bool CMSPrecleaningEnabled                     = true                                {product}
            bool CMSPrintChunksInDump                      = false                               {product}
            bool CMSPrintEdenSurvivorChunks                = false                               {product}
            bool CMSPrintObjectsInDump                     = false                               {product}
            uintx CMSRemarkVerifyVariant                    = 1                                   {product}
            bool CMSReplenishIntermediate                  = true                                {product}
            uintx CMSRescanMultiple                         = 32                                  {product}
            uintx CMSSamplingGrain                          = 16384                               {product}
            bool CMSScavengeBeforeRemark                   = false                               {product}
            uintx CMSScheduleRemarkEdenPenetration          = 50                                  {product}
            uintx CMSScheduleRemarkEdenSizeThreshold        = 2097152                             {product}
            uintx CMSScheduleRemarkSamplingRatio            = 5                                   {product}
        double CMSSmallCoalSurplusPercent                = 1.050000                            {product}
        double CMSSmallSplitSurplusPercent               = 1.100000                            {product}
            bool CMSSplitIndexedFreeListBlocks             = true                                {product}
            intx CMSTriggerInterval                        = -1                                  {manageable}
            uintx CMSTriggerRatio                           = 80                                  {product}
            intx CMSWaitDuration                           = 2000                                {manageable}
            uintx CMSWorkQueueDrainThreshold                = 10                                  {product}
            bool CMSYield                                  = true                                {product}
            uintx CMSYieldSleepCount                        = 0                                   {product}
            uintx CMSYoungGenPerWorker                      = 67108864                            {pd product}
            uintx CMS_FLSPadding                            = 1                                   {product}
            uintx CMS_FLSWeight                             = 75                                  {product}
            uintx CMS_SweepPadding                          = 1                                   {product}
            uintx CMS_SweepTimerThresholdMillis             = 10                                  {product}
            uintx CMS_SweepWeight                           = 75                                  {product}
            bool CheckEndorsedAndExtDirs                   = false                               {product}
            bool CheckJNICalls                             = false                               {product}
            bool ClassUnloading                            = true                                {product}
            bool ClassUnloadingWithConcurrentMark          = true                                {product}
            intx ClearFPUAtPark                            = 0                                   {product}
            bool ClipInlining                              = true                                {product}
            uintx CodeCacheExpansionSize                    = 65536                               {pd product}
            uintx CodeCacheMinimumFreeSpace                 = 512000                              {product}
            bool CollectGen0First                          = false                               {product}
            bool CompactFields                             = true                                {product}
            intx CompilationPolicyChoice                   = 3                                   {product}
        ccstrlist CompileCommand                            =                                     {product}
            ccstr CompileCommandFile                        =                                     {product}
        ccstrlist CompileOnly                               =                                     {product}
            intx CompileThreshold                          = 10000                               {pd product}
            bool CompilerThreadHintNoPreempt               = true                                {product}
            intx CompilerThreadPriority                    = -1                                  {product}
            intx CompilerThreadStackSize                   = 0                                   {pd product}
            uintx CompressedClassSpaceSize                  = 1073741824                          {product}
            uintx ConcGCThreads                             = 0                                   {product}
            intx ConditionalMoveLimit                      = 3                                   {C2 pd product}
            intx ContendedPaddingWidth                     = 128                                 {product}
            bool ConvertSleepToYield                       = true                                {pd product}
            bool ConvertYieldToSleep                       = false                               {product}
            bool CrashOnOutOfMemoryError                   = false                               {product}
            bool CreateMinidumpOnCrash                     = false                               {product}
            bool CriticalJNINatives                        = true                                {product}
            bool DTraceAllocProbes                         = false                               {product}
            bool DTraceMethodProbes                        = false                               {product}
            bool DTraceMonitorProbes                       = false                               {product}
            bool Debugging                                 = false                               {product}
            uintx DefaultMaxRAMFraction                     = 4                                   {product}
            intx DefaultThreadPriority                     = -1                                  {product}
            intx DeferPollingPageLoopCount                 = -1                                  {product}
            intx DeferThrSuspendLoopCount                  = 4000                                {product}
            bool DeoptimizeRandom                          = false                               {product}
            bool DisableAttachMechanism                    = false                               {product}
            bool DisableExplicitGC                         = false                               {product}
            bool DisplayVMOutputToStderr                   = false                               {product}
            bool DisplayVMOutputToStdout                   = false                               {product}
            bool DoEscapeAnalysis                          = true                                {C2 product}
            bool DontCompileHugeMethods                    = true                                {product}
            bool DontYieldALot                             = false                               {pd product}
            ccstr DumpLoadedClassList                       =                                     {product}
            bool DumpReplayDataOnError                     = true                                {product}
            bool DumpSharedSpaces                          = false                               {product}
            bool EagerXrunInit                             = false                               {product}
            intx EliminateAllocationArraySizeLimit         = 64                                  {C2 product}
            bool EliminateAllocations                      = true                                {C2 product}
            bool EliminateAutoBox                          = true                                {C2 product}
            bool EliminateLocks                            = true                                {C2 product}
            bool EliminateNestedLocks                      = true                                {C2 product}
            intx EmitSync                                  = 0                                   {product}
            bool EnableContended                           = true                                {product}
            bool EnableResourceManagementTLABCache         = true                                {product}
            bool EnableSharedLookupCache                   = true                                {product}
            bool EnableTracing                             = false                               {product}
            uintx ErgoHeapSizeLimit                         = 0                                   {product}
            ccstr ErrorFile                                 =                                     {product}
            ccstr ErrorReportServer                         =                                     {product}
        double EscapeAnalysisTimeout                     = 20.000000                           {C2 product}
            bool EstimateArgEscape                         = true                                {product}
            bool ExitOnOutOfMemoryError                    = false                               {product}
            bool ExplicitGCInvokesConcurrent               = false                               {product}
            bool ExplicitGCInvokesConcurrentAndUnloadsClasses  = false                               {product}
            bool ExtendedDTraceProbes                      = false                               {product}
            ccstr ExtraSharedClassListFile                  =                                     {product}
            bool FLSAlwaysCoalesceLarge                    = false                               {product}
            uintx FLSCoalescePolicy                         = 2                                   {product}
        double FLSLargestBlockCoalesceProximity          = 0.990000                            {product}
            bool FailOverToOldVerifier                     = true                                {product}
            bool FastTLABRefill                            = true                                {product}
            intx FenceInstruction                          = 0                                   {ARCH product}
            intx FieldsAllocationStyle                     = 1                                   {product}
            bool FilterSpuriousWakeups                     = true                                {product}
            ccstr FlightRecorderOptions                     =                                     {product}
            bool ForceNUMA                                 = false                               {product}
            bool ForceTimeHighResolution                   = false                               {product}
            intx FreqInlineSize                            = 325                                 {pd product}
        double G1ConcMarkStepDurationMillis              = 10.000000                           {product}
            uintx G1ConcRSHotCardLimit                      = 4                                   {product}
            uintx G1ConcRSLogCacheSize                      = 10                                  {product}
            intx G1ConcRefinementGreenZone                 = 0                                   {product}
            intx G1ConcRefinementRedZone                   = 0                                   {product}
            intx G1ConcRefinementServiceIntervalMillis     = 300                                 {product}
            uintx G1ConcRefinementThreads                   = 0                                   {product}
            intx G1ConcRefinementThresholdStep             = 0                                   {product}
            intx G1ConcRefinementYellowZone                = 0                                   {product}
            uintx G1ConfidencePercent                       = 50                                  {product}
            uintx G1HeapRegionSize                          = 0                                   {product}
            uintx G1HeapWastePercent                        = 5                                   {product}
            uintx G1MixedGCCountTarget                      = 8                                   {product}
            intx G1RSetRegionEntries                       = 0                                   {product}
            uintx G1RSetScanBlockSize                       = 64                                  {product}
            intx G1RSetSparseRegionEntries                 = 0                                   {product}
            intx G1RSetUpdatingPauseTimePercent            = 10                                  {product}
            intx G1RefProcDrainInterval                    = 10                                  {product}
            uintx G1ReservePercent                          = 10                                  {product}
            uintx G1SATBBufferEnqueueingThresholdPercent    = 60                                  {product}
            intx G1SATBBufferSize                          = 1024                                {product}
            intx G1UpdateBufferSize                        = 256                                 {product}
            bool G1UseAdaptiveConcRefinement               = true                                {product}
            uintx GCDrainStackTargetSize                    = 64                                  {product}
            uintx GCHeapFreeLimit                           = 2                                   {product}
            uintx GCLockerEdenExpansionPercent              = 5                                   {product}
            bool GCLockerInvokesConcurrent                 = false                               {product}
            uintx GCLogFileSize                             = 8192                                {product}
            uintx GCPauseIntervalMillis                     = 0                                   {product}
            uintx GCTaskTimeStampEntries                    = 200                                 {product}
            uintx GCTimeLimit                               = 98                                  {product}
            uintx GCTimeRatio                               = 99                                  {product}
            uintx HeapBaseMinAddress                        = 2147483648                          {pd product}
            bool HeapDumpAfterFullGC                       = false                               {manageable}
            bool HeapDumpBeforeFullGC                      = false                               {manageable}
            bool HeapDumpOnOutOfMemoryError                = false                               {manageable}
            ccstr HeapDumpPath                              =                                     {manageable}
            uintx HeapFirstMaximumCompactionCount           = 3                                   {product}
            uintx HeapMaximumCompactionInterval             = 20                                  {product}
            uintx HeapSizePerGCThread                       = 87241520                            {product}
            bool IgnoreEmptyClassPaths                     = false                               {product}
            bool IgnoreUnrecognizedVMOptions               = false                               {product}
            uintx IncreaseFirstTierCompileThresholdAt       = 50                                  {product}
            bool IncrementalInline                         = true                                {C2 product}
            uintx InitialBootClassLoaderMetaspaceSize       = 4194304                             {product}
            uintx InitialCodeCacheSize                      = 2555904                             {pd product}
            uintx InitialHeapSize                          := 16777216                            {product}
            uintx InitialRAMFraction                        = 64                                  {product}
        double InitialRAMPercentage                      = 1.562500                            {product}
            uintx InitialSurvivorRatio                      = 8                                   {product}
            uintx InitialTenuringThreshold                  = 7                                   {product}
            uintx InitiatingHeapOccupancyPercent            = 45                                  {product}
            bool Inline                                    = true                                {product}
            ccstr InlineDataFile                            =                                     {product}
            intx InlineSmallCode                           = 2000                                {pd product}
            bool InlineSynchronizedMethods                 = true                                {C1 product}
            bool InsertMemBarAfterArraycopy                = true                                {C2 product}
            intx InteriorEntryAlignment                    = 16                                  {C2 pd product}
            intx InterpreterProfilePercentage              = 33                                  {product}
            bool JNIDetachReleasesMonitors                 = true                                {product}
            bool JavaMonitorsInStackTrace                  = true                                {product}
            intx JavaPriority10_To_OSPriority              = -1                                  {product}
            intx JavaPriority1_To_OSPriority               = -1                                  {product}
            intx JavaPriority2_To_OSPriority               = -1                                  {product}
            intx JavaPriority3_To_OSPriority               = -1                                  {product}
            intx JavaPriority4_To_OSPriority               = -1                                  {product}
            intx JavaPriority5_To_OSPriority               = -1                                  {product}
            intx JavaPriority6_To_OSPriority               = -1                                  {product}
            intx JavaPriority7_To_OSPriority               = -1                                  {product}
            intx JavaPriority8_To_OSPriority               = -1                                  {product}
            intx JavaPriority9_To_OSPriority               = -1                                  {product}
            bool LIRFillDelaySlots                         = false                               {C1 pd product}
            uintx LargePageHeapSizeThreshold                = 134217728                           {product}
            uintx LargePageSizeInBytes                      = 0                                   {product}
            bool LazyBootClassLoader                       = true                                {product}
            intx LiveNodeCountInliningCutoff               = 40000                               {C2 product}
            bool LogCommercialFeatures                     = false                               {product}
            intx LoopMaxUnroll                             = 16                                  {C2 product}
            intx LoopOptsCount                             = 43                                  {C2 product}
            intx LoopUnrollLimit                           = 60                                  {C2 pd product}
            intx LoopUnrollMin                             = 4                                   {C2 product}
            bool LoopUnswitching                           = true                                {C2 product}
            bool ManagementServer                          = false                               {product}
            uintx MarkStackSize                             = 4194304                             {product}
            uintx MarkStackSizeMax                          = 536870912                           {product}
            uintx MarkSweepAlwaysCompactCount               = 4                                   {product}
            uintx MarkSweepDeadRatio                        = 1                                   {product}
            intx MaxBCEAEstimateLevel                      = 5                                   {product}
            intx MaxBCEAEstimateSize                       = 150                                 {product}
            uintx MaxDirectMemorySize                       = 0                                   {product}
            bool MaxFDLimit                                = true                                {product}
            uintx MaxGCMinorPauseMillis                     = 18446744073709551615                    {product}
            uintx MaxGCPauseMillis                          = 18446744073709551615                    {product}
            uintx MaxHeapFreeRatio                          = 100                                 {manageable}
            uintx MaxHeapSize                              := 16777216                            {product}
            intx MaxInlineLevel                            = 9                                   {product}
            intx MaxInlineSize                             = 35                                  {product}
            intx MaxJNILocalCapacity                       = 65536                               {product}
            intx MaxJavaStackTraceDepth                    = 1024                                {product}
            intx MaxJumpTableSize                          = 65000                               {C2 product}
            intx MaxJumpTableSparseness                    = 5                                   {C2 product}
            intx MaxLabelRootDepth                         = 1100                                {C2 product}
            intx MaxLoopPad                                = 11                                  {C2 product}
            uintx MaxMetaspaceExpansion                     = 5451776                             {product}
            uintx MaxMetaspaceFreeRatio                     = 70                                  {product}
            uintx MaxMetaspaceSize                          = 18446744073709547520                    {product}
            uintx MaxNewSize                               := 5242880                             {product}
            intx MaxNodeLimit                              = 75000                               {C2 product}
        uint64_t MaxRAM                                    = 137438953472                        {pd product}
            uintx MaxRAMFraction                            = 4                                   {product}
        double MaxRAMPercentage                          = 25.000000                           {product}
            intx MaxRecursiveInlineLevel                   = 1                                   {product}
            uintx MaxTenuringThreshold                      = 15                                  {product}
            intx MaxTrivialSize                            = 6                                   {product}
            intx MaxVectorSize                             = 32                                  {C2 product}
            uintx MetaspaceSize                             = 21807104                            {pd product}
            bool MethodFlushing                            = true                                {product}
            uintx MinHeapDeltaBytes                        := 524288                              {product}
            uintx MinHeapFreeRatio                          = 0                                   {manageable}
            intx MinInliningThreshold                      = 250                                 {product}
            intx MinJumpTableSize                          = 10                                  {C2 pd product}
            uintx MinMetaspaceExpansion                     = 339968                              {product}
            uintx MinMetaspaceFreeRatio                     = 40                                  {product}
            uintx MinRAMFraction                            = 2                                   {product}
        double MinRAMPercentage                          = 50.000000                           {product}
            uintx MinSurvivorRatio                          = 3                                   {product}
            uintx MinTLABSize                               = 2048                                {product}
            intx MonitorBound                              = 0                                   {product}
            bool MonitorInUseLists                         = false                               {product}
            intx MultiArrayExpandLimit                     = 6                                   {C2 product}
            bool MustCallLoadClassInternal                 = false                               {product}
            uintx NUMAChunkResizeWeight                     = 20                                  {product}
            uintx NUMAInterleaveGranularity                 = 2097152                             {product}
            uintx NUMAPageScanRate                          = 256                                 {product}
            uintx NUMASpaceResizeRate                       = 1073741824                          {product}
            bool NUMAStats                                 = false                               {product}
            ccstr NativeMemoryTracking                      = off                                 {product}
            bool NeedsDeoptSuspend                         = false                               {pd product}
            bool NeverActAsServerClassMachine              = false                               {pd product}
            bool NeverTenure                               = false                               {product}
            uintx NewRatio                                  = 2                                   {product}
            uintx NewSize                                  := 5242880                             {product}
            uintx NewSizeThreadIncrease                     = 5320                                {pd product}
            intx NmethodSweepActivity                      = 10                                  {product}
            intx NmethodSweepCheckInterval                 = 5                                   {product}
            intx NmethodSweepFraction                      = 16                                  {product}
            intx NodeLimitFudgeFactor                      = 2000                                {C2 product}
            uintx NumberOfGCLogFiles                        = 0                                   {product}
            intx NumberOfLoopInstrToAlign                  = 4                                   {C2 product}
            intx ObjectAlignmentInBytes                    = 8                                   {lp64_product}
            uintx OldPLABSize                               = 1024                                {product}
            uintx OldPLABWeight                             = 50                                  {product}
            uintx OldSize                                  := 11534336                            {product}
            bool OmitStackTraceInFastThrow                 = true                                {product}
        ccstrlist OnError                                   =                                     {product}
        ccstrlist OnOutOfMemoryError                        =                                     {product}
            intx OnStackReplacePercentage                  = 140                                 {pd product}
            bool OptimizeFill                              = true                                {C2 product}
            bool OptimizePtrCompare                        = true                                {C2 product}
            bool OptimizeStringConcat                      = true                                {C2 product}
            bool OptoBundling                              = false                               {C2 pd product}
            intx OptoLoopAlignment                         = 16                                  {pd product}
            bool OptoScheduling                            = false                               {C2 pd product}
            uintx PLABWeight                                = 75                                  {product}
            bool PSChunkLargeArrays                        = true                                {product}
            intx ParGCArrayScanChunk                       = 50                                  {product}
            uintx ParGCDesiredObjsFromOverflowList          = 20                                  {product}
            bool ParGCTrimOverflow                         = true                                {product}
            bool ParGCUseLocalOverflow                     = false                               {product}
            uintx ParallelGCBufferWastePct                  = 10                                  {product}
            uintx ParallelGCThreads                         = 8                                   {product}
            bool ParallelGCVerbose                         = false                               {product}
            uintx ParallelOldDeadWoodLimiterMean            = 50                                  {product}
            uintx ParallelOldDeadWoodLimiterStdDev          = 80                                  {product}
            bool ParallelRefProcBalancingEnabled           = true                                {product}
            bool ParallelRefProcEnabled                    = false                               {product}
            bool PartialPeelAtUnsignedTests                = true                                {C2 product}
            bool PartialPeelLoop                           = true                                {C2 product}
            intx PartialPeelNewPhiDelta                    = 0                                   {C2 product}
            uintx PausePadding                              = 1                                   {product}
            intx PerBytecodeRecompilationCutoff            = 200                                 {product}
            intx PerBytecodeTrapLimit                      = 4                                   {product}
            intx PerMethodRecompilationCutoff              = 400                                 {product}
            intx PerMethodTrapLimit                        = 100                                 {product}
            bool PerfAllowAtExitRegistration               = false                               {product}
            bool PerfBypassFileSystemCheck                 = false                               {product}
            intx PerfDataMemorySize                        = 32768                               {product}
            intx PerfDataSamplingInterval                  = 50                                  {product}
            ccstr PerfDataSaveFile                          =                                     {product}
            bool PerfDataSaveToFile                        = false                               {product}
            bool PerfDisableSharedMem                      = false                               {product}
            intx PerfMaxStringConstLength                  = 1024                                {product}
            intx PreInflateSpin                            = 10                                  {pd product}
            bool PreferInterpreterNativeStubs              = false                               {pd product}
            intx PrefetchCopyIntervalInBytes               = 576                                 {product}
            intx PrefetchFieldsAhead                       = 1                                   {product}
            intx PrefetchScanIntervalInBytes               = 576                                 {product}
            bool PreserveAllAnnotations                    = false                               {product}
            bool PreserveFramePointer                      = false                               {pd product}
            uintx PretenureSizeThreshold                    = 0                                   {product}
            bool PrintAdaptiveSizePolicy                   = false                               {product}
            bool PrintCMSInitiationStatistics              = false                               {product}
            intx PrintCMSStatistics                        = 0                                   {product}
            bool PrintClassHistogram                       = false                               {manageable}
            bool PrintClassHistogramAfterFullGC            = false                               {manageable}
            bool PrintClassHistogramBeforeFullGC           = false                               {manageable}
            bool PrintCodeCache                            = false                               {product}
            bool PrintCodeCacheOnCompilation               = false                               {product}
            bool PrintCommandLineFlags                     = false                               {product}
            bool PrintCompilation                          = false                               {product}
            bool PrintConcurrentLocks                      = false                               {manageable}
            intx PrintFLSCensus                            = 0                                   {product}
            intx PrintFLSStatistics                        = 0                                   {product}
            bool PrintFlagsFinal                          := true                                {product}
            bool PrintFlagsInitial                         = false                               {product}
            bool PrintGC                                   = true                                {manageable}
            bool PrintGCApplicationConcurrentTime          = false                               {product}
            bool PrintGCApplicationStoppedTime             = false                               {product}
            bool PrintGCCause                              = true                                {product}
            bool PrintGCDateStamps                        := true                                {manageable}
            bool PrintGCDetails                           := true                                {manageable}
            bool PrintGCID                                 = false                               {manageable}
            bool PrintGCTaskTimeStamps                     = false                               {product}
            bool PrintGCTimeStamps                        := true                                {manageable}
            bool PrintHeapAtGC                             = false                               {product rw}
            bool PrintHeapAtGCExtended                     = false                               {product rw}
            bool PrintHeapAtSIGBREAK                       = true                                {product}
            bool PrintJNIGCStalls                          = false                               {product}
            bool PrintJNIResolving                         = false                               {product}
            bool PrintOldPLAB                              = false                               {product}
            bool PrintOopAddress                           = false                               {product}
            bool PrintPLAB                                 = false                               {product}
            bool PrintParallelOldGCPhaseTimes              = false                               {product}
            bool PrintPromotionFailure                     = false                               {product}
            bool PrintReferenceGC                          = false                               {product}
            bool PrintSafepointStatistics                  = false                               {product}
            intx PrintSafepointStatisticsCount             = 300                                 {product}
            intx PrintSafepointStatisticsTimeout           = -1                                  {product}
            bool PrintSharedArchiveAndExit                 = false                               {product}
            bool PrintSharedDictionary                     = false                               {product}
            bool PrintSharedSpaces                         = false                               {product}
            bool PrintStringDeduplicationStatistics        = false                               {product}
            bool PrintStringTableStatistics                = false                               {product}
            bool PrintTLAB                                 = false                               {product}
            bool PrintTenuringDistribution                 = false                               {product}
            bool PrintTieredEvents                         = false                               {product}
            bool PrintVMOptions                            = false                               {product}
            bool PrintVMQWaitTime                          = false                               {product}
            bool PrintWarnings                             = true                                {product}
            uintx ProcessDistributionStride                 = 4                                   {product}
            bool ProfileInterpreter                        = true                                {pd product}
            bool ProfileIntervals                          = false                               {product}
            intx ProfileIntervalsTicks                     = 100                                 {product}
            intx ProfileMaturityPercentage                 = 20                                  {product}
            bool ProfileVM                                 = false                               {product}
            bool ProfilerPrintByteCodeStatistics           = false                               {product}
            bool ProfilerRecordPC                          = false                               {product}
            uintx PromotedPadding                           = 3                                   {product}
            uintx QueuedAllocationWarningCount              = 0                                   {product}
            uintx RTMRetryCount                             = 5                                   {ARCH product}
            bool RangeCheckElimination                     = true                                {product}
            intx ReadPrefetchInstr                         = 0                                   {ARCH product}
            bool ReassociateInvariants                     = true                                {C2 product}
            bool ReduceBulkZeroing                         = true                                {C2 product}
            bool ReduceFieldZeroing                        = true                                {C2 product}
            bool ReduceInitialCardMarks                    = true                                {C2 product}
            bool ReduceSignalUsage                         = false                               {product}
            intx RefDiscoveryPolicy                        = 0                                   {product}
            bool ReflectionWrapResolutionErrors            = true                                {product}
            bool RegisterFinalizersAtInit                  = true                                {product}
            bool RelaxAccessControlCheck                   = false                               {product}
            ccstr ReplayDataFile                            =                                     {product}
            bool RequireSharedSpaces                       = false                               {product}
            uintx ReservedCodeCacheSize                     = 251658240                           {pd product}
            bool ResizeOldPLAB                             = true                                {product}
            bool ResizePLAB                                = true                                {product}
            bool ResizeTLAB                                = true                                {pd product}
            bool RestoreMXCSROnJNICalls                    = false                               {product}
            bool RestrictContended                         = true                                {product}
            bool RewriteBytecodes                          = true                                {pd product}
            bool RewriteFrequentPairs                      = true                                {pd product}
            intx SafepointPollOffset                       = 256                                 {C1 pd product}
            intx SafepointSpinBeforeYield                  = 2000                                {product}
            bool SafepointTimeout                          = false                               {product}
            intx SafepointTimeoutDelay                     = 10000                               {product}
            bool ScavengeBeforeFullGC                      = true                                {product}
            intx SelfDestructTimer                         = 0                                   {product}
            uintx SharedBaseAddress                         = 34359738368                         {product}
            ccstr SharedClassListFile                       =                                     {product}
            uintx SharedMiscCodeSize                        = 122880                              {product}
            uintx SharedMiscDataSize                        = 4194304                             {product}
            uintx SharedReadOnlySize                        = 16777216                            {product}
            uintx SharedReadWriteSize                       = 16777216                            {product}
            bool ShowMessageBoxOnError                     = false                               {product}
            intx SoftRefLRUPolicyMSPerMB                   = 1000                                {product}
            bool SpecialEncodeISOArray                     = true                                {C2 product}
            bool SplitIfBlocks                             = true                                {C2 product}
            intx StackRedPages                             = 1                                   {pd product}
            intx StackShadowPages                          = 20                                  {pd product}
            bool StackTraceInThrowable                     = true                                {product}
            intx StackYellowPages                          = 2                                   {pd product}
            bool StartAttachListener                       = false                               {product}
            intx StarvationMonitorInterval                 = 200                                 {product}
            bool StressLdcRewrite                          = false                               {product}
            uintx StringDeduplicationAgeThreshold           = 3                                   {product}
            uintx StringTableSize                           = 60013                               {product}
            bool SuppressFatalErrorMessage                 = false                               {product}
            uintx SurvivorPadding                           = 3                                   {product}
            uintx SurvivorRatio                             = 8                                   {product}
            intx SuspendRetryCount                         = 50                                  {product}
            intx SuspendRetryDelay                         = 5                                   {product}
            intx SyncFlags                                 = 0                                   {product}
            ccstr SyncKnobs                                 =                                     {product}
            intx SyncVerbose                               = 0                                   {product}
            uintx TLABAllocationWeight                      = 35                                  {product}
            uintx TLABRefillWasteFraction                   = 64                                  {product}
            uintx TLABSize                                  = 0                                   {product}
            bool TLABStats                                 = true                                {product}
            uintx TLABWasteIncrement                        = 4                                   {product}
            uintx TLABWasteTargetPercent                    = 1                                   {product}
            uintx TargetPLABWastePct                        = 10                                  {product}
            uintx TargetSurvivorRatio                       = 50                                  {product}
            uintx TenuredGenerationSizeIncrement            = 20                                  {product}
            uintx TenuredGenerationSizeSupplement           = 80                                  {product}
            uintx TenuredGenerationSizeSupplementDecay      = 2                                   {product}
            intx ThreadPriorityPolicy                      = 0                                   {product}
            bool ThreadPriorityVerbose                     = false                               {product}
            uintx ThreadSafetyMargin                        = 52428800                            {product}
            intx ThreadStackSize                           = 1024                                {pd product}
            uintx ThresholdTolerance                        = 10                                  {product}
            intx Tier0BackedgeNotifyFreqLog                = 10                                  {product}
            intx Tier0InvokeNotifyFreqLog                  = 7                                   {product}
            intx Tier0ProfilingStartPercentage             = 200                                 {product}
            intx Tier23InlineeNotifyFreqLog                = 20                                  {product}
            intx Tier2BackEdgeThreshold                    = 0                                   {product}
            intx Tier2BackedgeNotifyFreqLog                = 14                                  {product}
            intx Tier2CompileThreshold                     = 0                                   {product}
            intx Tier2InvokeNotifyFreqLog                  = 11                                  {product}
            intx Tier3BackEdgeThreshold                    = 60000                               {product}
            intx Tier3BackedgeNotifyFreqLog                = 13                                  {product}
            intx Tier3CompileThreshold                     = 2000                                {product}
            intx Tier3DelayOff                             = 2                                   {product}
            intx Tier3DelayOn                              = 5                                   {product}
            intx Tier3InvocationThreshold                  = 200                                 {product}
            intx Tier3InvokeNotifyFreqLog                  = 10                                  {product}
            intx Tier3LoadFeedback                         = 5                                   {product}
            intx Tier3MinInvocationThreshold               = 100                                 {product}
            intx Tier4BackEdgeThreshold                    = 40000                               {product}
            intx Tier4CompileThreshold                     = 15000                               {product}
            intx Tier4InvocationThreshold                  = 5000                                {product}
            intx Tier4LoadFeedback                         = 3                                   {product}
            intx Tier4MinInvocationThreshold               = 600                                 {product}
            bool TieredCompilation                         = true                                {pd product}
            intx TieredCompileTaskTimeout                  = 50                                  {product}
            intx TieredRateUpdateMaxTime                   = 25                                  {product}
            intx TieredRateUpdateMinTime                   = 1                                   {product}
            intx TieredStopAtLevel                         = 4                                   {product}
            bool TimeLinearScan                            = false                               {C1 product}
            bool TraceBiasedLocking                        = false                               {product}
            bool TraceClassLoading                         = false                               {product rw}
            bool TraceClassLoadingPreorder                 = false                               {product}
            bool TraceClassPaths                           = false                               {product}
            bool TraceClassResolution                      = false                               {product}
            bool TraceClassUnloading                       = false                               {product rw}
            bool TraceDynamicGCThreads                     = false                               {product}
            bool TraceGen0Time                             = false                               {product}
            bool TraceGen1Time                             = false                               {product}
            ccstr TraceJVMTI                                =                                     {product}
            bool TraceLoaderConstraints                    = false                               {product rw}
            bool TraceMetadataHumongousAllocation          = false                               {product}
            bool TraceMonitorInflation                     = false                               {product}
            bool TraceParallelOldGCTasks                   = false                               {product}
            intx TraceRedefineClasses                      = 0                                   {product}
            bool TraceSafepointCleanupTime                 = false                               {product}
            bool TraceSharedLookupCache                    = false                               {product}
            bool TraceSuspendWaitFailures                  = false                               {product}
            intx TrackedInitializationLimit                = 50                                  {C2 product}
            bool TransmitErrorReport                       = false                               {product}
            bool TrapBasedNullChecks                       = false                               {pd product}
            bool TrapBasedRangeChecks                      = false                               {C2 pd product}
            intx TypeProfileArgsLimit                      = 2                                   {product}
            uintx TypeProfileLevel                          = 111                                 {pd product}
            intx TypeProfileMajorReceiverPercent           = 90                                  {C2 product}
            intx TypeProfileParmsLimit                     = 2                                   {product}
            intx TypeProfileWidth                          = 2                                   {product}
            intx UnguardOnExecutionViolation               = 0                                   {product}
            bool UnlinkSymbolsALot                         = false                               {product}
            bool Use486InstrsOnly                          = false                               {ARCH product}
            bool UseAES                                    = true                                {product}
            bool UseAESIntrinsics                          = true                                {product}
            intx UseAVX                                    = 2                                   {ARCH product}
            bool UseAdaptiveGCBoundary                     = false                               {product}
            bool UseAdaptiveGenerationSizePolicyAtMajorCollection  = true                                {product}
            bool UseAdaptiveGenerationSizePolicyAtMinorCollection  = true                                {product}
            bool UseAdaptiveNUMAChunkSizing                = true                                {product}
            bool UseAdaptiveSizeDecayMajorGCCost           = true                                {product}
            bool UseAdaptiveSizePolicy                     = true                                {product}
            bool UseAdaptiveSizePolicyFootprintGoal        = true                                {product}
            bool UseAdaptiveSizePolicyWithSystemGC         = false                               {product}
            bool UseAddressNop                             = true                                {ARCH product}
            bool UseAltSigs                                = false                               {product}
            bool UseAutoGCSelectPolicy                     = false                               {product}
            bool UseBMI1Instructions                       = true                                {ARCH product}
            bool UseBMI2Instructions                       = true                                {ARCH product}
            bool UseBiasedLocking                          = true                                {product}
            bool UseBimorphicInlining                      = true                                {C2 product}
            bool UseBoundThreads                           = true                                {product}
            bool UseBsdPosixThreadCPUClocks                = true                                {product}
            bool UseCLMUL                                  = true                                {ARCH product}
            bool UseCMSBestFit                             = true                                {product}
            bool UseCMSCollectionPassing                   = true                                {product}
            bool UseCMSCompactAtFullCollection             = true                                {product}
            bool UseCMSInitiatingOccupancyOnly             = false                               {product}
            bool UseCRC32Intrinsics                        = true                                {product}
            bool UseCodeCacheFlushing                      = true                                {product}
            bool UseCompiler                               = true                                {product}
            bool UseCompilerSafepoints                     = true                                {product}
            bool UseCompressedClassPointers               := true                                {lp64_product}
            bool UseCompressedOops                        := true                                {lp64_product}
            bool UseConcMarkSweepGC                        = false                               {product}
            bool UseCondCardMark                           = false                               {C2 product}
            bool UseCountLeadingZerosInstruction           = true                                {ARCH product}
            bool UseCountTrailingZerosInstruction          = true                                {ARCH product}
            bool UseCountedLoopSafepoints                  = false                               {C2 product}
            bool UseCounterDecay                           = true                                {product}
            bool UseDivMod                                 = true                                {C2 product}
            bool UseDynamicNumberOfGCThreads               = false                               {product}
            bool UseFPUForSpilling                         = true                                {C2 product}
            bool UseFastAccessorMethods                    = false                               {product}
            bool UseFastEmptyMethods                       = false                               {product}
            bool UseFastJNIAccessors                       = true                                {product}
            bool UseFastStosb                              = true                                {ARCH product}
            bool UseG1GC                                   = false                               {product}
            bool UseGCLogFileRotation                      = false                               {product}
            bool UseGCOverheadLimit                        = true                                {product}
            bool UseGCTaskAffinity                         = false                               {product}
            bool UseHeavyMonitors                          = false                               {product}
            bool UseHugeTLBFS                              = false                               {product}
            bool UseInlineCaches                           = true                                {product}
            bool UseInterpreter                            = true                                {product}
            bool UseJumpTables                             = true                                {C2 product}
            bool UseLWPSynchronization                     = true                                {product}
            bool UseLargePages                             = false                               {pd product}
            bool UseLargePagesInMetaspace                  = false                               {product}
            bool UseLargePagesIndividualAllocation         = false                               {pd product}
            bool UseLockedTracing                          = false                               {product}
            bool UseLoopCounter                            = true                                {product}
            bool UseLoopInvariantCodeMotion                = true                                {C1 product}
            bool UseLoopPredicate                          = true                                {C2 product}
            bool UseMathExactIntrinsics                    = true                                {C2 product}
            bool UseMaximumCompactionOnSystemGC            = true                                {product}
            bool UseMembar                                 = true                                {pd product}
            bool UseMontgomeryMultiplyIntrinsic            = true                                {C2 product}
            bool UseMontgomerySquareIntrinsic              = true                                {C2 product}
            bool UseMulAddIntrinsic                        = true                                {C2 product}
            bool UseMultiplyToLenIntrinsic                 = true                                {C2 product}
            bool UseNUMA                                   = false                               {product}
            bool UseNUMAInterleaving                       = false                               {product}
            bool UseNewLongLShift                          = false                               {ARCH product}
            bool UseOSErrorReporting                       = false                               {pd product}
            bool UseOldInlining                            = true                                {C2 product}
            bool UseOnStackReplacement                     = true                                {pd product}
            bool UseOnlyInlinedBimorphic                   = true                                {C2 product}
            bool UseOprofile                               = false                               {product}
            bool UseOptoBiasInlining                       = true                                {C2 product}
            bool UsePSAdaptiveSurvivorSizePolicy           = true                                {product}
            bool UseParNewGC                               = false                               {product}
            bool UseParallelGC                            := true                                {product}
            bool UseParallelOldGC                          = true                                {product}
            bool UsePerfData                               = true                                {product}
            bool UsePopCountInstruction                    = true                                {product}
            bool UseRDPCForConstantTableBase               = false                               {C2 product}
            bool UseRTMDeopt                               = false                               {ARCH product}
            bool UseRTMLocking                             = false                               {ARCH product}
            bool UseSHA                                    = false                               {product}
            bool UseSHA1Intrinsics                         = false                               {product}
            bool UseSHA256Intrinsics                       = false                               {product}
            bool UseSHA512Intrinsics                       = false                               {product}
            bool UseSHM                                    = false                               {product}
            intx UseSSE                                    = 4                                   {product}
            bool UseSSE42Intrinsics                        = true                                {product}
            bool UseSerialGC                               = false                               {product}
            bool UseSharedSpaces                           = false                               {product}
            bool UseSignalChaining                         = true                                {product}
            bool UseSquareToLenIntrinsic                   = true                                {C2 product}
            bool UseStoreImmI16                            = false                               {ARCH product}
            bool UseStringDeduplication                    = false                               {product}
            bool UseSuperWord                              = true                                {C2 product}
            bool UseTLAB                                   = true                                {pd product}
            bool UseThreadPriorities                       = true                                {pd product}
            bool UseTypeProfile                            = true                                {product}
            bool UseTypeSpeculation                        = true                                {C2 product}
            bool UseUnalignedLoadStores                    = true                                {ARCH product}
            bool UseVMInterruptibleIO                      = false                               {product}
            bool UseXMMForArrayCopy                        = true                                {product}
            bool UseXmmI2D                                 = false                               {ARCH product}
            bool UseXmmI2F                                 = false                               {ARCH product}
            bool UseXmmLoadAndClearUpper                   = true                                {ARCH product}
            bool UseXmmRegToRegMoveAll                     = true                                {ARCH product}
            bool VMThreadHintNoPreempt                     = false                               {product}
            intx VMThreadPriority                          = -1                                  {product}
            intx VMThreadStackSize                         = 1024                                {pd product}
            intx ValueMapInitialSize                       = 11                                  {C1 product}
            intx ValueMapMaxLoopSize                       = 8                                   {C1 product}
            intx ValueSearchLimit                          = 1000                                {C2 product}
            bool VerifyMergedCPBytecodes                   = true                                {product}
            bool VerifySharedSpaces                        = false                               {product}
            intx WorkAroundNPTLTimedWaitHang               = 1                                   {product}
            uintx YoungGenerationSizeIncrement              = 20                                  {product}
            uintx YoungGenerationSizeSupplement             = 80                                  {product}
            uintx YoungGenerationSizeSupplementDecay        = 8                                   {product}
            uintx YoungPLABSize                             = 4096                                {product}
            bool ZeroTLAB                                  = false                               {product}
            intx hashCode                                  = 5                                   {product}
        0
        1
        2

## 3.2 堆的配置参数

### 3.2.1 最大堆和初始堆设置  
   -Xms 初始堆  
   -Xmx 最大堆  

        java -Xms16M -Xmx32M -XX:+PrintCommandLineFlags Example
        -XX:InitialHeapSize=16777216 -XX:MaxHeapSize=33554432 -XX:+PrintCommandLineFlags -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC
        0
        1
        2

        java -Xms16000000 -Xmx32000000 -XX:+PrintCommandLineFlags Example
        -XX:InitialHeapSize=16000000 -XX:MaxHeapSize=32000000 -XX:+PrintCommandLineFlags -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC
        0
        1
        2
        3

### 3.2.2 新生代设置  
   -Xmn 新生代(一般设置为整个堆空间的1/3到1/4大小)  
   -XX:SurvivorRatio=eden/from=eden/to 设置新生代中eden区和from/to区的比例  
   -XX:NewRatio=老年代/新生代 设置老年代与新生代的比例  

        java \
        -Xms2000000K \
        -Xmx2000000K \
        -Xmn1000000K \
        -XX:+PrintCommandLineFlags \
        -XX:+PrintGCDetails \
        Example
        -XX:InitialHeapSize=2048000000 -XX:MaxHeapSize=2048000000 -XX:MaxNewSize=1024000000 -XX:NewSize=1024000000 -XX:+PrintCommandLineFlags -XX:+PrintGCDetails -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC
        0
        ...
        Heap
        PSYoungGen      total 875008K, used 60006K [0x0000000782f80000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 750080K, 8% used [0x0000000782f80000,0x0000000786a19aa0,0x00000007b0c00000)
        from space 124928K, 0% used [0x00000007b8600000,0x00000007b8600000,0x00000007c0000000)
        to   space 124928K, 0% used [0x00000007b0c00000,0x00000007b0c00000,0x00000007b8600000)
        ParOldGen       total 1000960K, used 0K [0x0000000745e00000, 0x0000000782f80000, 0x0000000782f80000)
        object space 1000960K, 0% used [0x0000000745e00000,0x0000000745e00000,0x0000000782f80000)
        Metaspace       used 2650K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 287K, capacity 386K, committed 512K, reserved 1048576K

        java \
        -Xms2000000K \
        -Xmx2000000K \
        -Xmn1000000K \
        -XX:SurvivorRatio=6 \
        -XX:+PrintCommandLineFlags \
        -XX:+PrintGCDetails \
        Example
        -XX:InitialHeapSize=2048000000 -XX:MaxHeapSize=2048000000 -XX:MaxNewSize=1024000000 -XX:NewSize=1024000000 -XX:+PrintCommandLineFlags -XX:+PrintGCDetails -XX:SurvivorRatio=6 -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC
        0
        ...
        Heap
        PSYoungGen      total 875008K, used 60006K [0x0000000782f80000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 750080K, 8% used [0x0000000782f80000,0x0000000786a19aa0,0x00000007b0c00000)
        from space 124928K, 0% used [0x00000007b8600000,0x00000007b8600000,0x00000007c0000000)
        to   space 124928K, 0% used [0x00000007b0c00000,0x00000007b0c00000,0x00000007b8600000)
        ParOldGen       total 1000960K, used 0K [0x0000000745e00000, 0x0000000782f80000, 0x0000000782f80000)
        object space 1000960K, 0% used [0x0000000745e00000,0x0000000745e00000,0x0000000782f80000)
        Metaspace       used 2650K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 287K, capacity 386K, committed 512K, reserved 1048576K

        java \
        -Xms2000000K \
        -Xmx2000000K \
        -Xmn1000000K \
        -XX:SurvivorRatio=8 \
        -XX:+PrintCommandLineFlags \
        -XX:+PrintGCDetails \
        Example
        -XX:InitialHeapSize=2048000000 -XX:MaxHeapSize=2048000000 -XX:MaxNewSize=1024000000 -XX:NewSize=1024000000 -XX:+PrintCommandLineFlags -XX:+PrintGCDetails -XX:SurvivorRatio=8 -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC
        0
        ...
        Heap
        PSYoungGen      total 900096K, used 64020K [0x0000000782f80000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 800256K, 8% used [0x0000000782f80000,0x0000000786e05300,0x00000007b3d00000)
        from space 99840K, 0% used [0x00000007b9e80000,0x00000007b9e80000,0x00000007c0000000)
        to   space 99840K, 0% used [0x00000007b3d00000,0x00000007b3d00000,0x00000007b9e80000)
        ParOldGen       total 1000960K, used 0K [0x0000000745e00000, 0x0000000782f80000, 0x0000000782f80000)
        object space 1000960K, 0% used [0x0000000745e00000,0x0000000745e00000,0x0000000782f80000)
        Metaspace       used 2650K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 287K, capacity 386K, committed 512K, reserved 1048576K

    下面使用-XX:NewRatio=1和上面的输出一致:

        java \
        -Xms2000000K \
        -Xmx2000000K \
        -XX:NewRatio=1 \
        -XX:+PrintCommandLineFlags \
        -XX:+PrintGCDetails \
        Example

        java \
        -Xms2000000K \
        -Xmx2000000K \
        -XX:NewRatio=1 \
        -XX:SurvivorRatio=6 \
        -XX:+PrintCommandLineFlags \
        -XX:+PrintGCDetails \
        Example

        java \
        -Xms2000000K \
        -Xmx2000000K \
        -XX:NewRatio=1 \
        -XX:SurvivorRatio=8 \
        -XX:+PrintCommandLineFlags \
        -XX:+PrintGCDetails \
        Example

### 3.2.3 堆溢出处理  
   -XX:+HeapDumpOnOutOfMemoryError 内存溢出后导出整个堆的信息  
   -XX:HeapDumpPath=/temp/aa.dump 指定导出堆的存放路径  
   -XX:OnOutOfMemoryError=/temp/bb.sh 内存溢出时触发脚本运行  

        java \
        -Xms16000K \
        -Xmx16000K \
        -Xmn6000K \
        -XX:+PrintCommandLineFlags \
        -XX:+PrintGCDetails \
        -XX:+HeapDumpOnOutOfMemoryError \
        -XX:HeapDumpPath=./aa.dump \
        -XX:OnOutOfMemoryError=./bb.sh \
        Example
        -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=./aa.dump -XX:InitialHeapSize=16384000 -XX:MaxHeapSize=16384000 -XX:MaxNewSize=6144000 -XX:NewSize=6144000 -XX:OnOutOfMemoryError=./bb.sh -XX:+PrintCommandLineFlags -XX:+PrintGCDetails -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC
        0
        1
        2
        3
        [GC (Allocation Failure) --[PSYoungGen: 3717K->3717K(5120K)] 12933K->12941K(15872K), 0.0018331 secs] [Times: user=0.00 sys=0.00, real=0.00 secs]
        [Full GC (Ergonomics) [PSYoungGen: 3717K->3354K(5120K)] [ParOldGen: 9224K->9216K(10752K)] 12941K->12570K(15872K), [Metaspace: 2642K->2642K(1056768K)], 0.0057021 secs] [Times: user=0.03 sys=0.00, real=0.01 secs]
        [GC (Allocation Failure) --[PSYoungGen: 3354K->3354K(5120K)] 12570K->12578K(15872K), 0.0007594 secs] [Times: user=0.00 sys=0.00, real=0.00 secs]
        [Full GC (Allocation Failure) [PSYoungGen: 3354K->3342K(5120K)] [ParOldGen: 9224K->9216K(10752K)] 12578K->12558K(15872K), [Metaspace: 2642K->2642K(1056768K)], 0.0033639 secs] [Times: user=0.02 sys=0.00, real=0.00 secs]
        java.lang.OutOfMemoryError: Java heap space
        Dumping heap to ./aa.dump ...
        Heap dump file created [13432193 bytes in 0.023 secs]
        #
        # java.lang.OutOfMemoryError: Java heap space
        # -XX:OnOutOfMemoryError="./bb.sh"
        #   Executing "./bb.sh"...
        bb.sh
        Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
            at Example.main(Example.java:11)
        Heap
        PSYoungGen      total 5120K, used 3481K [0x00000007bfa80000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 4608K, 75% used [0x00000007bfa80000,0x00000007bfde6498,0x00000007bff00000)
        from space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
        to   space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
        ParOldGen       total 10752K, used 9216K [0x00000007bf000000, 0x00000007bfa80000, 0x00000007bfa80000)
        object space 10752K, 85% used [0x00000007bf000000,0x00000007bf9000e8,0x00000007bfa80000)
        Metaspace       used 2673K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 289K, capacity 386K, committed 512K, reserved 1048576K


## 3.3 非堆内存的配置参数

### 3.3.1 方法区配置  
   Java8开始永久区被废除来使用元数据区，元数据区只受系统可用内存的限制。  
   -XX:MaxMetaspaceSize=最大可用值

        java \
        -Xms2000000K \
        -Xmx2000000K \
        -Xmn2000000K \
        -XX:MaxMetaspaceSize=20000K \
        -XX:+PrintCommandLineFlags \
        -XX:+PrintGCDetails \
        Example
        -XX:CompressedClassSpaceSize=12091392 -XX:InitialHeapSize=2048000000 -XX:MaxHeapSize=2048000000 -XX:MaxMetaspaceSize=20480000 -XX:MaxNewSize=2048000000 -XX:NewSize=2048000000 -XX:+PrintCommandLineFlags -XX:+PrintGCDetails -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC
        0
        ...
        Heap
        PSYoungGen      total 1750016K, used 120013K [0x0000000785300000, 0x00000007ff400000, 0x00000007ff400000)
        eden space 1500160K, 8% used [0x0000000785300000,0x000000078c833440,0x00000007e0c00000)
        from space 249856K, 0% used [0x00000007f0000000,0x00000007f0000000,0x00000007ff400000)
        to   space 249856K, 0% used [0x00000007e0c00000,0x00000007e0c00000,0x00000007f0000000)
        ParOldGen       total 1024K, used 0K [0x0000000785200000, 0x0000000785300000, 0x0000000785300000)
        object space 1024K, 0% used [0x0000000785200000,0x0000000785200000,0x0000000785300000)
        Metaspace       used 2650K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 287K, capacity 386K, committed 512K, reserved 1048576K
   
### 3.3.2 栈配置  
   -Xss 指定线程栈的大小

        java \
        -Xms2000000K \
        -Xmx2000000K \
        -Xmn2000000K \
        -Xss200K \
        -XX:+PrintCommandLineFlags \
        -XX:+PrintGCDetails \
        Example
        -XX:InitialHeapSize=2048000000 -XX:MaxHeapSize=2048000000 -XX:MaxNewSize=2048000000 -XX:NewSize=2048000000 -XX:+PrintCommandLineFlags -XX:+PrintGCDetails -XX:ThreadStackSize=200 -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC
        0
        ...
        Heap
        PSYoungGen      total 1750016K, used 120013K [0x0000000745f00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 1500160K, 8% used [0x0000000745f00000,0x000000074d433440,0x00000007a1800000)
        from space 249856K, 0% used [0x00000007b0c00000,0x00000007b0c00000,0x00000007c0000000)
        to   space 249856K, 0% used [0x00000007a1800000,0x00000007a1800000,0x00000007b0c00000)
        ParOldGen       total 1024K, used 0K [0x0000000745e00000, 0x0000000745f00000, 0x0000000745f00000)
        object space 1024K, 0% used [0x0000000745e00000,0x0000000745e00000,0x0000000745f00000)
        Metaspace       used 2650K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 287K, capacity 386K, committed 512K, reserved 1048576K
   
### 3.3.3 直接内存配置  
   -XX:MaxDirectMemorySize=最大可用直接内存(默认值为最大堆空间)  
   直接内存适合申请次数较少，读写访问频繁的场合。  
   在申请空间时，堆空间的速度远远快于直接内存。  
   堆内存申请:  
   ByteBuffer buffer = ByteBuffer.allocate(1024);  
   直接内存申请:  
   ByteBuffer buffer = ByteBuffer.allocateDirect(1024);  


        java \
        -Xms2000000K \
        -Xmx2000000K \
        -Xmn2000000K \
        -XX:MaxDirectMemorySize=200K \
        -XX:+PrintCommandLineFlags \
        -XX:+PrintGCDetails \
        Example
        -XX:InitialHeapSize=2048000000 -XX:MaxDirectMemorySize=204800 -XX:MaxHeapSize=2048000000 -XX:MaxNewSize=2048000000 -XX:NewSize=2048000000 -XX:+PrintCommandLineFlags -XX:+PrintGCDetails -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC
        [GC (System.gc()) [PSYoungGen: 60006K->448K(1750016K)] 60006K->456K(1751040K), 0.0005824 secs] [Times: user=0.00 sys=0.00, real=0.00 secs]
        [Full GC (System.gc()) [PSYoungGen: 448K->0K(1750016K)] [ParOldGen: 8K->282K(1024K)] 456K->282K(1751040K), [Metaspace: 2642K->2642K(1056768K)], 0.0030048 secs] [Times: user=0.02 sys=0.00, real=0.01 secs]
        Exception in thread "main" java.lang.OutOfMemoryError: Direct buffer memory
            at java.nio.Bits.reserveMemory(Bits.java:694)
            at java.nio.DirectByteBuffer.<init>(DirectByteBuffer.java:123)
            at java.nio.ByteBuffer.allocateDirect(ByteBuffer.java:311)
            at Example.main(Example.java:14)
        Heap
        PSYoungGen      total 1750016K, used 45005K [0x0000000745f00000, 0x00000007c0000000, 0x00000007c0000000)
        eden space 1500160K, 3% used [0x0000000745f00000,0x0000000748af34b8,0x00000007a1800000)
        from space 249856K, 0% used [0x00000007a1800000,0x00000007a1800000,0x00000007b0c00000)
        to   space 249856K, 0% used [0x00000007b0c00000,0x00000007b0c00000,0x00000007c0000000)
        ParOldGen       total 1024K, used 282K [0x0000000745e00000, 0x0000000745f00000, 0x0000000745f00000)
        object space 1024K, 27% used [0x0000000745e00000,0x0000000745e46990,0x0000000745f00000)
        Metaspace       used 2675K, capacity 4486K, committed 4864K, reserved 1056768K
        class space    used 289K, capacity 386K, committed 512K, reserved 1048576K

## 3.4 虚拟机工作模式

Java虚拟机支持Client和Server两种工作模式  
使用参数-client指定使用Client模式  
使用参数-server指定使用Server模式  
虚拟机会根据当前计算机系统环境自动选择运行模式  
使用-version参数可以查看当前模式  

    java -version
    java version "1.8.0_201"
    Java(TM) SE Runtime Environment (build 1.8.0_201-b09)
    Java HotSpot(TM) 64-Bit Server VM (build 25.201-b09, mixed mode)

## 完