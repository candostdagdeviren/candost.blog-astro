---
title: "Categories and Using Objects with Categories in Objective-C"
description: ""
tags:
  - programming
  - objective-c
date: 2014-10-25T11:33:00.000Z
updateDate: 2014-10-25T11:33:00.000Z
external: false
---

There is an effective way to add a property to a category. These are called runtime objects. If you want to add functionality or property to existing class, you should implement category. In this way, class stays stable and you can do what you want. First I'll talk about categories in Objective-C. After that, I will try to explain using categories with extra properties.

## Categories

Assume that you have a framework and you want to add some functionalities to one class of it.  For example, consider NSString class which one of the source code access is restricted classes. How can you add a new method to NSString without using categories? Let's write some code.

```objective-c
 @interface NSString (SomeAdditions)
 @end
```

Here you can see declaration of category which is written for NSString. Similar declaration with class, we use @interface and class name. But we give a name to this category and this name should be in brackets. Let's give a functionality to NSString class with this category.

```objective-c
 @interface NSString (SomeAdditions)
 - (void)removeSpaces;
 @end
```

In this way, we added a method to this category. Here we say this method removes white-spaces from string (NSString class have some methods to handle this situation but this is just an example). We will implement this method now.

```objective-c
 #import "NSString + SomeAdditions.h"

 @implementation NSString (SomeAdditions)

 - (NSString *)removeSpaces {
   NSString *removedSpacesString = [self stringByReplacingOccurrencesOfString:@" " withString:@""];
   return removedSpacesString;
 }
 @end
```

Now, we can use removeSpaces method in our classes which have

```objective-c
 #import "NSString + SomeAdditions.h"
```

## Runtime Objects with Categories

We can use methods to add some functionalities but what about adding a property to an existing class? Adding a property to class is not usual actually. Because, in real word you shouldn't add property to NSString class. On the other way, you can get into some situations to add some properties to a framework. When you want to do that, you have to use runtime objects. I added a property to the SomeAdditions category in header file. Normally, in this way you can't add a property to category in this way. Actually, you have to implement property's set and get methods.

```objective-c
 @interface NSString (SomeAdditions)

 @property (nonatomic, strong) NSString *stringTag;

  - (void)removeSpaces;

 @end
```

Now, let's implement set and get methods of this property in .m file.

```objective-c
 #import "NSString + SomeAdditions.h"

 static const char *stringTagKey = "stringTagRuntimeTag";

 @implementation SomeClass (ExtraStorage)

 - (NSString *)stringTag {
   return objc_getAssociatedObject(self, stringTagKey);
 }

 - (void)setStringTag:(NSString *)stringTag {
     objc_setAssociatedObject(self, stringTagKey, stringTag, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
 }
```

In this way, we are created a runtime object. It actually created at runtime not build time. This is a kind of workaround of SDK.

If you have any questions, please feel free to write a comment.
