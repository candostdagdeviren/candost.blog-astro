---
title: "Blocking crawlers for training language models"
tags:
  - blog-meta
date: 2023-10-03
updateDate: 2023-10-03
external: false
---

If you look at the footer of the website, all my content is licensed under [CC BY-NC-SA 4](https://creativecommons.org/licenses/by-nc-sa/4.0/), Attribution-NonCommercial-ShareAlike 4.0 International. That means none of my posts can be used for commercial purposes.

Not that I'm against AI or using language models; I just don't like the idea of any company using my text to train their language model for their commercial purposes without asking for my permission. Looking at my server-side metrics on Netlify, robots.txt has been requested ~1.5k in the last 30 days, so, some of these are asking for permission or at least looking for something.

After reading [Jim's](https://blog.jim-nielsen.com/2023/robots-txt/), [Chris's](https://chriscoyier.net/2023/04/21/the-secret-list-of-websites/), [Manuel's](https://manuelmoreale.com/bots-spiders-and-crawlers-the-results), and [Jeremy's](https://adactio.com/journal/20515) posts, it was the time I set up robots.txt.

Also, I know from [Manuel's experiment](https://manuelmoreale.com/bots-spiders-and-crawlers-the-results) that most bots don't care about whatever you put in robots.txt. Even Manuel says,

> So, what's the takeaway here? I guess that the vast majority of crawlers don't give a shit about your robots.txt. As for me and this site, I think I'm gonna revert back and allow bots to just do whatever the hell they want. This seems a worthless battle to fight for no real benefit to my general mission which is to connect with other human beings.

Then why do I still put in the effort? I want to choose a different way. I am not putting a worthless fight against AI, but I'm choosing the naive way and doing minor things while hoping that people will play rightly.

The only thing I can do is add robots.txt and block the following User-Agents (maybe others in the future) that I took from [Jeremy's post](https://adactio.com/journal/20515):

```txt
User-agent: CCBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Omgilibot
Disallow: /

User-agent: FacebookBot
Disallow: /
```

I still know that these are useless. The main problem is with the whole system as [Neil put it well](https://neil-clarke.com/block-the-bots-that-feed-ai-models-by-scraping-your-website/):

> These companies should be prevented from using data that they haven’t been given explicit consent for. Opt-out is problematic as it counts on concerned parties hearing about new or modified bots BEFORE their sites are targeted by them. That is simply not practical.
>
> It should be strictly opt-in. No one should be required to provide their work for free to any person or organization. The online community is under no responsibility to help them create their products.

Although the system is opt-out and robots.txt is useless, I still want to add it. I know that these companies are not just, but the least I can do is play the game right.

I know that the system is not gonna change anytime soon. So...

Welcome my new weakest friend, robots.txt.
