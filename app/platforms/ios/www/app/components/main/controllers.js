angular.module('whos_your_doc.controllers', [])
    .controller('mainCtrl', function ($scope) {
        console.log('Here we go');
        var data = [
            "pain",
            "chills",
            "toothache",
            "headache",
            "chest paint",
            "redness",
            "abdominal pain",
            "back pain",
            "fever",
            "paresthesia",
            "numbness",
            "tingling",
            "electric tweaks",
            "light-headed",
            "dizzy",
            "dry mouth",
            "nauseated",
            "sick",
            "short of breath",
            "sleepy",
            "sweaty",
            "thirsty",
            "tired",
            "weak"
        ];
        $(document).ready(
            function () {
                $("#symptoms").autocomplete({
                    source: data,
                    autoFocus: true
                });
            }
        );

    });