---
title: "Firebase Predictions"
description: "Google announced Firebase Predictions in Firebase Dev Summit in Amsterdam this year."
date: 2017-12-10
updateDate: 2017-12-10
external: false
---

Google announced Firebase Predictions in Firebase Dev Summit in Amsterdam this year. This is maybe the most important announcement of the summit. It enables businesses to predict user behavior depending on previously collected data. This way, we can guess what users might do next and offer discounts, and promote features to keep them engaged. Until Firebase Predictions, we had to do this job by exporting our user’s behavior-tracking data and applying some machine-learning techniques to predict what users may do in the future. By releasing this tool into the Firebase ecosystem, Google takes over this responsibility and gets all data we have from Google Analytics for Firebase. It trains the data and predicts the future motion of the user depending on the defined goals. OK, sounds great! But…

## How much data does it use?

It uses Google Analytics for Firebase as a data source and takes the last 100 days of user activity. It trains and evaluates/holds out the data and generates predictions for the next 7 days. Also, it calculates the accuracy of predicted values for the last 14 days.

## How useful is it for product owners/project managers?

Looking at user analytics data helps to track how the project is going. Defining KPIs and following them is the most important part of the project. Because KPIs enable people to see if a project achieves key business objectives. On the other side, machine learning algorithms are widely used to predict user interactions and improve business goals. Firebase Predictions are likely to help to achieve these goals without spending a lot of resources. It has predictions for churn and spending by default. For instance, if your project uses a freemium model, you can predict which users are likely not to spend money. So, you can improve your conversion rate by focusing on these users by offering them some discounts or extra advantages.

![](/images/content/posts/firebase/8e7bad6a-2a73-4bd6-ab8f-60eb22abf849_1920x1080.png)

Offer extra lives to your unhappy users to increase engagement. (Source: Firebase)

