select current_database();

set search_path to public;


SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'public';


SELECT * FROM public.usuarios;

ALTER TABLE public.usuarios
ALTER COLUMN id_user TYPE SERIAL;



SELECT column_default 
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND column_name = 'id_user';


CREATE SEQUENCE IF NOT EXISTS public.usuarios_id_user_seq;


ALTER TABLE public.usuarios
ALTER COLUMN id_user SET DEFAULT nextval('public.usuarios_id_user_seq');


ALTER SEQUENCE public.usuarios_id_user_seq
OWNED BY public.usuarios.id_user;

SELECT column_name, column_default
FROM information_schema.columns
WHERE table_name = 'usuarios' 
AND column_name = 'id_user';

CREATE or REPLACE FUNCTION insertar_registroNuevo_usuarios_datos()
RETURNS TRIGGERS AS $$
BEGIN

SELECT * from usuarios_datos;
SELECT * from usuarios;

-- HACEMOS AUTO INCREMENTAL EL ID DE usuarios_datos --
CREATE SEQUENCE usuarios_datos_id_usuario_dts_seq START 1;
ALTER TABLE public.usuarios_datos 
ALTER COLUMN id_usuario_dts SET DEFAULT nextval('usuarios_datos_id_usuario_dts_seq');


ALTER TABLE public.usuarios_datos
ALTER COLUMN id_usuario_dts
SET DEFAULT nextval ('usuarios_datos_id_usuario_dts_seq');


CREATE OR REPLACE FUNCTION asignar_userinfo_a_usuario()
RETURNS TRIGGER AS $$
DECLARE
    nuevo_usuario_dts_id INT;
BEGIN
    -- Insertar un nuevo registro en usuarios_datos y obtener su ID
    INSERT INTO public.usuarios_datos DEFAULT VALUES RETURNING id_usuario_dts INTO nuevo_usuario_dts_id;

    -- Actualizar el usuario recién insertado con el nuevo id_usuario_dts
    UPDATE public.usuarios 
    SET fk_userinfo = nuevo_usuario_dts_id 
    WHERE id_user = NEW.id_user;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_asignar_userinfo
AFTER INSERT ON public.usuarios
FOR EACH ROW
EXECUTE FUNCTION asignar_userinfo_a_usuario();



-- RESETEAR SECUENCIAS SI ES NECESARIO  TOMAR COMO EJEMPLO---
ALTER SEQUENCE usuarios_datos_id_usuario_dts_seq RESTART WITH 1;
SELECT setval('public.usuarios_id_user_seq',(SELECT MAX(id_user) FROM public.usuarios));
TRUNCATE TABLE public.usuarios RESTART IDENTITY;
-- BORRAR SECUENCIA--
DROP SEQUENCE IF EXISTS usuarios_datos_id_usuario_dts_seq;
--REINICIAR SECUENCIA DESDE 0----
ALTER SEQUENCE nombre_de_la_secuencia RESTART WITH 0;

-- VER CUANTAS SECUENCIAS EXISTEN ---
SELECT sequence_name
FROM information_schema.sequences
WHERE sequence_schema = 'public';



--- 9/3/25 ---
-- CREA LA SECUENCIA PARA EL PK DE RECIBOS--
CREATE SEQUENCE IF NOT EXISTS public.recibos_id_recibos_seq;

-- MODIFCA LA COLUMNA DEL PK DE RECIBOS--
ALTER TABLE public.recibos
ALTER COLUMN id_recibos SET DEFAULT nextval('public.recibos_id_recibos_seq');

-- SI EXISTEN REGISTROS EN LA TABLE TOMA SU VALOR Y APARTIR DE AHI LO HACE AUTOINCREMENTAL
SELECT setval('recibos_id_recibos_seq', (SELECT MAX(id_recibos) FROM recibos));