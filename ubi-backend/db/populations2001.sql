The Standalone UBI Calculator has some errors.  To begin with, in the UBI Calculator Parameters, the Tax Year Dropdown box only offers
2 years, and obviously does not query the database to get its' values.

http://localhost:5173/api/deciles
http://localhost:5173/api/years
http://localhost:5173/standalone-app.html
decile-calculator-svg-demo.html

I want the decile income chart on the standalone-app to be a little different:  A multi-bar (stacked) chart with before-taxes total income and on top of that the yearly ubi amount.  The next bar to the right will be after-taxes total income (old) and the bar to the right of that will be before_taxes_total_income - (before_taxes_total_income + UBI -exemption) * flat_tax.  