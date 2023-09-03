---
title: "Generics in Swift"
description: "As one of the most powerful features in Swift, Generics can be tricky. A lot of people have trouble understanding and using them, especially application developers."
tags:
  -
date: 2017-10-23
updateDate: 2017-10-23
external: false
---

As one of the most powerful features in Swift, Generics can be tricky. A lot of people have trouble understanding and using them, especially application developers. Generics are most suitable for libraries, frameworks, and SDKs. In this post, I’ll try something different than other tutorials. We’ll open a restaurant and get permission from SwiftyCity City Council. For the sake of integrity, I’ll try to keep things under four subjects.

1. Generic Functions and Generic Types
2. Protocols with Associated Types
3. Generic Where Clauses
4. Generic Subscripts

Here we go!

## Generic Functions and Generic Types

### Opening a Swift Restaurant

Let’s set up a new restaurant. While setting up, instead of focusing only on our restaurant construction, we’ll also take a look at the legal part, the city council’s permission. Furthermore, we will focus on our own business to make it functional and profitable.

First, what does a company look like to The Council? A company should have some basic functionalities.

```swift
protocol Company {
  func buy(product: Product, money: Money)
  func sell(product: Product.Type, money: Money) -> Product?
}
```

`buy` function adds the product to the inventory, and it takes money out of the company’s vault. On the other hand, `sell` function gets the product type, creates/finds the product, and returns it in exchange for money.

### Generic Functions

In this protocol, `Product` being in **actual type** doesn’t sound right. Fitting every real product into `Product` type is not possible. Each product has different functionalities, properties, and so on. Using an **actual type** in these kinds of functions is a really bad idea. Let’s turn back to The Council. All over the world, whatever each company does, requires having to buy and sell capability. So, The Council has to find a **generic** solution for these two functions and make them work for every company. They can improve these functions using **Generics**:

```swift
protocol Company {
  func buy<T>(product: T, with money: Money)
  func sell<T>(product: T.Type, for money: Money) -> T?
}
```


```swift
let penneArrabiata = swiftRestaurant.sell(product: PenneArrabiata.Self,
                                          for: Money(value:7.0, currency: .dollar))
```

The compiler replaces `T` with `PenneArrabiata`’s type during compilation time. When this method gets called at runtime, it will already have an **actual type** (`PenneArrabiata`) instead of a **placeholder type**. But there’s another problem. We can’t just buy and sell any type here; there needs to be something to define what we can legally buy and sell. This is where **type constraints** come in. The Council has another protocol named `LegallyTradable`. It just checks and marks products that we can buy and sell legally. The Council forces us to apply this protocol to all trading operations. The Council will iterate over every product and adopt all suitable products to this protocol. So, we have to put **type constraints** to our generic functions to limit our functions’ usage to only allowed products.

```swift
protocol Company {
  func buy<T: LegallyTradable>(product: T, with money: Money)
  func sell<T: LegallyTradable>(product: T.Type, for money: Money) -> T?
}
```

Now, we can use these functions with inner peace. Basically, we put a constraint on our **placeholder type** `T` by saying “Only products which conform to `LegallyTradable` can be parameters of our `Company` protocol’s functions”. This constraint is called **protocol as a constraint** in Swift. If one product is not conforming to this protocol, it can’t be used as a parameter in this function.

### Generic Types

Let’s move the focus to our restaurant. We got our permission and are ready to focus on restaurant management. We hired a great manager, and she wants to set up a system to keep track of every item in our inventory separately. In our restaurant, we have a wonderful pasta menu and our customers are going to love all kinds of pasta. That’s why we need a huge place to store pasta. We created a list of pasta packages and whenever chefs use a package, they remove it from the list. Also, whenever the restaurant buys a pasta package, we’ll add it to our list. Lastly, our manager will order new packages if there are fewer than three packages on the list. Here is our `PastaPackageList` struct:

```swift
struct PastaPackageList {
  var packages: [PastaPackage]

  mutating func add(package: PastaPackage) {
    packages.append(item)
  }

  mutating func remove() -> PastaPackage {
    return packages.removeLast()
  }

  func isCapacityLow() -> Bool {
    return packages.count < 3
  }
}
```


