---
title: "Design Patterns"
description: ""
tags:
  - programming
  - java
date: 2013-01-16T11:33:00.000Z
updateDate: 2013-01-16T11:33:00.000Z
external: false
---

## What is Design Pattern?

There is a good description from Christopher Alexander. He says, "Each pattern describes a problem which occurs over and over again in environment, and then describes the core of the solution to that problem, in such a way that you can use this solution a million times over, without ever doing it the same way twice."

In general, a pattern has four essential elements:

1. Pattern Name is a handle we can use to describe a design problem, its solutions, and consequences in a word or two.
2. Problem describes when to apply the pattern.
3. Solution describes the elements that make up the design, their relationships, responsibilities, and collaborations. The solution doesn't describe a particular concrete design or implementation, because a pattern is like a template that can be applied in many different situations.
4. Consequences are the results and trade-offs of applying the pattern.

A design pattern names, abstracts, and identifies the key aspects of a common design structure that make it useful for creating a reusable objectoriented design. The design pattern identifies the participating classes and instances, their roles and collaborations, and the distribution of responsibilities. Each design pattern focuses on a particular object-oriented design problem or issue. It describes when it applies, whether it can be applied in view of other design constraints, and the consequences and trade-offs of its use. Since we must eventually implement our designs, a design pattern also provides sample C++ and (sometimes) Smalltalk code to illustrate an implementation. Although design patterns describe object-oriented designs, they are based on practical solutions that have been implemented in mainstream objectoriented programming languages like Smalltalk and C++ rather than procedural languages (Pascal, C, Ada) or more dynamic object-oriented languages (CLOS, Dylan, Self). We chose Smalltalk and C++ for pragmatic reasons: Our day-to-day experience has been in these languages, and they are increasingly popular.

## Describing Design Patterns

Gang of Four's book describes 23 patterns arranged into 3 groups. Groups help classify how patterns are used: creational, structural, and behavioral patterns. Creational patterns concern the process of object creation. Structural patterns deal with the composition of classes or objects. Behavioral patterns characterize the ways in which classes or objects interact and distribute responsibility. Each design pattern has a description.

Pattern Name and Classification:
The name of the pattern and its classification (Creational, structural, or behavioral)

- **Intent:** A short statement about what the pattern does.
- **Also Known As:** Other well-known names for the pattern, if any.
- **Motivation:** An illustrative design problem that shows how the pattern can solve the problem.
- **Applicability:** Situtations where the pattern can be used.
- **Structure:** A graphical representation showing the classes in the pattern.
- **Participants:** The classes that principate in the pattern and their responsibilities.
- **Collaborations:** How the participants collaborate.
- **Consequences:** Benefits and trade-offs of using the pattern
- **Implementation:** Hints, pitfalls, and techniques that can be used to help implement the pattern.
- **Sample Code:** Code illustrations of using the pattern.
- **Known Uses:** Examples of the pattern used in real systems.
- **Related Patterns:** Other patterns closely related to the current one.

## The Gang of Four Design Patterns

### Creational Patterns

- **Factory Method:** Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.
- **Abstract Factory:** Provide an interface for creating families of related or dependent objects without specifying their concrete classes.
- **Builder:** Separate the construction of a complex object from its representation so that the same construction process can create different representations.
- **Prototype:** Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.
- **Singleton:** Ensure a class only has one instance, and provide a global point of access to it.

### Structural Patterns

- **Adapter:** Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn't otherwise because of incompatible interfaces.
- **Bridge:** Decouple an abstraction from its implementation so that the two can vary independently.
- **Composite:** Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.
- **Decorator:** Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.
- **Facade:** Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.
- **Proxy:** Provide a surrogate or placeholder for another object to control access to it.

### Behavioral Patterns

- **Chain of Responsibility:** Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain until an object handles it.
- **Command:** Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.
- **Flyweight:** Use sharing to support large numbers of fine-grained objects efficiently.
- **Interpreter:** Given a language, define a represention for its grammar along with an interpreter that uses the representation to interpret sentences in the language.
- **Iterator:** Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.
- **Mediator:** Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly, and it lets you vary their interaction independently.
- **Memento:** Without violating encapsulation, capture and externalize an object's internal state so that the object can be restored to this state later.
- **Observer:** Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
- **State:** Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.
- **Strategy:** Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.
- **Template Method:** Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm's structure.
- **Visitor:** Represent an operation to be performed on the elements of an object structure. Visitor lets you define a new operation without changing the classes of the elements on which it operates.

#### References

- Design Patterns: Elements of Reusable Object-Oriented Software, Publication Date: November 10, 1994, ISBN-10 0201633612, ISBN-13 978-0201633610
- Ankara University, Computer Engineering Department, Object-Oriented Programming Course Slides, Kurtulus Kullu
