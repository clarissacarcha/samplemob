NEXT PATCH

1.  Add bookmark
2.  Connect Mobile Number to Phone Contacts
3.  Add In-app chat functionality
4.  WYSIWYG/HTML for Announcements
5.  Share Delivery Link, Updated Driver Info
6.  Priority Fee
7.  Notification Read/Unread
8.  Google API Consumption
9.  Blocked Account Chain
10. If Blocked Account has ongoing orders, continue.
11. Customer Loader and Prompt
12. (done) Google Maps - Avoid Toll Roads
13. (done) Google Maps - Routes for Motorcycles
14. (done)Fix Navigation to enable Android back
15. Granular Security

Customer Pending (FIX WALLET LOGS IF TOKTOK OPERATOR FIRST)

1. Fix Order Type Schedule, Today Only
2. Handle sender/recipient location change when other is empty. Focus on location
3. Handle skip location still invoked after Proceed
4. Toktok Logo on Image Profile
5. Toktok Consumer App Change Profile
6. (HALF) Item Description API (HARD CODE)
7. Cant Cancel If Picked Up IN API

Driver Pending

1. Can't Go Offline with Ongoing Orders
2. Don't get orders from blocked consumer account.
3. Validate Accept Orders Only Status = 1 and consumer user.status = 1
4. Rider Check Location and Camera Permission
5. Notify Riders in 100km and is-online
6. Driver Vehicle ID on Delivery on Accept
7. Ongoing Order Column on Driver
8. Add Rider Location on Go Online
9. Wallet Logs when Operator is Toktok (IF OperatorWalletID and ToktokWallet Id = same, don't insert for toktok)
10. Notify Rider of assigned order

# No operator, 0 balance. Give all to toktok.

# Finalize Timestamp

# Sort Grouped By Date And Distance

# Dont Expire ASAP created 11:30 onwards

# Font Family

# User status check... tok_users.active

# Session Flush On blocked, not active.

Good To Have

1. On Query Error Refetch
2. Image Loader
3. Paginations
4. Password Eye - SecureTextInput (component for passwords)
5. Booking Copy
6. Can't Type dots and dashes on mobile number fields.
7. Driver Ongoing Order Count (Increment/Decrement on Accept and Complete)

Current

1. (Reverse Geocode) On Booking Map, after auto detection of sender location
2. (Places API) On Search Places, on keyboard type, debounce of 1 second
3. (Reverse Geocode) On Map pinpoint location, on every move
4. (Reverse Geocode) On Confirm Sender or Recipient Details

Proposed

1. On Confirm Sender or Recipient (Detect changes to not invoke Google API on same location)
2. On Search Places, Search Button to call Google API instead of every type.

Customer Done

1. (done) Move handling blocked accounts after password
2. (done) Connect address breakdown for sender and recipient location
3. (done) Handle Network Error on app open
4. (done) Fix Navigation and allow android back
5. (done) Fix +63 issue on booking
6. (done) Fix reset location after booking
7. (done) Fix map focus animation broken by getting order price
8. (done) Validate booking for sender location if location cannot be detected
9. (done) Handle broadcast notification without payload
10. (done) Add Mobile Number under Sender/Recipient in Delivery Details
11. (done) Fix Keyboard Issue on iOS Post Registration, Edit Profile, Forgot Password etc...
12. (done) Fix input fields for iOS Change Password
13. (done) Fix no auth token when loggin in without password

Driver Done

1. (done) Fix Navigation and allow android back
2. (done) Handle Rider pending application
3. (done) Update delivery when completed with operator com rate
4. (done) Remove birthdate and gender
5. (done) Show license number
6. (done) Fix rider wallet when 0 balance
