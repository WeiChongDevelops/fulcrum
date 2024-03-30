# Fulcrum

Welcome to Fulcrum, a free budgeting and expense tracking web application.

The intention behind Fulcrum was to make the (often tedious) process of creating a budget and keeping track of expenses, as simple and intuitive as possible. This sentiment is reflected in the front-end design, with the user interface focused on clarity and satisfaction, and the feature set focused on the essentials for practical use.



# Getting Started

Try Fulcrum today.

The homepage provides further information, to help get you hitting the ground running as quick and easy as possible.


# Technologies Used

## React TypeScript

React was leveraged for frontend development primarily because of the modular separation of concerns enabled by its functional components.

The most utilised node packages were [@tanstack/react-query](https://www.npmjs.com/package/@tanstack/react-query) and [react-router-dom](https://www.npmjs.com/package/react-router).

The former helps prevent race conditions, improves maintainability through concise syntax and has retries, loading stat, error state and data invalidation built in.

The latter is self-explanatory.

TypeScript was used, of course, for its type safety, accelerating debugging and increasing code maintainability.


## Kotlin Ktor

Kotlin Ktor was used for construction of API endpoints - leveraged for PostgreSQL database interactions through HTTP requests from the frontend, such as data CRUD and authentication.

Kotlin is favourable over Java as an increasingly rising industry standard (we are seeing increasingly wide adoption by silicon valley giants such as Google, Netflix and Facebook). It’s null-safe, less verbose, offers coroutines, and more.


## Supabase PostgreSQL

Supabase is an open source alternative to Google Firebase, chosen for its native support of PostgreSQL. It provides database hosting and a RESTful interface to interact with PostgreSQL via HTTP client calls.

PostgreSQL was preferred for its data integrity, schema enforcement and performance.

The scalability of Google Firebase’s NoSQL databases was deemed superfluous for this project.

AWS RDS was avoided due to unnecessary cost implications.


## Docker

Docker was used to containerise the application, providing a consistent and reproducible deployment environment.

It allows for easy packaging and distribution of the application along with its dependencies, ensuring that the application runs smoothly across different systems.


## Amazon Web Services (AWS)

AWS was utilised for reliably hosting and deploying the Fulcrum application; EC2 in particular.


## Prettier

Opinionated formatter for consistent codebase format.


## Tailwind CSS

Tailwind CSS was used for styling, alongside standard CSS.

The heuristic for when each technology is used is simple:

- Tailwind CSS has been used for:
    1. Styling disparities between otherwise identical elements
    2. Single-instance unique elements that don’t require the precision of raw CSS
- With CSS used for everything else.
- Although Tailwind CSS can be used in stylesheets, its entire utility is predicated on inline use, and so it was limited to this.


# Contribution

Contributions, issues, and feature requests are welcome!


# License

This project is open source, licensed under the GNU GENERAL PUBLIC LICENSE.
