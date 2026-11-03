-- =============================================================================
-- DefectDojo test framework — synthetic PostgreSQL schema
--
-- This file provides a STRUCTURED-SYNTHETIC schema derived from the canonical
-- DefectDojo `models.py` files in https://github.com/DefectDojo/django-DefectDojo
-- (dojo/product/models.py, dojo/product_type/models.py, dojo/engagement/models.py,
-- dojo/finding/models.py).
--
-- It is NOT a verbatim `pg_dump` of a running DefectDojo (the public sandbox at
-- demo.defectdojo.org does not expose PostgreSQL credentials, and capturing from
-- a self-hosted DefectDojo is documented in scripts/dump-seed.sh).
--
-- What this file does:
-- * Create the six tables the DB suite reads and writes: auth_user,
--   dojo_product_type, dojo_sla_configuration, dojo_product, dojo_engagement,
--   dojo_test_type, dojo_test, dojo_finding.
-- * Mirror the columns, CHECK constraints, and FK NOT NULL requirements of the
--   source models — minus optional FKs and M2M relations that would otherwise
--   pull in ~50 more tables we don't need.
-- * Seed one row each in auth_user (admin), dojo_product_type, and
--   dojo_sla_configuration so the chain `finding → test → engagement → product
--   → product_type` is satisfiable from defaults.
--
-- Replace this with a real `pg_dump` from your local DefectDojo when available.
-- Path of the seed file: tests-db/fixtures/seed/initdb.sql (gitignored, .gitkeep
-- placeholder pre-existed). Capture command: see scripts/dump-seed.sh.
--
-- Models read on 2026-10-20:
--   sha pin: master @ DefectDojo/django-DefectDojo
--   dojo/product/models.py            (Product, 325 lines)
--   dojo/product_type/models.py       (Product_Type, 91 lines)
--   dojo/engagement/models.py         (Engagement, 214 lines)
--   dojo/finding/models.py            (Finding, 1811 lines)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. Reset (idempotent — drops everything cleanly on re-seed)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS dojo_finding          CASCADE;
DROP TABLE IF EXISTS dojo_test             CASCADE;
DROP TABLE IF EXISTS dojo_test_type       CASCADE;
DROP TABLE IF EXISTS dojo_engagement       CASCADE;
DROP TABLE IF EXISTS dojo_product          CASCADE;
DROP TABLE IF EXISTS dojo_sla_configuration CASCADE;
DROP TABLE IF EXISTS dojo_product_type     CASCADE;
DROP TABLE IF EXISTS auth_user              CASCADE;

DROP SEQUENCE IF EXISTS auth_user_id_seq;
DROP SEQUENCE IF EXISTS dojo_product_id_seq;
DROP SEQUENCE IF EXISTS dojo_product_type_id_seq;
DROP SEQUENCE IF EXISTS dojo_sla_configuration_id_seq;
DROP SEQUENCE IF EXISTS dojo_engagement_id_seq;
DROP SEQUENCE IF EXISTS dojo_test_id_seq;
DROP SEQUENCE IF EXISTS dojo_test_type_id_seq;
DROP SEQUENCE IF EXISTS dojo_finding_id_seq;

