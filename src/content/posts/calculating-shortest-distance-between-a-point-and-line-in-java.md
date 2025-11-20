---
title: "Calculating shortest distance between point and line in Java"
description: ""
tags:
  - programming
  - java
date: 2012-10-08T11:33:00.000Z
updateDate: 2012-10-08T11:33:00.000Z
external: false
---

Objective: The aim in this practical tutorial is for the students to develop the ability to design and write simple Java programs which may not require a through Object Oriented Design and Analysis. Your task in this week’s lab exercise is to write a Java program which can calculate the shortest distance d from a given point to a given line segment.

The line segment will be given by the two end points by the user. If the projection of the point on the line that the line segment lies on falls outside the line segment, then the distance will be measure to the closest end point. Your program should ask for the point coordinates and line segment end points’ coordinates by using JOptionPane input dialogs, calculate the distance, and report the result by a JOptionPane message dialog. Show your program working in the lab hours and submit your source code via email. Please check that your code compiles from the command prompt with the “javac *.java” command and only send files with .java extension.

Solution:

Point.java:

```java
 public class Point
 {
     public Point(int x, int y)
     {
         this.x=x;
         this.y=y;
     }
     public int getterX()
     {
         return this.x;
     }
     public void setterX(int x)
     {
         this.x=x;
     }
     public int getterY()
     {
         return this.y;
     }
     public void setter(int y)
     {
         this.y=y;
     }
     private int x;
     private int y;
 }
```

Line.java:

```java
 public class Line {
     private Point point1;
     private Point point2;
     public Line(Point p1, Point p2)
     {
         point1 = p1;
         point2 = p2;
     }
     public Point getterPoint1()
     {
         return this.point1;
     }
     public void setterPoint1(Point p1)
     {
         this.point1 = p1;
     }
     public Point getterPoint2()
     {
         return this.point2;
     }
     public Point setterPoint2(Point p2)
     {
         this.point2 = p2;
     }
     public double distanceOfTwoPoints(Point pp1, Point pp2)
     {
         double result;
         result = Math.sqrt(Math.pow((pp2.x-pp1.x),2)+ Math.pow((pp2.y-pp1.y),2));
         return result;
     }
     public void distanceToPoint(Point p)
     {
         double distance;
         distance = Math.pow((point2.x - point1.x),2) - Math.pow((point2.y - point1.y),2);
         if (distance == 0)
         {
             distanceOfTwoPoints(point1.x, point1.y);
         }
         else
         {
             double tx = (((p.x - point1.x)*(point2.x-point1.x)+(p.y-point1.y)*(point2.y-      point1.y))/distance);
             if (tx < 0)
                 distanceOfTwoPoints(p1, p);
             else if (tx > 1)
                 distanceOfTwoPoints(p2, p);
             else
             {
                 Point pp = new Point(point1.x + tx * (point2.x - point1.x), point1.y + tx * (point2.y - point1.y));
                 distanceOfTwoPoints(pp, p);
             }
         }
     }
 }
```

Main.java:

```java
 public class shortestDistance {
     public static void main (string[] args)
     {
         int x1 = Integer.parseInt(JOptionalPane.ShowInputDialog("Begining of line x point:"));
         int y1 = Integer.parseInt(JOptionalPane.ShowInputDialog("Begining of line y point:"));
         int x2 = Integer.parseInt(JOptionalPane.ShowInputDialog("End of line x point:"));
         int y2 = Integer.parseInt(JOptionalPane.ShowInputDialog("End of line y point:"));
         int x3 = Integer.parseInt(JOptionalPane.ShowInputDialog("Point's x point:"));
         int y3 = Integer.parseInt(JOptionalPane.ShowInputDialog("Point's y point:"));
         Point p1 = new Point(x1,y1);
         Point p2 = new Point(x2,y2);
         Point p3 = new Point(x3,y3);
         Line l = new Line(p1,p2);
         l.distanceToPoint(p3);
     }
 }
```
