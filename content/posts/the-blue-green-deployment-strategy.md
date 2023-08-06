---
title: "What is Blue-Green Deployment"
description: "The Blue-Green Deployment is an application deployment technique used in continuous delivery. The new service is deployed and put into production gradually."
tags:
  -
date: 2021-01-30
updateDate: 2021-01-30
external: false
---

[Software deployment](https://www.wikiwand.com/en/Software_deployment) is one of the last but essential steps of the software development lifecycle. All [planning](https://www.wikiwand.com/en/Software_project_management), [designing](https://en.wikipedia.org/wiki/Software_design), [coding](https://en.wikipedia.org/wiki/Software_development#:~:text=Software%20development%20is%20the%20process,frameworks%2C%20or%20other%20software%20components.), [testing](https://en.wikipedia.org/wiki/Software_testing), and teamwork end up with deployment. Make it right; it's smooth and exciting. All the effort pays off. Make it wrong; disaster awaits: downtime and cluttered data are inevitable.

The Blue-Green Deployment is one of the application release models. The challenge of bringing software from the final stage of testing to live production without downtime is part of [continuous delivery](https://martinfowler.com/bliki/ContinuousDelivery.html). Every second spent in downtime loses money in the operation. This technique aims to reduce downtime and risks during the deployment.

In Blue-Green Deployment, the transition to the new version of the app is gradual. The blue represents an old version of the service.

![(Before Green Deployment)](/images/content/posts/blue-green-deployment/BlueGreenDeployment4.png)

When we want to deploy a new version, a.k.a. green, we create a new environment close to production and deploy our new version into it.

![New Version Deployed](/images/content/posts/blue-green-deployment/BlueGreenDeployment5.png)

After testing and making sure the green is working correctly, we route all traffic to the new version.

![New version is in use](/images/content/posts/blue-green-deployment/BlueGreenDeployment6.png)

When we fully transfer the traffic to the new version, we can destroy or recycle the old blue instances. However, we might prefer to keep the blue [service](/books/microservices-and-their-benefits/) for a while to revert if we face problems with the new green one. One of the continuous delivery goals is to bring the code to production as fast as possible with low risk. It means that the rollback is necessary in case things go south. When we discover the green version is broken, it's easy to roll back to the blue version.

The blue-green deployment comes with the challenge of handling the database and persistence layer between two easily switchable environments. We can manage this by separating [database schema](https://www.wikiwand.com/en/Database_schema) deployment from service deployment. We can deploy the new database schema and migrate the data to the new schema in a blue environment. Once everything is successful, we can switch the service from blue to green.

When we would like to have instant rollout and rollback, blue-green deployment is a good strategy. However, it requires more resources. Both green and blue have to be deployed to a separate but identical environment at the same time. Also, testing the new version with proper tests requires more effort and planning. If the application is stateful, routing all traffic to the latest version is problematic.

## Blue Green Deployment vs. Canary Deployment

Canary Releases are slightly different than Blue-Green Deployments. In Canary Deployment, we create a new version and deploy it to production while keeping the existing version. After the deployment is successful, the latest version starts to get only a small percentage of the traffic, such as 10-20%. If there is no problem with the new version, we can route all traffic to the latest version.

Resource-wise, both deployment methods require two environments. In Blue-Green Deployment, we test the new version with many tests and route 100% of the traffic afterward. In Canary Deployment, instead of routing 100%, we send a canary to the new cave, 10% of the traffic. If the canary is alive, we go all in. We test the latest version with production traffic in Canary Deployment.

## Blue Green Deployment vs. Rolling Deployment

In Rolling Deployment, the main difference is we have one environment instead of two, like in Blue Green. We deploy the new version to the same environment but slowly update the nodes (or instances) one by one once they pass the health check.
