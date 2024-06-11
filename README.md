# Fulcrum

## A free web application for budgeting and expense tracking.
Features including recurring expenses, theme customisation and data visualisation, support a holistic user experience.
Try Fulcrum today at https://fulcrumfinance.app/ !


## Budget

* Set an estimated total income.
* Starting with some defaults, create budgets for various types of expenses in your life.
* Organise your budgets into reorderable groups, choosing colours and icons that suit your tastes.
* Visualise your budget distributions by category or category group, and view more granular insights. 

## One-Time Expenses

* Log expenses as they arise, categorised by your budget (choose the 'Other' option if you haven't budgeted for it).
* View totals and records across time, aggregated by day and month.
* Recurring expenses can be created from this menu if a frequency aside from the default "None" is selected.

## Recurring Expenses

* Record expenses your expect to arise regularly to save yourself time and energy.
* Manage these recurring expenses, changing the start date, frequency, category and amount as desired.


## User Preferences

* Select a theme (dark/light).
* Toggle accessibility mode, designed for visual impairments.
* Select a display currency ($AUD, $USD, £GBP, ¥CNY, ¥JPY, ₩KRW, RZAR).
* View other application and user information.


## Technologies

* React Typescript - modular, type-safe frontend development.
* Supabase PostgreSQL - an open source alternative to Google Firebase, chosen for its native support of PostgreSQL (data integrity, schema enforcement and performance).
* Docker Compose - in-tandem container coordination, providing reproducible production environment.
* Amazon Web Services - various services used for hosting, load balancing, DNS, and SSL certificate management (EC2, ELB, Route 53, ACM).
* Kotlin Ktor - API endpoints (largely phased out in favour of direct client-interactions during late beta due to Supabase's opinionated client API for authentication)
* Tanstack React Query - mitigating race conditions, data invalidation and ridiculously verbose data state management.
* Tailwind CSS - for high-velocity styling and front-end development.


# Contribution

Contributions, issues, and feature requests are welcome!


# License

This project is open source, licensed under [APACHE 2.0](https://github.com/WeiChongDevelops/Fulcrum/blob/main/LICENSE).
