#include <stdio.h>
#include <stdbool.h>

#include "solution.h" // Function definitions

// #define MARKER_LENGTH 4 solution1
#define MARKER_LENGTH 14 // solution2

#define EMPTY_ARRAY_MARK '-'

int main(void)
{
	char lastChars[MARKER_LENGTH];
	for (int i = 0; i < MARKER_LENGTH; i++)
	{
		lastChars[i] = EMPTY_ARRAY_MARK;
	}

	// size_t n = sizeof(lastChars)/sizeof(lastChars[0]); // Array size
	
	// Open file
	FILE* fp;
	fp = fopen("./input.txt", "r");

	// Get file size because why not
	int file_size = get_file_size(fp);
	printf("File size: %i bytes\n", file_size);

	char c; // read char
	int result; // break result

	// Read file char by char
	while (!feof(fp))
	{
		c = fgetc(fp); // Get next char in file
		if (c == '\n' || feof(fp)) // skip newline and EOF
		{
			continue;
		}

		shift(lastChars, c);
		if (all_chars_in_array_unique(lastChars, MARKER_LENGTH)) // are last x  characters in arr unique
		{
			result = ftell(fp); // Current file position is the answer
			break;
		}
	}

	printf("Result: %i\n", result);

	// Close file
	fclose(fp);

	return 0;
}

int get_file_size(FILE* fp)
{
	fseek(fp, 0L, SEEK_END);
	int filesize = ftell(fp); // Position at last character (filesize)
	rewind(fp); // Put marker back at beginning of file
	return filesize;
}

void shift(char arr[], char c)
{
	// Shift all chars in array one position to the left
	for (int i = 0; i < MARKER_LENGTH-1; i++)
	{
		arr[i] = arr[i+1];
	}

	arr[MARKER_LENGTH-1] = c; // Put in new character
}

bool all_chars_in_array_unique(char arr[], int array_length)
{
	// Checks if all characters in array is unique

	for (int i = 0; i < array_length; i++)
	{
		if (
			char_exists_in_array(arr, array_length, arr[i], i)
			|| arr[i] == EMPTY_ARRAY_MARK // empty chars are never considered unique
			)
		{
			return false;
		}
	}

	printf("= true\n");

	return true;
}

bool char_exists_in_array(char arr[], int array_length, char c, int exclude_index)
{
	for (int i = 0; i < array_length; i++)
	{
		if (i != exclude_index && arr[i] != EMPTY_ARRAY_MARK)
		{
			if (arr[i] == c)
			{
				return true;
			}
		}
	}

	return false;
}