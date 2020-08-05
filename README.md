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

1. Consumer Profile Pix
2. Ratings
3. Saved Locations
4. Fix Order Type Schedule, Today Only
5. Handle sender/recipient location change when other is empty. Focus on location
6. Handle skip location still invoked after Proceed
7. Toktok Consumer App Change Profile
8. (HALF) Item Description API (HARD CODE)
9. Cant Cancel If Picked Up IN API
10. Error on Splash, retry button

# Driver Pending

1. Can't Go Offline with Ongoing Orders
2. Don't get orders from blocked consumer account.
3. Validate Accept Orders Only delivery.Status = 1 and consumer user.status = 1
4. Rider Check Location and Camera Permission
5. Notify Riders in 100km and is-online
6. Driver Vehicle ID on Delivery on Accept
7. Add Rider Location on Go Online
8. Better Update Profile

# Backend Pending

# Finalize Timestamp

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
