

def to_lower(value):
    return (value.lower() if isinstance(value, str) else value)

def to_lower_list(elements):
    return {key: to_lower(value) for key, value in elements.items()}

def filter_none(elements):
    return {key: value for key, value in elements.items() if value is not None}    