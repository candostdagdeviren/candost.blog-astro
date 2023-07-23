---
title: "View Lifecycle in iOS"
description: "Truly understanding when the view is created, loaded, appeared, or destroyed helps us to understand our approach deeply while developing an iOS App."
tags:
  -
date: 2018-11-18
updateDate: 2018-11-18
external: false
---

The next thing after learning [Application Lifecycle](https://candost.substack.com/p/ios-application-lifecycle), the view lifecycle holds an essential position in every iOS developer’s life.

Each view is created either using storyboards, xibs, or using a programmatic approach. Independent from the approach, truly understanding when the view is created, loaded, appeared, or destroyed helps us to understand our approach deeply while developing the screen designs, animations, and even business logic.

## Ok, but why do we need to know

When we think about the [application lifecycle](https://candost.substack.com/p/ios-application-lifecycle), we easily see that certain things happen as the application goes to the background, suspended, etc. Whenever the user interacts with the app, some specific action happens, and the app's state may change. However, the view's state may change with any user interaction or any change in the app's data.

On the other hand, we might need to manipulate the user interface when there is a particular state transition in the view. For example, if we would like to use custom views and set them to `UIViewController`'s `view`, we have to do it in a `loadView` method. Or, if our design requires us to have minor differences between landscape and portrait mode, we must know when we can make this change in the code. Therefore, understanding all lifecycle methods not only helps us in code but also enables us to be more creative and implement an advanced user interface.

## What do we need to know?

To use the view in proper positions, we must know when the view is created, loaded, appeared, changed, disappeared, and terminated. Subclasses of `UIViewController` is responsible for managing the views (aka. `UIView`s). View controller has one root view, which is a `UIView` instance. The important thing here is how they work together.

`UIViewController` handles all the magic behind `UIView` while `UIView` just represents the screen and some content to the user. `UIViewController` tells the root `UIView` object when to come to the screen. First, the view controller creates its root view and loads it. After loading, it tells the view to appear on the screen and disappear when necessary.

Furthermore, a view controller might be a child of another view controller. So, the view controller's lifecycle not only cares about its root view but also includes the relationship with other view controllers, like whether it moved to the parent view controller or not.

Lastly, the view controller’s root view (aka. `UIView`) has its own content and lifecycle. The root view has subviews like buttons, labels, switches, or other `UIView` subclasses. The lifecycle of the subviews is, in most cases, not considered by every developer. But there is one common case which is embedding a view controller into another. In this case, we need to imitate the lifecycle actions for both view controllers’ views and call proper methods when necessary.

## How to get notified about lifecycle events

`UIViewController` has a lot of methods to inform us when some particular action happens. For example, we can override the `viewDidLoad` method to do some actions right after loading the view. Or use the `loadView` method to replace UIViewController’s root `UIView` with our custom `UIView` class.

We’ll look at the relationships between the combination of views and view controllers to learn the current state. Instead of focusing too much on what each method does, we’ll look at what is important for each method and when to use them.

### UIView - UIViewController Relationship

#### loadView

This is where the root view of the view controller is loaded. The `view` property of `UIViewController` is `nil` at the moment. We need to override this method if we want to create a custom view and set it to the `view` property. If the Interface Builder is used to create the view and initialize the view controller, this method must not be overridden. Once we override this method, we have to initialize our custom view and set it to `view` property of `UIViewController` and never call `super.loadView` because it creates the view by itself and assigns it to `view`. Lastly, we shouldn’t call this method directly.

#### viewDidLoad

This is called only once after creating the view and loading it into memory. But the `bounds` of the view is not defined yet. We generally override this method to initialize the objects which the view controller will use. We shouldn’t forget to call super when we override.

#### viewWillAppear

This method is called right before the view appears on the screen. When this is called, the view’s bounds are defined, but the orientation is not set yet. We need to be careful while using appear methods since they will be called every time the view comes to the screen. Similarly, we shouldn’t forget to call super.

#### viewDidAppear

This method is called right after the view is visible to the user. It’s a good place to start animations. Same as before, we shouldn’t forget to call super.

#### viewWillLayoutSubviews

This is the first place to learn the bounds of the view in the lifecycle. This is also called right before `layoutSubviews` method is triggered in `UIView`. This is also called when the subviews of the root view are loaded. For example, this is called when the cells of the collection view are loaded.

#### viewDidLayoutSubviews

This is called right after `layoutSubviews` called. The subviews have been set, and size, position, and constraints are applied. `viewWillLayoutSubviews` and `viewDidLayoutSubviews` are also called when the orientation of the screen changes between portrait and landscape modes. So the key point is whenever the bounds of the view are updated, or the view layout is recalculated, both methods will be called. Similarly, we shouldn’t forget to call super at some point in these methods.

#### viewWillDisappear

This is called when the view is about to disappear from the screen. One thing we can do here is to save the user data to not lose anything important. Another thing we might be canceling is network requests. We can override this method also if we want to hand over first responder jobs to another view when the view disappears.

#### viewDidDisappear

This is called when the view is disappeared from the screen. The view is removed from the view hierarchy at the moment.

![Complete View Lifecycle](/images/content/essays/ns-for-ios-devs/ios-complete-view-lifecycle.jpeg)

We took a look at the most common relationship, view and view controller relationship which was also a default one implemented by UIKit. But the view controller not only gets in a relationship with a view but also with other view controllers like a child and parent.

### UIViewController - UIViewController Relationship

Understanding this relationship and the lifecycle of the view controller is important if we embed one view controller into another. Because we might need to manually call some lifecycle methods to inform the system about the state, let’s have an example for adding and removing child view controllers.

#### Adding a ViewController as a child to Another ViewController

```swift
let childViewController = UIViewController()
let parentViewController = UIViewController()
parentViewController.addChild(childViewController)
parentViewController.view.addSubview(childViewController.view)


// Time to setup auto-layout constraints for childViewController.view
// Example:
//   NSLayoutConstraint.activate([
//       childViewController.view.topAnchor.constraint(equalTo: parentViewController.view.topAnchor)
//   ])


childViewController.didMove(toParent: parentViewController)
```

Let’s examine what we are doing about the lifecycle. After creating view controllers, we add the child to the parent. This addition automatically calls `childViewController.willMove(toParent: parentViewController)` for us. So, we don’t need to call it manually. Then, we need to add the child view controller’s view to the parent’s view to have a child-parent relationship for views. The system will load both views and will add one to another with our call `addSubview`. Then we inform the system by calling `didMove(toParent:)`. The system will handle the rest of displaying the view controller and calling the view controller’s necessary methods in its lifecycle like `viewDidLoad`, `viewDidAppear`, etc.

#### Removing the Child ViewController from the Parent ViewController

```swift
childViewController.willMove(toParent: nil)
childViewController.view.removeFromSuperview()
childViewController.removeFromParent()
```

While removing the child view controller from the parent, we have to call `willMove(toParent:)` method with `nil` to inform the system that the child view controller will be removed from the parent. Then, we remove its view and later itself from the parent. As we see, we don’t need to call `didMove(toParent:)` method while we’re removing it. `removeFromParent` method automatically calls that method for us.

Additionally, we can override both `willMove(toParent:)` and `didMove(toParent:)`. If we need to know in a view controller that it’s been added as a child to another view controller, we can override these methods and implement our custom actions.

Parent and child view controller relationships are common. It’s important to understand the lifecycle of both view controllers in order to call the necessary method at a certain point. If we forget to call one method, we might lead to some memory problems inside the app. Now, we came to the last point - the relationship between view and its subviews and lifecycle methods.

### View - View (Subviews) Relationship

In this relationship, most of the lifecycle is handled automatically by the system and no need for calling some methods like parent and child view controllers relationship. For example, even if we try to call `willRemoveSubview` method, it does nothing. The default implementation is empty. The system calls the below functions only to inform us when something is changed. There are not so many things to talk about. Learning that we can detect when the subview is added, the view is added as a subview or moved to the window opens up opportunities for implementing extra actions during those phases.

Here are the mentioned lifecycle methods for `UIView`:

#### didAddSubview(_:)

#### willRemoveSubview(_:)

#### willMove(toSuperView:)

#### didMoveToSuperview()

#### willMove(toWindow:)

#### didMoveToWindow()

The only important thing to know here is `removeFromSuperview` method. We can call this if we want to remove the view from its parent. Calling this method removes all constraints in the view and in its subtrees. We shouldn’t call this method inside the view’s `draw(_:)` method.

## Last Words

Only knowing one of the [application](https://candost.substack.com/p/ios-application-lifecycle), view controller, and view lifecycles are not enough to understand the whole picture and develop a great overview of iOS applications. Grasping the use of lifecycle methods is important to take appropriate actions in certain places, especially working with custom implementations of UIKit classes. Now we know the lifecycles, we can truly understand what is going on behind the scenes in the system and intervene when necessary.

---

Further reading:
- [The Lifecycle of a View](https://medium.com/@amyjoscelyn/the-life-cycle-of-a-view-c98f296fd84e)
- [UIViewController Documentation](https://developer.apple.com/documentation/uikit/uiviewcontroller)
- [Implementing a Container View Controller](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/ImplementingaContainerViewController.html)
