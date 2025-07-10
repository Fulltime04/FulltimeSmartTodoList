let inputItem = document.querySelector(".input");
let list_btn = document.querySelector(".list_btn");
let item_Items = document.querySelector(".item_Items");
let Clear_btn = document.querySelector(".Clear_btn");
let Currents = document.querySelector(".Current");

Clear_btn.addEventListener("click", function () {
    inputItem.value = "";
    Clear_btn.disabled = true;
});
function Clear_btn_Function() {
   if(inputItem.value == "") {
       Clear_btn.disabled = true;
   }else{
       Clear_btn.disabled = false;
   }
}
Clear_btn_Function()


    inputItem.addEventListener("input", function(){
        if(this.value !== ""){
            Clear_btn.disabled = false;
        }else{
            Clear_btn.disabled = true;
        }
    })

// window.addEventListener("keydown", function(e){
//         if (e.key === "Enter") {
//             list_btn.click()
//         }
// })

Clear_btn.addEventListener("click", function(){

})

document.addEventListener("DOMContentLoaded", function(){
    Clear_btn.disabled = true;

});
let NotificationVar = notification();

list_btn.addEventListener("click", function () {
    if (inputItem.value.trim() === "") {
        NotificationVar.classList.add("NotificationDisplay");
        NotificationVar.innerHTML = "Please Enter your task";
        setTimeout(() => {
            NotificationVar.classList.remove("NotificationDisplay");
        }, 2000);
        return;
    }

    let users = getFromStorage(); // Should return an array of task objects now
    let inputText = inputItem.value.trim();

    // Check if it already exists
    let isDuplicate = users.some(task => task.text.toLowerCase() === inputText.toLowerCase());

    if (isDuplicate) {
        NotificationVar.classList.add("NotificationDisplay");
        NotificationVar.innerHTML = "Task already exists";
        setTimeout(() => {
            NotificationVar.classList.remove("NotificationDisplay");
        }, 2000);
        return;
    }

    // Create new task with id and timestamp
    const now = Date.now();

    let newTask = {
        id: now,
        text: inputText,
        timestamp: now
    };

    users.push(newTask);

    inputItem.value = "";
    Clear_btn_Function();
    localStorage.setItem("userData", JSON.stringify(users));
    retrievFromStorage();
    TotalTask();
});
function formatTime(timestamp) {
    let date = new Date(timestamp);
    return date.toLocaleString(); // e.g., "6/30/2025, 1:30:05 PM"
}

function timeAgo(timestamp) {
    let seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + " min ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + " hrs ago";

    return Math.floor(seconds / 86400) + " days ago";
}

function startAutoUpdateTimeAgo() {

    setInterval(() => {
        let tasks = getFromStorage();
        tasks.forEach(task => {
            let el = document.querySelector(`small[data_id='${task.id}']`);
            if (el) {
                el.textContent = timeAgo(task.timestamp);
            }
        });
    }, 60000);
}
startAutoUpdateTimeAgo()


document.addEventListener("keydown", function(event){
    if(inputItem.value.length > 0){
        if(event.key === "Enter"){
            list_btn.click()
        }
    }

})

