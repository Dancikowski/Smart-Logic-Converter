require(['logic'], function (logic) {

    (function popup() {

        const modal = document.querySelector('.modal');
        modal.style.display = 'block';
        document.querySelector('.closeBtn').addEventListener('click', function () {
            modal.style.display = 'none';
        })

        window.addEventListener('click', function (e) {
            if (e.target.className == "modal") {
                modal.style.display = 'none';
            }


        });

    })();





    function regexIndexOf(text, re, i) {
        var indexInSuffix = text.slice(i).search(re);
        return indexInSuffix < 0 ? indexInSuffix : indexInSuffix + i;
    }

    const initialCheck = function (t) {
        let valid = true;
        const reg = new RegExp('~~');
        const reg2 = new RegExp('p|q|r', 'gi');
        if (t.search(reg) != -1) valid = false;
        return valid;


    }
    const removeDuplicateNegations = function (t) {
        let copy = t;
        const reg = new RegExp('~~', 'gi');
        while (t.search(reg) != -1) {
            t = t.split('');
            t.splice(copy.search(reg), 2, "");
            t = t.join('');
            copy = t;
        }
        return t;

    }
    const checkFormula = function (t) {

        var bool = true;
        let duplicate = 0;
        const arrayOfSymbolsInput = ['p', 'q', 'r', '>', '<', '~', '^', 'v', '(', ')', '='];

        [].forEach.call(t, function (ele) {

            if (arrayOfSymbolsInput.indexOf(ele) == -1) bool = false;

        })


        return bool;

    }
    const arrayOfSymbolKeys = [80, 81, 82, 192, 187, 54, 86, 190, 61, 57, 48];
    const text = document.querySelector('.type');
    let stack = [];
    const container = document.querySelector('.mobileContainer');
   
    if (window.innerWidth > 500) {
        document.addEventListener('keydown', function (el) {
            text.style.color = '3b3b3b';
          
            if (el.keyCode != 13) {
                if (el.keyCode != 16) {
                    if (arrayOfSymbolKeys.indexOf(el.keyCode) != -1) {

                        let a = el.keyCode == 190 ? '⇒' : el.keyCode == 61 || el.keyCode == 187 ? '⇔' : el.keyCode == 192 ? '~' : el.keyCode == 54 ? '∧' : el.keyCode == 86 ? '∨' : el.key;
                        stack.push(a);

                        text.textContent = stack.join('');
                       
                    } else if (el.keyCode == 8) {
                        text.style.color = '';
                        el.preventDefault();
                        stack.pop();
                        text.textContent = stack.join('');
                    }
                }
            } else text.textContent = stack.join('');
        })
    }
    if (window.innerWidth > 500) {
        document.querySelector('.go').addEventListener('click', function () {

            let formula = text.textContent.split('').map(function (el) {

                return el == '⇒' ? '>' : el == '⇔' ? '=' : el;
            }).join('');


            if (!initialCheck(formula)) {
                stack = [];
                text.style.color = '#e05454';
                text.textContent = 'Invalid Syntax!';
            } else {

                let result = logic.convertFormula(formula).split('').map(function (el) {
                    return el == '>' ? '⇒' : el == '=' ? '⇔' : el;
                }).join('');

                result = removeDuplicateNegations(result);
                stack = result.split('');
                text.textContent = result;
            }
        })
    } else {


        container.querySelector('.go').addEventListener('click', function () {

            container.querySelector('.formulas').style.display = "none";
            container.querySelector('#error').style.display = "none";
            let formula = container.querySelector('#formula').value;
            if (checkFormula(formula) && formula != "") {
                container.querySelector('#error').style.display = "";
                let yourFormula = formula.split('').map(function (el) {
                    return el == '>' ? '⇒' : el == '=' ? '⇔' : el == '^' ? '∧' : el == 'v' ? '∨' : el;
                }).join('');

                container.querySelector('.yourFormula pre').textContent = yourFormula;
                let result = logic.convertFormula(formula).split('').map(function (el) {
                    return el == '>' ? '⇒' : el == '=' ? '⇔' : el == '^' ? '∧' : el == 'v' ? '∨' : el;
                }).join('');
                container.querySelector('.result pre').textContent = result;
                container.querySelector('.formulas').style.display = "block";
            } else {

                container.querySelector('#error').style.display = "block";
            }

        })

    }

    container.querySelector('.clear').addEventListener('click', function () {
        container.querySelector('#formula').value = "";
        stack = [];
        text.textContent = "";
    })


    document.querySelector('.clear').addEventListener('click', function () {

        stack = [];
        text.textContent = "";

    })

})
