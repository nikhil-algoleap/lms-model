// Shared storage helper for the prototype
const LMS_STORE = {
    ACCOUNTS_KEY: 'algoleap_accounts',

    // Get all accounts (combining defaults + custom)
    getAccounts: function() {
        const defaults = ['DHL', 'Thomson Reuters', 'IDP Education', 'Cargill', 'CBRE', 'Cornerstone', 'Maersk', 'KPMG', 'ADP'];
        const custom = JSON.parse(localStorage.getItem(this.ACCOUNTS_KEY) || '[]');
        // Return unique list
        return [...new Set([...defaults, ...custom])].sort();
    },

    // Add a new account
    addAccount: function(name) {
        if (!name) return;
        const custom = JSON.parse(localStorage.getItem(this.ACCOUNTS_KEY) || '[]');
        if (!custom.includes(name)) {
            custom.push(name);
            localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(custom));
        }
    }
};
