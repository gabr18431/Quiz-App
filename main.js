let countSpan = document.querySelector('.quiz-info .count span');
let bullets = document.querySelector('.bullets');
let bulletsSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.submit-button');
let resultsContainer = document.querySelector('.results');
let countdownDiv = document.querySelector('.countdown');
let categoryDom = document.querySelector('#category');
let nQuestions = document.querySelector('#nQuestions');
let difficultyDom = [
    document.querySelector('#easy'),
    document.querySelector('#medium'),
    document.querySelector('#hard')
];
let url;
let startBtn = document.querySelector('#startBtn');

// set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

startBtn.onclick = function () {
    let URL = setURL()
    getQuestions(URL)
    document.querySelector('.settings').style.display = 'none'
    document.querySelector('.show-app').style.display = 'block'
}
function setURL() {
    const amount = getAmount();
    const categoryId = categoryDom.value;
    const difficulty = getDifficulty();
    url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`;
    return url;
}
// get amount
function getAmount() {
    const amount = nQuestions.value;
    if (amount > 0) {
        return amount;
    } else {
        alert('Please enter number of questions')
    }
}
// get difficulty 
function getDifficulty() {
    const difficulty = difficultyDom.filter((e) => e.checked)
    if (difficulty.length === 1) {
        return difficulty[0].id
    } else {
        alert('Please select a difficulty')
    }
}
// get questions function
function getQuestions(url) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText).results;
            let qCount = questionsObject.length;
            console.log(questionsObject[0]);
            // create bullets and set questions count
            createBullets(qCount);
            // add questions data
            addQuestionsData(questionsObject[currentIndex], qCount)
            // start countdown 
            countdown(10,qCount)
            submitButton.onclick = () => {
                let theRightAnswer = questionsObject[currentIndex].correct_answer;
                checkAnswer(theRightAnswer, qCount)
                currentIndex++;
                quizArea.innerHTML = ''
                answersArea.innerHTML = ''
                addQuestionsData(questionsObject[currentIndex], qCount)
                // console.log(theRightAnswer);
                handelBullets()
                clearInterval(countdownInterval)
                countdown(10,qCount)
                showResults(qCount)
            }
        }
    }
    request.open('GET',url,true);
    request.send();
}


function createBullets(num){
    countSpan.innerHTML = num;
    for (var i = 0; i < num; i++) {
        let theBullet = document.createElement('span');
        // check if the bullet first children
        if (i == 0) {
            theBullet.className = 'on'
        }
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionsData(obj,count) {
    if (currentIndex < count) {
        // create the question
        let questionElement = document.createElement('h2')
        let questionText = document.createTextNode(obj.question)
        questionElement.appendChild(questionText)
        quizArea.appendChild(questionElement)
        // create the Answers 
        for (let i = 0; i < 3; i++) {
            answersArea.innerHTML += `
                <div class="answer">
                    <input type="radio" name="question" id="answer_${i}" data-answer="${obj.incorrect_answers[i]}">
                    <label for="answer_${i}">${obj.incorrect_answers[i]}</label>
                </div>`
        }
        answersArea.innerHTML += `<div class="answer">
                <input type="radio" name="question" id="answer_4" data-answer="${obj.correct_answer}">
                <label for="answer_4">${obj.correct_answer}</label>
            </div>`
        }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName('question')
    let theChosenAnswer;
    answers.forEach((answer) => {
        if (answer.checked) {
            theChosenAnswer = answer.dataset.answer;
        }
    })

    if (theChosenAnswer === rAnswer) {
        rightAnswers++;
    }
}

function handelBullets() {
    let bulletsSpans = document.querySelectorAll('.bullets .spans span');
    bulletsSpans.forEach((bullet, index) => {
        if (index === currentIndex) {
            bullet.className = 'on';
        }
    })
}
function showResults(count) {
    let theResults = `<span class="bad">Bad</span> , ${rightAnswers} From ${count} .` ;
    if (count === currentIndex) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="good">Good</span> , ${rightAnswers} From ${count} Is Good.`
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span> , All Answers  Is Right.`
        } else {
            `<span class="bad">Bad</span> , ${rightAnswers} From ${count} .`
        }
        resultsContainer.innerHTML = theResults;
        
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function() {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdownDiv.innerHTML = `${minutes} : ${seconds}`;
            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        },1000)
    }
}