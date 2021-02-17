FLATRATE = 60
PERKM = 6
TRESHOLD = 1
COMRATE = 20%

RIDER1 Delivery

- DISTANCE = 100km
- P660.00
- Collect From Sender
- CREDIT_COST = P132.00

PARENT_DELIVERY = 60
DROP1 (21km) = 120
DROP2 (20km) = 120
DROP3 (20km) = 120
DROP4 (20km) = 120
DROP5 (20km) = 120

# SCENARIO

RIDER1 Delivered DROP1.

- Earned P96.00
- Deduct Wallet P24.00

RIDER1 Delivered DROP2.

- Earned P96.00
- Deduct Wallet P24.00

RIDER1 Delivered DROP3.

- Earned P96.00
- Deduct Wallet P24.00

Nasiraan si RIDER1 after DROP3, 5km distance to DROP4.

Transfer PARENT_DELIVERY, DROP4 and DROP5 to RIDER2.
RIDER1 pays P300.00 to RIDER2

RIDER2 Delivered DROP4.

- Earned P96.00
- Deduct Wallet P24.00

RIDER2 Delivered DROP5.

- Earned P96.00
- Deduct Wallet P24.00

RIDER2 completed delivery

- Earned P48.00
- Deduct Wallet P12.00

# TOTAL EARNINGS

RIDER1 earned P288.00
RIDER1_OPERATOR earned P72.00

RIDER2 earned P240.00
RIDER2_OPERATOR earned P60.00

# TALLY

- 288 + 72 + 240 + 60 = P660

NOTE:
RIDER1 won't earn from the 15km he traveled from DROP3 to DROP4.
