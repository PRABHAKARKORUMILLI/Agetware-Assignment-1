def format_indian_currency(number):
    integer, dot, fraction = str(number).partition('.')
    if len(integer) <= 3:
        return integer + (dot + fraction if dot else '')
    head = integer[-3:]
    tail = integer[:-3]
    tail_groups = []
    while tail:
        tail_groups.insert(0, tail[-2:])
        tail = tail[:-2]
    formatted = ','.join(tail_groups + [head])
    return formatted + (dot + fraction if dot else '')
print(format_indian_currency(input("")))
