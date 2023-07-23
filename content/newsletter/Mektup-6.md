---
title: "Mektup #6: Why should you deploy your code in smaller chunks and release software often?"
tags:
 -
date: 2021-05-27
updateDate: 2021-05-27
external: false
---

Hello friend!

I hope you had a great month. Summer is coming, and I'm looking forward to going out to nature more.

In the previous issues, I talked about deep work, prioritizing your workflow, and carefully designing your focus areas. All of them focus on increasing your productivity as a person. This week, we will look at the other side and discover why you should deploy your software in small batches and release it often to increase your gain while decreasing cost. Let's dive in.

---

I think deploying software is similar to going to the supermarket for groceries. We don't visit the supermarket five times to buy five apples. We batch several things together to optimize our lives. Also, we don't buy fifty kilos of apples for the next five months. Sometimes we buy in bulk, but we make jam to maintain them for a longer time. I think software deployments are the same. **If you make extremely small deployments, it's inefficient and time-consuming. If you increase the deployment size, you have various disadvantages and, on top of that, rising maintenance costs.**

In waterfall, the problem is not that every step is done one by one; it's _the size of the deployments and "Big Bang" releases_. That's what the agile approach claims to solve.

> Our highest priority is to satisfy the customer through early and continuous delivery of valuable software. - The first principle of the Agile Manifesto

The current common strategy and approach are not very different from the waterfall technique. We still gather requirements, design, plan, implement, test, deploy, and release, but we do it in smaller sizes and release more often than a year or two.

The fierce market competition forces everyone to accelerate. Scrum, Kanban, or any other methodologies push us to finish a piece of work as often as possible and deliver it to the market. Some companies work with regular release cycles, and some don't. While release cycles help divide the work into smaller chunks, it's still not the ideal solution. **Deploying software in bigger batches creates countless problems, such as high costs, increasing risks, losing the competition, and low psychological safety.** The practices of [Developer Operations (DevOps)](https://candost.blog/swc-13-devops-and-sre-as-a-career/) changed the way how we approach these problems.

DevOps tries to reduce costs by introducing different deployment strategies, continuous integration (CI), continuous deployment (CD), and tools around developer productivity. DevOps focus on four metrics:

- Lead Time for Change
- Deploy Frequency
- Change Failure Rate
- Median Time to Restore

These metrics focus on the acceleration of the deployments and releases. But still, many companies are more reluctant to improve their processes and systems because they don't think they have enough budget or vision to work on these metrics. Let's focus on the budget part. How does deploying small and often more profitable than deploying in bigger batches?

Let's start by looking into the cost of bigger batch-size deployments. With bigger-size deployments, we spend more time testing the software, troubleshooting an error, migrating data, and communicating during the code freeze. While these are direct costs and somehow mathematically measurable, we also have indirect costs. These costs are caused by multitasking and parallel work, losing focus, context switching, disconnecting from the work, lower psychological safety, and a slow product feedback cycle.

If we look at direct costs, **increasing batch size demands more testing effort because the changes impact various parts of the system**. Diagnosing the bugs is more complicated and requires more time. The risk and the cost of deployments increase because they need more parallel work, such as running data migrations, checking if the data aggregation is correct, and watching different services concurrently. In these cases, there are often code freezes and communication costs on top of everything.

![](/images/content/newsletter/cost-batch-size-communication-direct-people.png)

On the other hand, **deploying tiny changes is not free**. Every deployment has infrastructure and people costs (we call them transactional costs). Every CI pipeline costs money, and people need to spend more time if something is broken (_damn you, outdated dependencies_). That's the part where people think they gain more advantage with bigger-size deployments; _fewer deployments mean people are spending less time on it_. The decrease in these transactional costs lures companies. **Using less infrastructure and money on CI & CD pipelines creates an illusion.**

![](/images/content/newsletter/transactional-costs.png)

While transactional costs decrease with bigger batch sizes, the maintenance costs increase exponentially. When software is not maintained often with small steps, the degree of the disorder increases because many dependencies get new updates and changes. After a while, maintenance efforts start becoming bigger. It's also possible to have newly-discovered security vulnerabilities and cause customer dissatisfaction and poor performance. **The cost of delay in software maintenance increases exponentially; however, we can decrease the cost before it becomes heavy with small batches.**

![](/images/content/newsletter/repair-costs.png)

Maintenance costs add up to our previous ones, and in the end, we get the total costs.

![](/images/content/newsletter/optimum-range.png)

If a new feature hits the release early, we quickly learn if it is working or not. We often don't perceive impediments if the new feature will be successful or not. **When we know something doesn't work within a week, it's better not to spend more time on it and instead develop useful (and profitable) features.** Execution and early feedback show us our mistakes and give us a chance to learn. Making bad product decisions because of the [lack of feedback](/importance-of-the-feedback) and experiments is one of the indirect costs.

"Big Bang" releases require multitasking. When batch size increases, many things need to be done in parallel, such as running migrations, deployments, and job sync between services and people. One mistake can create significant problems. These parallel efforts interrupt the standard workflow. **When the gap between development and deployment increases, people begin disconnecting from the work that they completed weeks ago.** Diagnosing the problems becomes more difficult. These problems lead to low psychological safety, stress, and fear because of the high risk.

Overall, deploying big batches is not efficient, while small batches have many benefits. **Achieving the optimal batch size deployments and frequently releasing the software take time and effort.** One way to figure out if you are in a good spot is by asking yourself:

_"Can you deploy on Friday after lunch without being afraid of doing overtime on Friday evening or over the weekend?"_

**If you can't give a confident yes to this question, look for what lowers your confidence.** What would you change if you had a magic wand? I was a firm believer in no deployment on Fridays. After seeing the costs, risks, and available tools, I'm convinced--thanks to the world of CI/CD and DevOps practices. Before we go, one more thing.

{% mark %}Release != Deployment{% /mark %}

**Deploy small batches, and release often.** Both are related but separate. While deployment is a technical decision and setup, the release is a product strategy. If you want to start thinking about how you can get better at the product side, use Eric Schmidt's question that focuses on speed and ask yourself:

> ["Why can't this be done sooner?"](/why-cant-this-be-done-sooner) - Larry Page

It's never too late to start improving. Don't forget; **[minor improvements accumulate](/newsletter/mektup-3) and create a significant impact.** You don't need to start a big project to achieve optimum release and deployments. [Focus on a tiny improvement in each product development cycle.](/bias-towards-action)

— Candost