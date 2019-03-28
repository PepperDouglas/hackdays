let menuMain = document.querySelector('.menu-main');
let incomeDiv = document.querySelector('.menu-income');
let expenseDiv = document.querySelector('.menu-expense');
let statsDiv = document.querySelector('.menu-stats');
let settingsDiv = document.querySelector('.menu-settings');
let incBtn = document.createElement('button');
let expBtn = document.createElement('button');
let statBtn = document.createElement('button');
let settBtn = document.createElement('button');
const reducer = (accumulator, currentValue) => accumulator + currentValue;
incBtn.onclick = incomeButton;
expBtn.onclick = expenseButton;
statBtn.onclick = statsButton;
settBtn.onclick = settingsButton;
incBtn.innerText = 'INCOME';
expBtn.innerText = 'EXPENSE';
statBtn.innerText = 'STATS';
settBtn.innerText = 'SETTINGS';

let masterObj = {
  income: [0, 0],
  expense: [0, 0, 0, 0]
}

let goalsObj = {
  goalSave: 0,
  maxBad: 0
}

incomeDiv.appendChild(incBtn);
expenseDiv.appendChild(expBtn);
statsDiv.appendChild(statBtn);
settingsDiv.appendChild(settBtn);

function addArray(arrayObject){
  let parsed = parseArray(arrayObject);
  return parsed.reduce(reducer);
}

function settingsButton(){
  let html = `
  <label for="savedes">- Desired saved % of total income -</label><br>
  <input type="text" id="savedes" name="savedes" required
  minlength="1" maxlength="3" size="10"><br>
  <label for="maxdes">- Desired maximum misspent -</label><br>
  <input type="text" id="maxdes" name="maxdes" required
  minlength="1" maxlength="6" size="10"><br>
  <button class="done" id="settfin" onclick="settFinish()">Set!</button>`;
  settingsDiv.innerHTML = html;
}
  
function incomeButton(){
  let p = document.createElement('p');
  p.innerText = 0;
  let select = 1;
  incomeDiv.innerHTML = createInputTable(select);
  incomeDiv.appendChild(p);
  let unchecked = document.getElementsByName('income');
  unchecked.forEach((n) => {
    n.addEventListener('change', function(){
      document.querySelector('p').innerHTML = 0;
    });
  })
}

function expenseButton(){
  let p = document.createElement('p');
  p.innerText = 0;
  let select = 2;
  expenseDiv.innerHTML = createInputTable(select);
  expenseDiv.appendChild(p);
  let unchecked = document.getElementsByName('expense');
  unchecked.forEach((n) => {
    n.addEventListener('change', function(){
      document.querySelector('p').innerHTML = 0;
    });
  })
}

function statsButton(){
  let master = JSON.parse(localStorage.getItem('master'));
  let goal = JSON.parse(localStorage.getItem('goals'));
  let net = addArray(master.income) - addArray(master.expense);
  let incPer = incomePercentage(master.income);
  let expPer = expensePercentage(master.expense);
  let totSav = savedSoFar(master.expense);
  let saToBa = savedToBadRatio(master.expense);
  let rating = formulateGoal(master.income, master.expense, goal);
  let html = `<p>Left to spend:<br> ${net}</p>`
  html += `<p>Income sources:<br> ${incPer}</p>`
  html += `<p>Expense spread:<br> ${expPer}</p>`
  html += `<p>Saved so far:<br> ${totSav}</p>`
  html += `<p>Saved/Bad expense ratio:<br> ${saToBa}</p>`
  html += `<p>Your goals followed:<br>Score: ${rating}</p>`
  html += `<button class="done" id="statfin" onclick="statFinish()">Ok!</button>`;
  statsDiv.innerHTML = html;
}

function createInputTable(select){
  let html = `<button class="adder" id="10" onclick="increaseBtn(this.id, ${select})">10</button>`;
  html += `<button class="adder" id="50" onclick="increaseBtn(this.id, ${select})">50</button>`;
  html += `<button class="adder" id="100" onclick="increaseBtn(this.id, ${select})">100</button>`;
  html += `<button class="adder" id="500" onclick="increaseBtn(this.id, ${select})">500</button>`;
  html += `<button class="adder" id="1000" onclick="increaseBtn(this.id, ${select})">1000</button>`;
  html += `<button class="adder" id="5000" onclick="increaseBtn(this.id, ${select})">5000</button>`;
  html += createRadio(select);
  html += `<br><button class="done" id="doneBtn" onclick="finishInput()">Finished!</button>`;
  return html;
}