-- -----------------------------------------------------------------------------
-- 1. auth_user — minimal Django default user table
-- -----------------------------------------------------------------------------
CREATE TABLE auth_user (
    id              bigserial PRIMARY KEY,
    username        varchar(150) NOT NULL UNIQUE,
    password        varchar(128) NOT NULL,
    email           varchar(254),
    first_name      varchar(150),
    last_name       varchar(150),
    is_active       boolean NOT NULL DEFAULT true,
    is_staff        boolean NOT NULL DEFAULT false,
    is_superuser    boolean NOT NULL DEFAULT false,
    last_login      timestamptz,
    date_joined      timestamptz NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. dojo_product_type
-- -----------------------------------------------------------------------------
CREATE TABLE dojo_product_type (
    id                bigserial PRIMARY KEY,
    name              varchar(255) NOT NULL UNIQUE,
    description       varchar(4000),
    critical_product  boolean NOT NULL DEFAULT false,
    key_product       boolean NOT NULL DEFAULT false,
    created           timestamptz NOT NULL DEFAULT NOW(),
    updated           timestamptz NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. dojo_sla_configuration (minimal — Product requires FK to it)
-- -----------------------------------------------------------------------------
CREATE TABLE dojo_sla_configuration (
    id          bigserial PRIMARY KEY,
    name        varchar(100) NOT NULL,
    description text,
    created     timestamptz NOT NULL DEFAULT NOW(),
    updated     timestamptz NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. dojo_product — the "assets" entity
-- -----------------------------------------------------------------------------
CREATE TABLE dojo_product (
    id                                  bigserial PRIMARY KEY,
    name                                varchar(255) NOT NULL UNIQUE,
    description                         varchar(4000) NOT NULL,
    prod_type_id                         bigint       NOT NULL REFERENCES dojo_product_type(id) ON DELETE RESTRICT,
    sla_configuration_id                bigint       NOT NULL DEFAULT 1 REFERENCES dojo_sla_configuration(id) ON DELETE RESTRICT,
    business_criticality                 varchar(16)  CHECK (business_criticality IS NULL OR business_criticality IN ('very high','high','medium','low','very low','none')),
    platform                            varchar(100),
    lifecycle                           varchar(100),
    origin                              varchar(100),
    external_audience                   boolean NOT NULL DEFAULT false,
    internet_accessible                 boolean NOT NULL DEFAULT false,
    enable_simple_risk_acceptance       boolean NOT NULL DEFAULT false,
    enable_full_risk_acceptance         boolean NOT NULL DEFAULT true,
    enable_product_tag_inheritance      boolean NOT NULL DEFAULT false,
    disable_sla_breach_notifications    boolean NOT NULL DEFAULT false,
    async_updating                      boolean NOT NULL DEFAULT false,
    user_records                        integer,
    revenue                             numeric(15,2),
    prod_numeric_grade                  integer,
    tid                                 integer NOT NULL DEFAULT 0,
    technical_contact_id                bigint REFERENCES auth_user(id),
    team_manager_id                     bigint REFERENCES auth_user(id),
    product_manager_id                  bigint REFERENCES auth_user(id),
    created                             timestamptz NOT NULL DEFAULT NOW(),
    updated                             timestamptz NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. dojo_engagement
-- -----------------------------------------------------------------------------
CREATE TABLE dojo_engagement (
    id                                          bigserial PRIMARY KEY,
    name                                        varchar(300),
    description                                 varchar(2000),
    version                                     varchar(100),
    first_contacted                             date,
    target_start                                date NOT NULL,
    target_end                                  date NOT NULL,
    product_id                                  bigint NOT NULL REFERENCES dojo_product(id) ON DELETE CASCADE,
    active                                      boolean NOT NULL DEFAULT true,
    status                                      varchar(50) CHECK (status IS NULL OR status IN ('Not Started','Blocked','Cancelled','Completed','In Progress','On Hold','Scheduled','Waiting for Resource')),
    progress                                    varchar(100) NOT NULL DEFAULT 'threat_model',
    threat_model                                boolean NOT NULL DEFAULT true,
    api_test                                    boolean NOT NULL DEFAULT true,
    pen_test                                    boolean NOT NULL DEFAULT true,
    check_list                                  boolean NOT NULL DEFAULT true,
    deduplication_on_engagement                 boolean NOT NULL DEFAULT false,
    done_testing                                boolean NOT NULL DEFAULT false,
    engagement_type                            varchar(30) CHECK (engagement_type IS NULL OR engagement_type IN ('Interactive','CI/CD')),
    tracker                                     varchar(200),
    test_strategy                               varchar(200),
    build_id                                    varchar(150),
    commit_hash                                 varchar(150),
    branch_tag                                  varchar(150),
    source_code_management_uri                  varchar(600),
    reason                                      varchar(2000),
    lead_id                                     bigint REFERENCES auth_user(id),
    requester_id                                bigint,
    preset_id                                   bigint,
    report_type_id                              bigint,
    created                                     timestamptz NOT NULL DEFAULT NOW(),
    updated                                     timestamptz NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. dojo_test_type
-- -----------------------------------------------------------------------------
CREATE TABLE dojo_test_type (
    id      bigserial PRIMARY KEY,
    name    varchar(100) NOT NULL UNIQUE,
    created timestamptz NOT NULL DEFAULT NOW(),
    updated timestamptz NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. dojo_test — bridges engagement → test_type, and is the FK target of Finding
-- -----------------------------------------------------------------------------
CREATE TABLE dojo_test (
    id              bigserial PRIMARY KEY,
    engagement_id   bigint NOT NULL REFERENCES dojo_engagement(id) ON DELETE CASCADE,
    test_type_id    bigint NOT NULL REFERENCES dojo_test_type(id) ON DELETE RESTRICT,
    target_start    date,
    target_end      date,
    created         timestamptz NOT NULL DEFAULT NOW(),
    updated         timestamptz NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. dojo_finding — NO direct product_id / engagement_id columns; only test_id
-- -----------------------------------------------------------------------------
CREATE TABLE dojo_finding (
    id                              bigserial PRIMARY KEY,
    title                           varchar(511) NOT NULL UNIQUE,
    date                            date NOT NULL DEFAULT CURRENT_DATE,
    sla_start_date                  date,
    sla_expiration_date             date,
    cwe                             integer DEFAULT 0,
    cve                             varchar(50),
    epss_score                      numeric(5,2),
    epss_percentile                 numeric(5,2),
    known_exploited                 boolean NOT NULL DEFAULT false,
    ransomware_used                 boolean NOT NULL DEFAULT false,
    kev_date                        date,
    url                             text,
    severity                        varchar(200) NOT NULL CHECK (severity IN ('Info','Low','Medium','High','Critical')),
    description                     text,
    mitigation                      text,
    fix_available                   boolean,
    fix_version                     varchar(100),
    impact                          text,
    steps_to_reproduce              text,
    severity_justification           text,
    "references"                    text,
    test_id                         bigint NOT NULL REFERENCES dojo_test(id) ON DELETE CASCADE,
    active                          boolean NOT NULL DEFAULT true,
    verified                        boolean NOT NULL DEFAULT false,
    false_p                         boolean NOT NULL DEFAULT false,
    duplicate                       boolean NOT NULL DEFAULT false,
    duplicate_finding_id            bigint REFERENCES dojo_finding(id),
    out_of_scope                    boolean NOT NULL DEFAULT false,
    risk_accepted                   boolean NOT NULL DEFAULT false,
    under_review                    boolean NOT NULL DEFAULT false,
    is_mitigated                    boolean NOT NULL DEFAULT false,
    thread_id                       integer NOT NULL DEFAULT 0,
    last_status_update              timestamptz NOT NULL DEFAULT NOW(),
    last_reviewed                   timestamptz,
    numerical_severity              varchar(4),
    hash_code                       varchar(255),
    line                            integer,
    file_path                       varchar(255),
    component_name                  varchar(150),
    component_version               varchar(100),
    static_finding                  boolean NOT NULL DEFAULT false,
    dynamic_finding                 boolean NOT NULL DEFAULT true,
    scanner_confidence              integer,
    sonarqube_issue_id              bigint,
    unique_id_from_tool             varchar(200),
    vuln_id_from_tool               varchar(200),
    sast_source_object              varchar(500),
    sast_sink_object                varchar(500),
    sast_source_line                integer,
    sast_source_file_path           varchar(500),
    nb_occurences                   integer,
    publish_date                    date,
    service                         varchar(150),
    planned_remediation_date        date,
    planned_remediation_version     varchar(100),
    effort_for_fixing               varchar(50),
    reporter_id                     bigint REFERENCES auth_user(id),
    review_requested_by_id          bigint REFERENCES auth_user(id),
    defect_review_requested_by_id   bigint REFERENCES auth_user(id),
    last_reviewed_by_id             bigint REFERENCES auth_user(id),
    mitigated_by_id                 bigint REFERENCES auth_user(id),
    mitigated                       timestamptz,
    created                         timestamptz NOT NULL DEFAULT NOW(),
    updated                         timestamptz NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. Seed defaults so the FK chain stays usable from t=0
--    - admin / admin user (matches DB password in .env.example)
--    - one default Product_Type ("Other")
--    - one default SLA_Configuration so Product.sla_configuration_id default=1 is satisfiable
--    - one default Test_Type ("Generic")
-- -----------------------------------------------------------------------------
INSERT INTO auth_user (username, password, email, is_active, is_staff, is_superuser, date_joined)
VALUES ('admin', '!unused', 'admin@defectdojo.test', true, true, true, NOW());

INSERT INTO dojo_product_type (name, description, critical_product, key_product)
VALUES ('Other', 'Default product type', false, false);

INSERT INTO dojo_sla_configuration (name, description)
VALUES ('Default SLA', 'Default SLA configuration');

INSERT INTO dojo_test_type (name)
VALUES ('Generic');

-- -----------------------------------------------------------------------------
-- 10. Lock sequences to known values so tests can rely on id=1, id=2, ...
-- -----------------------------------------------------------------------------
SELECT setval('auth_user_id_seq',                (SELECT MAX(id) FROM auth_user));
SELECT setval('dojo_product_type_id_seq',       (SELECT MAX(id) FROM dojo_product_type));
SELECT setval('dojo_sla_configuration_id_seq',  (SELECT MAX(id) FROM dojo_sla_configuration));
SELECT setval('dojo_test_type_id_seq',          (SELECT MAX(id) FROM dojo_test_type));
