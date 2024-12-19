// Lesson 08.06 Trivia Quiz API - FINAL

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
categoryMenu.addEventListener('change', fetchTriviaQuestions);

// 5. Get the score box, which is a div and the h3 that holds the question
const scoreBox = document.querySelector('#score-box');
const questionH3 = document.querySelector('#question-box h3');

// 6. get all 4 answer choice buttons at once w querySelectorAll
// this returns a Node List of all 4 answer choice buttons
const answerChoiceBtns = document.querySelectorAll('.answer-choice-btn');

// 7. Get the button for fetching a question and have it call the fetchTriviaQuestions function
const getTriviaBtn = document.querySelector('#get-trivia-btn');
getTriviaBtn.addEventListener('click', fetchTriviaQuestions);

// 7B. Get the 3 radio buttons for difficulty level (Easy, Medium, Hard):
const radioBtns = document.querySelectorAll('.radio-btn');

// 7C. Find radio btn w checked property (rather than explicitly loop 'em):
// find() is an array method which returns the first item matching condition
// const selectedRadioBtn = radioBtns.filter(radBtn => radBtn.checked);
let difficulty = '';
for(radBtn of radioBtns) {
    radBtn.addEventListener('change', setDifficultyLevel);
}

// runs every time radio button is changed, and sets difficulty
function setDifficultyLevel() {
    difficulty = this.value;
}

// Global Variables
//  the correct answer is required by two functions, and as such must be in the global scope
// fetchTriviaQuestions() fetches a question, which includes the correct answer
// evalAnswerChoice() compares the user's choice to the correct answer

// 8.  Declare variables for score, tries and average (avg = score / tries)
let score = 0;
let tries = 0;
let avg = 0;

// And for the choices array.

let allChoices = [];

// 9. loop the array of 4 answer choice buttons, assigning each a listener that calls evalAnswerChoice function when the button is clicked; this requires that we immediately decalare the function
for(let i = 0; i < answerChoiceBtns.length; i++) {
    answerChoiceBtns[i].addEventListener('click', evalAnswerChoice);
}


// 10. test the function and the id's of the buttons, which are letters A-D; make the buttons visible by turning off display: none in the .answer-choice-btn clss in the .css file

// 11. Since we mention evalAnswerChoice and fetchTriviaQuestions in the listeners, we need to immediately declare these functions; have each function log the id of the button that called it:
function fetchTriviaQuestions() {
    // 12. Clear away the previous question:
    questionH3.innerHTML = "";

    // 13. Call the fetch() method, passing it the API URL as its first argument
    // 14. we don't want the same category every time, so concatenate the value of the category menu as the number
    // 15. Add the second argument to the fetch method, the object: {method: "GET"}
    fetch(`https://opentdb.com/api.php?amount=1&category=9&type=multiple&difficulty=${difficulty}` /*`https://opentdb.com/api.php?amount=1&category=${categoryMenu.value}&type=multiple&difficulty=${difficulty}`*/)
    
    // Don't end fetch() with a semi-colon, because we need to chain on TWO then() methods
    // fetch() returns the question data in JSON format (with double quotes around all the keys). We need to parse this stringified version of the data to get a usable object

    // 16. Write the first then(), which takes a callback function as its argument; the callback takes the JSON data as its argument
    .then((jsonData) => jsonData.json())

    // 17. Write the second then(); its callback takes the object as its argument. We now have access to all the properties of the object provided by the API.
    .then((data) => {
        // 18. Log the object to the console to see its structure:
        console.log(data);

        //    We want: the question, correct_answer and incorrect_answers properties
        //    incorrect_answers is an array, since there are 3 incorrect answer choices
        //    question and correct_answer are strings
        //    these properties are children of results, the value of which is an array
        // Let's make variables to hold these values:
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

        // 19. output the question
        questionH3.innerHTML = `<span style="color:gray">Level: ${difficulty}</span><br>${question}`;

        // displaying answer choices: the incorrect answers and the corret answer are separate variables: an array and a string, respectively. We need to combine them into one array of 4 choices:
        
        // 20. make an array of all choices by passing the array of incorrect answers as well as the correctAnswer string to the new array; use the spread operator (...) to break down the incorrect_answers array into individual items
        allChoices = [...incorrectAnswers, correctAnswer];
        // 21. put an &nbsp; (non-breaking space at the end) of the correct as an "invisible tag" by which we can identify it

        // 22. The correct answer is the last of the 4 items in the allChoices array, so randomize the items so that the correct choice is not always choice "D"
        allChoices.sort(() => Math.random() - 0.5);

        // 22B. Shuffle a second time for good measure, 
        //      using Fisher-Yates Shuffle algo:
        for(let i = 0; i < allChoices.length; i++) {
            let currentItemCopy = allChoices[i];
            let r = Math.floor(Math.random() * allChoices.length); // 0-3
            // replace current item w random item
            allChoices[i] = allChoices[r];
            allChoices[r] = currentItemCopy;
        }
        
        // 23. Log the array of all 4 answer choices, followed by the correct answer
        console.log(allChoices, correctAnswer);

        // 25. loop the array of 4 buttons and assign them their answer choices from the allChoices arr
        for(let i = 0; i < answerChoiceBtns.length; i++) {
            // 26. Start each choice with a letter, which is the id of the current button; this is followed by a dot then space &nbsp; space, then the answer choices from allChoices arr:
            // 27. Add the choice text to the answer choice button
            answerChoiceBtns[i].innerHTML = `${answerChoiceBtns[i].id}. &nbsp; ${allChoices[i].text}`;
            // 28. Make the answer choice buttons normal color
            answerChoiceBtns[i].style.backgroundColor = "#eee";
            answerChoiceBtns[i].style.color = "#333";
            // 29. make the button visible (and turn on display:none in the css for the .answer-choice-btn class)
            answerChoiceBtns[i].style.display = "block";
        }

    }); // close fetch then then

} // close function fetchTriviaQuestions()


// evalAnswerChoice() runs when the user clicks any one of the 4 answer choice buttons

// 30. Declare the evalAnswerChoice() function:

function evalAnswerChoice() {
    // If it's the start of the game, there are no choices to evaluate.
    if (allChoices.length === 0) {
        return;
    }

    // 31. Each choice requires tries variable to be incremented
    tries++;

    if(allChoices[this.id - 1].isCorrect) {``
        // 33. if the answer is correct, make the button green w white text
        this.style.backgroundColor = "darkgreen";
        // 34. Increment the score for a correct answer
        score++;
    } else {
        // 35. Else, the answer is incorrect, so make the button red w white text
        this.style.backgroundColor = "darkred";
    }

    // 36. Right or wrong, the choice text becomes white, due to the new bg color:
    this.style.color = "#fff";

    // 37. Recalculate the average and round it to 3 decimal places:
    avg = score / tries;
    avg = avg.toFixed(3);

    // 37. Output the updated score
    scoreBox.innerHTML = `Tries: ${tries} &nbsp; &nbsp; &nbsp; Score: ${score} &nbsp; &nbsp; &nbsp; Avg: ${avg}`;

} // close function evalAnswerChoice()

// END: Lesson 08.06