const date = new Date();
let activeDay = date.getDate(); 
const monthYear = document.getElementById("month-year");
const daysContainer = document.querySelector(".days");

const selectMonth = document.getElementById("select-month");
const selectYear = document.getElementById("select-year");
const goToBtn = document.getElementById("goto");
const todayBtn = document.getElementById("to-day");

const eventWrapper = document.querySelector(".add-event-wrapper");
const addEventBtn = document.querySelector(".add-sign");
const closeEventBtn = document.querySelector(".close");
const eventNameInput = document.querySelector(".event-name");
const eventTimeFrom = document.querySelector(".event-time-from");
const eventTimeTo = document.querySelector(".event-time-to");
const eventList = document.querySelector(".events");

// local storage me kuchh events hain toh wahi load karo nahin toh empty object bana do
let events = JSON.parse(localStorage.getItem("events")) || {};

function saveEvents() {
    localStorage.setItem("events", JSON.stringify(events));
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Select month ka logic in month dropdown
months.forEach((month, index) => {
    let option = document.createElement("option");
    option.value = index;
    option.innerText = month;
    selectMonth.appendChild(option);
});

// Select year ka logic in year dropdown
for (let i = 1900; i <= 2100; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerText = i;
    selectYear.appendChild(option);
}

// Default value ko set kiya hai current date pe 
selectMonth.value = date.getMonth();
selectYear.value = date.getFullYear();


// Pop up aa jaye event add karne ke liye
addEventBtn.addEventListener("click", function () {
    
        eventNameInput.value = "";
        eventTimeFrom.value = "";
        eventTimeTo.value = "";

    eventWrapper.style.display = "block";
});

// Pop up band ho jaye event add karne ke baad
closeEventBtn.addEventListener("click", function () {
    eventWrapper.style.display = "none";
});

//calender bhai ki functionality
function renderCalendar() {
    const firstDayIndex = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const prevLastDate = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

    selectMonth.value = date.getMonth();
    selectYear.value = date.getFullYear();


    // Calender pe month and year show karne ke liye
    monthYear.innerHTML = `${months[date.getMonth()]} ${date.getFullYear()}`;

    let days = "";

    //prev dates ko show karne ke liye
    for (let k = firstDayIndex; k > 0; k--) {
        days += `<div class="prev-date">${prevLastDate - k + 1}</div>`;
    }
    //current dates ko show karne ke liye 
    // Today ko highlight karne ka jugad
    // Active day ko highlight karne ka jugad
    // Has event wale dates ko check karne ka jugad
    for (let i = 1; i <= lastDate; i++) {
        let className = "day";
        if (i === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear()) {
            className += " today"; 
        }
        if (i === activeDay) {
            className += " active";
        }

        const eventDateKey = `${date.getFullYear()}-${date.getMonth()}-${i}`;
        if (events[eventDateKey] && events[eventDateKey].length > 0) {
            className += " has-event"; 
        }

        days += `<div class="${className}">${i}</div>`;
    }

    //next month dates ko show karne ke liye
    for (let j = 1; j <= 7 - lastDayIndex - 1; j++) {
        days += `<div class="next-date">${j}</div>`;
    }
    
    // sab days ke container me push karne ke liye
    daysContainer.innerHTML = days;

    addDayClickEvent();

    updateSelectedDate(activeDay);
}

// Go To Selected Month & Year
goToBtn.addEventListener("click", function () {
    date.setMonth(parseInt(selectMonth.value));
    date.setFullYear(parseInt(selectYear.value));
    activeDay = 1;
    renderCalendar();
});

// Reset to Today’s Date
todayBtn.addEventListener("click", function () {
    date.setMonth(new Date().getMonth());
    date.setFullYear(new Date().getFullYear());
    activeDay = new Date().getDate();
    renderCalendar();
});


// Day pe click karne pe active class add karne ke liye
function addDayClickEvent() {
    document.querySelectorAll(".day").forEach(day => {
        day.addEventListener("click", function () {
            document.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
            this.classList.add("active");
            activeDay = parseInt(this.innerText);
            updateSelectedDate(activeDay);
        });
    });
}

// Selected date ko update karne ke liye
function updateSelectedDate(day) {
    const selectedDate = new Date(date.getFullYear(), date.getMonth(), day);
    document.querySelector(".event-day").innerText = selectedDate.toLocaleString('en-us', { weekday: 'long' });
    document.querySelector(".event-date").innerText = `${day} ${monthYear.innerText}`;
    
    showEvents();
}

// Event add karne ke liye
document.querySelector(".add-event-btn").addEventListener("click", function () {

    const eventName = eventNameInput.value.trim();
    const timeFrom = eventTimeFrom.value.trim();
    const timeTo = eventTimeTo.value.trim();

    if (!eventName || !timeFrom || !timeTo) {
        alert("Please fill in all fields.");
        return;
    }

    const eventDateKey = `${date.getFullYear()}-${date.getMonth()}-${activeDay}`;
    
    if (!events[eventDateKey]) {
        events[eventDateKey] = [];
    }

    events[eventDateKey].push({ name: eventName, timeFrom, timeTo });

    saveEvents();

    eventNameInput.value = "";
    eventTimeFrom.value = "";
    eventTimeTo.value = "";

    eventWrapper.style.display = "none";

    showEvents();
    renderCalendar(); 
});

// Events show karne ke liye 
function showEvents() {
    eventList.innerHTML = "";
    const eventDateKey = `${date.getFullYear()}-${date.getMonth()}-${activeDay}`;

    if (events[eventDateKey]) {
        events[eventDateKey].forEach((event, index) => {
            const eventItem = document.createElement("div");
            eventItem.classList.add("event-item");
            eventItem.innerHTML = `
                <strong>${event.name}</strong> (${event.timeFrom} - ${event.timeTo})
                <button class="edit-btn" onclick="editEvent(${index})">&#9999;</button>
                <button class="delete-btn" onclick="deleteEvent(${index})">🗑</button>
            `;
            eventList.appendChild(eventItem);
        });
    }
}

// Events edit karne ke liye 
function editEvent(index) {
    const eventDateKey = `${date.getFullYear()}-${date.getMonth()}-${activeDay}`;
    if (events[eventDateKey] && events[eventDateKey][index]) {
        const event = events[eventDateKey][index];

        eventNameInput.value = event.name;
        eventTimeFrom.value = event.timeFrom;
        eventTimeTo.value = event.timeTo;

        eventWrapper.style.display = "block";

        events[eventDateKey].splice(index, 1);
        
        saveEvents();
        showEvents();
        renderCalendar(); 
    }
}

// Events delete karne ke liye 
function deleteEvent(index) {
    const eventDateKey = `${date.getFullYear()}-${date.getMonth()}-${activeDay}`;
    
    if (events[eventDateKey]) {
        events[eventDateKey].splice(index, 1);
        
        if (events[eventDateKey].length === 0) {
            delete events[eventDateKey];
        }
        saveEvents();
        showEvents();
        renderCalendar(); 
    }
}

document.getElementById("prev").addEventListener("click", function () {
    date.setMonth(date.getMonth() - 1);
    activeDay = 1; 
    renderCalendar();
});

document.getElementById("next").addEventListener("click", function () {
    date.setMonth(date.getMonth() + 1);
    activeDay = 1; 
    renderCalendar();
});

renderCalendar();
