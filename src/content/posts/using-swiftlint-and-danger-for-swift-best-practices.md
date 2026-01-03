---
title: "Using SwiftLint and Danger for Swift Best Practices"
description: "Swift is a very flexible language, therefore, easy to misuse. Applying best practices in Swift lint is important."
date: 2017-04-30
updateDate: 2017-04-30
external: false
---

Apple’s Swift is becoming more and more popular amongst the developer community. Most of us already started adapting our projects to this folk. While adopting, we may not be as careful as we should be as Swift is a very flexible language, and it’s really easy to misuse it. Especially coming from an Objective-C culture, applying best practices becomes really important.

After reading [Swifty Tips from Göksel](https://medium.com/nsistanbul/swifty-tips-%EF%B8%8F-8564553ba3ec), I realized a couple of his tips could be checked automatically with **[SwiftLint](http://bit.ly/2pszEcm)**. Also, we’re lazy people, and we tend to forget to check our code before merging to master. Just here, **[Danger](http://bit.ly/2pJ2DLY)** comes to the stage with shiny clothes and points out we’re doing something dangerous.

Sounds interesting...🤔 But what are these tools, actually?

## SwiftLint 💪🏽

[SwiftLint](http://bit.ly/2pszEcm) is an open-source tool to enforce Swift's style and conventions. It is developed by Realm. You can set your coding style rules and force them during development. SwiftLint has a command-line tool, Xcode plugin, AppCode, and Atom integration. So it always fits your development environment. It’ll show you warnings and/or errors if you violate the linting rules.

![](/images/content/posts/ns-for-ios-devs/Pasted%20image%2020230722221510.png)

You can take a look at the setup guide and tutorial [here](http://bit.ly/2oJGIUS). After installation, you’ll have some rules by default. For example, it warns when you use private IBOutlet or force unwrapping in optionals.

Let’s take a look at Göksel’s [tips](http://bit.ly/2oTbJkg). He says, “Never use implicitly unwrap optionals.” SwiftLint provides this by default exactly how he describes it. SwiftLint will warn you when you implicitly unwrap an optional, except if it’s IBOutlet. The other one is “Avoiding \_ misuse.” SwiftLint is smart enough to point you out when you’re not using your bound optionals.

```swift
if let _ = Foo.optionalValue { } // Trigers a warning
if case .some(let _) = self {} // Triggers a warning
if foo() { let _ = bar() } // Not triggers a warning
if foo() { _ = bar() } // Not triggers a warning
```

In addition to applying best practices individually, we want to make the codebase consistent. Make it easier to apply custom rules. These rules should fit best practices, though. Configuring linting is handled from the *.swiftlint.yml* file. This file sits in the project’s main path. We can enable, disable or write custom rules in this YML file. Let’s take a look at some examples.

First things first, writing a big function is generally a bad sign. If your function is getting bigger, it means that you should split [the responsibility](http://bit.ly/2qqFzxT). Add the following code piece to your *.swiftlint.yml* file. This warns developers to have functions less than 200 lines. If the programmer reaches 300, SwiftLint generates an error. Remember, you can ignore warnings but not errors. 😉

```ruby
function_body_length:
 - 200 # warning
 - 300 # error
```

Almost every project has dependencies or code pieces that are not possible to change. These code pieces should not be linted at all. For example, if a project uses CocoaPods as a dependency manager, it’ll have a Pods folder that keeps all dependency files. We need to exclude this folder from the linting process. As you can see below, it’s so easy.

```ruby
excluded:
  - Pods
```

As you saw from the examples, what gives the extra boost to SwiftLint is flexibility. Sometimes you have to break the rules in special lines or files. These situations are handled in SwiftLint with special comments. You can use the following to adjust rules in these cases.

Add this comment to disable the rule in the file:

```ruby
//swiftlint:disable rule_name
```

Add this comment to disable the rule in the following line:

```ruby
//swiftlint:disable:next rule_name
```

Add this comment to disable the rule in the previous line:

```ruby
//swiftlint:disable:previous rule_name
```

You can get the list of all rules by running `swiftlint rules` command in the terminal.😏

Finally, we finalized our rules, and now we can code in peace. But even in some cases, you have to be more careful than just applying your linting rules. This is where Danger comes into place.

**P.S.:** You can find my predefined *.swiftlint.yml* file [here](http://bit.ly/2pswdlX)😉.

## Danger ⚡️

Every project/piece of code has its own specific flow. When the project grows, maintaining and adding new features become harder. Error-prone increases. Having coding guidelines and applying best practices are generally not enough. We are human; we make mistakes. [Danger](http://bit.ly/2pJ2DLY) can catch basic errors and let us think of the harder problems. For example, it can catch common typos or generated file changes that you shouldn’t change by yourself. It can also force you to write tests if you write more than 20 lines of code. The rules are in your hands, as same as SwiftLint.

The Danger is a Ruby gem that runs in CI during the pull request/merge request process. It leaves messages and comments or even fails your CI build when your rules are violated. Danger can run on several CI tools and can chat on GitHub, Bitbucket, and GitLab.

![](/images/content/posts/ns-for-ios-devs/Pasted%20image%2020230722221526.png)

For [single responsibility](http://bit.ly/2qqFzxT) and easier code review, developers shouldn’t open big pull requests. If a pull request has more than 600 lines of code, there should be a warning to split the pull request. Danger can provide this with a single line of configuration:

```ruby
warn Big PR, consider splitting into smaller if git.lines_of_code > 600
```

What else? If you’re working with the Test-After development process, you can easily forget to write tests. On the other hand, there should be an automated way for “You forgot to add tests” comments. In general, if you change more than 20 lines of code, you should write tests. The number of lines depends on your decision, but you got the idea. Let’s take a look at how we can achieve this with Danger:

```ruby
## Let's check if there are any changes in the project folder
has_app_changes = !git.modified_files.grep(/ProjectName/).empty?

## Then, we should check if tests are updated
has_test_changes = !git.modified_files.grep(/ProjectNameTests/).empty?

## Finally, let's combine them and put extra condition 
## for changed number of lines of code
if has_app_changes && !has_test_changes && git.lines_of_code > 20
  fail("Tests were not updated", sticky: false)
end
```

The Danger is suitable for every kind of project. It provides a broad range of configurations to several languages by plugins. In Swift's case, Ash Furrow developed [a plugin](http://bit.ly/2pvYyd2) for SwiftLint. Thanks to this plugin, we can have SwiftLint warnings as inline comments in the pull request. You can see the installation guide [here](http://bit.ly/2pvYyd2). After installation, you’ll need to add the following lines to the end of your *Dangerfile*.

```ruby
swiftlint.lint_files
swiftlint.lint_files inline_mode: true
```

*Dangerfile* ensures your development guidelines are applied to your code. It makes you more confident. In the long run, warnings teach you to be more careful. There is a reference guide [here](http://bit.ly/2oCQ9pd) to give you a more detailed view of Danger’s capabilities.

**Note:** You don’t have to configure CI. It’s possible to run Danger on your local machine with `danger local` command.

If `danger local` command doesn’t run across the last open PR, you can always use the following command:

```ruby
danger pr https://YOUR_PR_URL --dangerfile=YOUR_DANGERFILE_PATH
```

**P.S.:** You can find my predefined *Dangerfile* [here](http://bit.ly/2oT8Z6s)😉.

## Bonus: SwiftLint with Git Hook

If you’re working with different text editors or IDEs that SwiftLint doesn’t support, you can only use command-line tools to lint your code. This is an extra step, and it’s easy to forget. Good thing we can automate this. The hook feature in Git is another place to automate things. Basically, Git hooks are scripts where Git executes before or after events such as commit, push, and receive. We can run SwiftLint in one of these scripts. Personally, I’m using SwiftLint in the pre-commit hook while I’m writing Swift in Sublime Text.

**P.S.:** You can find my full pre-commit hook [here](http://bit.ly/2oWmiE8)😉. If you want to use the same, just place the file above under .git/hooks folder inside your project. (You’ll see sample hook scripts in there. Place it among them.) You can also use it as a different hook. You can take a look at the list of available hooks and more information [here](http://do.co/2qfn4x3).

## The End 😌

Let Danger and SwiftLint handle the trivial stuff for you. From now on, you can skip basic problems and focus on more complicated things during code review. SwiftLint and Danger ensure that everything is in place as you want. Wanna try?
