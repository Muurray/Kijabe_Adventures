/* ============================================================
   MOUNT LONGONOT — BOOKING CALCULATOR
   Kijabe Adventures

   HIKER TRANSPORT RULES
   ---------------------
   1–4 hikers   = Small vehicle
   5–15 hikers  = Large vehicle / Nissan
   16+ hikers   = Group bus

   SELF DRIVE
   ----------
   Self Drive is always available and has no transport charge.

   IMPORTANT
   ---------
   Actual transport prices are stored internally and are NOT
   displayed in the customer-facing transport options.
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       HELPER
    ======================================================== */

    const $ = (id) => document.getElementById(id);

    const formatKES = (amount) =>
        Number(amount || 0).toLocaleString("en-KE");


    /* ========================================================
       MAIN ELEMENTS
    ======================================================== */

    const residency =
        $("longonotResidency");

    const hikerType =
        $("longonotHikerType");

    const groupPricing =
        document.querySelector(".group-pricing");

    const transportWrapper =
        $("longonotTransportWrapper");

    const transport =
        $("longonotTransport");

    const parkingBox =
        $("longonotParkingBox");

    const parking =
        $("longonotParking");

    const resultCard =
        $("longonotResultCard");

    const totalHikersEl =
        $("longonotTotalHikers");

    const totalEl =
        $("longonotTotal");

    const depositEl =
        $("longonotDeposit");

    const whatsapp =
        $("longonotWhatsapp");

    const nameInput =
        $("longonotName");

    const phoneInput =
        $("longonotPhone");


    /* ========================================================
       REQUIRED ELEMENT CHECK
    ======================================================== */

    if (
        !residency ||
        !hikerType ||
        !groupPricing ||
        !transportWrapper ||
        !transport
    ) {

        console.warn(
            "Longonot calculator: required elements were not found."
        );

        return;
    }


    /* ========================================================
       HIKER PRICING
    ======================================================== */

    const HIKER_RATES = {

        resident: {

            adult: 1573,

            student: 1275,

            child: 1000

        },

        nonresident: {

            adult: 3000,

            student: 2500,

            child: 2000

        }

    };


    /* ========================================================
       TRANSPORT PRICES
       
       These prices are intentionally NOT displayed to users.
       
       1–4  = small
       5–15 = large
       16+  = bus
    ======================================================== */

    const TRANSPORT_PRICES = {

        nairobi: {

            small: 8500,

            large: 11500,

            bus: 16500

        },

        westlands: {

            small: 8000,

            large: 10000,

            bus: 16000

        },

        kikuyu: {

            small: 7500,

            large: 9500,

            bus: 15500

        },

        thika: {

            small: 9000,

            large: 12000,

            bus: 17000

        }

    };


    /* ========================================================
       CUSTOMER-FACING PICKUP LABELS
       
       NO PRICES ARE DISPLAYED.
    ======================================================== */

    const TRANSPORT_LABELS = {

        self:
            "🚗 Self Drive — Own Vehicle",

        nairobi:
            "📍 Nairobi Pickup",

        westlands:
            "📍 Westlands Pickup",

        kikuyu:
            "📍 Kikuyu Pickup",

        thika:
            "📍 Thika Pickup"

    };


    /* ========================================================
       VEHICLE CATEGORY
    ======================================================== */

    function getVehicleCategory(hikers) {

        if (
            hikers >= 1 &&
            hikers <= 4
        ) {

            return "small";

        }


        if (
            hikers >= 5 &&
            hikers <= 15
        ) {

            return "large";

        }


        if (hikers >= 16) {

            return "bus";

        }


        return null;

    }


    /* ========================================================
       VEHICLE LABEL
       
       These are customer-facing labels.
    ======================================================== */

    function getVehicleLabel(category) {

        if (category === "small") {

            return (
                "🚗 Small Vehicle — 1–4 hikers"
            );

        }


        if (category === "large") {

            return (
                "🚙 Large Vehicle / Nissan — 5–15 hikers"
            );

        }


        if (category === "bus") {

            return (
                "🚌 Group Bus — 16+ hikers"
            );

        }


        return "";

    }


    /* ========================================================
       COLLAPSE / EXPAND
    ======================================================== */

    function setCollapsed(
        element,
        collapsed
    ) {

        if (!element) return;

        element.classList.toggle(
            "is-collapsed",
            collapsed
        );

    }


    /* ========================================================
       HIKER COUNT INPUTS
    ======================================================== */

    const counts = {

        resident: {

            adult:
                $("longonotResidentAdults"),

            student:
                $("longonotResidentStudents"),

            child:
                $("longonotResidentChildren")

        },

        nonresident: {

            adult:
                $("longonotNonresidentAdults"),

            student:
                $("longonotNonresidentStudents"),

            child:
                $("longonotNonresidentChildren")

        }

    };


    /* ========================================================
       GET INPUT ROW
    ======================================================== */

    function getInputRow(input) {

        if (!input) return null;


        return (
            input.closest("[data-field]") ||
            input.closest(".form-group") ||
            input.parentElement
        );

    }


    /* ========================================================
       SHOW / HIDE INPUT
    ======================================================== */

    function showInput(
        input,
        show
    ) {

        if (!input) return;


        const row =
            getInputRow(input);


        if (!row) return;


        row.classList.toggle(
            "is-collapsed",
            !show
        );


        row.setAttribute(
            "aria-hidden",
            String(!show)
        );


        input.disabled =
            !show;

    }


    /* ========================================================
       DETERMINE REQUIRED HIKER COMBINATIONS
    ======================================================== */

    function getSelectedCombinations() {

        const residencyValue =
            residency.value;

        const hikerTypeValue =
            hikerType.value;


        if (
            !residencyValue ||
            !hikerTypeValue
        ) {

            return [];

        }


        let residencies = [];

        let types = [];


        /* Residency */

        if (
            residencyValue === "mixed"
        ) {

            residencies = [
                "resident",
                "nonresident"
            ];

        } else {

            residencies = [
                residencyValue
            ];

        }


        /* Hiker type */

        if (
            hikerTypeValue === "mixed"
        ) {

            types = [
                "adult",
                "student",
                "child"
            ];

        } else {

            types = [
                hikerTypeValue
            ];

        }


        const combinations = [];


        residencies.forEach(
            (residencyType) => {

                types.forEach(
                    (type) => {

                        combinations.push({

                            residency:
                                residencyType,

                            type:
                                type

                        });

                    }
                );

            }
        );


        return combinations;

    }


    /* ========================================================
       UPDATE HIKER INPUT VISIBILITY
    ======================================================== */

    function updateHikerInputs() {

        const combinations =
            getSelectedCombinations();


        const ready =
            combinations.length > 0;


        /* Group pricing */

        setCollapsed(
            groupPricing,
            !ready
        );


        /* Hiker rows */

        Object.keys(counts)
            .forEach(
                (residencyType) => {

                    Object.keys(
                        counts[residencyType]
                    ).forEach(
                        (type) => {

                            const input =
                                counts[
                                    residencyType
                                ][type];


                            if (!input) {
                                return;
                            }


                            const shouldShow =
                                combinations.some(
                                    (item) =>
                                        item.residency ===
                                            residencyType &&
                                        item.type ===
                                            type
                                );


                            showInput(
                                input,
                                shouldShow
                            );

                        }
                    );

                }
            );


        /* No selections */

        if (!ready) {

            resetTransport();


            setCollapsed(
                transportWrapper,
                true
            );


            setCollapsed(
                parkingBox,
                true
            );


            if (parking) {

                parking.checked =
                    false;

            }


            hideResult();

            return;

        }


        /* Transport becomes available */

        setCollapsed(
            transportWrapper,
            false
        );


        updateTransportOptions();

    }


    /* ========================================================
       TOTAL HIKERS
    ======================================================== */

    function getTotalHikers() {

        const combinations =
            getSelectedCombinations();


        let total =
            0;


        combinations.forEach(
            (item) => {

                const input =
                    counts[
                        item.residency
                    ]?.[
                        item.type
                    ];


                if (!input) {
                    return;
                }


                let value =
                    parseInt(
                        input.value,
                        10
                    );


                if (
                    isNaN(value) ||
                    value < 0
                ) {

                    value = 0;

                }


                total += value;

            }
        );


        return total;

    }


    /* ========================================================
       HIKER COST
    ======================================================== */

    function calculateHikerCost() {

        const combinations =
            getSelectedCombinations();


        let total =
            0;


        combinations.forEach(
            (item) => {

                const input =
                    counts[
                        item.residency
                    ]?.[
                        item.type
                    ];


                if (!input) {
                    return;
                }


                let number =
                    parseInt(
                        input.value,
                        10
                    );


                if (
                    isNaN(number) ||
                    number < 0
                ) {

                    number = 0;

                }


                const rate =
                    HIKER_RATES[
                        item.residency
                    ]?.[
                        item.type
                    ] || 0;


                total +=
                    number * rate;

            }
        );


        return total;

    }


    /* ========================================================
       RESET TRANSPORT
    ======================================================== */

    function resetTransport() {

        transport.innerHTML =
            `
                <option value="">
                    Select Transport
                </option>

                <option value="self">
                    🚗 Self Drive — Own Vehicle
                </option>
            `;

        transport.value =
            "";

    }


    /* ========================================================
       UPDATE TRANSPORT OPTIONS
       
       This is the main dynamic transport function.
    ======================================================== */

    function updateTransportOptions() {

        const hikers =
            getTotalHikers();


        const previousValue =
            transport.value;


        /*
           Always rebuild the dropdown.
        */

        transport.innerHTML =
            `
                <option value="">
                    Select Transport
                </option>

                <option value="self">
                    🚗 Self Drive — Own Vehicle
                </option>
            `;


        /*
           Self Drive is available even before
           the paid transport categories.
        */

        if (hikers < 1) {

            setCollapsed(
                parkingBox,
                true
            );


            if (parking) {

                parking.checked =
                    false;

            }


            hideResult();

            return;

        }


        const vehicle =
            getVehicleCategory(
                hikers
            );


        if (!vehicle) {

            return;

        }


        /*
           Add pickup locations.

           IMPORTANT:
           No prices are included here.
        */

        Object.keys(
            TRANSPORT_PRICES
        ).forEach(
            (pickup) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    pickup;


                option.textContent =
                    `${TRANSPORT_LABELS[pickup]} — ${getVehicleLabel(vehicle)}`;


                /*
                   Store vehicle type internally.
                */

                option.dataset.vehicle =
                    vehicle;


                transport.appendChild(
                    option
                );

            }
        );


        /*
           Restore existing selection.
        */

        if (
            previousValue &&
            (
                previousValue === "self" ||
                TRANSPORT_PRICES[
                    previousValue
                ]
            )
        ) {

            transport.value =
                previousValue;

        }


        /*
           Parking section.
        */

        if (
            transport.value
        ) {

            setCollapsed(
                parkingBox,
                false
            );

        } else {

            setCollapsed(
                parkingBox,
                true
            );


            if (parking) {

                parking.checked =
                    false;

            }

        }


        calculateTotal();

    }


    /* ========================================================
       GET TRANSPORT COST
    ======================================================== */

    function getTransportCost() {

        const hikers =
            getTotalHikers();


        const pickup =
            transport.value;


        /*
           Self Drive = KES 0.
        */

        if (
            pickup === "self"
        ) {

            return 0;

        }


        if (
            hikers < 1 ||
            !pickup ||
            !TRANSPORT_PRICES[pickup]
        ) {

            return 0;

        }


        const vehicle =
            getVehicleCategory(
                hikers
            );


        return (
            TRANSPORT_PRICES[
                pickup
            ]?.[
                vehicle
            ] || 0
        );

    }


    /* ========================================================
       TRANSPORT DESCRIPTION
    ======================================================== */

    function getTransportDescription() {

        const hikers =
            getTotalHikers();


        const pickup =
            transport.value;


        if (!pickup) {

            return "";

        }


        if (
            pickup === "self"
        ) {

            return (
                "🚗 Self Drive — Own Vehicle"
            );

        }


        if (hikers < 1) {

            return "";

        }


        const vehicle =
            getVehicleCategory(
                hikers
            );


        return (
            `${TRANSPORT_LABELS[pickup]} — ` +
            `${getVehicleLabel(vehicle)}`
        );

    }


    /* ========================================================
       PARKING COST
    ======================================================== */

    function getParkingCost() {

        if (
            parking &&
            parking.checked
        ) {

            return 300;

        }


        return 0;

    }


    /* ========================================================
       HIDE RESULT
    ======================================================== */

    function hideResult() {

        if (!resultCard) {
            return;
        }


        resultCard.style.display =
            "none";

    }


    /* ========================================================
       SHOW RESULT
    ======================================================== */

    function showResult() {

        if (!resultCard) {
            return;
        }


        resultCard.style.display =
            "block";

    }


    /* ========================================================
       CALCULATE TOTAL
    ======================================================== */

    function calculateTotal() {

        const hikers =
            getTotalHikers();


        if (hikers < 1) {

            hideResult();

            updateWhatsApp(
                0,
                0,
                0,
                0,
                0
            );

            return;

        }


        const hikerCost =
            calculateHikerCost();


        const transportCost =
            getTransportCost();


        const parkingCost =
            getParkingCost();


        const total =
            hikerCost +
            transportCost +
            parkingCost;


        /*
           Booking fee = 30%.
        */

        const deposit =
            Math.ceil(
                total * 0.30
            );


        if (totalHikersEl) {

            totalHikersEl.textContent =
                hikers.toLocaleString(
                    "en-KE"
                );

        }


        if (totalEl) {

            totalEl.textContent =
                formatKES(
                    total
                );

        }


        if (depositEl) {

            depositEl.textContent =
                formatKES(
                    deposit
                );

        }


        /*
           Show results after a valid transport
           selection has been made.
        */

        if (
            transport.value &&
            total > 0
        ) {

            showResult();

        } else {

            hideResult();

        }


        updateWhatsApp(
            hikers,
            total,
            deposit,
            transportCost,
            parkingCost
        );

    }


    /* ========================================================
       WHATSAPP
    ======================================================== */

    function updateWhatsApp(
        hikers,
        total,
        deposit,
        transportCost,
        parkingCost
    ) {

        if (!whatsapp) {
            return;
        }


        const customerName =
            nameInput?.value.trim() ||
            "";


        const customerPhone =
            phoneInput?.value.trim() ||
            "";


        const ready =
            customerName &&
            customerPhone &&
            hikers > 0 &&
            transport.value &&
            total > 0;


        if (!ready) {

            whatsapp.classList.add(
                "disabled"
            );


            whatsapp.setAttribute(
                "aria-disabled",
                "true"
            );


            whatsapp.href =
                "#";


            return;

        }


        const residencyText =
            residency.options[
                residency.selectedIndex
            ]?.text ||
            "";


        const hikerTypeText =
            hikerType.options[
                hikerType.selectedIndex
            ]?.text ||
            "";


        const transportDescription =
            getTransportDescription();


        const parkingText =
            parking?.checked
                ? "Yes"
                : "No";


        /*
           Individual transport price is NOT
           included in the WhatsApp message.
        */

        const message =

`Hello Kijabe Adventures!

I would like to book the Mount Longonot Hike.

Name: ${customerName}
Phone: ${customerPhone}

Number of hikers: ${hikers}

Residency: ${residencyText}
Hiker type: ${hikerTypeText}

Transport: ${transportDescription}
Parking: ${parkingText}

Total: KES ${formatKES(total)}
Booking fee (30%): KES ${formatKES(deposit)}

Please confirm availability and booking details.`;


        whatsapp.href =
            "https://wa.me/254743980340?text=" +
            encodeURIComponent(
                message
            );


        whatsapp.classList.remove(
            "disabled"
        );


        whatsapp.removeAttribute(
            "aria-disabled"
        );

    }


    /* ========================================================
       EVENT LISTENERS
    ======================================================== */

    residency.addEventListener(
        "change",
        () => {

            updateHikerInputs();

            calculateTotal();

        }
    );


    hikerType.addEventListener(
        "change",
        () => {

            updateHikerInputs();

            calculateTotal();

        }
    );


    transport.addEventListener(
        "change",
        () => {

            if (
                transport.value
            ) {

                setCollapsed(
                    parkingBox,
                    false
                );

            } else {

                setCollapsed(
                    parkingBox,
                    true
                );


                if (parking) {

                    parking.checked =
                        false;

                }

            }


            calculateTotal();

        }
    );


    if (parking) {

        parking.addEventListener(
            "change",
            calculateTotal
        );

    }


    /*
       HIKER COUNT CHANGES

       This is critical.

       4 → 5:
       Small → Large

       15 → 16:
       Large → Bus
    */

    Object.values(counts)
        .flatMap(
            (group) =>
                Object.values(group)
        )
        .forEach(
            (input) => {

                if (!input) {
                    return;
                }


                input.addEventListener(
                    "input",
                    () => {

                        updateTransportOptions();

                        calculateTotal();

                    }
                );


                input.addEventListener(
                    "change",
                    () => {

                        updateTransportOptions();

                        calculateTotal();

                    }
                );

            }
        );


    if (nameInput) {

        nameInput.addEventListener(
            "input",
            calculateTotal
        );

    }


    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            calculateTotal
        );

    }


    /* ========================================================
       INITIAL STATE
    ======================================================== */

    setCollapsed(
        groupPricing,
        true
    );


    setCollapsed(
        transportWrapper,
        true
    );


    setCollapsed(
        parkingBox,
        true
    );


    if (parking) {

        parking.checked =
            false;

    }


    hideResult();


    /*
       Start with only Self Drive available internally.
       The complete pickup list is populated once
       the user has entered a valid number of hikers.
    */

    resetTransport();


    console.log(
        "Mount Longonot calculator loaded successfully."
    );

});