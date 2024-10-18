---
title: "New Horizons with Server-Side Swift"
description: "After hearing a lot about the great performance of Swift in the backend, I decided to give it a try. And here comes my first experiences step by step."
date: 2017-02-05
updateDate: 2017-02-05
external: false
---

After deciding to join more conferences this year, the very first one was **[dotSwift](https://www.dotswift.io/)**. It was held in a great old theater in Paris. It was a half-day conference, but it was better than I guessed. There were good talks about backend development in Swift. After hearing a lot about that and the great performance of Swift, I decided to give it a try. And here comes my first experience, step by step.

There are two major frameworks for the backend in Swift, [Kitura](https://github.com/IBM-Swift/Kitura) and [Vapor](https://github.com/vapor/vapor). I choose Kitura first. Because Kitura’s methods naming was close to the ones that I knew from Node.js. I felt more comfortable about understanding what each method does.

First, setting up the environment was easy because I have Mac and I’m actively developing iOS applications. So, Xcode and other stuff were already set up.

Creating a Swift backend project means creating a new Swift package with the single line command `swift package init`. This creates a structured new package. But packages are not executable, and I needed an executable project to run my backend. Creating `main.swift` file under the Sources directory gave me this ability to me. At this point, my current folder structure was like this:

```
SwiftBackend
  .gitignore
  Package.swift
  |--Sources
  main.swift
  |--Tests
```

Now, it was time to arrange `Package.swift` and add Kitura. Here is the `Package.swift` file with Kitura added as a dependency:

```swift
import PackageDescription

let package = Package(
  name: "SwiftBackend",
  dependencies: [
    .Package(url: "https://github.com/IBM-Swift/Kitura.git", majorVersion: 1, minor: 4)
  ]
)
```

`swift build` command installs the dependencies and builds the project. After adding a new dependency, it’s always logical to build the project and see if it works.

The next step is setting up an endpoint. The basic example in Kitura’s tutorial is:

```swift
import Kitura

let router = Router()
router.get("/") { request, response, next in
  response.send("Hello, World!")
  next()
}
Kitura.addHTTPServer(onPort: 8090, with: router)
Kitura.run()
```

I added this code to `main.swift` file. When I ran the project locally, I should have seen Hello, World! when I enter `localhost:8090` via browser (or make a get request via Postman etc.). To run this project, first, I needed to build it via `swift build` and this command created the executable for me under `.build/debug/SwiftBackend` . I’ve just run the executable by typing the command line `.build/debug/SwiftBackend`. At this point, I was able to send a request and see **“Hello, World!”** text in the browser. But in the console, I didn’t see any logs about these requests.

[`HeliumLogger`](https://github.com/IBM-Swift/HeliumLogger) came in at that point. It’s a logger component which available as a separate Swift module. I added this module to `Package.swift` file by adding it as a new dependency. At this point, my `Package.swift` file was like this:

```swift
import PackageDescription

let package = Package(
  name: "SwiftBackend",
  dependencies: [
    .Package(url: "https://github.com/IBM-Swift/Kitura.git", majorVersion: 1, minor: 4),
    .Package(url: "https://github.com/IBM-Swift/HeliumLogger.git", majorVersion: 1, minor: 4)
  ]
)
```

And I ran the swift build command again to install `HeliumLogger`. After that, I needed to import `HeliumLogger` and use it in `main.swift` file. It was just one line. My `main.swift` file became like this:

```swift
import Kitura
import HeliumLogger

HeliumLogger.use()

let router = Router()
router.get("/") { request, response, next in
  response.send("Hello, World!")
  next()
}
Kitura.addHTTPServer(onPort: 8090, with: router)
Kitura.run()
```

After building and running the project again, I was able to see the request logs in the console.

As the next step, I wanted to connect the database to my backend API. I used CouchDB because there is a [Kitura-CouchDB](https://github.com/IBM-Swift/Kitura-CouchDB) package.

After adding the CouchDB package to my `Package.swift` file, it became like this:

```swift
import PackageDescription

let package = Package(
  name: "SwiftBackend",
  dependencies: [
    .Package(url: "https://github.com/IBM-Swift/Kitura.git", majorVersion: 1, minor: 4),
    .Package(url: "https://github.com/IBM-Swift/HeliumLogger.git", majorVersion: 1, minor: 4),
    .Package(url: "https://github.com/IBM-Swift/Kitura-CouchDB.git", majorVersion: 1, minor: 4)
  ]
)
```

Again, I ran the command `swift build` to install a new package.

While implementing database operations, I wanted to create a structure to not do everything in `main.swift` file. First, I created a `User` struct as a model object. My main purpose for database operations was to add this `User` object to the CouchDB database as a document. Easy model, easy operation. So `User` struct was like this:

```swift
import Foundation

public struct User {
  let name: String
  let identifier: String
}
```

So, as I said, my main purpose was to add a document to the CouchDB database. I created a `DatabaseInteraction` struct with one method to achieve that goal. My plan was to add all database operations to this struct. Here is the `DatabaseInteraction` struct:

```swift
import Foundation
import CouchDB
import SwiftyJSON

public struct DatabaseInteraction {
  var db: Database
  public init(db: Database) {
    self.db = db
  }

func addNewUser(_ user: User, handler: @escaping (String?, String?, JSON?, NSError?) -> ()) {
    let userDict: [String: Any] = [
      "name": user.name,
      "identifier": user.identifier
    ]
    let userJSON = JSON(userDict)
    db.create(userJSON) {  (id, revision, doc, error) in
      if let error = error {
        handler(nil, nil, nil, error)
        return
      } else {
        handler(id, revision, doc, nil)
      }
    }
  }
}
```

I also separated HTTP request methods into routers. First, I created `UserRouter` to handle HTTP requests for users and I only wrote one post method to get user data in the body.`UserRouter` class is like this:

```swift
import Foundation
import Kitura
import CouchDB
import SwiftyJSON

public class UserRouter {
  var db: DatabaseInteraction

  public init(db: DatabaseInteraction) {
    self.db = db
  }

  public func bindAll(to router: Router) {
    addCreateUser(to: router)
  }

  private func addCreateUser(to router: Router) {
    router.post("/user/", handler: { req, res, next in
      guard let parsedBody = req.body else {
        res.status(.badRequest)
        next()
        return
      }
      switch(parsedBody) {
        case .json(let jsonBody):
          let name = jsonBody["name"].string ??
          let user = User(name: name, identifier: "\(name.characters.count)")
          self.db.addNewUser(user) { (id, revision, doc, error) in
            if let error = error {
              res.status(.internalServerError)
              next()
            } else {
              res.status(.OK)
              if let doc = doc {
                res.send(json: doc)
              } else {
                res.send("Something is wrong in the doc")
              }
              next()
            }
          }
        default:
          res.status(.badRequest)
          next()
      }
    })
  }
}
```

After that, I created the main router to manage separate routing operations from here. Here is the `BackendRouter` as the main router object:

```swift
import Foundation
import Kitura

public class BackendRouter {
  public let router = Router()
  var db: DatabaseInteraction
  public init(db: DatabaseInteraction) {
    self.db = db
    router.get("/status") { req, res, callNextHandler in
      res.status(.OK).send("Everything is working")
      callNextHandler()
    }

    router.all("*", middleware: BodyParser())
    self.routeToUser()
  }

  func routeToUser() {
    let user = UserRouter(db: self.db)
    user.bindAll(to: self.router)
  }
}
```

Lastly, I connected all of them in the `main.swift` file.

```swift
import Kitura
import HeliumLogger
import CouchDB

HeliumLogger.use()

let connProperties = ConnectionProperties(
    host: "127.0.0.1",  // httpd address
    port: 5984,         // httpd port
    secured: false,     // https or http
    username: "admin",  // admin username
    password: "password"// admin password
)

let db = Database(connProperties: connProperties, dbName: "swift_backend_test_db")
let databaseInteraction = DatabaseInteraction(db: db)
let app = MainRouter(db: databaseInteraction)

Kitura.addHTTPServer(onPort: 8090, with: app.router)
Kitura.run()
```

So, let’s see how the overall folder structure looks right now.

```
SwiftBackend
  .gitignore
  |--Sources
    BackendRouter.swift
    DatabaseInteraction.swift
    main.swift
    User.swift
    UserRouter.swift
  |--Tests
  Package.swift
```

After all coding, it was time to build the API and send a request via Postman. I got success after some trials. (Note: Be careful about connection properties and escaping closures). Of course, there are a lot of things to improve in code. But all these codes were intended to create a working backend API developed with Swift.

---

[In the next post](/unit-tests-in-server-side-swift/), I made this project testable and Dockerized. There are some points to be careful while making it testable.

As a final step, I’ll try to upload it to the cloud. But my first impression was really good. I should say that I am convinced to work on the backend side of Swift. It’s pretty easy. I’m working with SublimeText instead of Xcode. Thus, I can understand each line I wrote without auto-completion. If you’re working with Swift, you should definitely try to create some backend APIs with Swift.
