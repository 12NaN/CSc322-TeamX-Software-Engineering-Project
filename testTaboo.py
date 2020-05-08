
title = input('Enter title:')
content = input('Enter content:')

taboo = open('taboo.txt', 'r')

for line in taboo:
    stripped_line = line.strip()
    #print(stripped_line)
    if stripped_line in title:
        print(stripped_line)
        title = title.replace(stripped_line, '*'*len(stripped_line))
    if stripped_line in content:
        print(stripped_line)
        content = content.replace(stripped_line, '*'*len(stripped_line))
taboo.close()
print(title)
print(content)