---
title: "Ethernet 1500B and Jumbo 9000"
summary: "A short note on why Ethernet usually means 1500-byte MTU and what people mean by jumbo 9000."
sourceUrl: "https://datatracker.ietf.org/doc/html/rfc894"
publishedAt: 2026-03-19
tags:
  - networking
  - ethernet
  - mtu
featured: false
---

When people say `Ethernet 1500B`, they usually mean the normal Ethernet MTU or payload size, not the total frame size on the wire. [RFC 894](https://datatracker.ietf.org/doc/html/rfc894) says the Ethernet data field for an IP datagram goes up to `1500` octets. In other words, `1500 bytes` is the familiar payload limit for ordinary Ethernet IP traffic.

That is also why the total frame is a little bigger than `1500 bytes`. Red Hat's performance guide explains that a standard Ethernet frame without a VLAN tag is `1518 bytes` in total, with `18 bytes` of Ethernet overhead and `1500 bytes` left for payload. So the common `1500` number is the data part people care about most, not the whole frame envelope.

`Jumbo 9000` usually means configuring an MTU around `9000 bytes` instead of `1500 bytes`. The useful detail is that jumbo frames are non-standardized, so `9000` is a common operational choice rather than a single universal Ethernet rule. It is popular because larger frames reduce per-packet overhead and can lower CPU work when a host is moving large, contiguous streams such as backups, storage traffic, or lab data sets.

The catch is that jumbo frames only help when the whole path agrees. Red Hat's networking documentation is very direct here: all network devices on the transmission path need to support jumbo frames and use the same MTU. If one hop stays at `1500`, you can end up with fragmentation, drops, or confusing throughput regressions.

My short version is simple: `1500` is the safe default for general Ethernet networks, while `9000` is a deliberate tuning choice for controlled environments. If the traffic is large and the path is fully under your control, jumbo frames can be worth it. If not, `1500` is still the number to trust.

References:

- [RFC 894: A Standard for the Transmission of IP Datagrams over Ethernet Networks](https://datatracker.ietf.org/doc/html/rfc894)
- [Red Hat Enterprise Linux 9: Tuning the network performance](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/monitoring_and_managing_system_status_and_performance/tuning-the-network-performance_monitoring-and-managing-system-status-and-performance)
