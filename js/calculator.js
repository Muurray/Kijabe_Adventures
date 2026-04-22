// ===============================
// 🔥 CENTRAL SHARED LOGIC
// ===============================
const PricingEngine = {
  BOOKING_FEE_RATE: 0.3,

  calculateDeposit(total) {
    return Math.round(total * this.BOOKING_FEE_RATE);
  }
};

// ===============================
// 🎉 EVENT CALCULATOR (BANNER + MODAL)
// ===============================
function initEventCalculator() {

  // 🔹 Supports BOTH banner + modal (duplicate IDs handled safely)
  const nameInputs = document.querySelectorAll("#eventName");
  const peopleInputs = document.querySelectorAll("#eventPeople");

  const totalEls = document.querySelectorAll("#eventTotal");
  const depositEls = document.querySelectorAll("#eventDeposit");
  const btns = document.querySelectorAll("#eventWhatsapp");

  const PRICE_PER_PERSON = 2000;

  function update() {

    nameInputs.forEach((nameInput, index) => {

      const peopleInput = peopleInputs[index];
      const totalEl = totalEls[index];
      const depositEl = depositEls[index];
      const btn = btns[index];

      if (!nameInput || !peopleInput) return;

      let name = nameInput.value.trim();
      let people = parseInt(peopleInput.value);

      if (!name || !people || people < 1) {
        totalEl.innerText = "KES 0";
        depositEl.innerText = "KES 0";
        btn.classList.add("disabled");
        btn.href = "#";
        return;
      }

      let total = PRICE_PER_PERSON * people;
      let deposit = PricingEngine.calculateDeposit(total);

      totalEl.innerText = `KES ${total.toLocaleString()}`;
      depositEl.innerText = `KES ${deposit.toLocaleString()}`;

      let message = `Hello Kijabe Adventures 👋🏾

My name is ${name}.

I want to join the Kijabe Hills Hike.

👥 People: ${people}

💰 Total: KES ${total.toLocaleString()}
💳 Deposit (30%): KES ${deposit.toLocaleString()}

I will pay via Till Number 5440810.`;

      btn.href = `https://wa.me/254743980340?text=${encodeURIComponent(message)}`;
      btn.classList.remove("disabled");
    });
  }

  nameInputs.forEach(input => input.addEventListener("input", update));
  peopleInputs.forEach(input => input.addEventListener("input", update));
}

// ===============================
// 💳 PRIVATE BOOKING CALCULATOR
// ===============================
function initPrivateCalculator() {

  const name = document.getElementById("customerName");
  const people = document.getElementById("hikers");
  const type = document.getElementById("hikeType");
  const parking = document.getElementById("parking");

  const totalEl = document.getElementById("total");
  const depositEl = document.getElementById("deposit");
  const btn = document.getElementById("whatsappLink");

  function getPrice(t) {
    if (t === "adults") return 2000;
    if (t === "students") return 1500;
    if (t === "children") return 1000;
    return 0;
  }

  function update() {

    if (!name || !people || !type) return;

    let n = name.value.trim();
    let p = parseInt(people.value);
    let t = type.value;

    if (!n || !p || !t) {
      totalEl.innerText = "0";
      depositEl.innerText = "0";
      btn.classList.add("disabled");
      btn.href = "#";
      return;
    }

    let pricePerPerson = getPrice(t);
    let total = pricePerPerson * p;

    // ✅ SMART PARKING
    let cars = 0;
    let parkingCost = 0;

    if (parking && parking.checked) {
      cars = Math.ceil(p / 4); // 1 car per 4 people
      parkingCost = cars * 300;
      total += parkingCost;
    }

    let deposit = PricingEngine.calculateDeposit(total);

    totalEl.innerText = total.toLocaleString();
    depositEl.innerText = deposit.toLocaleString();

    let message = `Hello Kijabe Adventures 👋🏾

My name is ${n}.

Private hike booking:

👥 People: ${p}
👤 Type: ${t}

🚗 Cars: ${cars}
🅿️ Parking: KES ${parkingCost}

💰 Total: KES ${total.toLocaleString()}
💳 Deposit (30%): KES ${deposit.toLocaleString()}

I will pay via Till Number 5440810.`;

    btn.href = `https://wa.me/254743980340?text=${encodeURIComponent(message)}`;
    btn.classList.remove("disabled");
  }

  name.addEventListener("input", update);
  people.addEventListener("input", update);
  type.addEventListener("change", update);
  parking?.addEventListener("change", update);
}

// ===============================
// 🚀 INIT EVERYTHING
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  initEventCalculator();
  initPrivateCalculator();
});
