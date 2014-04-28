<a name="3.3.6"></a>
### 3.3.6  (2014-04-28)

#### Bug Fixes

* **key_sync:** optimize model updates ([5817877a](git://github.com/goinstant/goangular.git/commit/5817877aa100f4aecb6a8f0c021d20423e34a668))


<a name="v3.3.5"></a>
### v3.3.5 (2014-04-11)

#### Bug Fixes

* **off** Allows no eventName ([74de512dc7](https://github.com/goinstant/goangular/commit/74de512dc7f40fc23c298e51fe0f9d748ec370dc))

#### Chores

* **key guide** Adds a key and filter guide ([fbd9472cb7](https://github.com/goinstant/goangular/commit/fbd9472cb7dc892f7c382de259b4dff2970394d4))

<a name="v3.3.4"></a>
### v3.3.4 (2014-03-27)

#### Features

* **goUsers:** Implements the goUsers feature ([d93f5b3c932](https://github.com/goinstant/goangular/commit/d93f5b3c932f130392735843a566c640820b61af))
* **keyFilter:** Implements the keyFilter ([7d542ccd64](https://github.com/goinstant/goangular/commit/7d542ccd648331aa8a2ca5fb2325e093ababbc59))

<a name="v3.2.2"></a>
### v3.2.2 (2014-02-14)

#### Bug Fixes

* **fix(key/query sync):** $key must return a model**

<a name="v3.2.1"></a>
### v3.2.1 (2014-02-06)

* **on/off.md:** remove prefixed hash

<a name="v3.2.0"></a>
## v3.2.0 (2014-02-06)


#### Bug Fixes

* **example.js:** remove test code from example ([78753ce0](http://github.com/goinstant/goangular/commit/78753ce07af511d4e0c82d797b0b97a7ed293cdd))
* **sync.js:** trim dead branches on set ([3f069aac](http://github.com/goinstant/goangular/commit/3f069aac59b12f3aacec6146ac56d1c792d5548c))


#### Features

* **$goQuery:** Experimental intergration of Query ([eb619b20](http://github.com/goinstant/goangular/commit/eb619b2048a091f9af2e1f8ac5c3c5b47cae27ad))

<a name="v3.1.1"></a>
### v3.1.1 (2014-01-31)


#### Bug Fixes

* **sync.js:** trim dead branches on set ([3f069aac](http://github.com/goinstant/goangular/commit/3f069aac59b12f3aacec6146ac56d1c792d5548c))

<a name="v3.1.0"></a>
## v3.1.0 (2014-01-21)


#### Bug Fixes

* **goangular_frontpage:** Updating points, and removing links ([25524eef](http://github.com/goinstant/goangular/commit/25524eefefef2767277e1079a3a820d4f817505b))
* **chat_example:** ng-controller added to example


#### Features

* **$goConnection:** Enable deferred conn initialization ([b350c96a](http://github.com/goinstant/goangular/commit/b350c96a22b620bd820da22f0d6bebd3901206dd))
* **grunt-conventional-changelog:** Added generatable change-logs([0d77272](https://github.com/PascalPrecht/goangular/commit/0d77272ca388b9aea15844f638e3dcfdee91e5ed))
* **load-grunt-tasks:** Auto load grunt tasks([e6925a2](https://github.com/PascalPrecht/goangular/commit/e6925a23917729a6beffe6b57ded2052d66c683b))

### v3.0.1

- Fixing Getting-Started Links

### v3.0.0

- The $goKey service is now available, it is used to create a Model.  The Model
is associated to a position in an application GoInstant data structure.  It provides
methods for accessing, manipulating and synchronizing local and remote data.
- The GoAngular service used for automatically synchronizing an entire scope
has been deprecated in favor of extending $goKey.

### v2.0.0

- goConnection has replaced platformProvider, with the introduction of promises
to the goinstant API, goConnection now provides a simple way to access user,
rooms and keys.
- A number of services have been made redundant with promises in core, they've been removed.

### v1.0.2

- platformProvider now accepts a user parameter vs a token parameter

### v1.0.1

- Resolving an error users encountered when attempting to connect using default `rooms` & `token` values.

### v1.0.0

- The beginning of time.
