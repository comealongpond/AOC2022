

def getLetterPriority(c):
    modifier = 96
    if (c.isupper()):
        modifier = 38
    return ord(c) - modifier




def one():
    f = open("input.txt", "r")

    total_priority = 0

    for line in f:
        splitIndex = int(len(line) / 2)
        r1 = line[0: splitIndex]
        r2 = line[splitIndex:]
        for c in r1:
            if c in r2:
                total_priority += getLetterPriority(c)
                break
        
    print(total_priority)

def two():
    f = open("input.txt", "r")

    total_priority = 0
    currentGroup = []
    groupFound = False

    for line in f:
        if not groupFound:
            currentGroup.append(line.strip())
            if len(currentGroup) == 3:
                groupFound = True
        
        if groupFound:
            lm = currentGroup[0]
            for l in lm:
                if l in currentGroup[1] and l in currentGroup[2]:
                    total_priority += getLetterPriority(l)
                    break

            groupFound = False
            currentGroup = []

    print(total_priority)

two()