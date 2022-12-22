export const pendingCashOutNote = key => {
  switch (key) {
    case 'bdo':
      return {
        note1: 'Remittances can be claimed as late as 08:30 PM including weekends and selected holidays.',
        note2: '',
      };
    default:
      return {
        note1: 'All transactions made before 01:00 PM will be processed within the day.',
        note2: 'All transactions after 01:00 PM will be processed the next banking day.',
      };
  }
};
