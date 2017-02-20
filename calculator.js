$(document).ready(function () {
    'use strict';
    
    var current, entry = "", operator = "", formula = "", firstnum = "", secondnum = "", answer = "", decimal = false, plusminus = false, multipleoperations = false, multipleoperators = false;
    //current = the current button pushed, single #/character entered
    //entry = what is typed to the main screen, the current number being entered
    //operator = the operator entered
    //formula = the equation for calculation, displayed in the small screen when operator or equal is pushed (for display only no calculation on this var)
    //firstnum = the first number for calculating, set when an operator is pushed
    //secondnum = the second number for calculating, set when the equal is pushed
    //answer = the final answer, set when equal is pushed, then sets that value to firstnum for another calculation with the answer
    //decimal = boolean, set when decimal is pushed to stop multiple decimals from being entered
    //plusminus = boolean, toggled when pm is pushed, calculates the new number for display/calculation
    //multipleoperations = boolean, set to true when equal is pushed, keeps equal from being used more than once
    //mulitpleoperators = boolean, set to true when an operator is pushed, to keep any more operators from being pushed (can only use one operator per calculation)
    
    var operators = {
        " ^ ": function (fn, sn) { return Math.pow(fn, sn); },
        " / ": function (fn, sn) { return fn / sn; },
        " * ": function (fn, sn) { return fn * sn; },
        " + ": function (fn, sn) { return parseFloat(fn) + parseFloat(sn); },
        " - ": function (fn, sn) { return fn - sn; }
    }; //end operators
    
    function changehtml(main, small) {
        $(".mainscreen").html(main);
        $(".smallscreen").html(small);
    } //end changehtml
    
    $("button").click(function () {
        current = $(this).attr("value");
        
        switch (current) {
        case "0":
            entry = entry.toString();
            if (entry.length < 10 && entry !== "") { //so it doesn't put a bunch of zeros at the beginning
                if (firstnum === "" || operator !== "") { //stops this from being used on an answer
                    entry += current;
                    changehtml(entry, formula);
                }
            }
            break;
                
        case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9":
            entry = entry.toString();
            if (entry.length < 10) {
                if (firstnum === "" || operator !== "") { //stops this from being used on an answer
                    entry += current;
                    changehtml(entry, formula);
                }
            }
            break;
                
        case ".":
            if (firstnum === "" || operator !== "") { //stops this from being used on an answer
                if (!decimal) { //checks if the decimal has been used
                    entry += current;
                }
                decimal = true;
                changehtml(entry, formula);
            }
            break;
                
        case "pm":
            entry = entry.toString();
            if (entry !== "." && entry !== "") { //won't allow +/- unless theres an entry to use it on
                var entrysplit = entry.split(".");
                entry = parseFloat(entry);
                if (parseFloat(entrysplit[1]) === 0) {
                    decimal = false;
                }
                if (entry > 0) {
                    entry -= entry * 2;
                } else if (entry < 0) {
                    entry += entry * (-2);
                }
                changehtml(entry, formula);
            }
            break;
                
        case "back":
            entry = entry.toString();
            if (entry !== "" && entry[entry.length - 1] !== ".") { //makes back only available if something was entered as an entry, can't use back on an answer
                entry = entry.slice(0, entry.length - 1);
                changehtml(entry, formula);
            }
            break;
                
        case " / ": case " * ": case " + ": case " - ": case " ^ ":
            if (firstnum.length > 0 || (entry !== "" && entry !== ".")) {
                if (!multipleoperators) { //checks if any operators have already been used
                    if (multipleoperations) { //checks if the equal has been used
                        secondnum = entry; //so it sets secondnum and uses the previous equations answer as firstnum
                        formula = answer + current;
                    } else { //!multipleoperations
                        firstnum = entry;
                        formula = firstnum + current;
                    }
                    
                    operator = current;
                    entry = "";
                    decimal = false;
                    multipleoperators = true;
                    changehtml(entry, formula);
                } else if (multipleoperators) { //this is so if someone hits an operator and wants to change it to a different one
                    formula = formula.slice(0, formula.length - 3) + current;
                    operator = current;
                    changehtml(entry, formula);
                }
            }
            break;
                
        case " = ":
            if (operator !== "") { //can't use equal unless an operator has been entered
                secondnum = entry.toString(); //creates string for my .length test on next line

                if (secondnum.length > 0) { //makes it so equal can only be used if there is a second entry
                    formula += secondnum;
                    entry = "";
                    answer = operators[operator](firstnum, secondnum);
                    firstnum = operators[operator](firstnum, secondnum);
                    firstnum = firstnum.toString();
                    answer = Math.round(answer * 1000000000000000) / 1000000000000000;
                    var answer2 = answer.toString().split(".");
                    var re = /[e]/g;
                    parseInt(answer2[0]);
                    parseInt(answer2[1]);

                    if (answer2[0].length > 12 || (re.test(answer2[1]) && answer2[1] !== undefined)) { //this area is for display the correct number of digits, 12 total
                        answer = "ERROR";
                    } else if (answer2[1] === undefined || answer2[1] === 0) {
                        answer = answer2[0];
                    } else if (answer2[0].length + answer2[1].length < 11) {
                        answer = answer2[0] + "."  + answer2[1];
                    } else {
                        answer = answer.toFixed(11 - answer2[0].length);
                    }
                    
                    changehtml(answer, formula);
                    formula = answer;
                    secondnum = "";
                    operator = "";
                    multipleoperators = false;
                    multipleoperations = true;
                    decimal = false;
                }
            }
            break;
                
        case "ac": //reset everything to 0/false/blank and update html
            entry = "";
            operator = "";
            formula = "";
            firstnum = "";
            secondnum = "";
            answer = "";
            decimal = false;
            multipleoperations = false;
            multipleoperators = false;
            changehtml(entry, formula);
            break;
        } //end switch
    }); //end $("button").click
}); //end $(document).ready