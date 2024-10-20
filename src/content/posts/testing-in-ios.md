---
title: "Testability in iOS"
description: "Most of the developers have a hard time understanding the testing. Tests are often underrated and despised. What are the benefits of tests?"
date: 2018-12-04
updateDate: 2018-12-04
external: false
---

Tests are often a big discussion in the software development community. We hear a lot of people saying, “If you don’t write tests, you’re a bad developer,” or “If you don’t know how to write tests, you’re doing everything wrong,” or “Tests are good, but they are time-consuming.” However, I prefer saying

> “If you don’t write tests, that’s OK. Just try writing them, you’ll end up understanding the benefits and you’ll learn and think more about your architecture decisions which you made before coding.”

I talked with many people and watched a lot of talks at meet-ups and conferences about all kinds of tests. After a while, I realized to believe that the common thought, “In iOS, you don’t need to write tests if you have a QA person.” This still kicks me in the back from time to time. But whether we think the same or we like writing tests or not, we should acknowledge the benefits. Believe me, when I saw the benefits in time, I changed my mind and started writing automated tests even though we have QA people.

## OK. But still, why should we write tests

First, we should consider the workflow without tests and identify the (future) problems. Let’s think of the scenario where we have only one QA person and no automated tests. We need to consider every case before and during the coding. Just because of human nature, we tend to make mistakes. That’s why manual testing is buggy. There will be unwanted behavior. I hear you; you have great and hard-working QA people who test the builds. But small bugs tend to be missed, and they can be easily identifiable by automated tests.

On the other hand, when we have automated tests, we tend to have fewer bugs. We create the test cases and fix the code to make the tests pass. Only thinking and writing these cases brings more benefits. They become a documentation of intent. It provides enough information to the new developers in the project. Therefore, during the onboarding process, tests flatten the learning curve.

Writing less code is one of the things that most developers want. This is generally a strong argument against tests. But without tests, we end up spending more time finding bugs and fixing them. There isn’t an easy way to measure how much it affects. But the test-written projects tend to be more stable and solid. Even while adding the new feature, we can be comfortable. Because if our changes affect the other parts of the code, we will be notified by broken tests.

