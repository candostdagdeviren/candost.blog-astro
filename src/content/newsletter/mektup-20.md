---
title: "Mektup #20: The Rule of Three to Avoid Bias"
tags:
 - mektup
newsletterName: "Mektup"
issueNumber: "20"
date: 2021-12-14
updateDate: 2021-12-14
external: false
---


Hey friend,

I've been thinking about the goal of software engineering and what we do to achieve that goal. It's easy to generalize the goal by saying, "_it's all about solving problems._" However, it's not easy to generalize how we solve these problems at all. The most general answer to all our problems is "_it depends._"

There is no single way to define our next step when facing any issue. We might immediately find a solution by instinct, or we research a lot and then come up with a solution, or even mix both and then do a little research, try an answer, do more research, and adjust the solution.

The problem with going with instinct is that **we have biases and prejudice**. We intuitively form these with experience. If we didn't have any biases, we probably couldn't decide whether to use a _for loop_ or a _while loop_. Although biases are helpful for minor problems, when we face more significant issues, biases and prejudices are detrimental.

**Biases prevent us from finding the optimal solution.** In a problem, we recognize some cues that are familiar to us because of our previous knowledge. If we solved a similar issue in an earlier project, we're inclined to use the same solution, although the conditions are dif­ferent and the solution is suboptimal.

This flaw puts us at risk of miscalculating the solution or making ourselves blind to alternative and better solutions. Pair programming, Request for Comments (RFC), Post-Mortem Analysis (PMA), feedback sessions, and other processes were born to eliminate these flaws.

These processes bring different minds together to eliminate bias. Another pair of eyes evaluate our solution and help us to find the flaws we missed in the first place. Albeit these processes are helpful, people often criticize them for the commu­nication and collaboration overhead. That's why many people are hesitant to do pair programming or write an RFC for their solution. Instead of dealing with all the complexities of these processes, we sometimes need another way to eliminate the bias.

## The Rule of Three

There is one simple yet powerful method—The Rule of Three!

Wherever we face a problem, we have to **find a minimum of three solutions. Not one, not two, but three.** Before you think that is a lot of work, which will slow us down, look at it this way: Add it to your tool belt and use it wherever you need. I've been using this methodology for years. Just even thinking about three solutions itself is a fantastic mental practice. Even if you choose your initial solution, the other two solutions give you enough perspective to open your eyes and understand the core of the problem.

Because once you think of three different scenarios, you are already acting like you got feedback from your peers. If you write an RFC and include the alternatives to your solution, whoever comments on your proposal already notices that you considered their way but elimi­nated them for specific reasons. Hence, you prevent discussion overhead.

By the way, I hear your inner voice keep asking: why three?

Because **one choice is literally a trap**, it's full of bias, and if your only solution doesn't work, you're out of options—you're screwed.

**Two solutions are not enough because it creates a dilemma**. Your mind starts to think it like either _this_ or _that_. Instead of concentrating on the problem, you shift your focus to the solution.

**Three solutions give you an actual choice.** The more solutions you have, the better.

If you want to give this method a try, here are some guidelines that Rothman and Derby recommend in their book "Behind Closed Doors!"

- Don't worry about who will implement the solutions. First, find them. Choosing who will take care of the solution comes after.
- Consider solutions even if you don't know how to implement them—how part comes later.
- Find good solutions. Don't come up with lousy ones just for the sake of finding an alternative. Also, it doesn't matter if you like the solution or not. All of them have to be worthy of serious consideration.

I'm not saying that you should apply The Rule of Three everywhere. But be aware that the application is not limited to software engineering. You can use it for any problem you have in your life.

Use the rule as a tool, and let me know if you give it a shot in one of your problems. It's always good to hear back from a friend who tries your advice.

— Candost
