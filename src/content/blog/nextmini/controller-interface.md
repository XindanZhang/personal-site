---
title: "Controller interface"
summary: "Overview of the controller interface in Nextmini."
sourceUrl: "https://nextmini.org/"
publishedAt: 2026-03-11
series: "Nextmini"
seriesOrder: 2
tags:
  - nextmini
  - controller
  - interface
featured: false
---

## Introduction of `ControllerInterface`

The controller interface is a very important control-plane adapter for dataplane nodes. It bootstraps the nodes. Once it knows the `controller_addr`, it uses `connect()` to connect to the `controller` via `WebSocket`, and if succeeds, dataplan node sends the `DataplaneToController::StartUp` message to `controller`, including the private/public addresses, network name, and requested `node_id` of each node. Then the dataplane node will wait for the controller's `startup` response containing the node’s assigned runtime configuration. The dataplane applies that config locally first, and only then starts the rest of the node runtime.

Thus in `connect()`, we have this kind of one-time `startup handshake` between a dataplane node and the controller. So it's literally the bootstrap exchange. It runs once per `controller connection` and is used to register the dataplane node and fetch `controller-assigned` config.

```rust
fn connect(config) -> (updated_config, processors, ws_stream):
    parse controller URL
    connect to controller websocket with retry loop and timeout
    send StartUp message // DataplaneToController::StartUp
    wait for one controller response
    if response is ControllerToDataplane::StartUp:
        update config from response
    create processor handle using updated config
    return updated_config, processors, ws_stream
```
