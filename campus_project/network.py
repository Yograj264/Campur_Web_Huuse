"""Discover this machine's private IPv4 addresses for local development only."""
import ipaddress
import socket


def local_ipv4_addresses():
    try:
        records = socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET)
    except OSError:
        return []
    networks = [ipaddress.ip_network(block) for block in ('10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16')]
    addresses = {record[4][0] for record in records}
    return sorted(address for address in addresses if any(ipaddress.ip_address(address) in network for network in networks))
