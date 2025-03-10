from gunicorn.glogging import Logger

# Custom post-fork hook to change timeout for specific routes
def post_fork(server, worker):
    def custom_timeout(environ):
        if environ.get('RAW_URI', '').startswith('/api/blog'):
            worker.cfg.settings['timeout'].set(worker.cfg, 300)  # 300 seconds for /api/blog
        else:
            worker.cfg.settings['timeout'].set(worker.cfg, 30)  # Default 30s timeout

    worker.wsgi = CustomWSGIWrapper(worker.wsgi, custom_timeout)

class CustomWSGIWrapper:
    def __init__(self, app, timeout_func):
        self.app = app
        self.timeout_func = timeout_func

    def __call__(self, environ, start_response):
        self.timeout_func(environ)
        return self.app(environ, start_response)
