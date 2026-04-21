--
-- PostgreSQL database dump
--


-- Dumped from database version 17.8 (a48d9ca)
-- Dumped by pg_dump version 18.2

-- Started on 2026-04-21 14:23:32 WAT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 859 (class 1247 OID 32804)
-- Name: account_category_name_enum; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.account_category_name_enum AS ENUM (
    'secretariat',
    'project'
);


ALTER TYPE public.account_category_name_enum OWNER TO neondb_owner;

--
-- TOC entry 880 (class 1247 OID 41526)
-- Name: audit_log_action_enum; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.audit_log_action_enum AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE'
);


ALTER TYPE public.audit_log_action_enum OWNER TO neondb_owner;

--
-- TOC entry 862 (class 1247 OID 32827)
-- Name: transaction_type_enum; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.transaction_type_enum AS ENUM (
    'inflow',
    'outflow'
);


ALTER TYPE public.transaction_type_enum OWNER TO neondb_owner;

--
-- TOC entry 889 (class 1247 OID 65537)
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.user_role_enum AS ENUM (
    'admin',
    'user',
    'acct',
    'audit'
);


ALTER TYPE public.user_role_enum OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 57941)
-- Name: account; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.account (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    "accountNumber" character varying(50) NOT NULL,
    balance numeric(18,2) DEFAULT '0'::numeric NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    bank_id integer,
    currency_id integer,
    category_id integer,
    created_by integer
);


ALTER TABLE public.account OWNER TO neondb_owner;

--
-- TOC entry 222 (class 1259 OID 41441)
-- Name: account_category; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.account_category (
    id integer NOT NULL,
    name public.account_category_name_enum NOT NULL
);


ALTER TABLE public.account_category OWNER TO neondb_owner;

--
-- TOC entry 221 (class 1259 OID 41440)
-- Name: account_category_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.account_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_category_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3439 (class 0 OID 0)
-- Dependencies: 221
-- Name: account_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.account_category_id_seq OWNED BY public.account_category.id;


--
-- TOC entry 229 (class 1259 OID 57940)
-- Name: account_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3440 (class 0 OID 0)
-- Dependencies: 229
-- Name: account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.account_id_seq OWNED BY public.account.id;


--
-- TOC entry 226 (class 1259 OID 41470)
-- Name: audit_log; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.audit_log (
    id integer NOT NULL,
    "oldValue" text,
    "newValue" text,
    "entityType" character varying(50) NOT NULL,
    "entityId" integer NOT NULL,
    action public.audit_log_action_enum NOT NULL,
    description text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    created_by integer,
    "fieldChanged" text
);


ALTER TABLE public.audit_log OWNER TO neondb_owner;

--
-- TOC entry 225 (class 1259 OID 41469)
-- Name: audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.audit_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_log_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3441 (class 0 OID 0)
-- Dependencies: 225
-- Name: audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.audit_log_id_seq OWNED BY public.audit_log.id;


