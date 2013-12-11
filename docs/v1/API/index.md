# API

Use this API documentation when you need details related to a specific GoAngular feature.
For a summary of features and high-level concepts you should reference the
[GoAngular overview](OVER VIEW LINK GOES HERE).

Methods related to the synchronization of Angular models are all defined inside of the GoAngular namespace.

## Method Summary

| [goConnection](./goConnection.md)|
|:--|
| [provider](http://docs.angularjs.org/guide/dev_guide.services) in module ***goangular*** |
| GoAngular requires a connection to GoInstant. The `goConnection` provider enables you to configure the connection during the AngularJS configuration stage. |

| [GoAngular#constructor](./constructor.md) |
|:--|
| API in module ***goangular*** |
| Creates & configures a new instance of the GoAngular object which will allow you to initialize synchronization of the AngularJS [models](http://docs.angularjs.org/guide/concepts#model) in a specific scope between clients. |

| [GoAngular#initialize](./initialize.md) |
|:--|
| API in module ***goangular*** |
| Begins the synchronization of models in your AngularJS controllers scope. Models without an existing GoInstant value will default to the value currently assigned in scope. This method accepts no parameters. |

| [GoAngular#destroy](./destroy.md) |
|:--|
| API in module ***goangular*** |
| Cleans up both local AngularJS model `$watch` handlers, remote GoInstant `key` listeners and stops further synchronization. |

*Note: To view further details on each method, use the drop down API side-menu or click on the relevant heading.*
