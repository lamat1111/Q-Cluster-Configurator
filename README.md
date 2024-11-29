# Q Cluster Configurator

A web-based tool for generating cluster configurations for Quilibrium nodes.

## Overview

This tool helps operators configure multi-node clusters in the Quilibrium network by generating:
- Worker multiaddrs for the config.yml file
- UFW firewall rules for node-to-node communication
- Worker range assignments for each node

## Usage

1. Set number of nodes in your cluster
2. Choose between DNS or IP-based addressing
3. Enter node details (IP/DNS and worker count)
4. Optional: Configure UFW rules by providing master node IP
5. Copy generated configurations into respective node files

## Features

- Save/load configurations
- One-click output selection
- Automatic port assignment
- Worker range calculation
- UFW rule generation

[Use the tool](https://github.com/lamat1111/Q-Cluster-Configurator/)
