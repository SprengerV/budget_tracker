let db;
let budgetVersion;

const checkDatabase = () => {
    console.log('Checking DB');
    let transaction = db.transaction(['BudgetStore'], 'readwrite');
    const store = transaction.objectStore('BudgetStore');
    const getAll = store.getAll();
    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(res => {
                if (res.longth !== 0) {
                    transaction = db.transaction(['BudgetStore'], 'readwrite');
                    const currentStore = transaction.objectStore('BudgetStore');
                    currentStore.clear();
                    console.log('Clearing local store')
                }
            });
        }
    }
}
const saveRecord = record => {
    console.log('Saving record');
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
    const store = transaction.objectStore('BudgetStore');
    store.add(record);
}

const request = indexedDB.open('BudgetDB', budgetVersion || 21);

request.onupgradeneeded = e => {
    console.log('IndexedDB upgrade needed');
    !db.objectStoreNames.includes('BudgetStore') ?
        db.createObjectStore('BudgetStore', { autoIncrement: true })
        :
        console.log('Datastore already exists');
};
request.onerror = e => console.log(e.target.errorCode);
request.onsuccess = e => {
    console.log('Great success');
    db = e.target.result;
    if (navigator.onLine) {
        console.log('Backend online');
        checkDatabase();
    }
};

window.addEventListener('online', checkDatabase);