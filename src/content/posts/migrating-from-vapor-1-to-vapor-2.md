---
title: "Migration from Vapor 1 to Vapor 2"
description: "Migration Guide from Vapor 1 to Vapor 2"
date: 2017-05-21
updateDate: 2017-05-21
external: false
---

Vapor 2 is released 🚀🎉 This is a big breaking change, but a good one. We have a small server-side project which is developed with Vapor. When Vapor 2 was released, we directly took a look at what changed. We were a bit 😍 and a bit😩. Vapor 2 has fewer lines of code, the performance is better, and has a lot of new cool features. But on the other side, there is too much change that we had to adopt. As a beginner to the server side and Vapor, it took quite some time. We took some notes while migrating to version 2. First, let me introduce the basic components that I’ll talk about. We’re using MongoDB as a database. We have two custom middlewares which are for verifying requests and setting up response headers. We use custom Routing with `RouteCollection`. That’s all.

Let’s start migrating! 💪🏽

We started with the _Package.swift_ file. We were using Vapor 1.5.0 and VaporMongo 1.1.0

```swift
dependencies: [
  .Package(url: "https://github.com/vapor/vapor.git", majorVersion: 1, minor: 5),
  .Package(url: "https://github.com/vapor/mongo-provider.git", majorVersion: 1, minor: 1)
]
```

Now, we’re using **Vapor 2.0** and **MongoProvider 2.0.0** (was named VaporMongo before). MongoProvider comes with **FluentProvider** which is the new package. “The Fluent provider package adds Fluent to project and adds some additional, Vapor-specific conveniences like HTTP conformances.”

```swift
dependencies: [
  .Package(url: "https://github.com/vapor/vapor.git", majorVersion: 2),
  .Package(url: "https://github.com/vapor/mongo-provider.git", majorVersion: 2)
]
```

Then the moment came. Ran `vapor clean && vapor build` command and BAM! Tons of errors. 😩 There are a lot of things to do.

## Model

The `Model` protocol has moved to the `FluentProvider` package. We had to import `FluentProvider` to our `Model` files. In `Model`, `query()` method was changed to `makeQuery()`. So, we were using `User.query()` and we changed it to `User.makeQuery()` to run custom queries on the User model. The other entity methods like `all`, `find`, `chunk`, `count` are still the same.

Fluent models now require `Storable` protocol conformance for database operations. This protocol requires only one property that handles `id` and `exists` properties’ jobs. We don’t need to handle these properties manually anymore. We put let storage = Storage() as a property of every model. Instead of `Node` struct and `NodeConvertible` protocol, we now have `Row` struct and `RowConvertible` protocol. It has two new methods one for initializing the model and the other for making a row. Even though I don’t get the idea of a Row in databases like MongoDB, the implementation looks better now. So, we had `NodeConvertible` implementations before like this:

```swift
init(node: Node, in context: Context) throws {
  id = try node.extract("_id") // Trick for MongoDB database
  name = try node.extract("name")
  score = try node.extract("score")
}

func makeNode(context: Context) throws -> Node {
  return try Node(node: [
    "_id": id, // Trick for MongoDB database
    "name": name,
    "score": score
    ])
}
```

We migrated to `RowConvertible` and changed our code to following:

```swift
init(row: Row) throws {
  name = try row.get("name"")"
  score = try row.get("score")
}

func makeRow() throws -> Row {
  var row = Row()
  try row.set("name", name)
  try row.set("score", score)
  return row
}
```

Lastly, we need to send `id`s in the response body. We had to conform `JSONRepresentable` protocol and create custom `JSON` for our models.

```swift
extension User: JSONRepresentable {
  func makeJSON() throws -> JSON {
    var json = JSON()
    try json.set("id", id?.string)
    try json.set("name", name)
    try json.set("score", score)
    return json
  }
}
```

**Note**: If you still need `NodeConvertible`, `NodeRepresentable` protocol’s function syntax has been changed.

`func makeNode(context: Context) throws -> Node` migrated to this: `func makeNode(in context: Context?) throws -> Node`

## RouteCollection protocol

The only change in `RouterCollection` protocol is the method definition.

```swift
class OurCoolCollection: RouteCollection {
  typealias Wrapped = HTTP.Responder
  func build<Builder: RouteBuilder>(_ builder: Builder) where Builder.Value == Responder { ... }
}
```

migrated to

```swift
class OurCoolCollection: RouteCollection {
  func build(_ builder: RouteBuilder) throws { ... }
}
```

Also `drop.collection(OurCoolCollection())` is now throwable.

## Request Parameters

Because of technical limitations, we had a limit for the request parameters before. Now, there is no limit because the implementation is totally changed. There is a new `Parameterizable` protocol. Anything that conforms to `Entity` protocol, can conform `Parameterizable` without any extra work. So, every Fluent model can be `Parameterizable` easily with only conforming like `extension User: Parameterizable { }`

. In our custom collection, the implementation of endpoints was like this:

```swift
let users = builder.grouped("user")
let userController = UserController()
users.post("", User.self, handler: userController.create)
```

with only one change, it became like this

```swift
let users = builder.grouped("user")
let userController = UserController()
users.post("", handler: userController.create)
```

And the implementation of `create` function in the controller was like this:

```swift
func create(request: Request, user: User) throws -> ResponseRepresentable
```

Instead of the function parameters, we can get all request parameters directly from the request. So, the syntax of the function became like following

```swift
func create(request: Request) throws -> ResponseRepresentable {
  let user = try request.parameters.next(User.self)
}
```

`String` and `Int` data types automatically conform `Parameterizable` protocol. It means that we can use them as parameters. We also have an endpoint that only requires the id of the User as a String in the request. In Vapor 2, the new implementation is like this:

