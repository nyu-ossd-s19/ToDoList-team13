function getCurrentTab() {
    return browser.tabs.query({
        currentWindow: true,
        active: true,
    }).then(tabs => tabs[0]);
}

function getCurrentUrl() {
    return getCurrentTab().then(currTab => currTab.url);
}

function getCurrentIcon() {
    return getCurrentTab().then(currTab => currTab.favIconUrl);
}

async function main() {
    // get DOM elements
    const icon = document.querySelector('.header__icon');

    // display current icon in popup
    const currIcon = await getCurrentIcon();
    if (currIcon) {
        icon.src = currIcon;
    }
}

main();
