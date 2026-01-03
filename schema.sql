CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    date_of_birth TEXT,
    nrc_number TEXT,
    gender TEXT,
    position TEXT,
    start_date TEXT,
    contact_number TEXT,
    address TEXT,
    next_of_kin_name TEXT,
    next_of_kin_contact TEXT,
    next_of_kin_relationship TEXT,
    image_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
