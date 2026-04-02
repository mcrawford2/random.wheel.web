"""This is the Random Wheel Generator. This program allows you to create a wheel with various options and spin it to get random results. You can customize the wheel by adding your own options, and the program will randomly select one when you spin it."""

import random

def intro():
    """asks if user is ready to begin"""

    print("Are you ready to create your own wheel and spin it for random results? Say 'yes' to continue or 'no' to exit.")

    response = input().strip().lower()
    if response == 'no':
        print("Exiting the program. Goodbye!")
    elif response == 'yes':
        wheel()
    else:
        print("Invalid input. Please enter 'yes' or 'no'.")
        intro()

def wheel():
    """Creates the wheel and takes user input for options"""
    
    print("You can add an unlimited number of options to your wheel.")

    options = []
    while True:
        option = input("Enter option (or type 'done' to finish): ").strip().lower() #.strip() removes any leading or trailing whitespace from the input, and .lower() converts the input to lowercase for case-insensitive comparison.
        
        if option == "": #for empty input, prompt the user to enter something
            print("Input cannot be empty. Please enter something.")
            continue
        
        if option == 'done': #case sentitivity, converts the input to lowercase and checks if it is 'done' to exit the loop
            break

        options.append(option) #adds input to the options list

    if not options: #checks if the options list is empty, if it is, it prints a message and exits the program
        print("Exiting the program.")
        return

    print("\nYour wheel has the following options:")
    for idx, opt in enumerate(options, 1):
        print(f"{idx}. {opt}")
#idx is the index number starting at 1, opt is the option from the options list. This loop prints each option with its corresponding number.

    while True:
        manage = input("\nWould you like to remove an entry? Say 'yes' or 'no': ").strip().lower()
        if manage == 'yes':
            try:
                remove_num = int(input("Enter the number of the option to remove: "))
                if 1 <= remove_num <= len(options):
                    removed = options.pop(remove_num - 1)
                    print(f"Removed: {removed}")
                    print("\nYour updated wheel:")
                    for idx, opt in enumerate(options, 1):
                        print(f"{idx}. {opt}")
                else:
                    print("Invalid number. Please try again.")
            except ValueError:
                print("Please enter a valid number.")
        elif manage == 'no':
            break
        else:
            print("Invalid input. Please enter 'yes' or 'no'.")

    spin_wheel(options, 0)

def spin_wheel(options, spin_count=0):
    """Spins the wheel to select a random option, then delete that option from the list to be spun again without duplicates"""

    print("Are you ready to spin the wheel? Say 'yes' to spin or 'no' to restart your options.")

    if spin_count >= 10:
        print("You've reached the maximum of 10 spins! Would you like to create a new wheel? Say 'yes' to create a new wheel or 'no' to exit.")
        new_response = input().strip().lower()
        if new_response == 'yes':
            wheel()
        else:
            print("Exiting the program. Goodbye!")
        return
    
    response = input().strip().lower()
    if response == 'no':
        wheel()
    
    elif response == 'yes':

        if not options:  #checks if the options list is empty
            print("No more options left on the wheel! Would you like to create a new wheel? Say 'yes' to create a new wheel or 'no' to exit.")
            new_response = input().strip().lower()
            if new_response == 'yes':
                wheel()
            else:
                print("Exiting the program. Goodbye!")
            return

        print("Spinning the wheel...")
        print(f"Spin #{spin_count + 1}") #f treats curleybraces as placeholders for variables
        result = random.choice(options) #randomly selects an option from the options list
        print(f"The wheel landed on: {result}")
        options.remove(result) #removes the selected option from the options list
        final(options, spin_count + 1)

    else:
        print("Invalid input. Please enter 'yes' or 'no'.") 
        spin_wheel(options, spin_count)

def final(options, spin_count=0):
    """Asks if user wants to spin again or exit the program"""

    print("Would you like to spin again or create a new wheel? Say 'spin again' to spin again, 'new wheel' to create a new wheel, or 'no' to exit the program.")

    response = input().strip().lower()
    if response == 'no':
        print("Exiting the program. Goodbye!")  
    
    elif response == 'spin again':
        spin_wheel(options, spin_count)
    
    elif response == 'new wheel':
        wheel()

    else:
        print("Invalid input. Please enter 'spin again', 'new wheel', or 'no'.") 
        final(options, spin_count)

def main():
    """Entry point for the Random Wheel Generator"""
    print("Welcome to the Random Wheel Generator!")
    intro()

if __name__ == '__main__':
    main()
