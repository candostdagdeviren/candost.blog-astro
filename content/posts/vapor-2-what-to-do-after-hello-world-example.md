---
title: "Vapor 2 - What to do after 'Hello World' Example"
description: "When Apple announced Server APIs and working group, it made me think to switch to Swift for server-side development."
tags:
  -
date: 2017-07-09
updateDate: 2017-07-09
external: false
---

I was using Javascript and wasn’t happy with the language. Even if it has a lot of features and cool things, it’s not type-safe. This doesn’t feel right to me. In fact, I lost myself in the code a couple of months ago while trying to understand one undefined error.

Javascript is a big world, and there are millions of ways to do [one thing](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f). So, I decided to give Swift a shot for server-side development. I tried Kitura [at first](/new-horizons-with-server-side-swift/). Because naming was similar to Express.js and Koa.js. After some time, I realized naming is not the issue at that moment. While all frameworks getting better, Kitura has a lot of missing features even now. But I learned a lot of things while working with Kitura, though. Then, I decided to go with Vapor. It’s more complete and it looks like it’s ready for production.

In this article, I speak about creating a backend API for a small and beautiful iOS game called [Kaucuk](https://appsto.re/de/48TAhb.i). As an iOS developer with a small amount of backend experience, I’ll try to focus on getting things ready for production. I won’t focus on the web frontend side and also the basics of Vapor. You can check out the [documentation](https://docs.vapor.codes/2.0/) for basics.

## Here we go

There are some examples, and tutorials for setting up and creating an endpoint for Hello, World!” message. Most of the time I lose myself after this point. Don’t know what to do and what to research. Because from this point it starts to be specific for a use case. But there are a number of things that you should know/learn. I’ll focus on them one by one by explaining what we did.

### Database Preparation

We decided to go for MongoDB. Vapor has a Mongo provider to handle Mongo setup easily. We’ll set up MongoDB and connect to our API.

Install MongoDB on Mac with _brew install mongodb_ command and start it with _brew services start_ mongodb. When it’s completed, connect to the admin board with Mongo admin. Then, create user with `db.createUser({ user: "admin", pwd: "password", roles: ["root"] })` command and exit from the admin board with Ctrl+C. Run _mongod_ command in the terminal. This will run the database on your local. Now, we need to put these configurations in the _Config_ folder in our Vapor app. I’ll explain what is Config and why we did this later. Create a new file named _mongo.json_ under the _Config_ folder and put the following JSON in there. (This config is only for development)

```json
{
  "url": "mongodb://admin:password@127.0.0.1:27017/vapor_db"
}
```

Our database is ready. Let’s take a look at our models.

## Models

Models are pretty straightforward. Import _FluentProvider_ and conform to Model protocol. Add _Storage_ as property. It’ll handle all _id and exists_ thingies in the model. The only tweak here is for me to conforming _JSONRepresentable_ protocol and implement the custom JSON responses for the model. Because, if you want to return the id in the response, you have to use it. Also sometimes you just want a custom JSON response to fit your client’s style.

```swift
import Vapor
import Fluent
import FluentProvider
import Foundation

final class User: Model {
  let storage = Storage()
  var name: String

  var exists: Bool = false

  init(name: String) {
    self.name = name
  }

  init(row: Row) throws {
    name = try row.get("name")
  }

  func makeRow() throws -> Row {
    var row = Row()
    try row.set("name", name)
    return row
  }
}

extension User: JSONRepresentable {
  func makeJSON() throws -> JSON {
    var json = JSON()
    try json.set("id", id?.string)
    try json.set("name", name)
    return json
  }
}

extension User: Timestampable { }
extension User: Preparation {
  static func prepare(_ database: Database) throws {
    try database.create(self) { builder in
      builder.id()
      builder.string("name")
    }
  }

  static func revert(_ database: Database) throws {
    try database.delete(self)
  }
}
```

## Controllers

This is where all logic goes in. The controller basically manages requests and prepares responses properly. While preparing the response, we can send a query to the database, a network request to another system or just do logical operations. But we should be careful to not have massive controllers. Let’s take a look at the basic usage.

```swift
final class UserController {
  func all(request: Request) throws -> ResponseRepresentable {
    let allUsers = try User.all()
    return try allUsers.makeJSON()
  }
}
```

First, we get all users. It uses Fluent’s [all()](https://github.com/vapor/fluent/blob/cc2e9ef2723ed8ca3633396b0c344816077d9539/Sources/Fluent/Entity/Entity.swift#L134) method. It returns all users as _User_ array. Then we try to make it JSON and return it. We’re going to connect this function to /all endpoint like the following:

```swift
let userController = UserController()
drop.get("all", handler: userController.all)
```

This is the easiest endpoint. Let’s take a look at a more advanced one. In Kaucuk, we decided to keep our users’ highest scores only. In that case, our endpoint should update the user and return it back. We have a PATCH request to update one part of the user model. We search our user by identifier, update its score and save it back to the database.

```swift
func updateScore(request: Request) throws -> ResponseRepresentable {
  let id = try request.parameters.next(String.self)
  guard let json = request.json,
        let score = json["score"]?.int else {
    throw Abort(.badRequest)
  }

  guard let user = try User.find(id) else {
    throw Abort(.notFound)
  }
  let newUser = user
  do {
    if score > newUser.score {
      newUser.score = score
      try newUser.save()
      return try newUser.makeJSON()
    }
  } catch {
    return Response(status: .failedDependency)
  }

  do {
    return try newUser.makeJSON()
  } catch {
    return Response(status: .internalServerError)
  }
}
```

We can connect this controller method to an endpoint like the following:

```swift
let userController = UserController()
users.patch("", String.parameter, "score", handler: userController.updateScore)
```

### ResourceRepresentable Protocol

I should mention ResourceRepresentable protocol here. As the name explains it makes the controller representable and easily usable without adding every endpoint one by one to `Droplet`. It automatically integrates controller methods to the router.

```swift
final class UserController {
  func index(_ req: Request) throws -> ResponseRepresentable {
    return try User.all().makeJSON()
  }

  func show(_ req: Request) -> ResponseRepresentable {
    let user = try req.parameters.next(User.self)
    return user
  }
}
extension UserController: ResourceRepresentable {
  func makeResource() -> Resource<User> {
    return Resource(
      index: index,
      show: show
    )
  }
}
```

_UserController_ has two methods as an example. _index_ method returns all users and shows returns to the user you want. Instead of connecting these methods to endpoints one by one like this

```swift
let users = UserController()
drop.get("users", handler: users.index)
drop.get("users", User.self, handler: users.show)
```

using _ResourceRepresentable_ protocol, we can add our controller methods to the endpoints easily by addingcontroller as a resource only.

```swift
let users = UserController()
drop.resource("users", users)
```

You can find more details [here](https://vapor.github.io/documentation/guide/controllers.html#resources).

## Routing with collections

Everything looks nice for a small project with a few APIs. But when your app is getting bigger, you’ll need more APIs and want to group them and route them accordingly. This is what collections are for. In Kaucuk, we have operations on a score, like getting top 10 scores, fetching user position in highest scores, etc.. But we don’t have a score model and we don’t want to add everything to _UserController_. So, we decided to create another controller and put score logic in there. Everything in that controller is under /scores the URL path. Therefore, we have a custom _RouteCollection_.

```swift
final class ScoreCollection: RouteCollection {
  func build(_ builder: RouteBuilder) throws {
    let scores = builder.grouped("scores")
    let scoreController = ScoreController()
    scores.get("top", handler: scoreController.top10)
    scores.get("position", String.parameter, handler: scoreController.position)
  }
}
```

_grouped_ method in line 3 returns configured _RouteBuilder_ object and it allows us to make different groups consist of other groups. This can lead to more things. For example, if you prefer to handle versioning with URL paths, creating the collection for API versions makes it easy to handle. Just create a collection for the version. If you want to increase the API version with the support of the old version, create another one, create new or use existing endpoints and add them to it. Bind these two collections to your _Droplet_. It’s done, your API will be backward compatible.

Let’s get back to our example. Binding collection to _Droplet_ is really easy.

```swift
let scoreCollection = ScoreCollection()
try drop.collection(scoreCollection)
```

So far, we have pretty much everything we need. We have the database setup, CRUD operations on the database, working endpoints, and routing. For now, this should work without any problem. But it’s not production ready. Production-ready code needs some usage constraints, security layers, production configuration of underlying systems (for us it's the database), and so on. Now, let’s start with adding extra layers to our endpoints with middleware.

## Middleware

Middleware is a place where every request and response passes through. When they pass, we can manipulate almost everything and let them pass or reject. When a client makes a request, it comes to middleware first before going into any logical or database operations. Also, depending on the middleware implementation, responses go to the middleware after underlying operations. OK, good. But what are the cases that we can use? For example, our backend server works with only JSON requests and responses. We don’t support XML or any other format. So before letting the request get in, we have to select JSON contents only and reject all unsupported formats beforehand. We can tell our client that we’re working only with JSON using the Content-Type header. If the client request’s content is different from JSON, we’ll reject it. How does that look in the code?

```swift
final class RequestVerificationMiddleware: Middleware {
  func respond(to request: Request, chainingTo next: Responder) throws -> Response {
    if let contentType = request.headers["Content-Type"],
       contentType != "application/json" {
      throw Abort(.badRequest,
                  reason: "Server only accepts JSON content")
    }
    return try next.respond(to: request)
  }
}
```

_RequestVerificationMiddleware_, verifies all requests that come to our server. If the request has _Content-Type_ header, it has to be _application/json._ If it passes the check, we send it to the next _Responder_ object. If there is another middleware, the request will go to that one. Otherwise, it’ll directly go to the underlying operations. We can manipulate the request however we want. For example, we can forbid all DELETE operations without an Authentication header.

Middleware can manipulate also the response. Middleware protocol’s only method (_respond_) returns a _Response_ object. For example, we can put information headers to the response or restructure the response to handle only one thing.

We created our custom middleware above. We need to add it to our _Config_ object with one line.

```swift
config.addConfigurable(middleware: RequestVerificationMiddleware.init,
                       name: "request-verification")
```

After that, we need to add the middleware’s name to the _droplet.json_ file. I’ll explain this file and the _Config_ object in a moment.

## Application Configuration

This is the place where Vapor handles applications’ all configurations. All configurations for _Droplet_ (our application) are managed by _Config_ object and JSON files. All _Droplet_ methods are constants. We cannot change the properties of the _Droplet_ after initialization. That’s why we have a _Config_ object. _Config_ object basically includes our middleware, preparations for models, and providers. Configuration generally takes two steps. First, we add a configuration to the _Config_ object and then to the JSON file. Let’s take a look one by one.

We’ll start with our database. We set up our MongoDB at the beginning of the post, but we didn’t configure our app to use this database. We have _[MongoProvider](https://github.com/vapor-community/mongo-provider)_ as a community package. It allows us to use Mongo in our Vapor project. Adding it to the _Config_ requires only one line after importing _MongoProvider._

```swift
let config = try Config()
try config.addProvider(MongoProvider.Provider.self)
```

Now, _MongoProvider_ works with Mongo driver. (If you are using the same, don’t forget to create _mongo.json_ as I mentioned at the beginning. Otherwise, the app will crash) We then added this driver to _fluent.json_ file. _fluent.json_ file allows us to configure the Fluent package to have better communication with the database. Also, we are using ids in a type of UUID in the database. There are more options available in _fluent.json_ that we’re not using like pagination for the database. Here is our simple _fluent.json_ file.

```json
{
  "idType": "uuid",
  "driver": "mongo"
}
```

It’s time to talk about the middleware integration to our _droplet.json_ file that I mentioned above. Whenever we add a new middleware, we have to add its name to our _droplet.json_ file. This file and the _Config_ object work together to configure our application. This approach allows us to create different configurations for development, testing, and production. In Kaucuk, we created folders for each of these configurations under the Config folder in the project and put different _droplet.json_ files under them. But how Vapor knows where to look when we have multiple files with the same name? Vapor has a priority for Config files. It takes a look at CLI (Command Line Interface) first. Then, it’ll take a look at the _secrets_ folder. If it cannot find the necessary files, it’ll take a look at our environment configuration folders. If the files don’t exist, it’ll take a look at the main Config directory. Thanks to Vapor’s this approach, we achieved different middleware orders, different logging, and different database setup for each configuration. But what is there in this file? Here is our _droplet.json_ for development configuration.

```json
{
  "server": "engine",
  "client": "engine",
  "console": "terminal",
  "log": "dev-console",
  "hash": "dev-crypto",
  "cipher": "dev-crypto",
  "middleware": [
    "error",
    "request-verification"
  ]
}
```

The order of the middlewares in the JSON array represents the actual running order. As you can see, we have a middleware for logs named dev-console. In this logging, we pretty much log everything in a good format. In the equivalent file for production config, of course, we don’t log everything.

This configuration approach brings a lot of advantages. If you are an iOS developer and have no experience on the backend development, you won’t lose your mind while researching how to configure your project for different environments. Vapor is guiding us through an easy and understandable path.

## Conclusion

Until now, we have covered database setup, the logic of the app, routing, middleware, and application configuration. We should be ready for deploying our app for production. The remaining things are setting up a database on the cloud and deploying our application to the cloud. Currently, we’re using mLab in Kaucuk as a Mongo database and Heroku for deploying our application. You can benefit from [this post](https://medium.com/@xcadaverx/full-stack-swift-deploying-a-vapor-app-4a190bc0a8d) for setting up mLab and Heroku for your backend API.

---

### Further

- If you want to deploy your app to AWS, check [this post](https://medium.com/swiftybeaver-blog/deployment-of-a-vapor-app-to-aws-ec2-f577eaa6c38c) out. You can also learn other things like setting up _systemd_ which is a tool to restart your app when it crashes.
- If you want to use Docker and deploy wherever you want you can check [this post](https://medium.com/@LarsJK/easy-server-side-swift-with-docker-4c297feeeeb5) out for setting up Docker for your server-side Swift app.
- If you want to use DigitalOcean and MySQL, check [this post](https://medium.com/@pumplerod/server-side-swift-vapor-mysql-and-nginx-with-ssl-cert-running-on-ubuntu-instance-from-e59f50f450e2) out to learn all about setting up the process.
- Also, Amazon has a Quick Start Reference for setting up Swift Web applications on the AWS cloud which you can access from [here](https://aws.amazon.com/about-aws/whats-new/2016/11/swift-web-applications-on-the-aws-cloud-quick-start-reference-deployment/).
-