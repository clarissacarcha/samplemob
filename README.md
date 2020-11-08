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
8. Sender receiver distance duration total amount (After JC Referral, SMS and Email)
9. Synermaxx Logs
10. Dataloader

# App TODO

1. Fetch Data something went wrong Refetch Button
2. Session invalid. Flushing of session based on error.
3. Go back button in password confirmation.
4. Notification on Rating
5. App crashing on consecutive incorrect password

# Customer TODO

1. Fix Cargo Icons
2. Sender/Recipient icons in tracking map with directions.
3. Google Search Places Refactor
4. Fix Order Type Schedule, Today Only
5. Handle sender/recipient location change when other is empty. Focus on location
6. Handle skip location still invoked after Proceed
7. (HALF) Item Description API (HARD CODE)
8. Going back from details to placed orders, place a loading indicator.
9. Move vehicle type(Motorcycle, Van) for order in front end.

# Rider TODO

1. Refactor TopTab to show icons only.
2. Fix Loop Issue on no network when getting orders
3. Rider Check Location and Camera Permission
4. Add Rider Location on Go Online
5. Can't Go Offline with Ongoing Orders today

# ASAP TODO

1. Fix Location Log subscription on Refresh of Orders (Looping)
2. Cargo Items

# SQL TODO on Live

1. tok_notifications payload and type varchar(50)

# TODO

1. Multiple Drop Offs
   1.1 Limited to Sender for Multiple Drop Offs
2. Global Settings. Limit 150 km booking distance.
3. Limit Searching of Places in Google Places Autocomplete.
4. Auto Cancel Accepted Orders at 12:00 AM

# Final R1 TODO

1. Hold rider on 3rd return to sender.
2. Radius for searching SOS.
3. Piso Padala Maximum Rider Accepted.
4. Debounce

# 1.7.0 Changelogs

1. Added Refresh button on Rider Orders

# Notes

1 user number/device, 1 booking per day
For ASAP deliveries only

Rider SideMenu - Accounts
Gcash verification. Mobile Number. Name... coming from record. Type address.
delivery discountedPrice = Ibabawas sa delivery price.