--
-- TOC entry 220 (class 1259 OID 41422)
-- Name: bank; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.bank (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.bank OWNER TO neondb_owner;

--
-- TOC entry 219 (class 1259 OID 41421)
-- Name: bank_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.bank_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bank_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3442 (class 0 OID 0)
-- Dependencies: 219
-- Name: bank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.bank_id_seq OWNED BY public.bank.id;


--
-- TOC entry 228 (class 1259 OID 57930)
-- Name: currency; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.currency (
    id integer NOT NULL,
    code character varying(3) NOT NULL,
    name character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.currency OWNER TO neondb_owner;

--
-- TOC entry 227 (class 1259 OID 57929)
-- Name: currency_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.currency_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.currency_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3443 (class 0 OID 0)
-- Dependencies: 227
-- Name: currency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.currency_id_seq OWNED BY public.currency.id;


--
-- TOC entry 224 (class 1259 OID 41460)
-- Name: transaction; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.transaction (
    id integer NOT NULL,
    type public.transaction_type_enum NOT NULL,
    amount numeric(18,2) NOT NULL,
    "previousBalance" numeric(18,2) NOT NULL,
    "currentBalance" numeric(18,2) NOT NULL,
    description text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    account_id integer,
    created_by integer
);


ALTER TABLE public.transaction OWNER TO neondb_owner;

--
-- TOC entry 223 (class 1259 OID 41459)
-- Name: transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3444 (class 0 OID 0)
-- Dependencies: 223
-- Name: transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.transaction_id_seq OWNED BY public.transaction.id;


--
-- TOC entry 218 (class 1259 OID 41410)
-- Name: user; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    "passwordHash" character varying NOT NULL,
    role public.user_role_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO neondb_owner;

--
-- TOC entry 217 (class 1259 OID 41409)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3445 (class 0 OID 0)
-- Dependencies: 217
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 3242 (class 2604 OID 57944)
-- Name: account id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.account ALTER COLUMN id SET DEFAULT nextval('public.account_id_seq'::regclass);


--
-- TOC entry 3234 (class 2604 OID 41444)
-- Name: account_category id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.account_category ALTER COLUMN id SET DEFAULT nextval('public.account_category_id_seq'::regclass);


--
-- TOC entry 3237 (class 2604 OID 41473)
-- Name: audit_log id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_log ALTER COLUMN id SET DEFAULT nextval('public.audit_log_id_seq'::regclass);


--
-- TOC entry 3231 (class 2604 OID 41425)
-- Name: bank id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bank ALTER COLUMN id SET DEFAULT nextval('public.bank_id_seq'::regclass);


--
-- TOC entry 3239 (class 2604 OID 57933)
-- Name: currency id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.currency ALTER COLUMN id SET DEFAULT nextval('public.currency_id_seq'::regclass);


--
-- TOC entry 3235 (class 2604 OID 41463)
-- Name: transaction id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transaction ALTER COLUMN id SET DEFAULT nextval('public.transaction_id_seq'::regclass);


--
-- TOC entry 3229 (class 2604 OID 41413)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3433 (class 0 OID 57941)
-- Dependencies: 230
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.account 
(id, name, "accountNumber", balance, "createdAt", "updatedAt", bank_id, currency_id, category_id, created_by)
VALUES
(49, 'BMGF - Rice agric business support', '5075237511', 3456678.00, '2025-07-11 13:50:49.674485', '2025-07-18 14:26:31.930721', 2, 2, 2, 1),
(27, 'Admin Fees on Consultancy', '1027981512', 0.00, '2025-07-11 13:41:27.758797', '2025-07-11 13:41:27.758797', 9, 1, 1, 1),
(2, 'Opertions', '1011394153', 0.00, '2025-07-11 13:07:35.572594', '2025-07-11 13:07:35.572594', 2, 1, 1, 1),
(3, 'Conference', '1012147033', 0.00, '2025-07-11 13:11:49.980982', '2025-07-11 13:11:49.980982', 2, 1, 1, 1),
(4, 'Special Intervention Fund (NGF)', '1019755655', 0.00, '2025-07-11 13:13:06.626881', '2025-07-11 13:13:06.626881', 2, 1, 1, 1),
(5, 'Canton Fair', '1015003547', 0.00, '2025-07-11 13:14:11.187053', '2025-07-11 13:14:11.187053', 2, 1, 1, 1),
(6, 'NGFCapacity Building (NGN)', '0040026697', 0.00, '2025-07-11 13:19:21.710449', '2025-07-11 13:19:21.710449', 3, 1, 1, 1),
(7, 'NGF Operations (NGN)', '0040029423', 0.00, '2025-07-11 13:21:56.498364', '2025-07-11 13:21:56.498364', 3, 1, 1, 1),
(8, 'Nigeria Governors'' Forum Operations (NGN)', '2000005840', 0.00, '2025-07-11 13:22:53.231477', '2025-07-11 13:22:53.231477', 4, 1, 1, 1),
(9, 'NGF Project/Operations', '0023577047', 0.00, '2025-07-11 13:24:59.690083', '2025-07-11 13:24:59.690083', 5, 1, 1, 1),
(10, 'NGF (Conference)', '0023577054', 0.00, '2025-07-11 13:25:29.91408', '2025-07-11 13:25:29.91408', 5, 1, 1, 1),
(11, 'Nigeria Governors Forum', '0123152705', 0.00, '2025-07-11 13:25:58.50708', '2025-07-11 13:25:58.50708', 6, 1, 1, 1),
(12, 'NGF Operations', '5030081859', 0.00, '2025-07-11 13:26:31.036387', '2025-07-11 13:26:31.036387', 7, 1, 1, 1),
(15, 'Special Intervention Fund (NGF)', '2045663792', 0.00, '2025-07-11 13:27:50.632677', '2025-07-11 13:27:50.632677', 1, 1, 1, 1),
(16, 'NGF Admin Fees on Grants (NGN)', '2045663730', 0.00, '2025-07-11 13:28:16.160596', '2025-07-11 13:28:16.160596', 1, 1, 1, 1),
(17, 'NGF Consultant Project (NGN)', '0803543339', 0.00, '2025-07-11 13:28:47.45661', '2025-07-11 13:28:47.45661', 8, 1, 1, 1),
(19, 'Conference', '1014191531', 0.00, '2025-07-11 13:29:39.602605', '2025-07-11 13:29:39.602605', 9, 1, 1, 1),
(18, 'NGFS Operations (NGN)', '0720380244', 0.00, '2025-07-11 13:29:09.056249', '2025-07-11 13:29:09.056249', 8, 1, 1, 1),
(20, 'NGF Operations Dollars ($)', '5070096199', 0.00, '2025-07-11 13:30:48.568295', '2025-07-11 13:30:48.568295', 2, 2, 1, 1),
(21, 'NGF London & Paris Club (USD)', '0231533758', 0.00, '2025-07-11 13:31:35.944477', '2025-07-11 13:31:35.944477', 5, 2, 1, 1),
(22, 'NGFS (USD)', '0239769234', 0.00, '2025-07-11 13:31:56.762707', '2025-07-11 13:31:56.762707', 5, 2, 1, 1),
(23, 'NGF Admin Fees Project (Donor) Account (USD)', '2045663778', 0.00, '2025-07-11 13:32:23.697646', '2025-07-11 13:32:23.697646', 1, 2, 1, 1),
(24, 'NGF Operations (USD)', '0759660102', 0.00, '2025-07-11 13:32:56.05459', '2025-07-11 13:32:56.05459', 8, 2, 1, 1),
(26, 'NGFS (£)', '0148416205', 0.00, '2025-07-11 13:34:36.463761', '2025-07-11 13:34:36.463761', 5, 3, 1, 1),
(25, 'NGF Operations Pounds (£)', '5060202403', 0.00, '2025-07-11 13:33:42.578511', '2025-07-11 13:33:42.578511', 2, 3, 1, 1),
(28, 'Bill & Melinda Gates', '1015538232', 0.00, '2025-07-11 13:42:46.376945', '2025-07-11 13:42:46.376945', 2, 1, 2, 1),
(1, 'Project', '1011394160', 1000.50, '2025-07-11 13:05:13.234249', '2025-07-11 14:31:13.343467', 2, 1, 1, 1);

--
-- TOC entry 3425 (class 0 OID 41441)
-- Dependencies: 222
-- Data for Name: account_category; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.account_category (id, name)
VALUES
(1, 'secretariat'),
(2, 'project')
ON CONFLICT (id) DO NOTHING;


--
-- TOC entry 3429 (class 0 OID 41470)
-- Dependencies: 226
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.audit_log (
  id, "oldValue", "newValue", "entityType", "entityId",
  action, description, "createdAt", created_by, "fieldChanged"
) VALUES
(1, NULL, NULL, 'users', 1, 'CREATE', 'Created user "p@gmail.com"', '2025-07-10 23:17:38.124871', NULL, NULL),
(2, NULL, NULL, 'banks', 2, 'CREATE', 'Created bank "Zenith Bank"', '2025-07-11 09:44:54.097071', 1, NULL),
(3, NULL, NULL, 'banks', 3, 'CREATE', 'Created bank "Premium Trust Bank"', '2025-07-11 09:45:20.652902', 1, NULL)
ON CONFLICT (id) DO NOTHING;



--
-- TOC entry 3423 (class 0 OID 41422)
-- Dependencies: 220
-- Data for Name: bank; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.bank (id, name, "createdAt", "updatedAt") VALUES
(1, 'First bank', '2025-07-10 22:25:55.63425', '2025-07-10 22:25:55.63425'),
(2, 'Zenith Bank', '2025-07-11 09:44:53.311789', '2025-07-11 09:44:53.311789'),
(3, 'Premium Trust Bank', '2025-07-11 09:45:18.807617', '2025-07-11 09:45:18.807617'),
(4, 'Signature Bank', '2025-07-11 09:45:41.394703', '2025-07-11 09:45:41.394703'),
(5, 'GTB', '2025-07-11 09:46:14.411955', '2025-07-11 09:46:14.411955'),
(6, 'WEMA Bank', '2025-07-11 09:46:37.635805', '2025-07-11 09:46:37.635805'),
(7, 'Fidelity Bank', '2025-07-11 09:46:57.531888', '2025-07-11 09:46:57.531888'),
(8, 'Access Bank', '2025-07-11 09:47:34.105813', '2025-07-11 09:47:34.105813'),
(9, 'UBA', '2025-07-11 09:47:46.320727', '2025-07-11 09:47:46.320727'),
(10, 'STERLING', '2025-07-11 09:48:12.785964', '2025-07-11 09:48:12.785964')
ON CONFLICT (id) DO NOTHING;

--
-- TOC entry 3431 (class 0 OID 57930)
-- Dependencies: 228
-- Data for Name: currency; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.currency (id, code, name, "createdAt", "updatedAt") VALUES
(1, 'NGN', 'Naira', '2025-07-11 13:02:04.123648', '2025-07-11 13:02:04.123648'),
(2, 'USD', 'US Dollar', '2025-07-11 13:02:23.849261', '2025-07-11 13:02:23.849261'),
(3, 'GBP', 'Pound Sterling', '2025-07-11 13:02:35.76298', '2025-07-11 13:02:35.76298'),
(5, 'YEN', 'yen ooo', '2025-07-18 10:41:31.319869', '2025-07-18 10:41:55.176967')
ON CONFLICT (id) DO NOTHING;


--
-- TOC entry 3427 (class 0 OID 41460)
-- Dependencies: 224
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.transaction (
  id, type, amount, "previousBalance", "currentBalance",
  description, "createdAt", account_id, created_by
) VALUES
(1, 'inflow', 1000.50, 0.00, 1000.50, 'Payment received from client', '2025-07-11 14:31:11.605104', 1, 1),
(2, 'inflow', 1000.50, 0.00, 1000.50, 'Payment received from client', '2025-07-11 14:41:00.502648', 50, 1),
(3, 'inflow', 22324242491.56, 0.00, 22324242490.00, 'digital veirfication', '2025-07-18 11:48:38.009217', 13, 1),
(4, 'inflow', 3456678.00, 0.00, 3456678.00, 'test from front end', '2025-07-18 14:26:29.023045', 49, 1)
ON CONFLICT (id) DO NOTHING;


--
-- TOC entry 3421 (class 0 OID 41410)
-- Dependencies: 218
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public."user" (
  id, name, email, "passwordHash", role, "createdAt"
) VALUES
(1, 'Accountant', 'p@gmail.com', '$2b$10$7y60h10b7/lU5bsWDtSQrund1E80B9pgzGH08ffweFP6vl91TQiIC', 'acct', '2025-07-10 22:05:47.163435'),
(3, 'Auditor', 'k@gmail.com', '$2b$12$YWo/ChFX9.L.pEk552JzOezOUuw5SFn8B6Ff18ESiDKhfRTM0bTrm', 'audit', '2025-07-17 10:55:07.927932'),
(2, 'DG', 'a@gmail.com', '$2b$10$LX8DDNglRfBwIhmc3gScs.Sdi1lrZ54wCeCJy3sjCr3RSGOYgk2uO', 'user', '2025-07-11 09:39:23.762275')
ON CONFLICT (id) DO NOTHING;


--
-- TOC entry 3446 (class 0 OID 0)
-- Dependencies: 221
-- Name: account_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.account_category_id_seq', 2, true);


--
-- TOC entry 3447 (class 0 OID 0)
-- Dependencies: 229
-- Name: account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.account_id_seq', 58, true);


--
-- TOC entry 3448 (class 0 OID 0)
-- Dependencies: 225
-- Name: audit_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.audit_log_id_seq', 103, true);


--
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 219
-- Name: bank_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.bank_id_seq', 15, true);


--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 227
-- Name: currency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.currency_id_seq', 5, true);


--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 223
-- Name: transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.transaction_id_seq', 4, true);


--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 217
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_id_seq', 3, true);


--
-- TOC entry 3260 (class 2606 OID 41478)
-- Name: audit_log PK_07fefa57f7f5ab8fc3f52b3ed0b; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY (id);


--
-- TOC entry 3262 (class 2606 OID 57939)
-- Name: currency PK_3cda65c731a6264f0e444cc9b91; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY (id);


--
-- TOC entry 3254 (class 2606 OID 41446)
-- Name: account_category PK_534910c01c9eaf39f2df194114f; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.account_category
    ADD CONSTRAINT "PK_534910c01c9eaf39f2df194114f" PRIMARY KEY (id);


--
-- TOC entry 3265 (class 2606 OID 57949)
-- Name: account PK_54115ee388cdb6d86bb4bf5b2ea; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY (id);


--
-- TOC entry 3252 (class 2606 OID 41429)
-- Name: bank PK_7651eaf705126155142947926e8; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bank
    ADD CONSTRAINT "PK_7651eaf705126155142947926e8" PRIMARY KEY (id);


--
-- TOC entry 3256 (class 2606 OID 41468)
-- Name: transaction PK_89eadb93a89810556e1cbcd6ab9; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY (id);


--
-- TOC entry 3247 (class 2606 OID 41418)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 3249 (class 2606 OID 41420)
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- TOC entry 3267 (class 2606 OID 57951)
-- Name: account UQ_ee66d482ebdf84a768a7da36b08; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "UQ_ee66d482ebdf84a768a7da36b08" UNIQUE ("accountNumber");


--
-- TOC entry 3250 (class 1259 OID 41430)
-- Name: IDX_11f196da2e68cef1c7e84b4fe9; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "IDX_11f196da2e68cef1c7e84b4fe9" ON public.bank USING btree (name);


--
-- TOC entry 3257 (class 1259 OID 41535)
-- Name: IDX_7253c576c9bcaf94fe064341dd; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_7253c576c9bcaf94fe064341dd" ON public.audit_log USING btree ("entityType", "entityId");


--
-- TOC entry 3258 (class 1259 OID 41534)
-- Name: IDX_877c99611f347708de5db67fd0; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_877c99611f347708de5db67fd0" ON public.audit_log USING btree (action, "createdAt");


--
-- TOC entry 3263 (class 1259 OID 57952)
-- Name: IDX_ee66d482ebdf84a768a7da36b0; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "IDX_ee66d482ebdf84a768a7da36b0" ON public.account USING btree ("accountNumber");


--
-- TOC entry 3268 (class 2606 OID 41504)
-- Name: transaction FK_25b1234bd0af272d259fe5e38de; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "FK_25b1234bd0af272d259fe5e38de" FOREIGN KEY (created_by) REFERENCES public."user"(id);


--
-- TOC entry 3271 (class 2606 OID 57968)
-- Name: account FK_534910c01c9eaf39f2df194114f; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "FK_534910c01c9eaf39f2df194114f" FOREIGN KEY (category_id) REFERENCES public.account_category(id);


--
-- TOC entry 3272 (class 2606 OID 57958)
-- Name: account FK_7a64ccfaf2a121f228ab8c60368; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "FK_7a64ccfaf2a121f228ab8c60368" FOREIGN KEY (bank_id) REFERENCES public.bank(id);


--
-- TOC entry 3273 (class 2606 OID 57973)
-- Name: account FK_9f12e8ffb17cc4b4deeadb93401; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "FK_9f12e8ffb17cc4b4deeadb93401" FOREIGN KEY (created_by) REFERENCES public."user"(id);


--
-- TOC entry 3274 (class 2606 OID 57963)
-- Name: account FK_a686f2a046eb88d479b13b4658f; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "FK_a686f2a046eb88d479b13b4658f" FOREIGN KEY (currency_id) REFERENCES public.currency(id);


--
-- TOC entry 3270 (class 2606 OID 41536)
-- Name: audit_log FK_d58a4fc9c811719d902f43b2075; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT "FK_d58a4fc9c811719d902f43b2075" FOREIGN KEY (created_by) REFERENCES public."user"(id);


--
-- TOC entry 3269 (class 2606 OID 57953)
-- Name: transaction FK_e2652fa8c16723c83a00fb9b17e; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "FK_e2652fa8c16723c83a00fb9b17e" FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- TOC entry 2087 (class 826 OID 16497)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- TOC entry 2086 (class 826 OID 16496)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


-- Completed on 2026-04-21 14:24:14 WAT

--
-- PostgreSQL database dump complete
--


