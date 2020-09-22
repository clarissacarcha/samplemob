NEXT PATCH

1.  Search from contacts instead of input mobile number manually
2.  In-app chat
3.  WYSIWYG/HTML for Announcements
4.  Share Delivery Link, Updated Driver Info
5.  Notification Read/Unread
6.  Google API Consumption
7.  Blocked Account Chain
8.  If Blocked Account has ongoing orders, continue.
9.  Customer Loader and Prompt
10. Granular Security

# Good to Have

1. On Query Error Refetch
2. Image Loader
3. Paginations
4. Password Eye - SecureTextInput (component for passwords)
5. Booking Copy
6. Can't Type dots and dashes on mobile number fields.

# Customer Pending

1. (Done) Consumer Profile Pix
2. Fix Order Type Schedule, Today Only
3. Handle sender/recipient location change when other is empty. Focus on location
4. Handle skip location still invoked after Proceed
5. (Done) Toktok Consumer App Change Profile
6. (HALF) Item Description API (HARD CODE)
7. Cant Cancel If Picked Up IN API
8. Error on Splash, retry button
9. Add Booking, Vehicle Type ID (Just in the backend) Default to Motorcycle
10. Change welcome message to welcome banners.
11. Notification on Rating
12. Limit viewable history to 15 days. Set in global settings. Also limit related modules like notifications to 15 days
13. POGI rating, conditional render
14. Going back from details to placed orders, place a loading indicator.
15. Check if User is blocked by driver or consumer status.

# Driver Pending

1. Can't Go Offline with Ongoing Orders
2. Don't get orders from blocked consumer account.
3. Validate Accept Orders Only delivery.Status = 1 and consumer user.status = 1
4. Rider Check Location and Camera Permission
5. Notify Riders in 100km and is-online
6. (Done) Driver Vehicle ID on Delivery on Accept
7. Add Rider Location on Go Online
8. Better Update Profile
9. Cannot accept order if has Express Delivery ongoing
10. Handle when operator account is put on hold.
11. (Done) On Cancel Delivery, Have a confirmation button first
12. Order Delivery Express Delivery First
13. (Done) Express Delivery Change Text to price.
14. Font family
15. (Done) Operator ID when Driver accepts orders, update on deliveries record
16. Retry button or filter button on empty available orders
17. On going back from Selected Order from available orders, refresh available orders
18. Move ConsumerChangeProfile to Common
19. Create Range and Price validation in the backend.

# Backend Pending

# Font Family

# User status check... tok_users.active

# Session Flush On blocked, not active.

Current

1. (Reverse Geocode) On Booking Map, after auto detection of sender location
2. (Places API) On Search Places, on keyboard type, debounce of 1 second
3. (Reverse Geocode) On Map pinpoint location, on every move
4. (Reverse Geocode) On Confirm Sender or Recipient Details

Proposed

1. On Confirm Sender or Recipient (Detect changes to not invoke Google API on same location)
2. On Search Places, Search Button to call Google API instead of every type.

https://oauth2.googleapis.com/tokeninfo?id_token=

1. (Delivery Rating Done)
2. Delivery Rating refactoring (New Table to support edit)
3. Edit Rating (No Edit)
4. Notification on Rating
5. (Wag Muna Itanong) Rating Tags
6. (?) How to Rate Drivers From Web Portal?
7. (?) How to Rate Customers From Web Portal?
8. (?) Show Completed Number Of Deliveries in Driver Profile
9. (?) QR Code
10. (?Marketing) Wrong Location
11. (?Marketing) No Show Recipient
12. (?Marketing) Bearing of Cancellation
13. Changes for Express Delivery (Show Breakdrown, Highlight, First in Order By)
14. Fix Notification
15. Fix Map Zooming Out,,,

PUNCH GACCESS KEYSTORE FILE

1. Notify Riders of New Deliveries (Once in 5 minutes)(View details with Accept Button)
2. Notify Customers of Their Orders (Notification > Click > Details > Track. Doesn't exist in My Deliveries)
3. Limit viewing of history 15 days
4. Delegated Booking, make not instant. Have rider accept delegated orders.
5. Sender/Recipient icons in map.

Done.

1. Cancellation with reason customer and rider.
2. Customer update profile pictures.
3. Refactor Notification.
4. Notifying Riders of new delivery.

# PENDING

1. Notification on New Orders
2. Notification on All Customers
3. Enterprise Delegation

Search Near Restaurants
Select
See Menu
Add To Cart
Check Out
Un


Fix Loop Issue on no network when getting orders
When accepting order, make sure that is its not expired, cancelled, or deleted

