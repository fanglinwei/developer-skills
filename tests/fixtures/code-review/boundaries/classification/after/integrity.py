import hashlib

def verify_snapshot(data, manifest_digest):
    return hashlib.sha256(data).hexdigest() == manifest_digest
