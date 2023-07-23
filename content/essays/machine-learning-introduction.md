---
title: "Machine Learning Introduction"
description: "The fundamentals of machine learning require some knowledge of linear algebra and calculus. This barrier frightens people and keeps them away from machine learning with curiosity."
tags:
  -
date: 2017-11-09
updateDate: 2017-11-09
external: false
---

Machine learning (ML) has been an interesting topic for a lot of people since [1959](http://ieeexplore.ieee.org/document/5392560/?reload=true). Despite the interest, people are afraid to start learning. Because of the fundamentals of machine learning, it requires some knowledge of linear algebra and calculus. This barrier frightens people and keeps them away from ML with curiosity. I was one of them until the last couple of weeks. But my fear was not about the basics of linear algebra and calculus as I learned the fundamentals of them when I got a computer engineering degree. I was afraid of more advanced mathematical techniques that I also learned in university and forgot them all.

After years of staying away, I decided to give it a shot and started the Machine Learning course in Coursera. I was lost in the first 6–7 weeks. I couldn’t understand most of it even if I passed quizzes and completed programming assignments with help from other students and forums. I was feeling incompetent. The reason for this is my fear was with me all the time. But one day, I was talking with my friend about this, and he said it’s completely normal that I don’t understand. This is the nature of learning. He finished his words with, “Keep pushing, and eventually, the blur on your eyes will disappear.” I pushed a bit more, and one weekend, my blurred eyes were cleaned, and what I saw was beautiful. I was not inadequate. That felt good. Yet here, I’m starting to write the things that I’ve learned.

I am happy that I narrated my story.😌 Now, let’s start with defining machine learning.

## Defining and understanding machine learning

> _Machine Learning is a field of computer science that gives computers the ability to learn without being explicitly programmed. ([Wikipedia](https://en.wikipedia.org/wiki/Machine_learning))_

Machine learning was born during the early development of artificial intelligence and pattern recognition. Like all the other technologies, it grew into the industry with the help of businesses. There is one widely used formal definition of machine learning algorithms:

> _“A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P if its performance at tasks in T, as measured by P, improves with experience E.” — Tom. M. Mitchell_

The definition states that our program has to learn from our data and should improve its performance. As a classical example, if we want to predict house prices, first, we can feed our algorithm with the data like current prices according to the area of a house, # of bedrooms, etc. From the data, the algorithm learns and improves its guesses by reducing the errors for predictions. We can measure the performance by running the algorithm using new input data with known results and taking a look at the error rate. Our aim here will be to reduce the error rate.

## Types of Machine Learning Problems and Tasks

### Supervised Learning

This type of ML algorithm works with the teacher model. It means that we have a dataset with inputs and output values (better naming, labeled data). We define a method to get known outputs for the inputs we have. As we improve our method by using all input-output pairs (this is called training), we can predict output values for new input data. This is called supervised learning. We learn the model using the training data, and we test the model with unseen test data. So, we work both with input and output data. One of the best examples of supervised learning is predicting house prices, as I mentioned above.

### Unsupervised Learning

Unsupervised learning algorithms are used when we have only input data and no corresponding output values. There are no correct answers, therefore no teacher. These algorithms will be able to find hidden structures or relationships between different inputs. One of the best use cases for unsupervised learning algorithms is clustering problems.

### Semi-Supervised Learning

These algorithms are used where there is a huge amount of input data but only a small amount of output (labeled) data. These problems sit in the middle of supervised and unsupervised learning. Therefore, supervised and unsupervised learning techniques are used together. One of the best examples of this is identifying objects in photos. Some photos are labeled as apples and computers, but most of them are not labeled.

### Reinforcement Learning

Reinforcement Learning is influenced by behavioral psychology with a rewarding system. We can think this is like playing with a dog. We have a dog (terminologically called: agent), and we have a park (environment) where he can do whatever he wants. Whenever the dog gets back to you with a stick, you reward him with a portion of food. After a while, the dog will start to have better approaches to finding other sticks around. So, he will learn from the reward system. This approach in the dog’s head is called reinforcement learning. We have an agent, environment, and reward. The difference between supervised learning is in the output data. In reinforcement learning, when the dog is walking around, he doesn’t know whether he will get a reward or not. He may never get a reward at all. But whenever he finds it, he has learned to win. So, output data may come sometime later. In supervised learning, we know the output beforehand and make predictions by looking at them.

After the introduction of machine learning, I would like to continue diving deep into Supervised Learning and understand regression and classification problems and algorithms.

## Resources

- [Andre Ng’s Course in Coursera](https://www.coursera.org/learn/machine-learning/)
- [Machine Learning Mastery](https://machinelearningmastery.com/)
- [YouTube-sentdex](https://www.youtube.com/user/sentdex/)