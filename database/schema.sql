-- database/schema.sql

-- Extensie voor het genereren van UUIDs indien nodig, hoewel we Firebase UIDs (TEXT) zullen gebruiken.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types voor gestandaardiseerde, leesbare velden
CREATE TYPE user_status AS ENUM ('actief', 'pending_approval', 'niet geverifieerd', 'gedeactiveerd', 'rejected');
CREATE TYPE subscription_status AS ENUM ('actief', 'opgezegd', 'gepauzeerd', 'proefperiode');

-- Nieuwe tabel voor dynamische rollen
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- Hoofdtabel voor alle gebruikers in het platform
CREATE TABLE users (
    id TEXT PRIMARY KEY, -- Firebase UID
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role_id UUID REFERENCES roles(id),
    status user_status NOT NULL DEFAULT 'niet geverifieerd',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- Koppeltabel voor de ouder-kind relatie
-- Dit zorgt voor een flexibele many-to-many relatie (hoewel meestal one-to-many)
CREATE TABLE parent_child_links (
    parent_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (parent_id, child_id)
);

-- Specifieke details voor Tutors
CREATE TABLE tutor_details (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    subjects TEXT[], -- Array van vakken
    hourly_rate NUMERIC(10, 2),
    bio TEXT,
    availability TEXT, -- Kan later een meer gestructureerde tabel worden
    average_rating NUMERIC(3, 2),
    total_revenue NUMERIC(10, 2) DEFAULT 0
);

-- Specifieke details voor Coaches
CREATE TABLE coach_details (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    specializations TEXT[], -- Array van specialisaties
    hourly_rate NUMERIC(10, 2),
    bio TEXT,
    availability TEXT
);

-- Tabel voor abonnementen, gekoppeld aan ouders
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL, -- bv. 'family_guide_monthly'
    status subscription_status NOT NULL,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    next_billing_date TIMESTAMPTZ
);

-- Indexen voor snellere lookups
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_parent_child_links_child_id ON parent_child_links(child_id);

-- Initiële data (optioneel, voor development)
-- Voeg de standaardrollen toe aan de roles tabel
INSERT INTO roles (name, description) VALUES
('admin', 'Beheerder met volledige toegang tot het platform'),
('ouder', 'Ouder-account, gekoppeld aan leerlingen'),
('leerling', 'Leerling-account, voor de eindgebruiker'),
('tutor', 'Tutor-account, voor het geven van bijles'),
('coach', 'Coach-account, voor professionele begeleiding');


COMMIT;
