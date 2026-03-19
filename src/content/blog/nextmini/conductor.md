---
title: "Conductor"
summary: "Understanding of conductor in Nextmini."
sourceUrl: "https://nextmini.org/"
publishedAt: 2026-03-12
series: "Nextmini"
seriesOrder: 3
tags:
  - nextmini
  - conductor
featured: false
---

# Conductor

As the main entry of the dataplane, conductor is more like an orchestrator of each dataplane node.


# Components initialization

Conductor initializes other dataplane components like `controller_interface`, `lossless_runtime`, `controller_reporter` and `flowstatsreporter`.

- `controller_interface`
- `lossless_runtime`
- `controller_reporter`
- `flowstatsreporter`

```
  - ControllerReporterHandle in reporter.rs:25 is the low-level byte-metrics reporter.
    It is used by network interfaces in interface.rs:102: after packets are sent on a link, it aggregates bytes per flow_id and periodically sends
    DataplaneToController::Metrics in reporter.rs:112.
    Think: “how many bytes did this node send for each flow over each neighbor link?”
  - FlowStatsReporterHandle in flowstats.rs:77 is the higher-level flow lifecycle reporter.
    It is used by the local reader, routing table, user-space client, and lossless-unicast flow manager to report events like:
      - app flow start
      - user flow start
      - route assignment
      - flow finished
```

`controller_interface` and `lossless_runtime` will be introduced later as these are two important components in DP.

# Starts ingress server(s)

`conductor::run` will be called right after `Conductor::new()`, which will start listening for incoming network traffic from other nodes.
