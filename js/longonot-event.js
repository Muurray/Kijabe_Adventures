/* ============================================================
   MOUNT LONGONOT — EVENT DATE & COUNTDOWN
   Kijabe Adventures

   The event date is calculated automatically.

   The calculation uses the third Saturday as the
   mid-month Saturday.

   The recurrence rule is kept out of the public-facing
   page content.
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       ELEMENTS
    ======================================================== */

    const dateEl =
        document.getElementById(
            "longonotEventDate"
        );


    const quickDateEl =
        document.getElementById(
            "quickLongonotDate"
        );


    const daysEl =
        document.getElementById(
            "longonotDays"
        );


    const hoursEl =
        document.getElementById(
            "longonotHours"
        );


    const minutesEl =
        document.getElementById(
            "longonotMinutes"
        );


    const secondsEl =
        document.getElementById(
            "longonotSeconds"
        );


    /* ========================================================
       REQUIRED ELEMENT CHECK
    ======================================================== */

    if (
        !dateEl ||
        !daysEl ||
        !hoursEl ||
        !minutesEl ||
        !secondsEl
    ) {

        console.warn(
            "Longonot event script: required elements not found."
        );

        return;

    }


    /* ========================================================
       EVENT TIME
    ======================================================== */

    const EVENT_HOUR =
        9;


    const EVENT_MINUTE =
        0;


    /* ========================================================
       GET THIRD SATURDAY
       
       Sunday = 0
       Monday = 1
       ...
       Saturday = 6
    ======================================================== */

    function getThirdSaturday(
        year,
        month
    ) {

        const firstDay =
            new Date(
                year,
                month,
                1
            );


        const firstSaturdayOffset =
            (
                6 -
                firstDay.getDay() +
                7
            ) % 7;


        const firstSaturdayDate =
            1 +
            firstSaturdayOffset;


        const thirdSaturdayDate =
            firstSaturdayDate +
            14;


        return new Date(
            year,
            month,
            thirdSaturdayDate,
            EVENT_HOUR,
            EVENT_MINUTE,
            0,
            0
        );

    }


    /* ========================================================
       GET NEXT EVENT
    ======================================================== */

    function getNextEvent() {

        const now =
            new Date();


        let year =
            now.getFullYear();


        let month =
            now.getMonth();


        let eventDate =
            getThirdSaturday(
                year,
                month
            );


        /*
           If the current event has passed,
           calculate the next one.
        */

        if (
            eventDate.getTime() <=
            now.getTime()
        ) {

            month++;


            if (
                month > 11
            ) {

                month = 0;

                year++;

            }


            eventDate =
                getThirdSaturday(
                    year,
                    month
                );

        }


        return eventDate;

    }


    /* ========================================================
       FORMAT DATE
    ======================================================== */

    function formatEventDate(
        date
    ) {

        return date.toLocaleDateString(
            "en-KE",
            {
                weekday:
                    "long",

                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"
            }
        );

    }


    /* ========================================================
       UPDATE DATE DISPLAY
    ======================================================== */

    function updateDateDisplay(
        eventDate
    ) {

        const formatted =
            formatEventDate(
                eventDate
            );


        /*
           Public-facing date only.
           No recurrence wording.
        */

        dateEl.textContent =
            `📅 ${formatted} • ⏰ 9:00 AM – 4:00 PM`;


        /*
           Optional quick booking date.
        */

        if (
            quickDateEl
        ) {

            quickDateEl.textContent =
                formatted;

        }

    }


    /* ========================================================
       UPDATE COUNTDOWN
    ======================================================== */

    function updateCountdown(
        eventDate
    ) {

        const now =
            new Date();


        let difference =
            eventDate.getTime() -
            now.getTime();


        if (
            difference < 0
        ) {

            difference = 0;

        }


        const totalSeconds =
            Math.floor(
                difference /
                1000
            );


        const days =
            Math.floor(
                totalSeconds /
                86400
            );


        const hours =
            Math.floor(
                (
                    totalSeconds %
                    86400
                ) /
                3600
            );


        const minutes =
            Math.floor(
                (
                    totalSeconds %
                    3600
                ) /
                60
            );


        const seconds =
            totalSeconds %
            60;


        daysEl.textContent =
            String(days)
                .padStart(
                    2,
                    "0"
                );


        hoursEl.textContent =
            String(hours)
                .padStart(
                    2,
                    "0"
                );


        minutesEl.textContent =
            String(minutes)
                .padStart(
                    2,
                    "0"
                );


        secondsEl.textContent =
            String(seconds)
                .padStart(
                    2,
                    "0"
                );

    }


    /* ========================================================
       INITIALISE
    ======================================================== */

    let eventDate =
        getNextEvent();


    updateDateDisplay(
        eventDate
    );


    updateCountdown(
        eventDate
    );


    /* ========================================================
       LIVE COUNTDOWN
    ======================================================== */

    setInterval(
        () => {

            const now =
                new Date();


            /*
               Automatically move to the next event
               when the current event has passed.
            */

            if (
                now.getTime() >=
                eventDate.getTime()
            ) {

                eventDate =
                    getNextEvent();


                updateDateDisplay(
                    eventDate
                );

            }


            updateCountdown(
                eventDate
            );

        },
        1000
    );


    console.log(
        "Mount Longonot event date:",
        eventDate
    );

});