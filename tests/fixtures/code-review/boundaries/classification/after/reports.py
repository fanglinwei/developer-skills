def report(request_headers, store):
    principal = request_headers['X-Principal']
    return store.for_user(principal)
