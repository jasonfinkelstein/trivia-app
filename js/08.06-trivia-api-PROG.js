// Lesson 08.06 Trivia Quiz API - FINAL

let url = 'https://opentdb.com/api.php?amount=1&category=9&type=multiple';

// OpenTDB
// Trivia API
// This is the url for 1 question, Any Category (simplest request possible -- 1 question chosen at random from some random category such as Film, Sports, History, etc.)
// https://opentdb.com/api.php?amount=1
// the above url returns a rand obj like:
// {"response_code":0,"results":[{"category":"Sports","type":"multiple","difficulty":"medium","question":"Who won the 2018 Monaco Grand Prix?","correct_answer":"Daniel Ricciardo","incorrect_answers":["Sebastian Vettel","Kimi Raikkonen","Lewis Hamilton"]}]}

// 1. Go to https://www.opentdb.com and click the API tab at the top of the home page

// 2. Use the select menus to customize your data request:
//    For Number of Questions, enter 1 
//    For Select Category, choose General Knowledge
//    For Select Type, choose Multiple Choice

// 3. At the bottom of the page, click GENERATE API URL.
//   Copy the generated API URL which will appear at the top of the page 
//   Come back here to your JS file and paste the URL (we'll come back for it later):
//   https://opentdb.com/api.php?amount=1&category=9&type=multiple

// DOM Elements required by JS for this application
// JS will be needing:

// Get the DOM elements: 

// 4. Get the select menu for choosing a category and have it call the fetchTriviaQuestions function
const categoryMenu = document.querySelector('#category-menu');

// 5. Get the score box, which is a div and the h3 that holds the question
const scoreBox = document.querySelector('#score-box');
const questionHeading = document.querySelector('#question-heading');

// 6. get all 4 answer choice buttons at once w querySelectorAll
// this returns a NodeList of all 4 answer choice buttons
const answerButtons = document.querySelectorAll('.answer-choice-btn');
answerButtons.forEach((button) => button.addEventListener('click', evaluateChoice));

// 7. Get the button for fetching a question and have it call the fetchTriviaQuestions function
const getTriviaBtn = document.querySelector('#get-trivia-btn');

getTriviaBtn.addEventListener('click', getTrivia);




let radioBtns = document.querySelectorAll('.radio-btn');
console.log(radioBtns);
const selectedRadioBtn = [...radioBtns].find(radBtn => radBtn.checked);
radioBtns.forEach((button) => button.addEventListener('click', () => getTrivia))





url = `https://opentdb.com/api.php?amount=1&category=${categoryMenu.value}&difficulty=${selectedRadioBtn.value}`;


// if (selectedRadioBtn.value === 'easy') {
//     url = `https://opentdb.com/api.php?amount=1&category=${categoryMenu.value}&difficulty=easy&type=multiple`;
// } else if (selectedRadioBtn.value === 'medium') {
//     url = `https://opentdb.com/api.php?amount=1&category=${categoryMenu.value}&difficulty=medium&type=multiple`;
// } else if (selectedRadioBtn.value === 'hard') {
//     url = `https://opentdb.com/api.php?amount=1&category=${categoryMenu.value}&difficulty=hard&type=multiple`;
// } else {
//     url = `https://opentdb.com/api.php?amount=1&category=${categoryMenu.value}&type=multiple`
// }


getTrivia();


function getTrivia() {
    answerButtons.forEach((button) => button.addEventListener('click', evaluateChoice));

    const selectedRadioBtn = [...radioBtns].find(radBtn => radBtn.checked);



    fetch(`https://opentdb.com/api.php?amount=1&category=${categoryMenu.value}&difficulty=${selectedRadioBtn.value}`)
        .then ((res) => res.json())
        .then ((data) => {
            console.log(data.results[0]);
            const question = data.results[0].question;
            const incorrectAnswers = data.results[0].incorrect_answers.map((answer) => {
                return {
                    text: answer,
                    isCorrect: false,
                }
            })

            const correctAnswer = {
                text: data.results[0].correct_answer,
                isCorrect: true,
            }

            questionHeading.innerHTML = question;
            choices = [...incorrectAnswers, correctAnswer];


            if (data.results[0].type === 'multiple') {
                // Shuffle the choices according to the Fisher-Yates Shuffle Algorithm
                choices.forEach((choice, i) => {
                    let temp = choice;
                    let r = ~~(Math.random() * choices.length);
                    choices[i] = choices[r];
                    choices[r] = temp;
                })

                answerButtons.forEach((button, i) => {
                    // put as textContent the button's ID + a choice
                    button.innerHTML = `${button.id}. ${choices[i].text}`;
                    button.style.display = 'block';
                    button.classList.remove('right-answer', 'wrong-answer');
                    // button.classList.remove('wrong-answer');
                });
            } else {
                answerButtons.forEach((button, i) => {
                    button.classList.remove('right-answer', 'wrong-answer');
                    if (i == 0) {
// ************* NEED TO MAKE TRUE/FALSE WORK PROPERLY ************
// ****************** TRUE/FALSE SHOULD ALWAYS BE IN THE SAME PLACE BUT NEEDS TO CORRESPOND WITH THE CORRECT ANSWER *************
                        button.innerHTML = choices[0].text;
                        button.style.display = 'block';
                    } else if (i == 1) {
                        button.innerHTML = choices[1].text;
                        button.style.display = 'block';
                    } else {
                        button.innerHTML = '';
                        button.style.display = 'none';
                    }
                })


                // answerButtons[0].innerHTML = 'True';
                // answerButtons[1].innerHTML = 'False';
                // answerButtons[2].innerHTML = '';
                // answerButtons[3].innerHTML = '';
                
                console.log(categoryMenu.value)

            }
        })
}