Architectural decisions are made better with tests. We’ll talk about the architecture in later posts, but I just want to say that while writing tests, we end up thinking about our architectural approaches a lot. We start considering [single responsibility](https://www.wikiwand.com/en/Single_responsibility_principle) and [dependency inversion](https://www.wikiwand.com/en/Dependency_inversion_principle) principles to set up better architectures. Sometimes we need to [mock or stub](https://stackoverflow.com/a/2666006/1205160) services (and we generally do this by using `protocol`s in Swift), and this helps to understand [Protocol Oriented Programming](https://developer.apple.com/videos/play/wwdc2015/408/). So, unconsciously we start researching and learning more architectural approaches and design patterns.

Lastly, tests make code reviews easy. If we already have a lot of tests, we are more confident that the change doesn’t affect the other parts of the code. And if we’re not really familiar with the content of the [pull](https://www.atlassian.com/git/tutorials/making-a-pull-request) (or [merge](https://docs.gitlab.com/ee/user/project/merge_requests/)) request, thanks to the tests, we understand that content with ease. I like the quote that Apple engineers say in [one WWDC17 session](https://developer.apple.com/videos/play/wwdc2017/414/), “Code reviews for test code, not code reviews with test code.”

Ok, let’s summarize here:

- Manual tests are buggy, and they may cause unwanted behavior
- Automated tests are robust, and they provide self-documentation to the code
- Automated tests seem time-consuming at first, but they save more time in the long run
- Automated tests help us understand architectural approaches and teach a lot of things even without noticing.
- Automated tests make code reviews easier.

## Now we’re kind of convinced. So, what do we need to know?

There are tons of great online tutorials about writing tests for iOS apps (links are below). Here, we will focus on important points and some testing tips.

1. "Design your code for testability" - [John Sundell](https://youtu.be/amVstam84Xo?t=405)
    As John says, we should ask ourselves one question: **"What makes code easy to test?"**. When we ask this question, there are two things that come to mind:
    - We shouldn’t overuse singletons.
        Singletons are great, and Apple also uses them in important places like `UIScreen`, `UIApplication`. Since we have only one screen and only one application in run-time, this makes sense. But making an object global is not always necessary. We should keep the state of the object local instead and don’t let everyone change the state. So, we should think twice when we create a singleton.
    - We should use protocols and parameterization.
        Instead of subclassing for mocking purposes, we should prefer protocols ([composition over inheritance](https://medium.com/commencis/reusability-and-composition-in-swift-6630fc199e16)). Protocols provide a more robust solution. When we subclass to create a mock for tests, Xcode doesn’t give any warning if we forget to add `override` to a function. It is risky and also some classes cannot be subclassed (like `UIApplication`). If we use protocols, we abstract the implementation, and we create a proper mock. Also, Xcode shows an error when we forget to implement one function while conforming to a protocol. Let’s take a look at an example.
        Let’s say we want to create a `FileOpener` and its only purpose is opening files if the URL is correct. We’ll use `UIApplication.canOpenURL(url:)` method. And we’ll write tests for this.

        ```swift
        class FileOpener {
          func open(identifier: String) {
            guard let url = URL(string: "iosappscheme://open?id=\(identifier)") else {
                debugPrint("Failed to convert URL")
                return
            }
            if UIApplication.shared.canOpenURL(url) {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
            } else {
                debugPrint("Failed to open URL")
            }
          }
        }
        ```

        This should work in the app. But in UITests, this will open another app, and our tests will be blocked. When we start thinking about John’s question ("What makes code easy to test?"), we realize that we should parameterize the function first. `UIApplication` is a dependency in class. So, it’s better to inject it.

        ```swift
        class FileOpener {
          let application: UIApplication
          init(application: UIApplication = UIApplication.shared) {
            self.application = application
          }

          func open(identifier: String) {
            let url = URL(string: "iosappscheme://open?id=\(identifier)")
            if application.canOpenURL(url) {
              application.open(url, options: [:], completionHandler: nil)
            } else {
              debugPrint("Failed to load URL")
            }
          }
        }
        ```

        As we see in the initializer, we used `UIApplication.shared` in default parameter. This makes initializing the `DocumentOpener` so much easier. But we still have a problem. We cannot mock `UIApplication` because it’s a singleton. Now, we can get the power of protocols in Swift. Let’s implement a new protocol called `URLOpening` and make `UIApplication` to conform it.

        ```swift
          protocol URLOpening {
            func canOpenURL(_ url: URL) -> Bool
            func open(_ url: URL, options: [UIApplication.OpenExternalURLOptionsKey : Any], completionHandler completion: ((Bool) -> Void)?)
          }

          extension UIApplication: URLOpening {}
        ```

        Now, let’s adjust our `FileOpener` and use the protocol as a parameter in the initializer.

        ```swift
        class FileOpener {
          let urlOpener: URLOpening
          init(urlOpener: URLOpening = UIApplication.shared) {
            self.urlOpener = urlOpener
          }

          func open(identifier: String) {
            let url = URL(string: "iosappscheme://open?id=\(identifier)")
            if urlOpener.canOpenURL(url) {
              urlOpener.open(url, options: [:], completionHandler: nil)
            } else {
              debugPrint("Failed to load URL")
            }
          }
        }
        ```

        Thanks to Swift extensions, we don’t need to implement `URLOpening` protocol in the `UIApplication` extension, as we see above. Because we’re following the same method signature which `UIApplication` already has. Now we have abstracted the implementation; we can create a new mock class and just conform to `URLOpening` protocol. Thus, we’ll be able to use mocking while testing `FileOpener`.
2. We should separate logic and effects and create clear boundaries for APIs
    We should create frameworks and libraries to separate the logic. Using [Separation of Concerns](https://www.wikiwand.com/en/Separation_of_concerns), we may extract business logic and algorithms. They can have their own tests. And whenever we need to change something, we will know our changes won’t affect the business logic if we designed the API boundaries well. Swift has powerful [access control](https://docs.swift.org/swift-book/LanguageGuide/AccessControl.html). We shouldn’t expose more information than needed to the outside of those frameworks.
3. Use pure functions
    We should leverage functional style and reduce the effects of our functions. One function should always return the same output when given the same input. Also, it shouldn't have any side effects. (in functional programming, these functions are called ‘[Pure function](https://www.wikiwand.com/en/Pure_function)’). Pure functions are predictable, and they are easily testable.
4. Optimize App Launch for Testing
    While running the tests, we see the simulator but wait for a couple of seconds. This is because the app is loading. Tests don’t start before `func application(_ application: didFinishLaunchingWithOptions options:) -> Bool` returns. We generally do a lot of setup inside this method, like analytics and crash reporting setup. But we generally don’t need them during tests. So, we should avoid unnecessary work when the app is launched for tests. We can [set a custom scheme environment variable](https://medium.com/@derrickho_28266/xcode-custom-environment-variables-681b5b8674ec) and use it in `AppDelegate`.

    ```swift
    func application(_ application: UIApplication, didFinishLaunchingWithOptions options: _) -> Bool {
      let isUnitTesting = ProcessInfo.processInfo.environment["IS_UNIT_TESTING"] == "1"
      if isUnitTesting == false {
        // Do UI-related setup, which can be skipped when testing
      }
      return true
    }
    ```

5. Avoid too much mocking. Mocking is good while testing. But it might result in a lot of implementation details. Mocks provide predictability. Whenever we need really good predictability, we can define them. But even in this case, they should be as simple as possible, and they should be inline, not globally defined.
6. Use correct expectations in tests and avoid ambiguous tests. We should use faster, callback-based expectations in unit tests:
    - `XCTestExpectation`
    - `XCTNSNotificationExpectation`
    - `XCTKVOExpectation`
7. Use the [parallel testing](https://www.swiftbysundell.com/daily-wwdc/faster-and-more-robust-tests-with-xcode-10) feature in Xcode 10. If you have a lot of tests, make them run in parallel. Xcode runs them with good optimization to reduce the test running time. Try to watch your test classes’ execution times. If one test class takes a huge time while the others are not, try splitting the class into several classes or find the reason why it takes so much time. This will accelerate the running of the tests.

## Last Words

Covering the app code with tests is a neat way to be sure the app works properly. Not only should we set goals for test coverage, but we also should treat the tests with the same amount of care as our app. The quality of the test code is also really important to consider, even though the code is not shipping. Coding principles in the app code should also apply to the test code. And lastly, test code should support the evolution of our app, and they should grow together. Therefore, we should keep an eye on their growth with code coverage.

---

Further:

- [Engineering for Testability - WWDC17](https://developer.apple.com/videos/play/wwdc2017/414/)
- [Writing Swift code with great testability - John Sundell](https://www.youtube.com/watch?v=amVstam84Xo)
- [Testing Tips & Tricks - WWDC18](https://developer.apple.com/videos/play/wwdc2018/417/)
- [Mocking in Swift - Swift by Sundell](https://www.swiftbysundell.com/posts/mocking-in-swift)
- [Protocol Oriented Programming - WWDC15](https://developer.apple.com/videos/play/wwdc2015/408/)
- [iOS Unit Testing and UI Testing Tutorial - Ray Wenderlich](https://www.raywenderlich.com/709-ios-unit-testing-and-ui-testing-tutorial)
- [Test-Driven Development Tutorial for iOS - Ray Wenderlich](https://www.raywenderlich.com/5522-test-driven-development-tutorial-for-ios-getting-started)
- [Xcode’s Secret Performance Tests - Indie Stack](https://indiestack.com/2018/02/xcodes-secret-performance-tests/)