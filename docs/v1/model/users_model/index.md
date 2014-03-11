# Users Model

A users model is an object created and returned by the [$goUsers](../../users.md) factory.
It encapsulates your application's data and provides an API to access, manipulate
and persist that data.

The Users Model inherits all of the methods and properties from a Model.

## API

| [$sync()](../sync.md)|
|:--|
| Retrieves the current value of the key associated with this model and monitors it for changes, keeping the model in sync with the  associated key.  ***Note: changes made directly to the object do not persist back to the key.*** |

| [$key(name)](../key.md)|
|:--|
| Creates a new model instance, with a relative key. |

| [$omit()](../omit.md)|
|:--|
| Returns a new object, sans properties prefixed with `$`. |

| [$set(value)](../key_model/set.md)|
|:--|
| Overwrites the remote value of the key associated with this model.  The value of the model will also be updated. |

| [$add(value)](../key_model/add.md)|
|:--|
| Adds an item to a key with a generated id.  Ids are generated in chronological order. |

| [$remove()](../key_model/remove.md)|
|:--|
| Removes the remote key and local object. |

| [$self()](./self.md)|
|:--|
| Returns a promise that resolves to a new model, specific to the local user. |

| [$getUser(userId)](./get_user.md)|
|:--|
| Returns an object with a specific user's data. |

| [$on(eventName, opts, handler)](./on.md)|
|:--|
| Adds an event handler. Can be used to monitor local and remote changes to the model. Extends the implementation of [KeyModel#$on](../key_model/on). |

| [$off(eventName, opts handler)](./off.md)|
|:--|
| Removes an event handler. Extends the implementation of [KeyModel#$on](../key_model/on.md). |