On the engagement side, Firebase Predictions’ [churn value](https://www.wikiwand.com/en/Churn_rate) can help to see which users are likely to stop using the app. For example, in mobile applications, push notifications are widely used as a reminder to users about some content inside the app. This serves well in a lot of cases. Just imagine, if we knew the users who are likely to delete the app before they delete, what can we do to keep them inside? Instead of random guesses with push notifications, we can get benefit by understanding the user behavior and taking actions according to solid predictions.

## Which services can we integrate with Firebase Predictions?

Firebase gives the capability to combine its tools like [Remote Config](https://firebase.google.com/docs/remote-config/) with Predictions. Remote Config is another Firebase service that lets us change the behavior and appearance without forcing the user to update the app. A combination of Predictions with Remote Config is an awesome start. This means we can change the app according to user behavior predictions while on live. Another use case is integrating Predictions with [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/). Cloud Messaging is a tool allowing app owners to send push notifications to their users. The last thing is A/B testing. Firebase announced the A/B testing tool on the same day. Using predictions and A/B testing together is something that everyone should absolutely try.

## How to start using Firebase Predictions?

First, Firebase Predictions uses Analytics events that correlate to predictions. It means that you have to use Firebase Analytics as an event tracker. If you’re already using Analytics, you need to enable [Analytics Data Sharing](https://support.google.com/firebase/answer/6383877#manage). Then you’ll be able to enable Predictions for the project.

![](/images/content/posts/firebase/33f7969e-abdd-4f77-9792-10b7f865da88_1578x638.webp)

After enabling, you’ll see the default predictions and an explanation of the preparation process. It says that it can take 24 hours, but also it can take more time, according to your data.

![](/images/content/posts/firebase/3c476ce8-8ce2-4bda-8241-247bef8ab692_1327x898.webp)

At the end of the table, you’ll see the + button for creating custom predictions based on analytics events. When you want to create a custom prediction, you just need to name it and connect the event in the opening popup.

![](/images/content/posts/firebase/7660d2b8-5620-4718-ae49-c54241265a5b_583x519.webp)

You have created a new Firebase Prediction. But there is one more thing that you should know, risk tolerance level.

## What is the risk tolerance level?

> When predicting user behavior, there is always a degree of uncertainty that requires a trade-off: you must decide whether to include fewer users in a predicted group for higher overall accuracy or to include more users for lower overall accuracy.

![](/images/content/posts/firebase/b8c98d0d-809b-40d3-b39d-838d2412e3b3_650x884.webp)

## Targeting users based on risk tolerance level

By defining tolerance level, you tell Firebase Predictions how tolerant you’re about uncertainty. If you increase your tolerance level, you’ll be saying that you’re willing to take the risk about predictions. For instance, if you’re going to offer some free content for users, you may want to be more precise about predictions and choose a low level of tolerance. Otherwise, you can lose money for nothing. But if you’re planning to offer some small discounts, you might have some tolerance but not too much.

![](/images/content/posts/firebase/b1dbb5bd-e232-495d-9cb2-b0f37b71ff22_768x449.webp)

When the risk tolerance level increases, the accuracy of predictions will decrease. Firebase has 3 risk tolerance levels: high, medium, and low. High-risk tolerance level targets more users with the lowest level of accuracy. Low tolerance level targets fewer users with the highest level of accuracy available. The middle level is somewhere in between the two of them, targeting a moderate level of users with a moderate level of accuracy. You need to choose risk tolerance levels for each prediction. Our next step will be dependent on the use case and decision. We will take a look at the integration of Predictions with other tools. Let’s dive in one by one.

## Remote Config with Firebase Predictions

The usage of Remote Config inside the apps really affects how to use Firebase Predictions. If you’re already using Remote Config, you can adjust your values according to the predictions. If you’re not using Remote Config, please check [the documentation](https://firebase.google.com/docs/remote-config/) first for the setup. In remote config, we have to add a new condition or edit current ones to use prediction. When we add a new condition, we need to add the ‘App’ as the first application condition for the value. This app has to be the one with enabled Firebase Predictions. Secondly, we need to click “AND,” and choose a prediction value from the dropdown list and select the risk tolerance group; then, pressing the ‘Create Condition’ button will create the condition for us. Now, we can start using this condition in our Remote Config values.

![](/images/content/posts/firebase/27ca433d-5084-49e1-b63b-b26a26d8d3a7_1384x696.webp)

One of the examples of predicted remote config values is using them in the games. When we want to sell packages and adjust their content according to user willingness to pay, we can increase our revenue. Another example can be changing the appearance of share buttons inside our apps. If users are not likely to share the content in the app, we can prepare a good UI to convince them to share.

## A/B Testing with Firebase Predictions

These two new features are perfect for each other. A combination of them opens a lot of doors for every business. Creating a new A/B test experiment is easy. First, go to the Remote Config section in the Firebase Console. You’ll see the A/B Testing button in the upper right corner. When you click it, you’ll see three sections Running, Draft, and Completed. Click Create Experiment button. It’ll start the creating experiment process. Name the experiment and choose your Firebase Predictions enabled app like in Remote Config. After this, you’ll be able to see prediction values. You can choose one of them and continue the process. I won’t get into more details about all the A/B testing processes in Firebase. Because it’s another blog post subject on its own.

![](/images/content/posts/firebase/65808e33-830f-4775-a732-6af28afbac6f_1384x1156.webp)

Here is an example from the presentation about Firebase Predictions combined with A/B testing.

![](/images/content/posts/firebase/db6cba70-852a-4799-bb91-612504d765e1_2000x1095.webp)

In this test, they choose High-Risk Tolerance for **spend** prediction. So, when targeted users are likely to spend money, they change the appearance of the application by introducing different paid packages.

## Notifications with Firebase Predictions

Lastly, we can integrate Firebase Cloud Messaging with Firebase Predictions. If you’re not using Firebase Cloud Messaging, you can take a look at [the documentation](https://firebase.google.com/docs/cloud-messaging/). When you enter Notifications in Firebase Console, you can click on the New Message button. In the opening screen, enter your analytics event name in the “Message label” section. Choose “User segment” from the Target section and do the same as we did for A/B testing. Then, choose the app in which you enabled Firebase Predictions in the target conditions. And add another condition for prediction. Choose the prediction value and risk tolerance level in there.

![](/images/content/posts/firebase/notifications-with-firebase-predictions.png)

You can adjust other settings of notifications in the console. One thing to mention here, as we’re not able to send push notifications for user segments via Firebase SDKs, this feature is only available in Firebase Console.

## Final Words

Machine learning algorithms have been in use for decades, but interest is drastically increased in the last years. The hard part of applying machine learning algorithms to businesses arises from the complexity and collecting data. Even if every business collects data from users, they are not able to use machine learning algorithms to predict the future actions of their users. The introduction of Firebase Predictions seems like a solution to this problem. Google Analytics is already a leader in the analytics world, and Google Analytics for Firebase is becoming a standard in the mobile world. Google takes a big step to help all businesses by applying machine learning algorithms on big chunks of precious analytics data. We’ll see together how it’s going to achieve its goal.
