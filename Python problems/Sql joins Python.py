def inner_join(table1, table2, key1, key2):
    joined = []
    for row1 in table1:
        for row2 in table2:
            if row1[key1] == row2[key2]:
                joined.append({**row1, **row2})
    return joined
employees = [
    {'emp_id': 1, 'name': 'Raj'},
    {'emp_id': 2, 'name': 'Priya'},
    {'emp_id': 3, 'name': 'Kiran'}
]

departments = [
    {'dept_id': 10, 'emp_id': 1, 'dept_name': 'IT'},
    {'dept_id': 11, 'emp_id': 3, 'dept_name': 'HR'}
]

result = inner_join(employees, departments, 'emp_id', 'emp_id')
for row in result:
    print(row)
