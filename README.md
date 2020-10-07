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

# Backend TODO

1. Enterprise Booking API with PostbackURL
2. Account status check on API. Create error codes.
3. API check for user validation on every request.
4. Move getting price, distance, duration, address breakdown in backend
5. Handle when operator account is put on hold.
6. Limit viewing of history 15 days. Also related modules like notification
7. On checking number of ongoing orders, dont include delegated (to just check)
8. Synermaxx Logs
9. Dataloader

# App TODO

1. Fetch Data something went wrong Refetch Button
2. Session invalid. Flushing of session based on error.
3. Go back button in password confirmation.
4. Notification on Rating
5. JC API SMS and Email

# Customer TODO

1. Fix Cargo Icons
2. Sender/Recipient icons in tracking map with directions.
3. Google Search Places Refactor
4. Fix Order Type Schedule, Today Only
5. Handle sender/recipient location change when other is empty. Focus on location
6. Handle skip location still invoked after Proceed
7. (HALF) Item Description API (HARD CODE)
8. Going back from details to placed orders, place a loading indicator.
9. Move vehicle type for order in front end.

# Rider TODO

1. Refactor TopTab to show icons only.
2. Fix Location Log subscription on Refresh of Orders (Looping)
3. Hide Delivery Details for Driver When Delivery.tokDriverId is not him
4. Fix Loop Issue on no network when getting orders
5. Cant refetch orders when empty orders
6. Rider Check Location and Camera Permission
7. Add Rider Location on Go Online
8. Rider Check Location and Camera Permission
9. Can't Go Offline with Ongoing Orders today

# ASAP TODO

1. Contact numbers for sender and recipient mobile (Overide contact name and number.)
2. ~~MapView of Orders~~
3. ~~Express Delivery Sorting~~
4. ~~Welcome Banners~~
5. ~~Scrollable Sidebar~~
6. ~~REDIS~~
7. ~~5 minis limit for nearby order notification.~~
8. ~~Add Saved Location Delete~~
9. ~~Add Booking, Vehicle Type ID (Just in the backend) Default to Motorcycle~~
10. ~~Fix TimeStamp~~
11. ~~Variable kilometers in sending riders of new order notification~~
12. ~~Fix IOS Saved Location~~
13. ~~Search Locations of Available Orders~~
14. ~~Check if User is blocked by driver or consumer status.~~
15. ~~When accepting order, make sure that is its not expired, cancelled, or deleted~~
16. ~~Don't get orders from blocked consumer account.~~
17. ~~Don't accept orders if consumer is blocked.~~
18. ~~Cannot accept order if has Express Delivery ongoing.~~
19. ~~POGI rating, conditional render~~

#Toktok x Gogome

1. Confirming Orders. Able to bypass confirmation or have number of stocks to consume.
2. Payment, credit card, visa master, JC wallet.
3. Create toktok wallet. Reloading. (toktok wallet)
4. Limited top up amounts. 1000, 2000, 5000. Note cannot be encashed.
5. Order hold payment until item delivered.
6. Fixed Delivery Fee?
7. Use toktok price calculation.
8. Location permission allow disable. Allow searching for location first.

Tokwa Rider. (encashable)
Tokwa User. ()
Tokwa Operator

#

1. Fixed cannot scroll in pinpoint location on iOS

PAYKASH ACCESS

If has referral code and item delivered, text to referral code user's mobile number.
Also send email.
Can be injected in JC api?

Sender receiver distance duration total amount

1. Customer
2. Rider
3. Operator

4. Tanung kay boss kung magsesend ng sms kay sender and recipient upon booking.

.Check announcement

# SQL TODO on Live

1. Check for cancellation reasons
2. Check for rates of clusters
3. tok_consumers.status default value 1
