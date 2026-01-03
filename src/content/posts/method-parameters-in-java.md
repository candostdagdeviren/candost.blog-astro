---
title: "Method Paramters  in Java"
description: ""
tags:
  - programming
  - java
date: 2013-02-02T11:33:00.000Z
updateDate: 2013-02-02T11:33:00.000Z
external: false
---

Note to myself:

## By Value or By Reference

1. Primitive variables are passed by value.
2. Reference variables are passed by reference.
3. When you pass a primitive variable, the JVM will copy the value of the passed-in variable to a new local variable.
4. If you change the value of the local variable, the change will not affect the passed in primitive variable.
5. If you pass a reference variable, the local variable will refer to the same object as the passed in reference variable.
6. If you change the object referenced within your method, the change will also be reflected in the calling code.
