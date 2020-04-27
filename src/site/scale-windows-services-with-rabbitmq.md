---
title: "Scale Windows Services with RabbitMQ"
featured_image: 
description: ""
date: 2011-11-30
tags: posts
slug: scale-windows-services-with-rabbitmq
layout: layouts/post.njk
---



(Cross-posted to [FreshBrewedCode.com](http://freshbrewedcode.com/davidneal/2011/11/30/scale-windows-services-with-rabbitmq/))

When I joined my current company, we had a mixed bag of Windows Services and scheduled tasks that processed images and video from various sources. For example, we had a service that polled mailboxes for emails, another that polled Facebook accounts, one that sent video off to be encoded, and so forth. Although there were shared libraries, there remained a lot of duplicated code. Most of these services were single-threaded, and were not designed to scale beyond a single instance. Since our platform must be able to respond to huge spikes of activity whenever there is breaking news or weather events, we needed to figure out a better mouse trap.

Having attended a couple of Nashville .NET User Group lectures earlier in the year that touched on distributed architecture[\[1\]](#ref1), I had a good start on where to begin. A message queue-based system seemed to be the obvious answer.

### **Competing Consumers Message Pattern**

The “competing consumers” pattern comes from [Enterprise Integration Patterns](http://www.amazon.com/Enterprise-Integration-Patterns-Designing-Deploying/dp/0321200683/ref=sr_1_1?ie=UTF8&qid=1322663102&sr=8-1), and describes a message-based system where multiple consumers listen to a single message queue, and only one consumer is allowed to process any given message. The beauty of using a message queue is it makes no difference if these consumers are multiple instances of an application (or threads) on the same machine, or spread across multiple physical machines. Leveraging this pattern with a message queue platform makes it almost trivial to create a system that provides load balancing, scalability, and redundancy. You remain focused on implementing the business logic required to process a single message.

### **Basic Pattern Implementation with RabbitMQ and C#**

If you don't already have the RabbitMQ Server installed, go to the [RabbitMQ Downloads](http://www.rabbitmq.com/download.html) page and click on the appropriate installation guide for your platform. If you are running Windows, you'll need to download and install[Erlang](http://www.erlang.org/download.html) first. I also recommend you install the [management plugin](http://www.rabbitmq.com/management.html), which will give you a web-based UI for monitoring and managing RabbitMQ Server.  You can easily add the latest RabbitMQ.Client .NET library to your Visual Studio project using [NuGet](http://nuget.org/List/Packages/RabbitMQ.Client). Or, see "Further Reading and Resources" below to download the compiled library and source code.

Let's dive into some code that demonstrates publishing and consuming messages. Here is the code for the **server/publisher**:

```prettyprint
// Set up the RabbitMQ connection and channel
var connectionFactory = new ConnectionFactory
{
 HostName = "localhost",
 Port = 5672,
 UserName = "guest",
 Password = "guest",
 Protocol = Protocols.AMQP_0_9_1,
 RequestedFrameMax = UInt32.MaxValue,
 RequestedHeartbeat = UInt16.MaxValue
};

using (var connection = connectionFactory.CreateConnection())
using (var channel = connection.CreateModel())
{
 // Create a new, durable exchange
 channel.ExchangeDeclare("sample-ex", ExchangeType.Direct, true, false, null);
 // Create a new, durable queue
 channel.QueueDeclare("sample-queue", true, false, false, null);
 // Bind the queue to the exchange
 channel.QueueBind("sample-queue", "sample-ex", "optional-routing-key");

 // Set up message properties
 var properties = channel.CreateBasicProperties();
 properties.DeliveryMode = 2; // Messages are persistent and will survive a server restart

 // Ready to start publishing
 // The message to publish can be anything that can be serialized to a byte array,
 // such as a serializable object, an ID for an entity, or simply a string
 var encoding = new UTF8Encoding();
 for (var i = 0; i &lt; 10; i++)
 {
  var msg = string.Format("This is message #{0}?", i+1);
  var msgBytes = encoding.GetBytes(msg);
  channel.BasicPublish("sample-ex", "optional-routing-key", false, false, properties, msgBytes);
 }
 channel.Close();
}
Console.WriteLine("Messages published");
Console.ReadKey(true);
```

And here is the code for the **client/consumer**:

```prettyprint
// Set up the RabbitMQ connection and channel
var connectionFactory = new ConnectionFactory
{
 HostName = "localhost",
 Port = 5672,
 UserName = "guest",
 Password = "guest",
 Protocol = Protocols.AMQP_0_9_1,
 RequestedFrameMax = UInt32.MaxValue,
 RequestedHeartbeat = UInt16.MaxValue
};

using (var connection = connectionFactory.CreateConnection())
using (var channel = connection.CreateModel())
{
 // This instructs the channel not to prefetch more than one message
 channel.BasicQos(0, 1, false);

 // Create a new, durable exchange
 channel.ExchangeDeclare("sample-ex", ExchangeType.Direct, true, false, null);
 // Create a new, durable queue
 channel.QueueDeclare("sample-queue", true, false, false, null);
 // Bind the queue to the exchange
 channel.QueueBind("sample-queue", "sample-ex", "optional-routing-key");

 using (var subscription = new Subscription(channel, "sample-queue", false))
 {
  Console.WriteLine("Waiting for messages...");
  var encoding = new UTF8Encoding();
  while (channel.IsOpen)
  {
   BasicDeliverEventArgs eventArgs;
   var success = subscription.Next(2000, out eventArgs);
   if (success == false) continue;
   var msgBytes = eventArgs.Body;
   var message = encoding.GetString(msgBytes);
   Console.WriteLine(message);
   channel.BasicAck(eventArgs.DeliveryTag, false);
  }
 }
}
```

The first key step to implementing the pattern is to declare a **direct** exchange, which will publish messages to a single message queue based on routing information. The commonly-used **fanout** exchange broadcasts messages to every message queue bound to the exchange.

The second key step is configuring the consumer channel's **BasicQos** setting so that it only fetches one message off the queue at a time. If this is not set, then a single consumer could essentially put a hold on all the messages currently waiting in the queue so that none of the other consumers can access them. The messages will remain in a "consumed" but unacknowledged state until they are processed by the one consumer, totally defeating the purpose of implementing this pattern! There's not a lot of documentation available on configuring BasicQos, so I had to figure out this requirement the hard way.

The last step is to acknowledge that the message has been processed, allowing the RabbitMQ server to delete the message from the queue, and the consumer to pick up the next available message.

#### Running the Sample Code

1. [Download the sample project](https://github.com/reverentgeek/RabbitMQSamples).
2. Load and build the solution.
3. Launch two or more command prompts to be used as consumers.
4. Change the current directory of each command prompt to `[your-project-root]\CompetingConsumers.Consumer\bin\Debug` and launch `CompetingConsumers.Consumer.exe`
5. In Visual Studio, press F5 to launch CompetingConsumers.Publisher.

### Further Reading and Resources

Hopefully this brief introduction has wet your appetite for further exploration into messaging and RabbitMQ. Here are a few links to get you down the road a bit further.

* The official RabbitMQ .NET [library and documentation](http://www.rabbitmq.com/dotnet.html).
* Don't let the title scare you. ["AMQP 0-9-1 Model Explained"](http://www.rabbitmq.com/tutorials/amqp-concepts.html) is a concise introduction to the messaging protocol that RabbitMQ is based upon, and essential reading for understanding the fundamentals of RabbitMQ.
* The official RabbitMQ .NET [Getting Started tutorial code](https://github.com/rabbitmq/rabbitmq-tutorials/tree/master/dotnet).
* _[RabbitMQ in Action](http://www.manning.com/videla/)_ by Alvaro Videla and Jason J.W. Williams. You can download chapter 1 for free, which provides a great introduction to the history of messaging and some of the advantages of RabbitMQ over other messaging platforms.

\[1\] The two Nashville .NET User Group lectures I had attended were [Bryan Hunter](http://freshbrewedcode.com/bryanhunter/)’s talk on Command Query Responsibility Segregation ([CQRS](http://www.cqrsinfo.com/)), and [Alex Robson](http://freshbrewedcode.com/alexrobson/) and [Jim Cowart](http://freshbrewedcode.com/jimcowart/)’s [Introduction to Symbiote](http://nashdotnet.org/2011/05/may-12-2011-alex-robson-jim-cowart-introduction-to-symbiote/). I could extol the benefits of being involved in your local developer community, but that could be its own post for another day.



