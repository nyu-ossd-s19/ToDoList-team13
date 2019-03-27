function getCurrentTab() {
    return browser.tabs.query({
        currentWindow: true,
        active: true,
    }).then(tabs => tabs[0]);
}

// function getCurrentUrl() {
//     return getCurrentTab().then(currTab => currTab.url);
// }

function getCurrentIcon() {
    return getCurrentTab().then(currTab => currTab.favIconUrl);
}

// display current icon in popup
async function updateIcon() {
    const icon = document.querySelector('.header__icon');
    const currIcon = await getCurrentIcon();
    if (currIcon) {
        icon.src = currIcon;
    }
}

// insert all to-do items to the popup
async function initList() {
    const listObj = await getList();
    const listArr = Object.entries(listObj);
    listArr.forEach(([id, content]) => {
        console.log(content);
        appendToDoItemInPopup(id, content);
    });
}

// listen for the event of adding a new item to storage
function listenNewToDoItem() {
    const newContent = document.getElementById('new-content');
    const newSubmit = document.getElementById('new-submit');

    newSubmit.addEventListener('click', async (event) => {
        event.preventDefault();
        // get current id counter from storage
        const idCounter = await getIdCounter();
        // send content to update and save the list in storage
        await updateAndSaveList(idCounter, newContent.value);
        // send content to the UI
        appendToDoItemInPopup(idCounter, newContent.value);
        // update the counter in the UI
        updateCounterInPopup(idCounter + 1);
    });
}

// get and return the id counter from browser storage
async function getIdCounter() {
    const idCounter = await browser.storage.local.get('idCounter');
    if (idCounter.idCounter === undefined) {
        await browser.storage.local.set({
            idCounter: 0,
        });
        return 0;
    }
    return idCounter.idCounter;
}

// using the item id and its desired content, this fn will update it in storage
async function updateAndSaveList(id, content) {
    const list = await getList();
    list[id] = content;
    await saveList(list);
    await increaseIdCounter();
}

// get current list from storage
async function getList() {
    const result = await browser.storage.local.get('list');
    if (result.list === undefined) {
        return {};
    }
    return result.list;
}

// save the current list to browser storage
async function saveList(list) {
    await browser.storage.local.set({ list });
}

// increase the id counter in browser storage by 1
async function increaseIdCounter() {
    const idCounter = await browser.storage.local.get('idCounter');
    await browser.storage.local.set({
        idCounter: idCounter.idCounter + 1,
    });
}

// append a to-do item to the end of to-do list in popup(not storage)
function appendToDoItemInPopup(id, content) {
    const container = document.querySelector('.list');
    container.appendChild(createToDoItemElement(id, content));
}

/**
 * @param id {Number/String} - ID of the to-do item
 * @param content {String} - Content of the to-do item
 * @return {Object} - An <li> element object represents the to-do item
 */
function createToDoItemElement(id, content) {
    const toDoItem = document.createElement('li');
    toDoItem.id = `todo-${id}`;
    const text = document.createElement('span');
    text.innerText = content;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'DELETE';
    delBtn.addEventListener('click', async () => {
        await removeFromList(id);
        removeToDoItemInPopup(id);
    });
    toDoItem.appendChild(text);
    toDoItem.appendChild(delBtn);
    return toDoItem;
}

async function removeFromList(id) {
    const list = await getList();
    delete list[id];
    await saveList(list);
    decreaseIdCounter();
    updateCounterInPopup(await getIdCounter() - 1);
}

function removeToDoItemInPopup(id) {
    const ele = document.getElementById(`todo-${id}`);
    ele.outerHTML = '';
}

// update the counter on the UI
function updateCounterInPopup(counter) {
    document.getElementById('counter').innerText = counter;
}

async function decreaseIdCounter() {
    const idCounter = await browser.storage.local.get('idCounter');
    await browser.storage.local.set({
        idCounter: idCounter.idCounter - 1,
    });
}

async function main() {
    // listen for a new item to be added to the list
    listenNewToDoItem();

    // wait, then update the icon
    await updateIcon();

    // wait, then update the list with the current items
    await initList();
}

main();