function evaluateChoice (event) {
    // find which button was pressed
    const button = event.target;
    
    tries++;

    // figure out if it was the correct answer
    if (choices[button.id - 1].isCorrect) {
        button.classList.add('right-answer');
        score++;
        button.removeEventListener('click', evaluateChoice);
        setTimeout(() => {
            button.textContent = 'Correct!'
        }, 500);

        setTimeout(() => { // will get a new question after 4 sec
            getTrivia();
        }, 4500);
    } else {
        button.classList.add('wrong-answer');
        button.removeEventListener('click', evaluateChoice);
        button.textContent = 'Incorrect!'

    }
    
    average = Math.round((score / tries)*100) + '%';

    scoreBox.innerHTML = `Tries: ${tries} &nbsp; &nbsp; &nbsp; 
            Score: ${score} &nbsp; &nbsp; &nbsp; 
            Avg: ${average}`

}




// 7B. Get the 3 radio buttons for difficulty level (Easy, Medium, Hard):
// moved above functions
// const radioBtns = document.querySelectorAll('.radio-btn');

// const radioButtonAny = document.querySelector('#any');
// const radioButtonEasy = document.querySelector('#easy');
// const radioButtonMed = document.querySelector('#medium');
// const radioButtonHard = document.querySelector('#hard');


// 7C. Find radio btn w checked property (rather than explicitly loop 'em):
// find() is an array method which returns the first item matching condition
// moved above functions
// const selectedRadioBtn = radioBtns.filter(radBtn => radBtn.checked);


// runs every time radio button is changed, and sets difficulty



// Global Variables
//  the correct answer is required by two functions, and as such must be in the global scope
// fetchTriviaQuestions() fetches a question, which includes the correct answer
// evalAnswerChoice() compares the user's choice to the correct answer

// 8.  Declare variables for score, tries and average (avg = score / tries)
let score = 0;
let tries = 0;
let average = 0;

// And for the choices array.
let choices = [];

// 9. loop the array of 4 answer choice buttons, assigning each a listener that calls evalAnswerChoice function when the button is clicked; this requires that we immediately decalare the function

// 10. test the function and the id's of the buttons, which are letters A-D; make the buttons visible by turning off display: none in the .answer-choice-btn clss in the .css file

// 11. Since we mention evalAnswerChoice and fetchTriviaQuestions in the listeners, we need to immediately declare these functions; have each function log the id of the button that called it:

    // 12. Clear away the previous question:

    // 13. Call the fetch() method, passing it the API URL as its first argument
    // 14. we don't want the same category every time, so concatenate the value of the category menu as the number
    // 15. Add the second argument to the fetch method, the object: {method: "GET"}
    
    // Don't end fetch() with a semi-colon, because we need to chain on TWO then() methods
    // fetch() returns the question data in JSON format (with double quotes around all the keys). We need to parse this stringified version of the data to get a usable object

    // 16. Write the first then(), which takes a callback function as its argument; the callback takes the JSON data as its argument

    // 17. Write the second then(); its callback takes the object as its argument. We now have access to all the properties of the object provided by the API.

        // 18. Log the object to the console to see its structure:

        //    We want: the question, correct_answer and incorrect_answers properties
        //    incorrect_answers is an array, since there are 3 incorrect answer choices
        //    question and correct_answer are strings
        //    these properties are children of results, the value of which is an array
        // Let's make variables to hold these values:

        // 19. output the question

        // displaying answer choices: the incorrect answers and the corret answer are separate variables: an array and a string, respectively. We need to combine them into one array of 4 choices:
        
        // 20. make an array of all choices by passing the array of incorrect answers as well as the correctAnswer string to the new array; use the spread operator (...) to break down the incorrect_answers array into individual items
        
        // 21. put an &nbsp; (non-breaking space at the end) of the correct as an "invisible tag" by which we can identify it

        // 22. The correct answer is the last of the 4 items in the allChoices array, so randomize the items so that the correct choice is not always choice "D"

        // 22B. Shuffle a second time for good measure, 
        //      using Fisher-Yates Shuffle algo:
        
        // 23. Log the array of all 4 answer choices, followed by the correct answer

        // 25. loop the array of 4 buttons and assign them their answer choices from the allChoices arr
        
            // 26. Start each choice with a letter, which is the id of the current button; this is followed by a dot then space &nbsp; space, then the answer choices from allChoices arr:
            // 27. Add the choice text to the answer choice button
            
            // 28. Make the answer choice buttons normal color
            
            // 29. make the button visible (and turn on display:none in the css for the .answer-choice-btn class)


// evalAnswerChoice() runs when the user clicks any one of the 4 answer choice buttons

// 30. Declare the evalAnswerChoice() function:

    // 31. Each choice requires tries variable to be incremented


        // 33. if the answer is correct, make the button green w white text
        
        // 34. Increment the score for a correct answer
        
        // 35. Else, the answer is incorrect, so make the button red w white text

    // 36. Right or wrong, the choice text becomes white, due to the new bg color:

    // 37. Recalculate the average and round it to 3 decimal places:

    // 37. Output the updated score

// END: Lesson 08.06