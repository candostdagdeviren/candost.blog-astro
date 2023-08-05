---
title: "Unit Tests in Server-Side Swift API"
description: "Why do we need to reshape our module to make it testable?"
tags:
  -
date: 2017-03-21
updateDate: 2017-03-21
external: false
---

## TL;DR

- Swift accepts only one executable file for the app. We need to split the app and library to make it testable. Because testing requires a separate executable file.
- `main.swift` file is the main executable for app. `LinuxMain.swift` file is the main executable for tests.
- To split them, we’ll create two targets. One target is the library which will consist of all our code. The other one is the app which will be dependent on the library.
- Do not forget to add the ~Tests suffix for your test folders and test files.
- `LinuxMain.swift` file must be under the `Tests` directory.
- Create a static variable inside test classes and use it as a parameter while calling `testCase()` method in `LinuxMain.swift` file.

## Restructuring the Project

After [the first post](/new-horizons-with-server-side-swift), we should have an executable Swift Backend API. In this post, we’ll restructure and reconfigure our beloved tiny module for tests and Dockerize it. First, one question comes to our minds: **Why do we need to reshape our module to make it testable?** Because we have the executable module right now (which is the API), and **Swift doesn’t accept more than one main executable**. At this point, to execute tests, we need a separate executable .swift file for tests. From this point, we’ll move `main.swift` as a separate module and call it an app. The logic and all other stuff will be in our library module. You can see the latest folder structure on the right side. There are some points that we need to handle while separating our app and library. First, **top-level expressions are not allowed except** for **`main.swift`** file. It means that we can call methods or expressions outside of **class, struct, enum, etc.** only in `main.swift` file like our current version:

```swift
// main.swift
import Kitura
import HeliumLogger
import CouchDB

HeliumLogger.use()

let connProperties = ConnectionProperties(
    host: "127.0.0.1",  // httpd address
    port: 5984,         // httpd port
    secured: false,     // https or http
    username: "candost",      // admin username
    password: "password"       // admin password
)

let db = Database(connProperties: connProperties, dbName: "kitura_test_db")
let databaseInteraction = DatabaseInteraction(db: db)
let app = MainRouter(db: databaseInteraction)

Kitura.addHTTPServer(onPort: 8090, with: app.router)

Kitura.run()
```

After separating our Lib and App, we don’t have access to imported modules (in this case, Kitura, HeliumLogger, and CouchDB) and custom-created data structures (like MainRouter, DatabaseInteraction, etc.). So, we’ll move all this code into a function in a new data structure (class or struct). In this case, it’s good practice to name this file the same as our module, `SwiftBackend.swift`. After moving all code inside the `main.swift` file, our `SwiftBackend.swift` file becomes like this:

```swift
// SwiftBackend.swift
import Kitura
import HeliumLogger
import CouchDB

public class SwiftBackend {
  public static func run() {
    HeliumLogger.use()

    let connProperties = ConnectionProperties(
        host: "127.0.0.1",  // httpd address
        port: 5984,         // httpd port
        secured: false,     // https or http
        username: "candost",      // admin username
        password: "password"       // admin password
    )

    let db = Database(connProperties: connProperties, dbName: "kitura_test_db")
    let databaseInteraction = DatabaseInteraction(db: db)
    let app = MainRouter(db: databaseInteraction)

    Kitura.addHTTPServer(onPort: 8090, with: app.router)

    Kitura.run()

  }
}
```

Now, we all need to do is creating this `SwiftBackend` class inside our `main.swift` file in the App module and call the method `run`. Just don’t forget to import `SwiftBackendLib` to access `SwiftBackend` class. Here is the latest version of `main.swift`:

```swift
// main.swift
import SwiftBackendLib

SwiftBackend.run()
```

OK, we have 2 different modules `SwiftBackendLib` and `SwiftBackendApp`. Lastly, **we need to create these modules as targets** in our `Package.swift` file and **add our library as a dependency for the app target**. In the end, it should be like this:

