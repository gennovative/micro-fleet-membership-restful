--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.6
-- Dumped by pg_dump version 9.6.3

-- Started on 2018-01-11 22:17:49

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2146 (class 1262 OID 24576)
-- Name: membership; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "membership" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE "membership" OWNER TO "postgres";

\connect "membership"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2147 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- TOC entry 1 (class 3079 OID 12390)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";


--
-- TOC entry 2148 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION "plpgsql"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "plpgsql" IS 'PL/pgSQL procedural language';


SET search_path = "public", pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 188 (class 1259 OID 32773)
-- Name: account_privilege; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "account_privilege" (
    "account_id" bigint NOT NULL,
    "role_id" bigint NOT NULL
);


ALTER TABLE "account_privilege" OWNER TO "postgres";

--
-- TOC entry 187 (class 1259 OID 32768)
-- Name: account_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "account_roles" (
    "id" bigint NOT NULL,
    "name" character varying(100) NOT NULL
);


ALTER TABLE "account_roles" OWNER TO "postgres";

--
-- TOC entry 186 (class 1259 OID 24585)
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "accounts" (
    "id" bigint NOT NULL,
    "username" character varying(100) NOT NULL,
    "password" character varying(1000) NOT NULL,
    "login_attempts" integer NOT NULL,
    "last_attempt_at" timestamp without time zone,
    "last_login_at" timestamp without time zone,
    "last_login_from" character varying(45),
    "unclocked_at" timestamp without time zone,
    "status" character varying(10),
    "deleted_at" timestamp without time zone,
    "created_at" timestamp without time zone,
    "updated_at" timestamp without time zone,
	"role_id" bigint,
	"refresh_token" character varying(255),
	"token_exp" timestamp without time zone,
    CONSTRAINT "status_check" CHECK ((("status")::"text" = ANY (ARRAY[('active'::character varying)::"text", ('disabled'::character varying)::"text", ('locked'::character varying)::"text", ('banned'::character varying)::"text"])))
);


ALTER TABLE "accounts" OWNER TO "postgres";

--
-- TOC entry 185 (class 1259 OID 24577)
-- Name: civilians; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "civilians" (
    "id" bigint NOT NULL,
    "fullname" character varying(255) NOT NULL,
    "birthday" timestamp without time zone,
    "gender" character varying(20),
    "cellphone" character varying(20),
    "homephone" character varying(20),
    "address" character varying(200),
    "address_lat" double precision,
    "address_long" double precision,
    "marital_status" character varying(10),
    "city_id" bigint,
	"deleted_at" timestamp without time zone,
    CONSTRAINT "marital_stauts_check" CHECK ((("marital_status")::"text" = ANY (ARRAY[('single'::character varying)::"text", ('married'::character varying)::"text", ('separated'::character varying)::"text", ('devorced'::character varying)::"text", ('widowed'::character varying)::"text"])))
);


ALTER TABLE "civilians" OWNER TO "postgres";

--
-- TOC entry 2022 (class 2606 OID 32777)
-- Name: account_privilege account_privilege_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "account_privilege"
    ADD CONSTRAINT "account_privilege_pkey" PRIMARY KEY ("account_id", "role_id");


--
-- TOC entry 2020 (class 2606 OID 32772)
-- Name: account_roles account_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "account_roles"
    ADD CONSTRAINT "account_roles_pkey" PRIMARY KEY ("id");


--
-- TOC entry 2018 (class 2606 OID 24589)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");


--
-- TOC entry 2016 (class 2606 OID 24584)
-- Name: civilians civilians_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "civilians"
    ADD CONSTRAINT "civilians_pkey" PRIMARY KEY ("id");


--
-- TOC entry 2023 (class 2606 OID 32778)
-- Name: account_privilege account_privilege_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "account_privilege"
    ADD CONSTRAINT "account_privilege_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id");


--
-- TOC entry 2024 (class 2606 OID 32783)
-- Name: account_privilege account_privilege_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "account_privilege"
    ADD CONSTRAINT "account_privilege_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "account_roles"("id");

--
-- TOC entry 2024 (class 2606 OID 32783)
-- Name: accounts accounts_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY "accounts"
    ADD CONSTRAINT "accounts_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "account_roles"("id");

-- Completed on 2018-01-11 22:17:50

--
-- PostgreSQL database dump complete
--

