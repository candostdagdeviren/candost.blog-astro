---
title: "final in Java"
description: ""
tags:
  - programming
  - java
date: 2013-02-04T11:33:00.000Z
updateDate: 2013-02-04T11:33:00.000Z
external: false
---

Note to myself:

Blank finals must be initialized in the constructor. Ex:

```java
class A {
  private int i;

  A(int ii) {
    i = ii;
  }
}

public class MainClass {
  private final int i = 0; // Initialized final

  private final int j; // Blank final

  private final A a; // Blank final reference

  // Blank finals MUST be initialized in the constructor:
  public MainClass() {
    j = 1; // Initialize blank final
    a = new A(1); // Initialize blank final reference
  }

  public MainClass(int x) {
    j = x; // Initialize blank final
    a = new A(x); // Initialize blank final reference
  }

  public static void main(String[] args) {
    new MainClass();
    new MainClass(47);
  }
}
```

---

Java'da fonksiyonu final yapınca override yapılamaz.

```java
class A {
  final void meth() {
    System.out.println("This is a final method.");
  }
}

class B extends A {
  void meth() { // ERROR! Can't override.
    System.out.println("Illegal!");
  }
}
```

Java'da class final yapılırsa o classtan inheritance kullanarak subclass oluşturulamaz.