```swift
struct InventoryList<T> {
  var items: [T]

  mutating func add(item: T) {
    items.append(item)
  }

  mutating func remove() -> T {
    return items.removeLast()
  }

  func isCapacityLow() -> Bool {
    return items.count < 3
  }
}
```

This **generic type** gives us the ability to create separate inventory lists for each item in our inventory using the same implementation.

```swift
var pastaInventory = InventoryList<PastaPackage>(items: [])
pastaInventory.add(item: PastaPackage())
var tomatoSauceInventory = InventoryList<TomatoSauce>(items: [])
var flourSackInventory = InventoryList<FlourSack>(items: [])
```

Another advantage of generic types is that whenever our manager needs some extra information, like the first item in our inventory, we can write **extensions** to add the functionality. Swift allows us to write an **extension** for structs, classes, and protocols. While extending the generic type, we don’t need to provide **type parameter** as we do when defining structs. Yet, we can still use placeholder type in the extension. Let’s implement our manager’s request to understand better.

```swift
extension InventoryList { // We define it without any type parameters
  var topItem: T? {
    return items.last
  }
}
```

`InventoryList`’s existing type parameter `T` is used to indicate the type of `topItem` without defining the **type parameter** again. Now we have inventory lists for all products we have. We still don’t have storage because every restaurant should apply to The Council to get permission to store goods for long periods. So, let’s move our focus to The Council.

## Protocols with Associated Types

We went to the city council again to get permission to store food. The Council stipulates some rules that we have to obey. For instance, every restaurant with storage should have their storage clean and put certain foods away from each other. Also, The Council wants to check restaurants’ current inventory whenever they want. They provide a protocol to which every store owner should conform. Again, this protocol cannot be specific to the restaurant. Because storage items can change for different types of shops and also for restaurants. In Swift, generic protocols are implemented with **associated types**. Let’s have a look at the Storage protocol that came from the city council.

```swift
protocol Storage {
  associatedtype Item
  var items: [Item] { set get }
  mutating func add(item: Item)
  var size: Int { get }
  mutating func remove() -> Item
  func showCurrentInventory() -> [Item]
}
```

`Storage` protocol doesn’t specify how the items in the storage should be stored or what type they are allowed to be. Any shop or restaurant that conforms to `Storage` protocol must be able to specify the type of values it stores. It has to ensure that the correct type of items is added to and removed from storage. Also, it has to be able to show the current inventory completely. So, for our storage, we can conform `Storage` protocol like the following:

```swift
struct SwiftRestaurantStorage: Storage {
  typealias Item = Food // Optional
  var items = [Food]()
  var size: Int { return 100 }
  mutating func add(item: Food) { ... }
  mutating func remove() -> Food { ... }
  func showCurrentInventory() -> [Food] { ... }
}
```

We conformed to The Council’s `Storage` protocol. From now on, the associated type `Item` will be replaced with our `Food` type. Our restaurant’s storage is all available for `Food`. Associated type `Item` is just a **placeholder type** in protocols. We define the type with `typealias` keyword. But pointing out this keyword is optional in Swift. Even if we don’t use `typealias` keyword it’ll still compile as long as we use our `Food` type in all places that `Item` uses in the protocol. Swift automatically handles this.

### Constraining an Associated Type with Type Annotation

Like in real life, The Council always comes up with new rules and forces you to obey them. After a while, The Council modifies their `Storage` protocol. They announce that they won’t allow every item in the `Storage`. Every _Item_ **must conform** to _StorableItem_ protocol to be sure they are suitable for storage. In other words, they **constrained the associated type** `Item`.

```swift
protocol Storage {
  associatedtype Item: StorableItem // Constrained associated type
  var items: [Item] { set get }
  var size: Int { get }
  mutating func add(item: Item)
  mutating func remove() -> Item
  func showCurrentInventory() -> [Item]
}
```

Using this method, The Council constrained the type for the current associated type. Anyone who conforms to `Storage` protocol now has to use type aliases that conform to `StorableItem` protocol.

