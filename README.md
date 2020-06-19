- (checkmark) replace all 'driver' to 'toktok rider'.
- (checkmark) replace 'how are you today?' to 'tara lets ka-toktok'
- (checkmark) replace 'edit profile' to 'Profile' in navigation
- replace 'No Records' to ''
- (checkmark) SMS semaphore account
- iOS build

USER APP

NEXT PATCH:

1.  (checkmark) Create custom hook on search current location
2.  Add bookmark
3.  Connect Mobile Number to Phone Contacts
4.  (checkmark) Add Note: "Please describe your item"
5.  Add COD option upon booking
6.  Update dispatch by creating orders for pickup list
7.  Add push notification
8.  Add In-app chat functionality

ASAP:

1. (checkmark) Remove Total Gas Station
2. (checkmark) Upon booking, pop-up modal. "Your order has been booked" with OK button. Redirect to 'My Deliveries' page upon button clicked.
3. On Order Placed - Add 'Looking for your rider, ka-toktok.'
4. (checkmark) Add rider detail card on My Deliveries
5. (checkmark) Add CANCEL functionality, until items are picked-up
6. (checkmark) Scheduled pick-up, place date and time

RIDER APP

1. Set driver booking acceptance limit on admin side
2. Add CANCEL funcitonality on rider app

Additionals

1. (checkmark) toktok icon for branding on customer map

Questions:

1. Ung “Your Location” boss dun sa sender details, palitan ba natin ng “Sender Location”? Since pwedeng mag-book ako na hindi sakin ung pick up point.

Customer

1. (checkmark) Move toktok branding icon to upper left with menu icon
2. (checkmark) Add "Looking for your rider, ka-toktok" on Delivery Card for Placed Orders
3. (checkmark) Fix behavior issue in map
4. (checkmark) Display username on Profile
5. (checkmark) Add Talk to Us (Website and Email)
6. (checkmark) Change schedule to Order Type (As soon as possible, Scheduled)
7. (checkmark) Fix Anytime-Anytime values
   7.1 (checkmark) Load selected schedule on sender and recipient edit
8. (checkmark) Add 1 hour minimum to Scheduled Order Type
9. (checkmark) Display Order Type on Delivery Cards and Selected Delivery Details
10. (checkmark) Add GPS loading screen
    10.1 (checkmark) Allow consumers to book without GPS location
11. (checkmark) Add message prompt for GPS location can't be found (no message, goes straight to booking)
12. (checkmark) Display rider picture on Selected Delivery Details
13. (checkmark) Add Announcements already connected to database
14. (checkmark) Add Persistent Session
    14.1 (checkmark) Fix session error on newly created accounts
15. Add Push Notifications on Delivery Updates
16. Add Inbox for Delivery Updates tied to Push Notifications
    16.1 Send messages to consumer upon driver delivery updates
17. (checkmark) Add Login process with password
    17.1 (checkmark) Add change password on profile
18. Add CRON job to expire orders and create expiration log
19. Handle network errors

Driver

1. Overhaul River App without a need to go online
2. Add Push Notifications on new orders near location (set distance in database)
3. Add provision for Rider to add his picture
4. Add Wallet History
5. Rider maximum concurrent delivery orders
6. Add provision for rider to cancel an order

Readlly Next Patch:

1. Schedule Validation (Recipient schedule must be greater than Sender schedule)
2. Code Refactoring
3. Paginations
4. Image Loader
5. Granular Security
6. WYSIWYG/HTML for Announcements
7. Avoid Toll Roads
8. Routes for Motorcycles
9. Share Delivery Link, Updated Driver Info
10. Announcement No Data

Check UI of Scheduled Order Type, but one stop is ASAP
Constants

TODO:

1. Move checking if customer or rider account in platform on login
