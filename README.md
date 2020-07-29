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

1. Consumer Profile Pix
2. Ratings
3. Priority Fee
4. Saved Locations

#

1. Fix Order Type Schedule, Today Only
2. Handle sender/recipient location change when other is empty. Focus on location
3. Handle skip location still invoked after Proceed
4. (done) Toktok Logo on Image Profile
5. Toktok Consumer App Change Profile
6. (HALF) Item Description API (HARD CODE)
7. Cant Cancel If Picked Up IN API
8. (done) Toktok Logo on Splash
9. (done) Delivery ID in Delivery Details
10. (done) Announcement Overlay
11. Ratings
12. Error on Splash, retry button

Driver Pending

1. Can't Go Offline with Ongoing Orders
2. Don't get orders from blocked consumer account.
3. Validate Accept Orders Only delivery.Status = 1 and consumer user.status = 1
4. Rider Check Location and Camera Permission
5. Notify Riders in 100km and is-online
6. Driver Vehicle ID on Delivery on Accept
7. Add Rider Location on Go Online
8. (done) Notify Rider of assigned order
9. (done) Operator Details
10. (done) Push Notifs on Recharge
11. Better Update Profile

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
13. (done) Fix push notification not displayed when app is in focus.
    <!-- 15. (done) Fix app crashes on push notification without payload/additional data -->

Driver Done

1. (done) Fix Navigation and allow android back
2. (done) Handle Rider pending application
3. (done) Update delivery when completed with operator com rate
4. (done) Remove birthdate and gender
5. (done) Show license number
6. (done) Fix rider wallet when 0 balance

# PIPELINE

1. Bookmarked Locations.
2. Priority Booking

# DONE

1. (done) Referral System referral code validation after registreation and one time profile update
2. (done) Rider notification API for top up/reload credits
3. (done) Welcome Message
4. (ongoing) Referral System JC API call after delivery completion.
5. Customer/Rider Rating

#

1. (done) Rider Profile Icon to Toktok Icon
2. (done) Rider Operator Details
3. (done) Check JC Logs API
4. Queries for fetching orders, expiration