function createRadio(select){
  let html = ''; 
  if (select === 1){
    html += `<br><input type="radio" name="income" id="salary">Salary`;
    html += `<input type="radio" name="income" id="dividend">Dividend`;
  } else {
    html += `<br><input type="radio" name="expense" id="bad">Bad`;
    html += `<input type="radio" name="expense" id="food">Food`;
    html += `<input type="radio" name="expense" id="bills">Bill`;
    html += `<input type="radio" name="expense" id="savings">Savings`;
  }
  return html;
}

function increaseBtn(id, select){
  let selector;
  let radioSelector;
  if (select === 1){
  selector = '.menu-income p';
  } else {
  selector = '.menu-expense p';
  }
  let count = document.querySelector(selector).innerText;
  let ap = document.querySelector(selector);
  count = parseInt(count);
  count += parseInt(id);
  ap.innerText = count;
  
  radioSelector = radioChecker(select);
  if (select === 1){
    masterObj.income[radioSelector] = ap.innerText;
  } else {
    masterObj.expense[radioSelector] = ap.innerText;
  }
}

function radioChecker(activeDiv){
  if (activeDiv === 1){
    let allButtons = document.getElementsByName('income'); //TESTING
    for (let i = 0; i < allButtons.length; i++){
      if (allButtons[i].checked === true){
        return i;
      }
    }
  } else {
    let allButtons = document.getElementsByName('expense');
    for (let i = 0; i < allButtons.length; i++){
      if (allButtons[i].checked === true){
        return i;
      }
    }
  }
}

function finishInput(){
  localStorage.setItem('master', JSON.stringify(masterObj));
  incomeDiv.innerHTML = '';
  expenseDiv.innerHTML = '';
  incomeDiv.appendChild(incBtn);
  expenseDiv.appendChild(expBtn);
}

function statFinish(){
  statsDiv.innerHTML = '';
  statsDiv.appendChild(statBtn);
}

function settFinish(){
  let input1 = document.querySelector('#savedes');
  let input2 = document.querySelector('#maxdes');
  goalsObj.goalSave = input1.value;
  goalsObj.maxBad = input2.value;
  localStorage.setItem('goals', JSON.stringify(goalsObj));
  settingsDiv.innerHTML = '';
  settingsDiv.appendChild(settBtn);
}

//--------MATH
function incomePercentage(arrayObject){
  let parsed = parseArray(arrayObject);
  let total = addArray(arrayObject);
  let salPer = (parsed[0]/total*100).toFixed(1);
  let divPer = (100 - salPer).toFixed(1);
  return `${salPer}% salary, ${divPer}% dividends`;
}

function expensePercentage(arrayObject){
  let parsed = parseArray(arrayObject);
  let total = addArray(arrayObject);
  let badPer = (parsed[0]/total*100).toFixed(1);
  let foodPer = (parsed[1]/total*100).toFixed(1);
  let billsPer = (parsed[2]/total*100).toFixed(1);
  let savings = (100 -badPer -foodPer -billsPer).toFixed(1);
  return `${badPer}% bad, ${foodPer}% food, ${billsPer}% bills, ${savings}% to savings`;
}

function savedSoFar(arrayObject){
  let parsed = parseArray(arrayObject);
  return `${parsed[3]}`;
}

function savedToBadRatio(arrayObject){
  let parsed = parseArray(arrayObject);
  let ratio = (parsed[3]/parsed[0]).toFixed(2);
  return `${ratio} (higher is better)`;
}

function formulateGoal(income, expense, goal){
  let exp = parseArray(expense);
  let badRate = goal.maxBad/exp[0];
  let savedRate = (exp[3]/addArray(income))*100/goal.goalSave;
  let sumRate = (badRate * savedRate).toFixed(1);

  let finalRate = '';
  switch(true) {
    case sumRate > 1.8:
    finalRate = 'S, superb!';
      break;
    case sumRate > 1.2:
    finalRate = 'A, good!';
      break;
    case sumRate > 0.8:
    finalRate = 'B, keep it up!';
      break;
    case sumRate > 0.4:
    finalRate = 'C, do better!';
      break;
    default:
    finalRate = 'D, miserable!';
  } 
  return finalRate;
}

function parseArray(arrayObject){
  let parsed = [];
  arrayObject.forEach((n) => {
    parsed.push(parseInt(n));
  });
  return parsed;
}
  