```swift
// Package.swift
import PackageDescription

let package = Package(
    name: "SwiftBackend",
    targets: [
      Target(name: "SwiftBackendLib"),
      Target(name: "SwiftBackendApp", dependencies: ["SwiftBackendLib"])
    ],
    dependencies: [
        .Package(url: "https://github.com/IBM-Swift/Kitura.git", majorVersion: 1, minor: 4),
        .Package(url: "https://github.com/IBM-Swift/HeliumLogger.git", majorVersion: 1, minor: 4),
        .Package(url: "https://github.com/IBM-Swift/Kitura-CouchDB.git", majorVersion: 1, minor: 4)
    ]
)
```

We’re ready to start writing tests.

## Creating & Running Unit Tests

Our restructuring is done. We can start testing. Mainly, there are a few rules for tests. As you can see in our folder structure above, inside the **Test** folder, we have **SwiftBackendLibTests**. The first thing here is whenever you create a folder under the **Test** directory, you have to add the **~Tests** suffix to your folder name. Second, `LinuxMain.swift` file is the executable file for Tests. This is the **main reason** why we have to separate the library and the app in the first place. So, we have to place `LinuxMain.swift` file directly under the Tests directory. Finally, we can start writing some tests. Here is an example of a basic test file:

```swift
// UserTests.swift
import XCTest
@testable import SwiftBackendLib

class UserTests: XCTestCase {

    static var allTests : [(String, (UserTests) -> () throws -> Void)] {
        return [
                ("testAsserts", testAsserts)
            ]
    }

    override func setUp() {
        super.setUp()
    }

    func testAsserts() {
        XCTAssertEqual(1234, 1234, "Message shown when assert fails")
    }
}
```

As you can see, we have `allTests` variable which is `static`. This is the way you can call tests from your `LinuxMain.swift` file. As you can see in `LinuxMain.swift`:

```swift
// LinuxMain.swift
import XCTest
@testable import SwiftBackendLib

XCTMain([
    testCase(UserTests.allTests)
])
```

We’re using this static variable as a `testCase` parameter. This will run all tests inside the test file. So, when you add new test methods, do not forget to include them in the static variable `return` state. When you create new test classes, do not forget to add the ~Tests suffix and add `testCase` a method to `LinuxMain.swift` file with a static variable parameter. ## Dockerizing

I’ll not explain how to set up Docker. There are great guides that explain everything in steps. I assume you already have a running Docker Machine. Here is the basic Dockerfile to run this API using Docker. It means that you can deploy almost anywhere you want (if it supports Docker).

```
FROM ibmcom/swift-ubuntu:latest
MAINTAINER Candost Dagdeviren <candostdagdeviren@gmail.com>
ADD . /app
WORKDIR /app
EXPOSE 8090
USER root
RUN swift build
CMD [".build/debug/SwiftBackendApp"]
```

Let’s see what is going on in this Dockerfile. We’re using `ibmcom/swift-ubuntu:latest` image as a base image. This will fulfill our needs while running. If there is no setup for Swift, it’ll install the required Linux packages to make it run. After that, we copy all of our current directories (all files) to the under `/app` directory and make `/app` directory our working directory. `EXPOSE 8090` command exposes the 8090 port for our app. So our app will be accessible via port number 8090. Then, we set our current user as a `root` user to run everything with root access. Finally, everything is ready, and we can build and run our server API. `RUN swift build` runs the `swift build` command, and it creates executable files. The last line of the Dockerfile just executes this executable.

**NOTE:** In here, we’re using debug executable. If you want to use release configuration, you can change `RUN` command to `swift build -c release`. This will create an executable for release configuration. Then, you can use command `.build/release/SwiftBackendApp` in the last line.

You can run the API executable in your local with command `docker run -p 8090:8090 swiftbackend`. This should start running, and you can start sending requests to your Docker Machine

## Conclusion

Here we go. Finally, we have a working Swift Server API. I tried to explain all steps I did. I spent a lot of time making this app testable. I didn’t know that folder structure and naming really mattered for running tests with Swift. If you had some troubles that I didn’t mention here, please add them as comments.
