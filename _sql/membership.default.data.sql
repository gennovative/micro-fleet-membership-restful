--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.6
-- Dumped by pg_dump version 9.6.3

-- Started on 2018-05-02 17:03:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

--
-- TOC entry 2143 (class 0 OID 25390)
-- Dependencies: 185
-- Data for Name: account_privilege; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2144 (class 0 OID 25393)
-- Dependencies: 186
-- Data for Name: account_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO account_roles (id, name) VALUES (6374547386693320704, 'admin');


--
-- TOC entry 2145 (class 0 OID 25396)
-- Dependencies: 187
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--
-- username: admin / password: password
INSERT INTO accounts (id, username, password, login_attempts, last_attempt_at, last_login_at, last_login_from, unclocked_at, status, deleted_at, created_at, updated_at, refresh_token, token_exp, role_id) VALUES (6375263880553168896, 'admin', 'c2NyeXB0AA4AAAAIAAAAAU99L8mLAsec2yl3hy3cf3zNYJRxN0hoH2sHbBzk+saEDzdsQywT4caS/RU8bkcVNYq7/DDjovmPO3jp8gPuwrEEIZeEhPMdTg1pPJb8TP/O', 0, NULL, NULL, NULL, NULL, 'active', NULL, '2018-03-02 09:02:35', '2018-05-02 09:58:39', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2Mzc1MjYzODgwNTUzMTY4ODk2IiwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTUyNTI1NTExOSwiZXhwIjoxNTI3ODQ3MTE5LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAifQ.KUfnAiVgPYselCgnYsQL7BplglMoq-lZ-RKeD1Dw-i4', NULL, 6374547386693320704);


--
-- TOC entry 2146 (class 0 OID 25400)
-- Dependencies: 188
-- Data for Name: civilians; Type: TABLE DATA; Schema: public; Owner: postgres
--



-- Completed on 2018-05-02 17:03:35

--
-- PostgreSQL database dump complete
--

