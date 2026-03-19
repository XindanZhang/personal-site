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

## Introduction of controller interface

The controller interface is a very important control-plane adapter for dataplane nodes. It bootstraps the nodes. The `controller_interface` is initialized in `Conductor::new()`. Then we build the `ControllerInterfaceHandle`.

## fn `connect()`

Once controller interface calls `connect()` to connect to the `controller` with `controller addr` via `WebSocket`, and if succeeds, dataplan node sends the `DataplaneToController::StartUp` message to `controller`, including the private/public addresses, network name, and requested `node_id` of each node. Then the dataplane node will wait for the controller's `startup` response containing the node’s assigned runtime configuration. The dataplane applies that config locally first, and only then starts the rest of the node runtime.

Thus in `connect()`, we have this kind of one-time `startup handshake` between a dataplane node and the controller. So it's literally the bootstrap exchange. It runs once per controller connection and is used to register the dataplane node and fetch `controller-assigned` config.

The one-time StartUp message is the exception. In `connect()`, it is written directly to ws_stream before the stream is split into sender and receiver halves.

### psuedocode of `connect()`

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

## Processor started

Besides that, as you can see, the processor will be created after updating the `controller-assigned` configurations from the controller and, right before other handles which need to use `processor` to avoid the race condition.

Once `connect()` is done, `lossless_runtime` and `python_interface` will be created if needed. `processor.connect_lossless_handle()` is executed here to broadcast `ConnectLosslessHandle` to store `LosslessRuntimeHandle` to every processor for future use. We can find the `broadcast_receiver`

### Processor Implementation

(when we got a inbound packet into processor, it calls `processor_packet` to find next hop(s); then calls `send_packet`. Normally speaking, we will have two scenarios of sending the packet a) for intermidiate nodes, the scheduler—downstream of processor calls `send(packet).await` b) for dst nodes, since we already supported several modes, dst nodes have different ways of sending: i) `try_deliver_lossless(&packet)`, which being used in lossless session; ii) `local_interface.write_packet(packet)`, which being used for TUN delivery; iii) `user_space_sender`, which being used for smoltcp flows simulation; iv) actually we still have another way of handling local delivery with `python_interface`.

The workflow of using ` py_if.deliver(packet).await`:
1. register receiver (`register_receiver_from_node()`) and send bytes with `send_to_node()`
2. `scheduler` sends packets in intermidate nodes
3. `py_if.deliver(packet).await`
4. `PythonInterfaceHandle::deliver()` matches `flow_id`, stripes out the payload, queues them to python receiver.



In parrallel, `LosslessUnicastFlowManager` is also created.
