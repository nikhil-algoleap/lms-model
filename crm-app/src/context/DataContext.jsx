import React, { createContext, useContext, useState, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, onValue, set, update } from 'firebase/database';

const DataContext = createContext();

// ── Provider ────────────────────────────────────────────────────────────────
export function DataProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [company, setCompany] = useState({});

  // ── Firebase Real-Time Synchronization ─────────────────────────────────────
  useEffect(() => {
    if (!rtdb) return;

    const accountsRef = ref(rtdb, 'accounts');
    const unsubscribeAccounts = onValue(accountsRef, async (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setAccounts([]);
        setContacts([]);
        setCompany({});
      } else {
        const accountsList = [];
        const globalContactsList = [];
        
        Object.values(data).forEach(accountData => {
          const { contacts: nestedContacts, ...accountDetails } = accountData;
          const contactsArray = nestedContacts ? Object.values(nestedContacts) : [];
          contactsArray.sort((a, b) => Number(a.id) - Number(b.id));
          
          accountsList.push({
            ...accountDetails,
            contacts: contactsArray
          });
          
          contactsArray.forEach(c => {
            globalContactsList.push(c);
          });
        });
        
        accountsList.sort((a, b) => Number(a.id) - Number(b.id));
        globalContactsList.sort((a, b) => Number(a.id) - Number(b.id));
        
        setAccounts(accountsList);
        setContacts(globalContactsList);
        
        // Populate fallback company state using the first account record
        const firstAccount = accountsList[0];
        if (firstAccount) {
          setCompany({
            name: firstAccount.name || '',
            industry: firstAccount.industry || '',
            website: firstAccount.website || '',
            status: firstAccount.status || '',
            description: firstAccount.description || '',
            contact: {
              email: firstAccount.contactEmail || '',
              phone: firstAccount.contactPhone || '',
              altPhone: ''
            },
            address: {
              street: firstAccount.address || '',
              city: '',
              state: '',
              country: '',
              zip: ''
            },
            details: {
              employees: firstAccount.size || '',
              revenue: '',
              type: ''
            },
            social: {
              linkedin: firstAccount.linkedin || '',
              twitter: firstAccount.twitter || '',
              instagram: firstAccount.instagram || ''
            },
            tags: firstAccount.specialties ? firstAccount.specialties.split(',').map(s => s.trim()) : []
          });
        } else {
          setCompany({});
        }
      }
    });

    return () => {
      unsubscribeAccounts();
    };
  }, []);

  // ── Database Operations ────────────────────────────────────────────────────
  const addAccount = async (account) => {
    const newId = Date.now();
    const newAccount = { ...account, id: newId, contacts: {} };
    
    try {
      await set(ref(rtdb, `accounts/${newId}`), newAccount);
    } catch (err) {
      console.error('Error adding account to RTDB: ', err);
    }
  };

  const updateAccount = async (updatedAccount) => {
    try {
      // Use update instead of set to avoid erasing nested contacts list
      await update(ref(rtdb, `accounts/${updatedAccount.id}`), {
        id: updatedAccount.id,
        name: updatedAccount.name || '',
        industry: updatedAccount.industry || '',
        location: updatedAccount.location || '',
        size: updatedAccount.size || '',
        contact: updatedAccount.contact || '',
        foundedYear: updatedAccount.foundedYear || '',
        specialties: updatedAccount.specialties || '',
        address: updatedAccount.address || '',
        linkedin: updatedAccount.linkedin || '',
        twitter: updatedAccount.twitter || '',
        instagram: updatedAccount.instagram || '',
        website: updatedAccount.website || '',
        status: updatedAccount.status || '',
        description: updatedAccount.description || '',
        contactEmail: updatedAccount.contactEmail || '',
        contactPhone: updatedAccount.contactPhone || ''
      });
    } catch (err) {
      console.error('Error updating account in RTDB: ', err);
    }
  };

  const addContact = async (contact) => {
    const newId = Date.now();
    const newContact = { ...contact, id: newId };
    
    try {
      const matchingAccount = accounts.find(a => a.name === contact.company);
      const accountId = matchingAccount ? matchingAccount.id : 'unassociated';
      await set(ref(rtdb, `accounts/${accountId}/contacts/${newId}`), newContact);
    } catch (err) {
      console.error('Error adding contact to RTDB: ', err);
    }
  };

  const updateContact = async (updatedContact) => {
    try {
      const oldContact = contacts.find(c => c.id === updatedContact.id);
      const oldAccount = oldContact ? accounts.find(a => a.name === oldContact.company) : null;
      const newAccount = accounts.find(a => a.name === updatedContact.company);
      
      const oldAccountId = oldContact ? (oldAccount ? oldAccount.id : 'unassociated') : 'unassociated';
      const newAccountId = newAccount ? newAccount.id : 'unassociated';
      
      if (oldAccountId !== newAccountId) {
        // Contact company changed: remove from old account contacts path
        await set(ref(rtdb, `accounts/${oldAccountId}/contacts/${updatedContact.id}`), null);
      }
      // Save under the new parent account contacts path
      await set(ref(rtdb, `accounts/${newAccountId}/contacts/${updatedContact.id}`), updatedContact);
    } catch (err) {
      console.error('Error updating contact in RTDB: ', err);
    }
  };

  const deleteContact = async (contactId) => {
    try {
      const contact = contacts.find(c => c.id === contactId);
      const account = contact ? accounts.find(a => a.name === contact.company) : null;
      const accountId = account ? account.id : 'unassociated';
      await set(ref(rtdb, `accounts/${accountId}/contacts/${contactId}`), null);
    } catch (err) {
      console.error('Error deleting contact from RTDB: ', err);
    }
  };

  const updateCompany = async (updatedCompany) => {
    try {
      // Map company profile update back to CBRE account (ID 1)
      await update(ref(rtdb, 'accounts/1'), {
        name: updatedCompany.name || 'CBRE',
        website: updatedCompany.website || '',
        status: updatedCompany.status || '',
        description: updatedCompany.description || '',
        contactEmail: updatedCompany.contact?.email || '',
        contactPhone: updatedCompany.contact?.phone || '',
        address: updatedCompany.address?.street || '',
        size: updatedCompany.details?.employees || '',
        linkedin: updatedCompany.social?.linkedin || '',
        twitter: updatedCompany.social?.twitter || '',
        instagram: updatedCompany.social?.instagram || '',
        specialties: updatedCompany.tags ? updatedCompany.tags.join(', ') : ''
      });
    } catch (err) {
      console.error('Error updating company profile in RTDB: ', err);
    }
  };

  return (
    <DataContext.Provider value={{ 
      accounts, addAccount, updateAccount,
      contacts, addContact, updateContact, deleteContact,
      company, updateCompany,
      isFirebaseConfigured: true
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
