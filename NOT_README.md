# Consumers and Drivers

0. Incomplete Registration (Consumers)
1. Active
2. Pending (Drivers)
3. Blocked
4. On Hold(Can't Book, Accept)

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
4. Auto Cancel Accepted Orders at 12:00 AM (Don't)
5. Radius for searching SOS.
6. Hold rider on 3rd return to sender.
7. Add Rider Location on Go Online
8. Can't Go Offline with Ongoing Orders today
9. Validate Enterprise Cancel if delivery is owned by Enterprise Account
10. Notification on Rating
11. Rider Check Location and Camera Permission
12. Sender/Recipient icons in tracking rider location, add directions
13. Going back from details to placed orders, place a loading indicator.
14. Move vehicle type(Motorcycle, Van) for order in front end.
15. Handle sender/recipient location change when other is empty. Focus on location
16. (HALF) Item Description API (HARD CODE)
17. Handle when operator account is put on hold.

-- Backend TODO

1. Limit viewing of history 90 days. Also related modules like notification
2. On checking number of ongoing orders, dont include delegated (to just check)
3. Sender receiver distance duration total amount (After JC Referral, SMS and Email)
4. Dataloader

-- ETC TODO

1. Try Catch In API Calls. S3 Upload. Enterprise Postbacks. JC REFERRAL and PROCESS
2. Worker Threads for OneSignal Loop

# Wallet History Viewing Limit,

1. default today
2. date range 90 days

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

# Privacy Policy

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

# Fields if Conditional, null, else empty string. Create Scalar NullString

# Fix Updating delivery status. Crosscheck with Delivery Logs

# Search Places, allow typing while loading saved locations

# Pag sunorin, checking status and updating delivery status

# REFRESH TOKEN

# DATA LOADER

# Updates Done (Solid validation in updating deliveries)

1. (Done) Customer can only cancel Order Placed and Scheduled for Delivery
2. (Done) Use address displayed upon booking.
3. Boss API error logs
4. (Done) Maximum Booking Distance
5. (Done) Validate accepting order with where tokDriverId is null on update.
6. (Done) Prevent new order notification being viewed if order is already accepted.
7. Use delivery updated at
8. Enterprise API Logs
9. In App, when clicking new order notification if already accepted, do not show.
10. Hold accounts after 5 consecutive cancellations
11. Send email on 1st account hold, succeeding, relay to call center.
12. Prevent customers on hold to create booking
13. Prevent drivers on hold to accept booking
14. Driver QR Code
15. Fix Delivery Multiple Updates pumapasok
16. Include name and number on push notification.
17. Customer Scan Driver QR Code
18. Accept Terms and Conditions (I agree. I don't agree.)
19. Real Time Tracking
20. Real Time
21. Performance Logs

postDelivery check status - 1

Your account has been temporarily disabled due to multiple accepted order cancellation. Please check your email for instructions.

1. Check Join Status
2. Check user status on actions

# ToFoo toktok API

#

1. Tok Blocked devices and logs alter add status
2. Block consumer when booking if status = 3
3. Web booking create consumer account
4. Maximum OTP

#

1. Create Marketing APK
2. ADD Admin API error logs
