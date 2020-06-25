- (checkmark) replace all 'driver' to 'toktok rider'.
- (checkmark) replace 'how are you today?' to 'tara lets ka-toktok'
- (checkmark) replace 'edit profile' to 'Profile' in navigation
- (checkmark) replace 'No Records' to ''
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
7.  (checkmark) Add push notification
8.  Add In-app chat functionality

ASAP:

1. (checkmark) Remove Total Gas Station
2. (checkmark) Upon booking, pop-up modal. "Your order has been booked" with OK button. Redirect to 'My Deliveries' page upon button clicked.
3. (checkmark) On Order Placed - Add 'Looking for your rider, ka-toktok.'
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
15. (checkmark) Add Push Notifications on Delivery Updates
16. (checkmark)Add Inbox for Delivery Updates tied to Push Notifications
    16.1 (checkmark)Send messages to consumer upon driver delivery updates
17. (checkmark) Add Login process with password
    17.1 (checkmark) Add change password on profile
18. Add CRON job to expire orders and create expiration log
19. Handle network errors
    19.1 Notification icon and small logo

Driver

1. Overhaul River App without a need to go online
2. Add Push Notifications on new orders near location (set distance in database)
3. Add provision for Rider to add his picture
4. Add Wallet History
5. Rider maximum concurrent delivery orders
6. Add provision for rider to cancel an order

Readlly Next Patch:

1. Code Refactoring
2. Granular Security
3. WYSIWYG/HTML for Announcements
4. Google Maps - Avoid Toll Roads
5. Google Maps - Routes for Motorcycles
6. Share Delivery Link, Updated Driver Info
7. Priority Fee
8. Notification Read/Unread
9. Fix Navigation to enable Android back
10. Google API Consumption

NEXT PATCH

1. Image Loader
2. Paginations
3. Blocked Users Stage 2 (If has delivery, continue to login)
4. SecureTextInput (component for passwords)
5. Booking Copy

REPORT

1. (checkmark) Enlarge Driver Pix
2. (checkmark) Booking Copy (HIDDEN, ON HOLD)
3. (checkmark) Validate 10 Digits mobile number on press
4. (checkmark) Post Registration and Profile Update email and password validation
5. (checkmark) Upon Login, if User doesn't have a nominated Password, continue with SMS Verification.
6. (checkmark) Post Registration sign out on header back and android back press
7. (checkmark) Booking sender name remains from last session
8. (checkmark) Constants
9. (checkmark) Item Description Initial Data
10. (checkmark) Move checking if customer or rider account in platform on login
11. (checkmark) Post Registration Loading
12. (checkmark) Device ID
13. (checkmark) COD
14. (checkmark) Inbox to Notifications
15. (checkmark) Blocked Users Stage 1 (On login, show blocked.)
16. (checkmark) Change Password
17. (checkmark) Check PHP Password
18. (checkmark) Forgot Password
19. (checkmark) Exposed API for Announcements, Deliveries, Announcement Consumer/Driver
20. (checkmark) Normalize Date Formats (Scalar)
21. (checkmark) Normalize ScheduledFrom / To Format
22. Announcement for Customer and Rider
23. Fix Order Type Schedule, Today Only
24. Refactor Delivery Card to Show CashOnDelivery Price
25. Constants
26. (checkmark) Generalize On Error
27. Driver UI for Cash On Delivery
28. Driver Push Notifications (Order Cancel from Customer/Driver, New Orders)
29. Version Control
30. SynerMaxx

31. Handle Network Errors on Fetch
32. Rider Interval Logs

//

1. Turn On Cron Job

//
If user is blocked, can't log in. (if has orders, go)
If device is blocked, can't login. (if has orders, go)
If device is blocked, no orders (block the account)

Constants:
Distance in km to search for drivers to send push notifications.
Support email
website
Rider logs interval
Verification Code Expiration in seconds
