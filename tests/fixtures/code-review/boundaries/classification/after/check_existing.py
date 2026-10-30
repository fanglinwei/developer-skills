import hashlib
from integrity import verify_snapshot
data = b'release snapshot'
assert verify_snapshot(data, hashlib.sha256(data).hexdigest()) is True
print('valid snapshot check passed')
