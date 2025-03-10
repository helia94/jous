# custom_worker.py
from gunicorn.workers.sync import SyncWorker

class RouteSpecificSyncWorker(SyncWorker):
    def handle_request(self, listener, req, client, addr):
        # Default timeout
        self.timeout = 30

        # Route-specific timeout: 300s for /api/blog
        if req.path.startswith('/api/blog'):
            self.timeout = 300

        # Continue handling request
        super().handle_request(listener, req, client, addr)