function retrievFromStorage(){
    let itemsGet = getFromStorage();

    item_Items.innerHTML = "";



    itemsGet.forEach((item,e) => {
        let itemDiv = document.createElement("div");
        itemDiv.className = "Items_Wrapper";
        itemDiv.id = "era" + e;



        itemDiv.innerHTML = `
            <label class="item_checkes">
                <input class="checkbox" type="checkbox">
            </label>
          
        <nav class="main_text">
            <div class="Item_Text_Wrapper">
                <p class="itemText">${item.text}</p>
            </div>
            
    <div class="days_Ago">
            <small class="smallLine" data_id="${item.id}">
            ${timeAgo(item.timestamp)}
</small>
    </div>
              
            </nav>
            <div class="del_mark">
                <button class="edit">
                    <i class="fas fa-user-edit"></i>
                </button>
                <button class="del">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        item_Items.append(itemDiv);
    });



    let itemText = item_Items.querySelectorAll(".itemText");
    let checkboxContent = item_Items.querySelectorAll(".checkbox");
    let editText = item_Items.querySelectorAll(".edit");
    let main_textVar = item_Items.querySelectorAll(".main_text");
    let Item_Text_WrapperVar = item_Items.querySelectorAll(".Item_Text_Wrapper");
    let trash = item_Items.querySelectorAll(".del");
    let smallLineVariable = item_Items.querySelectorAll(".smallLine");
    let NotificationVar = notification();
    let timing;



    const progressBar = document.querySelector(".Progressing");

    function updateProgress() {
        const total = checkboxContent.length;
        const checked = document.querySelectorAll(".checkbox:checked").length;
        const percentage = Math.round((checked / total) * 100);
        progressBar.style.width = `${percentage}%`;

        if(progressBar.style.width === 100 + "%"){
            NotificationVar.classList.add("NotificationDisplay");
            NotificationVar.innerHTML = "'CONGRATULATIONS' YOU JUST COMPLETED YOUR TASK, Rate our Site";
            setTimeout(() => {
                NotificationVar.classList.remove("NotificationDisplay");
            }, 8000);
        }
    }

    itemText.forEach((item, c) => {

        item.id = c;
        if(item.innerHTML.length > 90){
            item.classList.add("addElipsis");
            item.title = "Click to Seemore";

            Item_Text_WrapperVar[c].addEventListener("mouseenter", function () {
                if(!item.classList.contains("addElipsis")){
                    NotificationVar.classList.add("NotificationDisplay");
                    NotificationVar.innerHTML = "Click the Text to SeeLess";
                    setTimeout(() => {
                        NotificationVar.classList.remove("NotificationDisplay");
                    }, 2500);

                }else{
                    NotificationVar.classList.add("NotificationDisplay");
                    NotificationVar.innerHTML = "Click the Text to SeeMore";
                    setTimeout(() => {
                        NotificationVar.classList.remove("NotificationDisplay");
                    },  1000);
                }
            });
        }


        Item_Text_WrapperVar[c].addEventListener("mouseleave", function () {
            NotificationVar.classList.remove("NotificationDisplay");
        });
        item.style.cursor = "pointer";

        item.addEventListener("click", function() {
            if(this.classList.contains("addElipsis")) {
                this.classList.remove("addElipsis");
                item.title = "Click to SeeLess";
            }else{
                this.classList.add("addElipsis");
                item.title = "Click to SeeMore";
            }
        })
    })



    editText.forEach((item, e) => {
        item.addEventListener("click", function() {
            let arraying = getFromStorage();
            let currentText = itemText[e].innerHTML;


            if (item.innerHTML === "Done") {
                item.innerHTML = "<i class=\"fas fa-user-edit\"></i>";
                itemText[e].contentEditable = false;
                // Item_Text_WrapperVar[e].classList.remove("editContent");
                arraying[e].text = currentText;
                localStorage.setItem("userData", JSON.stringify(arraying));
                retrievFromStorage();

            } else {
                // Item_Text_WrapperVar[e].classList.add("editContent");
                checkboxContent[e].disabled = true
                item.innerHTML = "Done";
                itemText[e].contentEditable = true;
                itemText[e].focus();
            }
        });

    });

    document.addEventListener("keydown", function(event){
        if(event.key === "Enter"){
          editText.forEach((item, e) => {
              if (item.innerHTML === "Done") {
                  editText[e].click()
              }
          })
        }
    })

    let currentss = 0;

    function Current() {
        checkboxContent.forEach((item, e) => {
            item.addEventListener("change", function () {
                updateProgress()
                let AllCompleteTask = FinishedStorage();
                let taskText = itemText[e].innerHTML.trim();

                item.id = "input" + e;

                let existing = AllCompleteTask.find(t => t.text === taskText);

                let task = existing || {
                    id: Date.now(),
                    text: taskText
                };

                if (item.checked === false) {
                    editText[e].disabled = false;
                    trash[e].disabled = false;
                    let updatedFinished = AllCompleteTask.filter(t => t !== task);
                    localStorage.setItem("UserFinished", JSON.stringify(updatedFinished));
                    itOkay();
                    // Currents.innerHTML = currentss;
                } else {
                    editText[e].disabled = true;
                    trash[e].disabled = true
                    if(!existing){
                        AllCompleteTask.push(task);
                        localStorage.setItem("UserFinished", JSON.stringify(AllCompleteTask));
                    }

                    itOkay();
                    // currentss++;
                    // Currents.innerHTML = currentss;
                }
            });
        });

        return checkboxContent;
    }
    Current();

    function Domchecked(){

        let AllCompleteTasksDom = FinishedStorage();

            itemText.forEach((logo, t) => {
                AllCompleteTasksDom.forEach((item, e) => {
                    if(item.text === logo.innerHTML.toLowerCase()){
                        if(checkboxContent[t].checked === false){
                            checkboxContent[t].checked = true;
                            logo.style.textDecoration = "line-through";
                            logo.style.color = "gold";
                            updateProgress();
                            disableAllTrashButtons(t);
                        }
                    }
            })


        });

    }
    Domchecked()

    function itOkay(){
        let AllCompleteTasks = FinishedStorage();
        Currents.innerHTML = AllCompleteTasks.length;
    }
    itOkay();



function eventing(){

    checkboxContent.forEach((item,e) => {

        item.addEventListener("change", function (event){

            if(event.target.checked === false){
                 this.checked = false;
                 itemText[e].style.textDecoration = "none";
                 itemText[e].style.color = "white";
                 smallLineVariable[e].style.textDecoration = "none";

            }else {
                this.checked = true;
                itemText[e].style.textDecoration = "line-through";
                smallLineVariable[e].style.textDecoration = "line-through";
                itemText[e].style.color = "gold";
            }

        });
    })
}

function tick(){
    let newTick = FinishedStorage();
     newTick.forEach((item,e) =>{

     })
}
    tick()
eventing()



    function disableAllTrashButtons(e) {
        editText[e].disabled = true;
        trash[e].disabled = true
    }

    function enableAllTrashButtons() {
        trash.forEach((btn) => {
            btn.disabled = false;
        });
    }

    trash.forEach((trashBtn, x) => {
        trashBtn.id = "trash" + x;

        trashBtn.addEventListener("click", function(event) {

            let allFinished = FinishedStorage();

            let itemToDeleteText = itemText[x].innerHTML.trim();

            let matchingTask = allFinished.find(task => task.text === itemToDeleteText);

            // if (!matchingTask) return;

            let updatedFinished = allFinished.filter(task => task.text !== matchingTask);

            localStorage.setItem("UserFinished", JSON.stringify(updatedFinished));

            NotificationVar.classList.add("NotificationDisplay");
            NotificationVar.textContent = "Task was Deleted Sucessfully";


            let stateRemove = getFromStorage();

            let updatedState = stateRemove.filter((item, i) => item.text !== itemText[x].innerHTML);


            localStorage.setItem("userData", JSON.stringify(updatedState));

            retrievFromStorage();
            TotalTask();

            timing = setTimeout(() => {
                NotificationVar.classList.remove("NotificationDisplay");
                enableAllTrashButtons();
            }, 1500);
        });
    });


    itemText.forEach((item, x) => {
    item.id = x;
});




}


function getFromStorage(){
    let strItems = localStorage.getItem("userData");

    return strItems ? JSON.parse(strItems) : [];
}

function notification(){
    let div = document.createElement("div");
        div.className = "Notification";
        div.textContent = "message";

      document.querySelector("#Container").append(div)
    return div
}
let total = document.querySelector(".total");

function TotalTask(){
    let Totals = getFromStorage();

     total.innerHTML = Totals.length;
}




TotalTask()


function FinishedStorage(){
    let newStorage = localStorage.getItem("UserFinished");
    return newStorage ? JSON.parse(newStorage) : [];
}

document.addEventListener("DOMContentLoaded", function (event) {
    retrievFromStorage();
    // Domchecked()
})

// function CounterCheck(){
//     let CountingArr = localStorage.getItem("Counter");
//
//     return CountingArr ? JSON.parse(CountingArr) : [];
// }


// document.addEventListener("DOMContentLoaded", function(event) {
//     itOkay()
// })





// — ${formatTime(item.timestamp)

