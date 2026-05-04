create table if not exists products (
  id text primary key,
  name text,
  price int,
  image text,
  description text,
  stock int default 0,
  active boolean default true,
  created_at timestamp default now()
);

create table if not exists orders (
  id text primary key,
  email text,
  amount int,
  status text,
  created_at timestamp default now()
);
