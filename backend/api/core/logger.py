import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# You can add FileHandler or StreamHandler if desired
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter('[%(asctime)s] %(levelname)s in %(module)s: %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)
