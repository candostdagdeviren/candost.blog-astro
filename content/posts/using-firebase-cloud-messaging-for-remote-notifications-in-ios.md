---
title: "Using Firebase Cloud Messaging for Remote Notifications in iOS"
description: "Firebase gives you the tools and infrastructure you need to build better apps and grow successful businesses. It provides several features divided into three groups develop, grow and earn."
tags:
  -
date: 2016-11-05
updateDate: 2016-11-05
external: false
---

Let’s talk about Firebase a little bit first.

On the Firebase website, it says, “Firebase gives you the tools and infrastructure you need to build better apps and grow successful businesses.”. It provides several features divided into three groups **develop**, **grow,** and **earn,** and all of them are connected to Analytics. It doesn’t matter which feature you are using; you’ll get Analytics for free. Features inside Grow and Earn groups are completely free. Actually, only 4 of the 15 features in total are paid. You can check them out [here](https://firebase.google.com/features/).

![](/images/content/posts/firebase/Pasted%20image%2020230722223051.png)

## Firebase Cloud Messaging (FCM)

Cloud Messaging is one of the cool free features of Firebase. It’s easy to fire push notifications from the server to FCM, and it handles the rest for iOS, Android, and the Web. I will skip the setup in this post. You can follow the well-written [setup guide](https://firebase.google.com/docs/cloud-messaging/ios/client) and add Firebase to your project.

![](/images/content/posts/firebase/Pasted%20image%2020230722223102.png)

You can connect to Firebase Cloud Messaging via Firebase Console or an app server. Firebase Console is pretty easy, but it’s a manual job. I’ll cover the app server side in this post. There are **three** ways to send notifications via Firebase. You can send notifications to **one device** or **device groups,** or **topics**. I would like to send notifications to all devices of a specific user, and I don’t want to store tokens. I’ll skip sending notifications to only one device way in here. Also, device groups are used for grouping one user’s all devices. In this way, you can send notifications to all devices of one user. So, both of them require storing tokens. Firebase suggests using device groups if you need to send messages to multiple devices per user. But as I said, I don’t want to store tokens. So I’m going to focus on only topics in this post. If you prefer storing tokens and dealing with them, you can use two other ways.

What is a **topic**? The topic is based on publish/subscribe model. Each device can subscribe to different topics. The server sends a request to topics. FCM handles the rest, and all subscribed devices get notifications. Such an easy and powerful way. But as with every service, it has pros and cons. Topics are not optimized for fast delivery. So there can be latency between sending notifications and receiving them. Topics are optimized for throughput.

## Real-Life Scenarios

We have a microservice that creates push payloads when it receives an event. Our lovely pusher has no idea about client devices and doesn’t have any storage. When a new event occurs on underlying systems, it gets notified. Then it sends notifications to mobile platforms.

Our pusher sends an HTPP request to FCM. You can learn more about the server implementation of FCM [here](https://firebase.google.com/docs/cloud-messaging/server). Our basic request structure is like this:

```shell
https://fcm.googleapis.com/fcm/send
Content-Type:application/json
Authorization:key=SERVER_API_KEY

{
  "condition": "'condition1' in topics &amp;&amp; 'condition2' in topics",
  "notification": {
      "category": "notification_category",
      "title_loc_key": "notification_title",
      "body_loc_key": "notification_body",
      "badge": 1
  },
  "data": {
    "data_type": "notification_data_type",
    "data_id": "111111",
    "data_detail": "FOO",
    "data_detail_body": "BAR"
  }
}
```

This request sends proper structure to APNs via FCM. You can learn more about notification payload keys and their value types more from [here](https://firebase.google.com/docs/cloud-messaging/http-server-ref#notification-payload-support). Also, you can put your extra information to process in your app in the “data” section. In the request, you’ll see the **condition** key. It’s used to send push notifications to **topics**. Every condition is a topic here. This request sends notifications to devices that subscribed to _condition1_ and _condition2_. We can use different conditions there. For instance, we can use **`||`** instead of **&&**. In that case, FCM sends notifications to devices that subscribe to _condition1_ or _condition2_. It’s possible to combine topics and create complex conditions like _condition1 && (condition2 `||` condition3)_. The only limitation is only one operator is allowed at a high level. It’s not possible to create conditions like _condition1 && condition1 && condition3_; it has to be grouped.

We have enough information about the server and FCM. Let’s move to the iOS side. (I won’t get into the notification handling. It’s completely another topic.)

FCM makes everything so much easier on the iOS side. There are a couple of things to do. After creating your APNs certificates and completing the necessary steps in the setup guide, you should configure your app for FCM. To do that, add this line `FIRApp.configure()` in your `AppDelegate`’s `application:didFinishLaunchingWithOptions:` method. This method configures your app using `GoogleService-Info.plist` file.

Firebase uses method-swizzling to map the APNs token to the FCM registration token. Also, for capturing analytics about delivery information of messages. I prefer disabling swizzling and handling these steps by myself. To disable swizzling, you need to set `FirebaseAppDelegateProxyEnabled` key to `NO` in your application `Info.plist` file. From now on, we will be responsible for APNS key mapping and analytics data. Let’s map the APNS token to the FCM token first. Here’s how to do it:

```swift
func application(_ application: UIApplication,
                 didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
  #if PROD_BUILD
    FIRInstanceID.instanceID().setAPNSToken(deviceToken, type: .prod)
  #else
    FIRInstanceID.instanceID().setAPNSToken(deviceToken, type: .sandbox)
  #endif
}
```

The important thing here is `FIRInstanceIDAPNSTokenType`. There are three types available `.prod`, `.sandbox` and `.none`. To get a notification, one of the Production or Sandbox token types must be used.

The last thing we have to do without method swizzling is sending message analytics to FCM. So, we’ll be able to use Analytics from Firebase Console. Here’s how to do it:

```swift
func application(_ application: UIApplication,
        didReceiveRemoteNotification userInfo: [AnyHashable : Any],
                 fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Swift.Void) {
    FIRMessaging.messaging().appDidReceiveMessage(userInfo)
}
```

We set up FCM, mapped our token to the FCM token, and sent message analytics. The last thing remaining is subscribing to topics. To subscribe to a new topic is really easy. It’s just one line:

```swift
FIRMessaging.messaging().subscribe(toTopic: "/topics/condition1")
// Don't forget to add /topics/ prefix while subscribing
```

If there is no topic in FCM, it creates a new topic automatically when you’ve subscribed. As you remember, we talked about combining topics in our HTTP request’s **condition** key. Also, on the app side, we can subscribe to **multiple topics** to get more notifications.

Let’s get back to our case. We would like to send new notifications to a specific user. To do that, we created topics using unique user ids. It sounds like misusing topics, but it was the only way in our case. Each user subscribes to a topic named something like “userID_11111”. And in our lovely pusher, we used user ids in condition.

Most of the apps have user login and logout cases. When users log out, you don’t want to send them notifications. To cover these cases, you can unsubscribe from topics. FCM removes that device token from a topic list (The topic always will be there. You cannot delete topics). Unsubscribing is similar to subscribing:

```swift
FIRMessaging.messaging().unsubscribe(fromTopic: "/topics/condition1")
// Don't forget to add /topics/ prefix while unsubscribing
```

We covered sending push notifications and FCM topics until now. FCM is really powerful and easy. But like any other service, we faced some problems.

## Problems

The first problem is subscribing to a new topic can take some time on FCM. If you don’t get notification directly after subscribing, you should wait a couple of minutes.

The other problem is handling push notifications was different on the Android side. If you want to create nice custom notifications, you should send a different payload. In the above HTPP request, we had **notification** and **data** keys. If the Android app gets a notification key, it has no control over it. It cannot customize notifications, and the device displays default notifications with the given title and body. To create a custom-style notification, they need to use the **data** key and create notification. When we were faced with this solution, we came up with an idea for **iOS** and **android** topics. We created two more topics. iOS devices subscribe to the **iOS** topic, Android devices subscribe to the **Android** topic. Our lovely pusher sends two requests for each event. For Android, our **condition** key’s value is _“‘userID_1111’ in topics && ‘android’ in topics”_ and it has no **notification** key. For iOS, it is **`"'userID_1111' in topics && 'iOS' in topics"`**. Maybe it’s not the perfect way to handle these cases. But it’s working very well, and we don’t care about device token handling. If you have better ideas or ways, please let me know.

The last problem is configuring sandbox and production types for Firebase. Most of the iOS apps don’t have a separate target for different release modes. For different configurations like Debug, Test, and Release, you have to set up different apps in Firebase Console. Then, you’ll have a separate GoogleService-Info.plist for different configurations. Renaming them and configuring Firebase with these files won’t work. The only solution I can find is running a script. Put different .plist files for different Firebase apps under separate folders. You can name them like prod, beta, etc., and run the following script before Compile Sources in Build Phases in your app target. (Don’t forget to configure the below script with your folder naming and path)

```shell
isRelease=`expr "$GCC_PREPROCESSOR_DEFINITIONS" : ".*release=\([0-9]*\)"`
RESOURCE_PATH=${SRCROOT}/firebase/beta
if [ $isRelease = 1 ]; then
  RESOURCE_PATH=${SRCROOT}/firebase/release
fi
BUILD_APP_DIR=${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app
echo "Copying all files under ${RESOURCE_PATH} to ${BUILD_APP_DIR}"
cp -v "${RESOURCE_PATH}/"* "${BUILD_APP_DIR}/"
```

This script takes the located config files (GoogleService-Info.plist) according to the app build configuration. And duplicates it to the build app directory before compiling sources. Then, Firebase will identify the .plist file as identical, like there is only one file. You can configure the script and copy only .plist files. Logic is the same.

This is it. Easy setup, easy configuration. The possibility of using FCM with other features of Firebase gives a lot more advantages. Maybe this will be the subject of other posts.
