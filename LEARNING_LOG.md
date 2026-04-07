# What HTML structure did you choose? 
The HTML structure is mostly non-semantic, because I wanted to use div containers. It has some semantic elements such as <h1> and <p>, but does not use <header> or <main>. The first parts of my HTML are for the welcome screen and following main application view. Because my original python script had a welcoming introduction before starting a wheel, it made sense for this application to do the same. The welcome screen is simple, and only contains a head, paragraph, and button that leads to the main screen. 

# What was your first piece of JavaScript? 
The first piece of javascript created was the color script and the first function, which allows users to see the wheel before anything is added. It includes there being no options inputted yet, spin count of 0, and sets max spins at 10. This also works with later script that resets the wheel back to this state. The color script at the beginning sets the colors for each segment of the wheel that is created as options are added. 

The first interaction beneath these initial sections of code is the function startApplication(), which is linked to the Start Creating button in the HTML file, and hides the welcome screen to show the main application screen. It also calls resizeCanvas() to widen the space available for user interaction and calls refreshUI() to clear any past inputs from the wheel.

# If AI generated it, what did you have to understand to make it work with your HTML?
AI helped generate my code, and to make it work with my HTML I had to understand that certain HTML elements, like addOption() and spinWheel() would rely on Javascript elements, such as COLORS and createInitialState(). 

It also helped with my first interaction, startApplication(), for which I had to understand is only possible through the creation and use of the HTML button and onclick ability. 