```swift
func someFunction(request: Request) throws -> ResponseRepresentable {
  let id = try request.parameters.next(String.self)
}
```

and in the `get` function, we just called `.parameter` property of `Parameterizable` protocol.

```swift
users.get("someEndpoint", String.parameter,
          handler: userController.someFunction)
```

## Droplet & Configuration

All of the Droplet parameters are now constants. Changing them after initialization is not allowed anymore. Vapor 2 has a new Config concept in which we can set up our Droplet’s configurations like middlewares, providers, preparations, etc. Droplet has two initialization methods. We used `init(_ config: Config)`. Creating the configuration and setting it up separately looks cleaner.

Our Droplet was written in Vapor 1 and it was something like that:

```swift
let drop = Droplet()
drop.middleware.insert(try CORSMiddleware(configuration: drop.config), at: 0)
drop.middleware.append(DummyMiddleware())
drop.middleware.append(SomeMiddleware())
drop.collection(OurCoolCollection())
try drop.addProvider(VaporMongo.Provider.self)
drop.preparations.append(User.self)
```

Now, we first created the config with

```swift
let config = try Config()
```

next, we added middleware to config

```swift
config.addConfigurable(middleware: DummyMiddleware(), name: "dummy")
config.addConfigurable(middleware: SomeMiddleware(), name: "some")
```

lastly, we added these middlewares to our `droplet.json` file. Vapor 2 puts the middlewares in order according to `droplet.json`. For example, if you want your `AwesomeMiddleware` to run at first, add it to the top of the middlewares array at the `droplet.json` file. After adding the middlewares to the `droplet.json`, it became like this

```json
{
  "server": "engine",
  "client": "engine",
  "console": "terminal",
  "log": "console",
  "hash": "crypto",
  "cipher": "crypto",
  "middleware": [
    "cors",
    "abort",
    "type-safe",
    "date",
    "dummy",
    "some"
  ]
}
```

As mentioned before, we now have the new `FluentProvider`. We had to add `fluent.json` for under the Config folder. Otherwise, it crashes the app when we run it. Vapor allows you to define the `idType` for the database as UUID format in JSON file instead of creating manually in every model. Also, we have to define our `driver` in here. We’re using `MongoProvider` and because of that, our database `driver` is `mongo`. We added this provider with only one line

```swift
try config.addProvider(MongoProvider.Provider.self)
```

and we defined a `fluent.json` file like

```json
{
  "idType": "uuid",
  "driver": "mongo"
}
```

Let’s look at preparations quickly. There is no extra work like Provider. We just added them to the config.

`config.preparations.append(User.self)`

Now, we can initialize our `Droplet` with the configuration in one line, that’s all.

`let drop = try Droplet(config)`

Our `Config` is not done yet. It seems `hash` and `cipher` have mandatory keys right now. So, we had to change our `crypto.json` file. Both of them now require three keys, `method`, `encoding`, and `key`. Our `crypto.json` file was like a dummy one before

```json
{
  "hash": {
    "method": "sha256",
    "key": "password"
  },
  "cipher": {
    "method": "chacha20",
    "key": "passwordpasswordpasswordpassword",
    "iv": "password"
  }
}
```

Now, it looks smarter

```json
{
  "hash": {
    "method": "sha256",
    "encoding": "hex",
    "key": "FjavUZaqfjjMg4q6722XXY3H4Yvmm39YorHQJ2uslPU"=
  },
  "cipher": {
    "method": "aes256",
    "key": "pHhMTJkxkykYn6cJu8fmtVUHkIx/61BTM5tYEwPsYa0=",
    "encoding": "base64",
  }
}
```

The last thing for the config was the `url`. It’s mandatory in `mongo.json` for `MongoProvider` configuration. Even if we gave host, port, username, password, and database parameters in the JSON file, it insistently asked for the `url` key. So, we just added `url` key to `mongo.json` file in the following format. The key point is, `MongoKitten` requires this `url` in a certain format. It has to start with `mongodb://`.

`"url": "mongodb://user:password@127.0.0.1:27017/test_db"`

## Abort

Abort is not an enum anymore. It has converted to a struct with three parameters.

```swift
var status: Status { get }
var reason: String { get }
var metadata: Node? { get }
```

We were using the `Abort` like following

```swift
throw Abort.custom(status: .badRequest,
                   message: "Why is this error happening? Because: \(error)")
throw Abort.notFound
```

and it is migrated to cleaner implementation

```swift
throw Abort(.badRequest,
            reason: "Why is this error happening? Because: \(error)")
throw Abort(.notFound)
```

**Update:**

servers.json file is simplified and renamed to server.json. Basic server.json can be found in the documentation like this:

```json
{
  "//": "The $PORT:8080 call tells the json file to see if there",
  "//": "is any value at the 'PORT' environment variable.",
  "//": "If there is no value there, it will fallback to '8080'",
  "port": "$PORT:8080",

  "host": "0.0.0.0",

  "//": "It's very rare that a server manages its own TLS.",
  "//": "More commonly, vapor is served behind a proxy like nginx.",
  "securityLayer": "none"
}
```

## Last words

Adoption to the latest versions with breaking changes is generally hard. But when it comes to performance, clean code, and other new features, walking around with the old version becomes redundant. Some people declare this as living on the edge. Although I agree with this on some level, I generally try to use the latest versions when they came out. But I always give it a try with some trial projects, not directly on production code.

---

Further:
- [Vapor 2 New Documentation](https://docs.vapor.codes/2.0/)
- [Steampress.io Vapor 2 Migration](https://www.steampress.io/blog/posts/migrating-to-vapor-2/)
- [Vapor Release Notes](https://github.com/vapor/vapor/releases/tag/2.0.0)
- [Vapor Changelog](https://github.com/vapor/migrator/blob/master/notes/vapor-diff.md)