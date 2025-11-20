---
title: "Type Casting For Inheritance In Java"
description: ""
tags:
  - programming
  - java
date: 2013-02-04T11:33:00.000Z
updateDate: 2013-02-04T11:33:00.000Z
external: false
---

Note to myself:

> With objects, you can cast an instance of a subclass to its parent class.
> Casting an object to a parent class is called upcasting.

```java
Child child = new Child ();
Parent parent = child;
```

To upcast a Child object, all you need to do is assign the object to a reference variable of type Parent. The parent reference variable cannot access the members that are only available in Child.

Because parent references an object of type Child, you can cast it back to Child. It is called downcasting because you are casting an object to a class down the inheritance hierarchy. Downcasting requires that you write the child type in brackets. For example:

```java
Child child2 = (Child) parent;
```
