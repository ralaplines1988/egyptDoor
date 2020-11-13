//Star animation's configuration
(function () {
   const starList = document.querySelectorAll('.star-container>.fa-star');
   // console.log(starList);

   //generates random numbers and put them into element's style, vary the duration.
   for (let i = 0; i < starList.length; i++) {
      let randomNumber = Math.floor(Math.random() * 50);
      //    console.log(randomNumber);
      starList[i].style.top = `${randomNumber}px`;
      starList[i].style.fontSize = `${Math.max(25, randomNumber)}px`;
      randomNumber = Math.floor(Math.random() * 6);
      starList[i].style.animationDuration = `${Math.max(3, randomNumber)}s`;
   }
})();

//the tip
let theSecret = '';
(function () {
   //Game configuration
   let itemNum = 0;
   // if false, can't open casement
   let playStage = false;
   let tipChance = 0

   //if true, click the start btn would restart the game.
   let gameOver = false;

   //elements list
   const casementsContainer = document.querySelector('.casement-container');
   const difficulty = document.querySelector('#difficulty');
   const startBtn = document.querySelector('#startButton');
   const scarab = document.querySelector('.right-god');
   const catTip = document.querySelector('.remainder-cat');
   //console.log(startBtn);

   //define cardFace would be used in game.
   const cardFace = [];
   cardFace.push('images/maleCat.png');
   cardFace.push('images/femaleCat.png');
   cardFace.push('images/anubis.png');

   // console.log(cardFace);
   // const maleCat = 'images/maleCat.png';
   // const femaleCat = 'images/femaleCat.png';
   // const anubis = 'images/anubis.png';
   const closedcasementURL = 'images/casement.png';

   function startGame() {
      //if game over, init the game
      if (gameOver) {
         initGame();
         gameOver = false;
         //else start the game but not init it
      } else if (!playStage) {
         playStage = true;
         startBtn.textContent = `Let's go!`;
      };
   }

   //a random helper function
   function randomNumber() {
      return Math.floor(Math.random() * 3)
   }

   //define init game function content
   function initGame() {
      playStage = false;
      startBtn.textContent = `Ready to Start!`;

      //check mode
      hardMode = difficulty.checked ? true : false;
      if (hardMode) {
         tipChance = 1;
         itemNum = 9 ;
      } else {
         itemNum = 3;
      }

      // generate html elements
      // clear casement container innerHTML 
      casementsContainer.innerHTML = '';

      for (let i = 1; i <= itemNum; i++) {
         const casementBox = document.createElement('div');
         casementBox.className = "casement";
         const imgBox = document.createElement('img');
         // imgBox.className = `test${i}`;
         casementBox.append(imgBox)
         // console.log(casementBox);
         casementsContainer.append(casementBox);
      }

      //get nodeList
      const casements = document.querySelectorAll('.casement>img');

      const casement = {};
      casement.casementList = [];
      casement.openedCasement = [];


      //store them in some place for late use
      for (let i = 0; i < casements.length; i++) {
         casements[i].src = closedcasementURL;
         casement.casementList.push(casements[i]);
         casement.openedCasement.push(undefined);
      }

      //define shuffle function
      function shuffleCasement() {
         for (let i = 0; i < casements.length; i++) {
            casement.openedCasement[i] = cardFace[randomNumber()];
         }
         // console.log(casement.openedCasement);
         // make sure there is at least one anubis
         let hasAnubis = casement.openedCasement.some((ele) => {
            return ele === 'images/anubis.png';
         })

         if (!hasAnubis) {
            // console.log(`reshuffle`);
            shuffleCasement();
         }
         let anubisCount = 0;
         for (let i = 0; i < casement.openedCasement.length; i++) {
            if (casement.openedCasement[i] === cardFace[2]) {
               anubisCount += 1;
            };
         }
         // Make sure that the amount of Anubis wouldn't be more than half of the total element num.
         if (anubisCount > Math.floor(casement.openedCasement.length / 2)) {
            // console.log(`too much Anubis,reshuffle!`);
            shuffleCasement();
         };
         anubisCount = 0;
         //to solve the recursive problem, for define remainder cat num
         for (let i = 0; i < casement.openedCasement.length; i++) {
            if (casement.openedCasement[i] === cardFace[2]) {
               anubisCount += 1;
            };
         }
         // console.log(casement.openedCasement);
         return anubisCount;
      }

      //little tip
      theSecret = casement.openedCasement;

      //for the first time display
      const anubisCount = shuffleCasement();
      console.log(`There are ${anubisCount} Anubis!`);
      let remainderCat = itemNum - anubisCount;
      catTip.textContent = `剩餘的貓咪 : ${remainderCat}`

      //use regex to check corresponding src
      const checkAnubis = /anubis/;
      const checkClosed = /casement/;

      function trueMirror() {
         if (tipChance > 0) {
            const anubisLocal = [];
            casement.openedCasement.forEach((ele, idx) => {
               if (checkAnubis.test(ele)) {
                  anubisLocal.push(idx);
               }
            })
            for (let i = 0; i < anubisLocal.length; i++) {
               casements[anubisLocal[i]].parentElement.classList.add('trueMirror');
            }
            setTimeout(function () {
               for (let i = 0; i < anubisLocal.length; i++) {
                  casements[anubisLocal[i]].parentElement.classList.remove('trueMirror');
               }
            }, 2000)
            tipChance-=1;
         } else {
            console.log(`Sorry, your luck's just gone.`)
         }
         console.log(tipChance);
      };

      //check function
      function whoIsBehide(casement, searchStr) {
         const checkText = searchStr;
         const checkResult = checkText.test(casement.src);
         if (checkResult) {
            return true;
         }
      }

      //add funciton to every casement, and use for to give corresponding src
      for (let i = 0; i < casements.length; i++) {
         casements[i].addEventListener('click', function () {
            //if the playstage true, allow casement opened.
            if (playStage && whoIsBehide(this, checkClosed)) {
               console.log(`casement opened!`)
               this.src = casement.openedCasement[i];
            };
            if (!playStage) {
               return;
            } else if (whoIsBehide(this, checkAnubis)) {
               this.classList.add('trueMirror');
               playStage = false;
               gameOver = true;
               startBtn.textContent = `You lose!`;
               for (let i = 0; i < casements.length; i++) {
                  casements[i].src = casement.openedCasement[i];
               }
               console.log(`Game over!`);
            } else if (playStage) {
               remainderCat -= 1;
               catTip.textContent = `剩餘的貓咪 : ${remainderCat}`
               if (remainderCat === 0) {
                  playStage = false;
                  gameOver = true;
                  startBtn.textContent = `congratulation`;
                  for (let i = 0; i < casements.length; i++) {
                     casements[i].src = casement.openedCasement[i];
                  }
                  console.log(`You won!`)
               }
            };
         })
      }
      scarab.onclick = trueMirror;
   }

   initGame();

   difficulty.addEventListener('change', initGame);
   startBtn.addEventListener('click', startGame);
})()