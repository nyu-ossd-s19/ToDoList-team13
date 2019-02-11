function getCurrentTabs(cb) {
    browser.tabs.query({
        currentWindow: true,
        active: true,
    }, cb);
}

function main() {
    getCurrentTabs((tabs) => {
        const tab = tabs[0];
        console.log(tab.url);
    });
}

main();
