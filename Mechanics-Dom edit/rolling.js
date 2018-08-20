let isRunning = false,
    isShown = false;

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

    $("input[type=button]").click(function () {
        if ($(this).attr("id") === "forceButton") {
            isShown = !isShown;
            document.getElementById("forceButton").value = (isShown) ?
            "Hide Forces":"Show Forces";
        }
    });

    $("input[type=submit]").click(function () {
        if ($(this).attr("id") === "playButton") {
            isRunning = !isRunning;
        }
    });

    init();
    return 0;
}

$(document).ready(main);