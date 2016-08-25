# loopback-connector-salesforce

**Allowing basic CRUD operations from LoopBack to Salesforce**

# About

This project is brand spanking new and only just approaching being fit-for-purpose, use at your own risk.

## Ambitions

The idea behind this project is to provide a connection between LoopBack and Salesforce.
"*Why not just talk to Salesforce directly as they provide a really good Javascript library already?*",
you might ask. Well, at SCVO we want to turn our focuses to front-end development so
we are developing a LoopBack based service that is highly configurable at runtime that
can handle most of our back-end needs. These needs are mostly, talking to Salesforce, and
indexing data in Elasticsearch. We are calling this service
[ElasticSauce](https://github.com/scvodigital/elasticsauce). Moving the connection to
our Salesforce instance (and other data sources) to a secured managed service, we can more
securely control access.

## Technologies Used

* [LoopBack](https://loopback.io)
* [Jasmine](https://jasmine.github.io)
* [jsforce](https://jsforce.github.io)

# Installation

This project is currently not in the NPM registry. If we feel that it is feature complete
enough to sit up there and be more easily accessed by others, we will add it. For now
you need to do an NPM install from github.

```
npm install @scvodigital/loopback-connector-salesforce --save
```

# Usage

Once this is installed it works just like any other data connector. An example data source
configuration would look like this:

```
    "salesforce": {
        "name": "salesforce",
        "connector": "salesforce",
        "username": "user@org.com",
        "password": "password+token",
        "debug": "true"
    }
```

Passwords should be a concatenation of the users Salesforce password and API token without the
plus symbol. Unfortunately you cannot connect to a sandbox environement with this just yet.

All basic CRUD operations should be working by now but have not been rigerously tested. This
will come in good time. Upserting probably won't work and if you run into any limitations, please
feel free to raise an issue or a pull request with your fix.

## Contributing

There are no coding standards or any proper tests set up for this project yet. We will eventually
be implementing a strict JSLint setup into the build and some Jasmine tests. Also, there is a severe
lack of comments in this code. It has been developed in something of a rush and will hopefully be
tidied up in the future. If you want to help with any of that, please issue a Pull Request.

Basically just use this project and if you run into issues you can fix, SCVO would be more than
happy to accept your help. We have limited developers and many projects on the go, and at the end
of the day this code is being used to help the Scottish Voluntary Sector!

# Notes

This was put together with help from Nagarjuna Surabathina's blog post
[LoopBack Connector Development and Creating Your Own Connector](https://strongloop.com/strongblog/loopback-connector-development-and-creating-your-own-connector/).

I also ended up just digging through the codebase for
[LoopBack's Microsoft SQL Server connector](https://github.com/strongloop/loopback-connector-mssql)
to understand what the heck is going on in a SQL like connector and how to use some of the features
such as `.buildWhere()` from filter JSON. It was

Cheers to both!