def merge_with_overlap(list1, list2):
    set1 = set(list1)
    set2 = set(list2)
    overlap = list(set1 & set2)
    merged = list1 + [item for item in list2 if item not in set1]
    return merged, overlap
list_a = [1, 2, 3, 4, 5]
list_b = [4, 5, 6, 7]

merged, overlap = merge_with_overlap(list_a, list_b)
print("Merged List:", merged)
print("Overlapping Items:", overlap)
