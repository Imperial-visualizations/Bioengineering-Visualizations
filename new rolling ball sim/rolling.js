let isRunning = false,
    isShown = false,
    isPressed = false;
    isChecked = false;

let question, answer1, congrats, sorry;

function update() {
}

function init() {
    update();
    return 0;
}

function main() {
    $("input[type=range]").each(function () {
        /*Allows for live update for display values*/
        $(this).on('input', function(){
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );
        });
    });


    $("input[type=submit]").click(function () {
        if ($(this).attr("id") === "playButton") {
            isRunning = !isRunning;
        }
    });

    $("input[type=button]").click(function () {
      if ($(this).attr("id") === "questionButton") {
        isPressed = !isPressed;
        document.getElementById("questionButton").value = (isPressed) ?
        "Check":"Question";
      }
    });

    $("input[type=button]").click(function () {
      if($(this).attr("id") === "checkButton") {
        isChecked = !isChecked;
        question = document.getElementById("modal_0")
        answer1 = document.getElementById("answer1");
        congrats = document.getElementById("modal_1");
        sorry = document.getElementById("modal_2");
        if (answer1.checked === true) {
          congrats.style.display = "block";
          question.style.display = "none";
        } else {
          congrats.style.display = "none";
          question.style.display = "none";
          sorry.style.display = "block";
        }
      }
    });

    init();
    initGuidance(["question1"]);
    return 0;
}

$(document).ready(main);
