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

            return index;
        }

        const firstIndexBackwards = function (form, word, ind) {

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


                    if (counterLeftBracket == currentLeftBracket && form[i + 1].search(reg1) != -1) {
                        let join = form[i + 1];


                        var a = "";
                        if (form[i].search(reg2) != -1) {
                            if (form[i - 1] != '~') {
                                a = form[i];

                            } else {
                                a = form.substring(i - 1, i + 1);

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
                            newPartFormula = '~' + a + '∨' + b;
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
            form = removeDuplicateNegation(form);
            form = changeMainConnective(form);
            form = removeNext(form);
            return form;
        }




        let result = mainInvoke(form);

        return result;

    }

    return {
        convertFormula: convertFormula
    };


});
