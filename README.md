#QUICK TODO

1. Openssl URL in live.
2. Cant Cancel If Picked Up IN API

# Good to Have

1. Performance/Error Logs
2. Check If Notification Received is really for the user. Can received notification. Logout, change account. Login and click notification.
3. Image Loader
4. Pagination
5. On Confirm Sender or Recipient (Detect changes to not invoke Google API on same location)
6. In-app chat
7. WYSIWYG/HTML for Announcements
8. Notification Read/Unread
9. Blocked Account Chain
10. Account status check on API. Create error codes.
11. API check for user validation on every request.
12. Fetch Data something went wrong Refetch Button
13. Session invalid. Flushing of session based on error.
14. Google Search Places Refactor
15. Refactor Rider TopTab to show icons only.

# Pipeline

1. Multiple Drop Offs
   1.1 Limited to Sender for Multiple Drop Offs
2. Global Settings. Limit 150 km booking distance.
3. Limit Searching of Places in Google Places Autocomplete.
4. Auto Cancel Accepted Orders at 12:00 AM
5. Radius for searching SOS.
6. Hold rider on 3rd return to sender.
7. Add Rider Location on Go Online
8. Can't Go Offline with Ongoing Orders today
9. Validate Enterprise Cancel if delivery is owned by Enterprise Account
10. Notification on Rating
11. Fix Loop Issue on no network when getting orders
12. Rider Check Location and Camera Permission
13. Sender/Recipient icons in tracking rider location, add directions
14. Going back from details to placed orders, place a loading indicator.
15. Move vehicle type(Motorcycle, Van) for order in front end.
16. Handle sender/recipient location change when other is empty. Focus on location
17. (HALF) Item Description API (HARD CODE)
18. Handle when operator account is put on hold.

-- Backend TODO

1. Limit viewing of history 90 days. Also related modules like notification
2. On checking number of ongoing orders, dont include delegated (to just check)
3. Sender receiver distance duration total amount (After JC Referral, SMS and Email)
4. Dataloader

-- ASAP TODO

1. Fix Location Log subscription on Refresh of Orders (Looping)

-- Final R1 TODO

1. \*\*\* Referral Name in Referral Code
2. \*\*\* Process Delivery Logs
3. \*\*\* CRON JOB ENV
4. \*\*\* Promo redeem/accept count validation, Validate in delegation also
5. Hold consumer/rider account on 5th cancel of the day
6. \*\*\* Message for Invalid Promo Code. Pop Up Message.
7. \*\*\* Debounce
8. Try Catch In API Calls. S3 Upload. Enterprise Postbacks. JC REFERRAL and PROCESS
9. Worker Threads for OneSignal Loop

# Refactor Notes

1. Check collectPaymentFrom Value R | S
2. Check if senderStop and recipientStop has formattedAddress
3. Add Pick Up Drop Off in StopCard
4. Changing Scheduled Date when scheduled To and From is already set

# Wallet 2 menu

Rider Wallet

Toktok Wallet
Toktok Wallet Balance Display
-Refresh, See History, Encash
-Encash: Encash all balance to gcash.

Incoming Data.
Remittances from promo Code.
Deliveries from Josh, Paul.
"Promo Code Delivery ID, pangalan, datetime, magkano"
"Gogome Transaction, Delivery ID'

Viewing Limit,
-default today
-date range 90 days

# Create Toktok_wallet

# CHANGE API tok toktok api

# Credit Cost Computation. Remove Express Fee

Toktok JC API

1. Target migrate API till Friday.
2. Check Price and Discounts
3. Referral Com in App
4. By Thursday, remove all account with referral code.
5. Display referral code and referral code name.

#Picture on Google Play and AppStore

1. With Alden and Main
2. Terms and Conditions
3. API
4. Wallet
5. Toktok Operator as Default

# Restructuring Plans

1. Project has to have one of each

- BA
- Web Project Lead
- Mobile Project Lead
- Web Dev Lead
- Mobile Dev Lead

2. Feature branch and code review
3. Pair programming

# 10 customer deliveries ongoing at a time? (To prevent spam bookings)

# Global Settings

- Maximum Distance for Booking

# Privacy Policy

- Run scripts to increment price with express fee for deliveries Before 2020-12-15 00:00:00

# Try Catch in process delivery referral. Catch error from API

# Create Driver ID QR Scan

# Enterprise Postback Logs

# Password Eye

# PerformanceLogs

# Admin Push Notification

# Allow same number to be used for Customer and Rider

# Consumer ID Checking on getPriceAndDirections

- id
- function
- request
- response
- success
- error
- startAt
- endAt
- duration
- errorCode
- Something went wrong. (0x0000123)

# Fields if Conditional, null, else empty string

# Tok Operator Id on rider accept.

# Refactor to refetch Delivery data on selecting delivery

# Fix Updating delivery status.

# Search Places, allow typing while loading saved locations

# Updates Done

1. (Done) Delivery cannot be cancelled when accepter or rider is on the way.
2. (Done) Use address displayed upon booking.
3. Fix Delivery Multiple Updates pumapasok
4. QR Code
