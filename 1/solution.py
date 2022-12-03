

f = open("input.txt", "r")

elfs = []

current_elf_calories = 0
for line in f:
	if line == "\n":
		elfs.append(current_elf_calories)
		current_elf_calories = 0
	else:
		current_elf_calories += int(line)

elfs.sort(reverse=True)

print(elfs[0]) # 1.1

print(elfs[0]+elfs[1]+elfs[2]) # 1.2