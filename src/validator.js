class Validator {
  static validate(sudoku) {
    const validator = new Validator

    return validator.validate(sudoku)
  }

  validate(sudoku) {

    
    const sudokuArray = this.stringToArraySudoku(sudoku);
    const subgroups = this.subgroups(sudokuArray);
    const rows = this.rows(sudokuArray);
    const columns = this.columns(sudokuArray);
    
    if(this.subarrayValidator(subgroups, rows, columns)) {
      if (sudokuArray.indexOf(0) < 0){
      return 'Sudoku is valid.';
      }
      return 'Sudoku is valid but incomplete.';
    } 

    return 'Sudoku is invalid.';
  }
  /*
    Šeit stringToArraySudoku metode, kas pārvērš sudoku no string, kas ielasīts no faila, par ciparu masīvu.
  */
  stringToArraySudoku(stringSudoku) {
    let numArray = []; //numArray masīvā tiks uzglabāti iegūtie cipari
    
      for(let i = 0; i < stringSudoku.length; i++) {
        /* Iekš if statement tiek pārbaudīts, vai iespējams character pārvērst par integer. 
            Ja pārvēršana ir iespējama un netiek atgriezts NaN, tad pievienojam ciparu numArray masīvam.
        */
        if (!isNaN(parseInt(stringSudoku.charAt(i)))) {
          numArray.push(stringSudoku.charAt(i)*1) /* Ar *1 pārvēršu string par number formātu */
        }
      }
    return numArray //Tiek atgriezts ciparu masīvs ar 81 vienību
  }
  /* Ar subgroups metodi tiek sudoku ciparu masīvs sadalīts 3x3 kvadrātos  */
  subgroups(array) {
    
    let subgroup = []; //Saturēs deviņus ciparus, kas atbilst viena 3x3 ciparu skaitam.
    let subgroups = []; //Saturēs deviņus subgroup masīvus, kas atbilst deviņiem 3x3 laukiem.
    /* Nested loops, kas sadala sudoku ciparu masīvu 3x3 lauciņos. Laukam pievienoju iedomātas x un y
    asis, lai varētu matemātiski saprast, kā jāvieto pa subgroup vienkāršais ciparu masīvs, kas
    bija pārvērsts no string tipa.
    
  * x   0      1      2
  y
      8 5 9 |6 1 2 |4 3 7
  0   7 2 3 |8 5 4 |1 6 9
      1 6 4 |3 7 9 |5 2 8
      ------+------+------
      9 8 6 |1 4 7 |3 5 2
  1   3 7 5 |8 6 2 |9 1 4
      2 4 1 |5 9 3 |7 8 6
      ------+------+------
      4 3 2 |9 8 1 |6 7 5
  2   6 1 7 |4 2 5 |8 9 3
      5 9 8 |7 3 6 |2 4 1
   
    Attiecīgi pēc y skatos vertikālo asi, bet pēc x - horizontālo.
    Nepieciešams ir aprēķināt katra 3x3 lauka sākumpunktu. To var izdarīt ar sekojošo formulu:

      3*(x+9*y)

      Piemēram, ja vajag iegūt sākumpozīciju 3x3 laukam, kas ir pēc koordinātām (x=1; y=1), tad
      iegūstu, ka 3*(1+9*1) = 30. Tātad, nešķirotā ciparu masīva elements ar indeksu 30 atradīsies
      centra 3x3 laukumā un tas būs pirmais elements šajā laukumā. 

      Pēdējais elements iegūstams iekš 3x3 laukuma ir pieskaitot sākotnējam elementa indeksam skaitli 20.
    
    */
    for (let y = 0; y < 3; y++){
      for (let x = 0; x < 3; x++) {

        /* mainīgais z domāts, lai varētu iterēt caur viena 3x3 lauka elementiem. Sākumelementam z=0.
        Otrajam elementam z=1
        Ik pa trim subgroup masīvā ieliktiem elementiem z jāpieskaita 7 no iepriekšējās vērtības,
        lai pārlēktu uz nākamo rindu un iegūtu atlikušos attiecīgā 3x3 lauka elementus. */
        let z = 0; 

        while (z < 21) { //z < 21, lai kontrolētu, vai netiek cipari ņemti no blakus esošajiem 3x3 laukiem.
        
            if (z == 2 || z == 11) {
              subgroup.push(array[3*(x + 9*y) + z]);
              z += 7; //Pieskaitām 7, jo kad z == 2 vai z == 11, tad nepieciešams pārlēkt uz jaunu rindu.
              
            } else {
              subgroup.push(array[3*(x + 9*y) + z]);
              z++;
              
            }
          
        }
        subgroups.push(subgroup);
        subgroup = []; /* Pievienojot subgroup masīvu subgroups, jādzēš subgroup dati, 
          lai tajā varētu rakstīt iekšā nākamo 3x3 lauku.
        */
      }

   
    }
    /*subgroups masīvs beigās iegūst šādu veidolu:
    
    [
      [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9]
      ... vēl seši subgroup masīvi
    ]
    */
    return subgroups;
  }
  /* subarrayValidator pārbaudīs katru rindu, kolonnu vai subgroup.
  Izmantoju rest parameter, lai varētu uzreiz ielikt kolonnas, rindas un subgrupas. */
  subarrayValidator(...subgroups) {
    let isValid = true; 

  

    subgroups.forEach((subgroup) => {
     subgroup.forEach(subarray => {
      subarray.forEach((num, index2, array) => {
        /* Zemāk esošais if statement pārbauda, vai, piemēram, vai vienas rindas ietvaros
        ir elements, kurš atkārtojas. indexOf atrod pirmo indeksu. Ja cipars atkārtojas,
        tad index2 nesakritīs ar indexOf vērtību pie pirmās atkārtošanās reizes. 
        
        Tāpat arī tiek pieļauts gadījums, ka tukšie elementi jeb 0 var atkārtoties*/
        if (array.indexOf(num)!== index2 && num != 0) { 
          isValid = false;
          return isValid;
        }
      })
     })
    })

    return isValid;
  }

  /* Ar rows metodi tiek sakārtoti elementi pa rindām */
  rows(array) {
    let rows = [];
    let row = [];
    for(let i = 0; i < array.length; i++) {
      if(row.length == 9){
        rows.push(row);
        row = [];
        row.push(array[i]);
      } else {
        row.push(array[i]);
      }
    }
    /*rows masīvs beigās iegūst šādu veidolu:
    
    [
      [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9]
      ... vēl seši row masīvi
    ]
    */
    return rows;
  }

  columns(array) {
    let columns = [];
    let column = [];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < array.length; j+=9) { /* j tiek palielināts par 9, jo tik elementu starpā
      starp kolonnas elementiem
      */
        column.push(array[j+i])

      }
      columns.push(column);
      column = [];
    }

    /*columns masīvs beigās iegūst šādu veidolu:
    
    [
      [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9]
      ... vēl seši column masīvi
    ]
    */

    return columns;
  }
}

module.exports = Validator
