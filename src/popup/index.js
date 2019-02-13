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

// add a new to-do item to storage
function addNewToDoItem() {
    const newContent = document.getElementById('new-content');
    const newSubmit = document.getElementById('new-submit');

    newSubmit.addEventListener('click', async (event) => {
        event.preventDefault();
        const idCounter = await getIdCounter();
        const content = newContent.value;
        await updateAndSaveList(idCounter, content);
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

async function main() {
    addNewToDoItem();
    await updateIcon();
    await getIdCounter();
}

main();
