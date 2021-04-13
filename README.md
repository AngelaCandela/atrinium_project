# Atrinium tech-test
Simple app made with Symfony, MySQL, React, CSS and Bootstrap
## Table of contents
- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)
## General info
An app whose goal is to allow the user to manage companies and sectors.

The project consists of a basic CRUD of two entities called Company and Sector, persistent in a MySQL database.
- The entity Company has the following fields: id, name, telephone, email, sector.
- The entity Sector has the following fields: id, name.

The project consists of the following pages:
1. Home page with two links: Companies and Sectors. Each link takes to a different page where all the instances of the corresponding entity are listed.
2. Paginated and filterable list of companies showing all of the entity's fields, as well as buttons on each row to edit and delete the instance. Besides, a button at the bottom of the list allows you to create a new company.
3. Form to edit or create companies with compulsory fields and a select input showing all the available sectors stored in the database. The form features email validation and two buttons to save or discard the changes.
4. Company deletion confirmation page with two buttons to delete the company from the database or cancel the operation and go back to the companies list page.
5. Paginated list of sectors showing all of the entity's fields, as well as buttons on each row to edit and delete the instance. Besides, a button at the bottom of the list allows you to create a new sector.
6. Form to edit or create sectors with compulsory fields and validating that a sector with the same name doesn't already exist in the database. The form also features two buttons to save or discard the changes.
7. Sector deletion confirmation page with two buttons to delete the sector from the database or cancel the operation and go back to the sectors list page. In the event that the sector we wish to delete is being used by one or more companies, it will return an error message and abort the oparation.

The project also features:
- Pagination using the bundle Pagerfanta showing lists of 10 items per page as well as relevant information on: total number of pages, total number of items and allowing to navigate through the pages.
- Possibility to filter companies by name (text input) and sector (select input). The filters are made using React useState Hook so they persist.
## Technologies
- Symfony 5
- MySQL
- React
- CSS 3
- Bootstrap
## Setup
Follow the steps in this link to clone this repository https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository
$ git clone g
