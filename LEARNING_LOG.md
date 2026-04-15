## ITERATION 1:

# What HTML structure did you choose? 
The HTML structure is mostly non-semantic, because I wanted to use div containers. It has some semantic elements such as <h1> and <p>, but does not use <header> or <main>. The first parts of my HTML are for the welcome screen and following main application view. Because my original python script had a welcoming introduction before starting a wheel, it made sense for this application to do the same. The welcome screen is simple, and only contains a head, paragraph, and button that leads to the main screen. 

# What was your first piece of JavaScript? 
The first piece of javascript created was the color script and the first function, which allows users to see the wheel before anything is added. It includes there being no options inputted yet, spin count of 0, and sets max spins at 10. This also works with later script that resets the wheel back to this state. The color script at the beginning sets the colors for each segment of the wheel that is created as options are added. 

The first interaction beneath these initial sections of code is the function startApplication(), which is linked to the Start Creating button in the HTML file, and hides the welcome screen to show the main application screen. It also calls resizeCanvas() to widen the space available for user interaction and calls refreshUI() to clear any past inputs from the wheel.

# If AI generated it, what did you have to understand to make it work with your HTML?
AI helped generate my code, and to make it work with my HTML I had to understand that certain HTML elements, like addOption() and spinWheel() would rely on Javascript elements, such as COLORS and createInitialState(). 

It also helped with my first interaction, startApplication(), for which I had to understand is only possible through the creation and use of the HTML button and onclick ability. 


## ITERATION 2:

# What was the hardest interaction to implement? 
There are three interactions I consider to have been the most difficult to implement: 
1. function drawWheel(). This function helps create the wheel and all option slices. 'ctx.' was new to me, but be used to set drawing styles, draw shapes and text,  or save/restore/clear drawing states. Having so many 'ctx.' directions made this section of code longer than most other functions in the file. 
2. function animate(). This function allows the wheel to spin smoothly. It tracks the amount of time it spins for and slows the spinning before stopping. It also finds angles while rotating, and when it finishes spinning it shows the winning option, marks the wheel as not spinning, allows the spin button to be pressed again, and refreshes the wheel display. This function was difficult to implement because I did not understand the meaning of 'progress'. 'progress' helped decide how far the wheel should rotate and when to stop the animation.
3. function updateOptionsList(). This function rebuilds the list of options whenever options change, so the UI stays in sync with the data. I did not initially understand the 'list.innerHTML', which helps set the HTML content in the list. This part of the code, which was originally generated with AI, initally was structure with HTML within JS script. This allowed the visual HTML effects of the page to be directly affected by JS data, and used on click instead of addEventListener. I changed this from the original AI code because using addEventListener makes the code more difficult to break, and following the DOM through createElement rather than HTML script is cleaner and easier to read.

# What JavaScript concepts did you use (variables, functions, arrays, conditionals, DOM methods)? 
- Variables: to store wheel state, options, rotation, and spin count.
- Functions: to organize actions like adding options, drawing the wheel, spinning, and updating the screen.
- Arrays: to keep colors and option items.
- Conditionals: to check things like empty input, max spins, and whether spinning is allowed.
- DOM methods: to get page elements, change text/HTML, show/hide sections, and handle button clicks/events.

# What bugs did you find and fix?
Input validation bugs were avoided by disallowing empty entries and the reserved word “done.” Spin-state bugs were avoided by preventing spins when the wheel is already spinning, has no options, or reached max spins. Similarly, repeated-click issues were stopped by disabling the spin button during animation and re-enabling it again after Finally, display issues were prevented by resizing and redrawing the wheel on page load and window resize.


## ITERATION 3:

# What feedback did you get?
I got positive feedback from two classmates. They stated that the app was pretty stright forward, and that it was easy to understand how to use it and in what situations they would want to use it. They also liked the colors of the wheel, the visual spinning effect, and the option to remove items or leave them in the wheel.

# What edge cases did you handle?
One edge case that was tested is rapid clicking of all buttons; they do not break when spammed and only accomplish their one task. Another case is empty text being added as an item. This results in the message "Input cannot be empty. Please enter something." Additionally, the "Spin the Wheel" button can't be clicked if the wheel is already spinning, to prevent user and program confusion, and if the wheel reaches it's max of 10 spins, "Maximum spins (10) reached! Reset to spin again." appears.

# What would you add with more time?
With more time, I would want to make the overall color theme more cohesive and change the visual layout of the page. I would also experiment with adding more animations or sound effects to the page for a more engaging app experience. I would also enhance functionality by allowing users to customize the wheel further. They would be able to assign colors to options, and have the ability to save and reload wheels. 