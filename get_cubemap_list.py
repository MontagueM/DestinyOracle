import os

seen = {}

for x in os.listdir('cubemapsv2922/'):
    b = x.split('_')[0]
    if b not in seen.keys():
        seen[b] = set()
    seen[b].add(x[:-6])

seen = [list(x) for x in seen.values()]
[x.sort(key=lambda x: int(x.split('_')[-1])) for x in seen]

with open('cubemap_list_v2922.txt', 'w') as f:
    for x in seen:
        for y in x:
            f.write(f'{y}\n')