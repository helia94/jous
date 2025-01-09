from enum import Enum

class Occasions(Enum):
    FIRST_DATE = (1, "first date")
    ROAD_TRIP = (2, "road trip")
    FOR_CHILDREN = (3, "for children")
    STRANGERS = (4, "strangers")

    def __init__(self, occasion_id, label):
        self._id = occasion_id
        self._label = label

    def __str__(self):
        return self._label

    @property
    def id(self):
        return self._id

    @property
    def label(self):
        return self._label