# Supabase database setup

Finora sudah memiliki schema dan service Supabase. Data demo tetap berjalan selama environment Supabase belum diisi.

## 1. Buat project Supabase

Buat project baru di [supabase.com](https://supabase.com), lalu buka menu **SQL Editor**.

## 2. Jalankan schema

Salin seluruh isi [supabase/schema.sql](supabase/schema.sql) ke SQL Editor, lalu jalankan. Schema ini membuat:

- `profiles` untuk data pengguna
- `transactions` untuk pemasukan dan pengeluaran
- `budgets` untuk batas pengeluaran
- Row Level Security agar user hanya dapat mengakses datanya sendiri
- Trigger profile otomatis setelah user mendaftar

## 3. Matikan verifikasi email (opsional untuk demo)

Agar user langsung masuk setelah membuat akun:

1. Buka **Authentication > Providers > Email**.
2. Matikan **Confirm email**.
3. Simpan perubahan.

Pengaturan ini wajib dilakukan di dashboard Supabase. Kode frontend tidak dapat melewati verifikasi email yang diwajibkan oleh Supabase.

## 4. Isi environment variable

Salin `.env.example` menjadi `.env.local`, lalu isi dari menu **Project Settings > API**:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Jangan commit `.env.local` atau membagikan anon key bersama kredensial lain.

## 5. Service yang tersedia

File [src/services/database.js](src/services/database.js) menyediakan operasi:

- `listTransactions`, `createTransaction`, `updateTransaction`, `deleteTransaction`
- `listBudgets`, `createBudget`, `updateBudget`, `deleteBudget`

Setelah environment dan schema siap, aplikasi menggunakan Supabase Auth serta service database tersebut untuk transaksi dan budget.
