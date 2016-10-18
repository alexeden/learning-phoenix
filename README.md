## Plugs

All plugs take a `conn` and return a `conn`
`conn` is a `Plug.Conn` struct

Two types of plugs:

1. Module plugs
2. Function plugs

Module plugs are used like this:
```
plug MyModulePlug
```

Module plugs must have two functions:

1. `init`: runs at *compile time*
2. `call`: runs at *runtime*

The result of `init` is used as the second argument of `call`

---

Function plugs are used like this:
```
plug :my_function_plug
```

## `Plug.Conn` struct

A `Plug.Conn` struct contains sets of:
- request fields
- fetchable fields
- connection fields
- response fields

Request fields are *parsed by the adapter for the web server being used* (Phoenix uses Cowboy)

Fetchable fields are empty until you explicitly request them
