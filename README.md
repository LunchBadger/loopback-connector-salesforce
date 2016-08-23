# loopback-connector-salesforce

**Allowing basic CRUD operations from LoopBack to Salesforce**

# About

This project is brand spanking new and not fit-for-purpose so use at your risk.

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

At the moment there is none. It will hopefully just end up working like any other LoopBack
connector. I'll keep this `README.md` up-do-date as progress is made.

# Notes

This was put together with help from Nagarjuna Surabathina's blog post
[LoopBack Connector Development and Creating Your Own Connector](https://strongloop.com/strongblog/loopback-connector-development-and-creating-your-own-connector/).
Cheers!