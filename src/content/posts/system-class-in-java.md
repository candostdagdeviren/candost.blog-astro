---
title: "System Class in Java"
description: ""
tags:
  - programming
  - java
date: 2013-02-04T11:33:00.000Z
updateDate: 2013-02-04T11:33:00.000Z
external: false
---

Note to myself:

System.arraycopy method:

Copy the content of an array (source) to another array (destination), beginning at the specified position, to the specified position of the destination array.

public static void arraycopy (Object source, int sourcePos, Object destination, int destPos, int length)

For example, the following code uses arraycopy to copy the contents of `array1` to `array2`.

```java
public class MainClass {

  public static void main(String[] a) {
    int[] array1 = { 1, 2, 3, 4 };
    int[] array2 = new int[array1.length];
    System.arraycopy(array1, 0, array2, 0, array1.length);

    for(int i: array2){

      System.out.println(i);
    }
  }
}
```

```bash
Output:
1
2
3
4
```

---

Redirect the output of System.out to a file.

```java
import java.io.File;
import java.io.IOException;
import java.io.PrintStream;

public class MainClass {
  public static void main(String[] args) {
    File file = new File("C:\\temp\\debug.txt");
    try {
      PrintStream ps = new PrintStream(file);
      System.setOut(ps);
    } catch (IOException e) {
    }
    System.out.println("To File");
  }
}
```

---

Loading Native Code

```java
public class Main {
  public static void main(String[] argv) throws Exception {

    System.loadLibrary("libraryName");
  }
}
```
