---
title: "URLClassLoader in Java"
description: ""
tags:
  - programming
  - java
date: 2013-02-04T11:33:00.000Z
updateDate: 2013-02-04T11:33:00.000Z
external: false
---

Note to myself:

Load a Class that is not on the classpath

```java
import java.io.File;
import java.net.URL;
import java.net.URLClassLoader;

public class Main {
  public static void main(String[] argv) throws Exception {
    File file = new File("c:\\class\\");
    URL url = file.toURI().toURL();
    URL[] urls = new URL[] { url };
    ClassLoader loader = new URLClassLoader(urls);
    Class cls = loader.loadClass("user.informatin.Class");
  }
}
```

---

Print classpath

```java
import java.net.URL;
import java.net.URLClassLoader;

public class Main {
  public static void main(String[] args) {
    ClassLoader sysClassLoader = ClassLoader.getSystemClassLoader();
    URL[] urls = ((URLClassLoader) sysClassLoader).getURLs();
    for (int i = 0; i < urls.length; i++) {
      System.out.println(urls[i].getFile());
    }
  }
}
```
