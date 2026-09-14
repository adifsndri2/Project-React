# Finora

Finora is a personal finance dashboard built with React and Supabase. It helps users track income, expenses, monthly budgets, and spending insights in one focused workspace.

## Features

- Supabase email authentication and account registration
- Persistent transactions stored in PostgreSQL
- Transaction CRUD: create, read, update, and delete
- Transaction search and income/expense filters
- Budget CRUD with category selection from expense transactions
- Budget progress calculated from matching transaction categories
- Dynamic total balance, monthly income, monthly spending, and savings rate
- Balance activity chart based on cumulative transactions
- Spending breakdown based on expense categories
- Settings and Help Center views
- Responsive desktop and mobile layout

## Tech Stack

- React 18
- Vite
- Supabase Auth
- Supabase PostgreSQL
- `@supabase/supabase-js`
- Lucide React
- Custom CSS

## Run Locally

### Requirements

- Node.js 20+
- A Supabase project
- The database schema applied to Supabase

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Do not commit `.env.local`. It is ignored by Git.

### Create the database

1. Open the Supabase project.
2. Go to **SQL Editor**.
3. Open [supabase/schema.sql](supabase/schema.sql).
4. Copy the complete SQL file into a new Supabase query.
5. Click **Run**.
6. Confirm that `profiles`, `transactions`, and `budgets` exist in **Table Editor**.

The schema includes Row Level Security so users can only access their own records.

### Optional: disable email confirmation for demo

For direct login after registration, open **Authentication > Providers > Email** in Supabase and disable **Confirm email**. This is suitable for a local portfolio demo; production applications should use email confirmation.

### Start the app

```bash
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
  components/
    Budgets.jsx          # Budget CRUD and progress view
    Dashboard.jsx        # Overview cards, chart, and spending breakdown
    HelpCenter.jsx       # Searchable help center and FAQ
    LoginScreen.jsx      # Supabase sign-in and registration
    Settings.jsx         # User preferences
    TransactionModal.jsx # Transaction create/edit/delete modal
    Transactions.jsx     # Search, filters, and transaction list
  lib/
    supabase.js          # Supabase client configuration
  services/
    auth.js              # Supabase Auth operations
    database.js          # Transaction and budget CRUD operations
  data.js                # UI data and formatting helpers
  main.jsx               # App state and navigation coordinator
supabase/
  schema.sql             # PostgreSQL tables, RLS policies, and auth trigger
```

## Database Model

- `profiles`: user profile created by an Auth trigger
- `transactions`: income and expense records linked to `auth.users`
- `budgets`: monthly category limits linked to `auth.users`

Budget spending is calculated in the UI from expense transactions whose category matches the budget category.

## Repository

GitHub: [adifsndri2/Project-React](https://github.com/adifsndri2/Project-React)
