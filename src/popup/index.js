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

async function increaseIdCounter() {
    const idCounter = await browser.storage.local.get('idCounter');
    await browser.storage.local.set({
        idCounter: idCounter.idCounter + 1,
    });
}

async function getList() {
    const result = await browser.storage.local.get('list');
    console.log(result.list);
    if (result.list === undefined) {
        return {};
    }
    return result.list;
}

async function saveList(list) {
    await browser.storage.local.set({ list });
}

async function updateAndSaveList(id, content) {
    const list = await getList();
    list[id] = content;
    await saveList(list);
    await increaseIdCounter();
}

async function removeFromList(id) {
    const list = await getList();
    delete list[id];
    await saveList(list);
}

function removeToDoItemInPopup(id) {
    const ele = document.getElementById(`todo-${id}`);
    ele.outerHTML = '';
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

// append a to-do item to the end of to-do list in popup(not storage)
function appendToDoItemInPopup(id, content) {
    const container = document.querySelector('.list');
    container.appendChild(createToDoItemElement(id, content));
}

// update the counter on the UI
function updateCounterInPopup(idCounter) {
    document.getElementById('counter').innerText = idCounter;
}

// listen the event to add a new to-do item to storage
function listenNewToDoItem() {
    const newContent = document.getElementById('new-content');
    const newSubmit = document.getElementById('new-submit');

    newSubmit.addEventListener('click', async (event) => {
        event.preventDefault();
        const idCounter = await getIdCounter();
        const content = newContent.value;
        await updateAndSaveList(idCounter, content);
        appendToDoItemInPopup(idCounter, content);
        updateCounterInPopup(idCounter);
    });
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

async function main() {
    // listen for a new item to be added to the list
    listenNewToDoItem();

    // wait, then update the icon
    await updateIcon();

    // wait, then update the list with the current items
    await initList();
}

main();
