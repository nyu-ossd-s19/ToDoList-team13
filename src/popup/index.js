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

/**
 * @param id {Number/String} - ID of the to-do item
 * @param content {String} - Content of the to-do item
 * @return {Object} - An <li> element object represents the to-do item
 */
function createToDoItemElement(id, content) {
    const toDoItem = document.createElement('li');
    toDoItem.innerText = content;
    toDoItem.id = `todo-${id}`;
    return toDoItem;
}

// append a to-do item to the end of to-do list in popup(not storage)
function appendToDoItemInPopup(id, content) {
    const container = document.querySelector('.list');
    container.appendChild(createToDoItemElement(id, content));
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
    listenNewToDoItem();
    await updateIcon();
    await initList();
}

main();