## Generic Where Clauses

### Generic Types with a Generic Where Clause

Let’s go back to the beginning of the post and take a look at the `Money` type in our `Company` protocol. As we are all talking about protocols, the money parameter of buy and sell functions was actually a protocol.

```swift
protocol Money {
  associatedtype Currency
  var currency: Currency { get }
  var amount: Float { get }
  func sum<M: Money>(with money: M) -> M where M.Currency == Currency
}
```

Again, after a while, The Council hit back to us by saying that they decided to have another rule. From now on, trading is only allowed with some currencies. Before that, we could use every kind of money in the type of `Money`. Instead of defining a new money types for every currency, they decided to use `Money` protocol and changed the buy and sell functions as follows.

```swift
protocol Company {
  func buy<T: LegallyTradable, M: Money>(product: T.Type, with money: M) -> T? where M.Currency: TradeCurrency
  func sell<T: LegallyTradable, M: Money>(product: T, for money: M) where M.Currency: TradeCurrency
}
```

The difference between **where clause** and **type constraint** is where clauses are used to **define requirements in associated type**. In other words, we are not constraining the associated type inside the protocol. Instead, we’re constraining it while using the protocol.

### Extension with a Generic Where Clause

Other usages of where clauses are in extensions. For instance, when The Council needs to print the money in a good format like “xxx EUR”, they can add an extension to `Money` with limiting its `Currency` to `Euro`

```swift
extension Money where Currency == Euro {
  func printAmount() {
    print("\(amount) EUR")
  }
}
```

**Generic where clause** lets us add a new requirement to `Money` extension so that the extension adds the `printAmount()` method only when the `Currency` is `Euro`.

### Associated Types with a Generic Where Clause

Our beloved council makes some improvements in `Storage` protocol. They want to iterate over each item and control them when they want to inspect if everything is OK. The controlling process is going to be different for each `Item`. Because of that, the council just provides an iteration feature for `Storage` by adding an `Iterator` associated type.

```swift
protocol Storage {
  associatedtype Item: StorableItem
  var items: [Item] { set get }
  var size: Int { get }
  mutating func add(item: Item)
  mutating func remove() -> Item
  func showCurrentInventory() -> [Item]

  associatedtype Iterator: IteratorProtocol where Iterator.Element == Item
  func makeIterator() -> Iterator
}
```

`Iterator` protocol has an associated type named `Element` and here we add a requirement by saying the type of `Element` must be equal to the type of `Item` in the `Storage` protocol.

## Generic Subscripts

It seems like requests from the manager and council are endless. Also, we’re here to materialize their wishes. So, our manager came to us saying that she wanted to access storage items using `Sequence` without accessing all items. Basically, the manager wants syntax sugar.

```swift
extension Storage {
  subscript<Indices: Sequence>(indices: Indices) -> [Item] where Indices.Iterator.Element == Int {
    var result = [Item]()
    for index in indices {
      result.append(self.items[index])
    }
    return result
  }
}
```

In Swift 4, subscripts can be generic, and we can use generic where clauses. In our usage, `indices` parameter has to conform `Sequence` protocol. [From Apple doc](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Generics.html), “The generic `where` clause requires that the iterator for the sequence must traverse over elements of type `Int`.” This ensures that the indices in the sequence are the same type as the indices used in storage.

## Final Words

We made our restaurant fully functional. Our manager and The Council seem to be happy. As we can see from our journey, generics are really powerful. We can satisfy extensive requirements with ease using generics once we get the concept. Generics are widely used in the Swift standard library. For instance, [Array](https://developer.apple.com/documentation/swift/array) and [Dictionary](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/CollectionTypes.html#//apple_ref/doc/uid/TP40014097-CH8-ID113) types are both generic collections. If you want to learn more and dive deep, you can always take a look at these classes and how they are implemented. [Swift Language Doc](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Generics.html) also provides an extensive explanation for generics. Lastly, Swift language has a [Generic Manifesto](https://github.com/apple/swift/blob/master/docs/GenericsManifesto.md), which explains the features and future direction of generics. I suggest you take a look at all documents to understand current usage and future plans.
