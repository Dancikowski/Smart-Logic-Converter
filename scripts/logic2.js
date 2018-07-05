define('logic', ['script'], function () {
    function convertFormula(form) {


        function removeDuplicateNegation(form) {
            var afterDelete = "";
            for (let i = 0; i < form.length; i++) {
                if (form[i] == '~') {

                    if (form[i + 1] == '~') i = i + 2;
                    else afterDelete += form[i];
                } else afterDelete += form[i];
            }
            return afterDelete;
        }

        function regexIndexOf(text, re, i) {
            var indexInSuffix = text.slice(i).search(re);
            return indexInSuffix < 0 ? indexInSuffix : indexInSuffix + i;
        }

        function constructor(symbol, index) {
            this.symbol = symbol;
            this.index = index;
            this.prior = symbol == '=' ? 1 : 0;


        }

        const repairForm = function (form) {
            //console.log('Im');
            const reg1 = new RegExp('=|>', 'gi');
            const reg2 = new RegExp('p|q|r', 'gi');
            const regBrac = /\(|\)/gi;
            var tab = [];


            for (let i = form.search(reg1); i < form.length; i++) {
                if (reg1.test(form[i])) {
                    var obj = new constructor(form[i], i);
                    tab.push(obj);
                }



            }
            // console.log(tab);


            var copyForm = form;
            for (let i = 0; i < tab.length - 1; i++) {
                var licznik = 0;
              
                if (tab[i].symbol == '>' && form.slice(tab[i].index + licznik, tab[i + 1].index + licznik).search(regBrac) != -1) continue;
                else {
                    var a = "";
                    if (form[tab[i].index - 1 + licznik].search(reg2) != -1) {

                        a = form[tab[i].index - 1 + licznik];
                      
                        if (form[tab[i].index - 2 + licznik] == '~') {
                            a = form.slice(tab[i].index - 2 + licznik, tab[i].index + licznik);
                         
                        }
                    } else {

                        let indexRight = countRight(form, tab[i].index + licznik);

                        a = form[indexRight - 1] == '~' ? indexRight - 1 : indexRight;
                      
                    }

                    var b = "";
                    if (form[tab[i].index + 1 + licznik].search(reg2) != -1) {
                        b = tab[i].index + 1 + licznik;



                    } else b = tab[i].index + 2 + licznik;

                    form = form.split('');
                    form.splice(a, 0, '(');
                    form.splice(b + 2, 0, ')');
                    form = form.join('');
                 

                    licznik = licznik + 2;


                }




            }
        }





        const countBracketsAfter = function (form, ind) {
            var left = 0;

            for (let i = 0; i < ind + 1; i++) {
                if (form[i] == '(') left++;
                if (form[i] == ')') left--;
            }

            return left;

        }

        const countLeft = function (form, ind) {

            var right = 0;
            var left = 0;
            var index = "";
            for (let i = ind + 1; i < form.length; i++) {
                if (form[i] == '(') left++;
                if (form[i] == ')') break;
            }

            for (let i = ind + 1; i < form.length; i++) {
                index = i;
                if (form[i] == ')') right++;
                if (right == left) break;
            }

            return index;
        }

        const countRight = function (form, ind) {
            var right = 0;
            var left = 0;
            var index = "";
            for (let i = ind + 1; i >= 0; i--) {
                if (form[i] == ')') right++;
                if (form[i] == '(') break;

            }

            for (let i = ind + 1; i >= 0; i--) {
                index = i;

                if (form[i] == '(') left++;
                if (right == left) break;
            }

            // if (form[index - 1] == '~') index--;

            return index;
        }

        const firstIndexBackwards = function (form, word, ind) {
            // console.log('jestem');
            var index = "";
            for (let i = ind + 1; i > 0; i--) {

                if (form.substring(i, ind + 1) == word) {
                    index = i;
                }

            }

            return index;
        }


        const removeNext = function (t) {
            const reg1 = new RegExp('>|=', 'gi');
            const reg2 = new RegExp('p|q|r', 'gi');
            var counterLeftBracket = 1;
            var currentLeftBracket = 0;
            var form = t;


            while (form.search(reg1) != -1) {


                for (let i = 0; i < form.length; i++) {
                    var helper = form;
                    if (form[i] == '(') currentLeftBracket++;
                    if (form[i] == ')') currentLeftBracket--;

                    //console.log(i + " KOnsole");
                    if (counterLeftBracket == currentLeftBracket && form[i + 1].search(reg1) != -1) {
                        let join = form[i + 1];


                        var a = "";
                        if (form[i].search(reg2) != -1) {
                            if (form[i - 1] != '~') {
                                a = form[i];

                            } else {
                                a = form.substring(i - 1, i + 1);
                                //  console.log(a + "a");

                            }

                        } else {
                            let indexRight = countRight(form, i);
                          
                            a = form.substring(indexRight, i + 1);

                        }



                        var b = "";

                        if (form[i + 2].search(reg2) != -1 || form[i + 2] == '~') {

                            if (form[i + 2] == '~') {
                                b = form.substring(i + 2, i + 4);

                            } else {
                                b = form[i + 2];

                            }
                        } else {
                            let indexLeft = countLeft(form, i);
                            let ind = form.indexOf(')', i + 2);
                            b = form.substring(i + 2, indexLeft + 1);

                        }

                        var newPartFormula = "";
                        if (join == '>') {
                            newPartFormula = '~' + a + 'V' + b;
                          
                            helper = helper.split('');
                            let firstInd = firstIndexBackwards(form, a, i)

                            helper.splice(form.indexOf(a, firstInd), a.length + b.length + 1, newPartFormula);

                            helper = helper.join('');

                            form = helper;
                            i++;


                        }

                        if (join == '=') {
                            newPartFormula = '(' + a + '>' + b + ')' + '∧' + '(' + b + '>' + a + ')';
                            helper = helper.split('');
                            let firstInd = firstIndexBackwards(form, a, i)
                            helper.splice(form.indexOf(a, firstInd), a.length + b.length + 1, newPartFormula);
                            helper = helper.join('');
                            form = helper;
                            currentLeftBracket = countBracketsAfter(form, i);

                        }
                    }
                }
                counterLeftBracket++;
              

            }

            return form;

        }

        const countBrackets = function (x) {
            let valid = false;
            let left = 0;
            let right = 0;
          
            for (let i = 0; i < x.length; i++) {
                if (x[i] == '(') left++;
                if (x[i] == ')') right++;

            }

            if (right == left) valid = true;
            return valid;

        }


        const changeMainConnective = function (t) {

            const reg1 = new RegExp('=|>', 'gi');
            var formula = t;
            //while (formula.search(reg1) != -1) {
            for (let i = 0; i < formula.length; i++) {

                if (formula[i].search(reg1) != -1) {
                    if (countBrackets(formula.substring(0, i))) {
                        let a = formula.substring(0, i).length > 2 && formula[0] != '(' ? '(' + formula.substring(0, i) + ')' : formula.substring(0, i);
                       
                        let b = formula.substr(i + 1).length > 2 && formula[i + 1] != '(' ? '(' + formula.substr(i + 1) + ')' : formula.substr(i + 1);

                        if (formula[i] == '>') {

                            formula = '~' + a + '∨' + b;

                        } else {
                            formula = '(' + a + '>' + b + ')' + '∧' + '(' + b + '>' + a + ')';
                        }
                    }
                }
            }

          
            return formula;
        }


        function mainInvoke(text) {

            let form = text;
            //console.log(form);
            form = removeDuplicateNegation(form);
            form = changeMainConnective(form);
            // console.log(form);
            form = removeNext(form);
            return form;
        }

        //let form = "~(p>q)=(p>q)";


        let result = mainInvoke(form);

        return result;

    }

    return {
        convertFormula: convertFormula
    };


});
