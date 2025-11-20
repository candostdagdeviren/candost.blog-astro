---
title: "&& vs & in Java"
description: ""
tags:
  - programming
  - java
date: 2013-02-01T11:33:00.000Z
updateDate: 2013-02-01T11:33:00.000Z
external: false
---

Note to myself:

In java, conditional `&&` will not evaluate the right-hand operand if the left-hand operand is false.

If you want to check the right-hand operand use `&`. For example:

```java
public class MainClass {

  public static void main(String[] arg) {
    int value = 8;
    int count = 10;
    int limit = 11;

    if (++value % 2 == 0 & ++count < limit) {
      System.out.println("here");
      System.out.println(value);
      System.out.println(count);
    }
    System.out.println("there");
    System.out.println(value);
    System.out.println(count);
  }
}
```

```bash
Output:
there
9
11
```
