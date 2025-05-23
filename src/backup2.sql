PGDMP  1                    }            proyectoJefatura    17.2    17.2 !    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16557    proyectoJefatura    DATABASE     �   CREATE DATABASE "proyectoJefatura" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Mexico.1252';
 "   DROP DATABASE "proyectoJefatura";
                     postgres    false            �            1255    16613    asignar_userinfo_a_usuario()    FUNCTION       CREATE FUNCTION public.asignar_userinfo_a_usuario() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    nuevo_usuario_dts_id INT;
BEGIN
    -- Insertar un nuevo registro en usuarios_datos y obtener su ID
    INSERT INTO public.usuarios_datos DEFAULT VALUES RETURNING id_usuario_dts INTO nuevo_usuario_dts_id;

    -- Actualizar el usuario recién insertado con el nuevo id_usuario_dts
    UPDATE public.usuarios 
    SET "fk_userInfo" = nuevo_usuario_dts_id 
    WHERE id_user = NEW.id_user;

    RETURN NEW;
END;
$$;
 3   DROP FUNCTION public.asignar_userinfo_a_usuario();
       public               postgres    false            �            1259    16591    areas    TABLE     �   CREATE TABLE public.areas (
    id_areas integer NOT NULL,
    nombre character varying,
    titular character varying,
    fecha date
);
    DROP TABLE public.areas;
       public         heap r       postgres    false            �            1259    16668    pk_respuestas_seq    SEQUENCE     z   CREATE SEQUENCE public.pk_respuestas_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.pk_respuestas_seq;
       public               postgres    false            �            1259    16617    public_recibos_id_recibos_seq    SEQUENCE     �   CREATE SEQUENCE public.public_recibos_id_recibos_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.public_recibos_id_recibos_seq;
       public               postgres    false            �            1259    16618    recibos_id_recibos_seq    SEQUENCE        CREATE SEQUENCE public.recibos_id_recibos_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.recibos_id_recibos_seq;
       public               postgres    false            �            1259    16570    recibos    TABLE     �  CREATE TABLE public.recibos (
    id_recibos integer DEFAULT nextval('public.recibos_id_recibos_seq'::regclass) NOT NULL,
    fecha_recibido date,
    referencia character varying,
    remitente character varying,
    cargo character varying,
    oficio character varying,
    procedencia character varying,
    asunto character varying,
    atencion character varying,
    volante character varying,
    indicacion character varying,
    fecha_captura date,
    nivel_prioridad integer,
    leyenda integer,
    nombre_archivo character varying,
    copia_para integer,
    copia_para2 integer,
    copia_para3 integer,
    fk_usuario_registra integer
);
    DROP TABLE public.recibos;
       public         heap r       postgres    false    223            �            1259    16577 
   respuestas    TABLE     5  CREATE TABLE public.respuestas (
    id_respuestas integer DEFAULT nextval('public.pk_respuestas_seq'::regclass) NOT NULL,
    respuesta character varying,
    fecha_crea date,
    fk_usuario_responde integer,
    fk_recibo integer,
    nombre_archivo_respuesta character varying,
    fecha_respuesta date
);
    DROP TABLE public.respuestas;
       public         heap r       postgres    false    224            �            1259    16561    usuarios    TABLE       CREATE TABLE public.usuarios (
    id_user integer NOT NULL,
    usr character varying NOT NULL,
    pwd character varying NOT NULL,
    status boolean DEFAULT true NOT NULL,
    rol boolean DEFAULT true NOT NULL,
    nombre character varying,
    apellido_p character varying
);
    DROP TABLE public.usuarios;
       public         heap r       postgres    false            �           0    0    TABLE usuarios    COMMENT     J   COMMENT ON TABLE public.usuarios IS 'Tabla que contendra a los usuarios';
          public               postgres    false    217            �            1259    16606    usuarios_id_user_seq    SEQUENCE     }   CREATE SEQUENCE public.usuarios_id_user_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.usuarios_id_user_seq;
       public               postgres    false    217            �           0    0    usuarios_id_user_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.usuarios_id_user_seq OWNED BY public.usuarios.id_user;
          public               postgres    false    221            1           2604    16607    usuarios id_user    DEFAULT     t   ALTER TABLE ONLY public.usuarios ALTER COLUMN id_user SET DEFAULT nextval('public.usuarios_id_user_seq'::regclass);
 ?   ALTER TABLE public.usuarios ALTER COLUMN id_user DROP DEFAULT;
       public               postgres    false    221    217            �          0    16591    areas 
   TABLE DATA           A   COPY public.areas (id_areas, nombre, titular, fecha) FROM stdin;
    public               postgres    false    220   !+       �          0    16570    recibos 
   TABLE DATA             COPY public.recibos (id_recibos, fecha_recibido, referencia, remitente, cargo, oficio, procedencia, asunto, atencion, volante, indicacion, fecha_captura, nivel_prioridad, leyenda, nombre_archivo, copia_para, copia_para2, copia_para3, fk_usuario_registra) FROM stdin;
    public               postgres    false    218   (,       �          0    16577 
   respuestas 
   TABLE DATA           �   COPY public.respuestas (id_respuestas, respuesta, fecha_crea, fk_usuario_responde, fk_recibo, nombre_archivo_respuesta, fecha_respuesta) FROM stdin;
    public               postgres    false    219   �-       �          0    16561    usuarios 
   TABLE DATA           V   COPY public.usuarios (id_user, usr, pwd, status, rol, nombre, apellido_p) FROM stdin;
    public               postgres    false    217   �.       �           0    0    pk_respuestas_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.pk_respuestas_seq', 5, true);
          public               postgres    false    224            �           0    0    public_recibos_id_recibos_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.public_recibos_id_recibos_seq', 1, false);
          public               postgres    false    222            �           0    0    recibos_id_recibos_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.recibos_id_recibos_seq', 11, true);
          public               postgres    false    223            �           0    0    usuarios_id_user_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.usuarios_id_user_seq', 5, true);
          public               postgres    false    221            ?           2606    16597    areas Areas_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.areas
    ADD CONSTRAINT "Areas_pkey" PRIMARY KEY (id_areas);
 <   ALTER TABLE ONLY public.areas DROP CONSTRAINT "Areas_pkey";
       public                 postgres    false    220            ;           2606    16576    recibos Recibos_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.recibos
    ADD CONSTRAINT "Recibos_pkey" PRIMARY KEY (id_recibos);
 @   ALTER TABLE ONLY public.recibos DROP CONSTRAINT "Recibos_pkey";
       public                 postgres    false    218            =           2606    16583    respuestas respuestas_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_pkey PRIMARY KEY (id_respuestas);
 D   ALTER TABLE ONLY public.respuestas DROP CONSTRAINT respuestas_pkey;
       public                 postgres    false    219            7           2606    16616    usuarios unico_usuarionick 
   CONSTRAINT     T   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT unico_usuarionick UNIQUE (usr);
 D   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT unico_usuarionick;
       public                 postgres    false    217            9           2606    16569    usuarios usuarios_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_user);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public                 postgres    false    217            C           2620    16614 !   usuarios trigger_asignar_userinfo    TRIGGER     �   CREATE TRIGGER trigger_asignar_userinfo AFTER INSERT ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.asignar_userinfo_a_usuario();
 :   DROP TRIGGER trigger_asignar_userinfo ON public.usuarios;
       public               postgres    false    225    217            A           2606    16663    respuestas fk_recibo_ligado    FK CONSTRAINT     �   ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT fk_recibo_ligado FOREIGN KEY (fk_recibo) REFERENCES public.recibos(id_recibos) NOT VALID;
 E   ALTER TABLE ONLY public.respuestas DROP CONSTRAINT fk_recibo_ligado;
       public               postgres    false    218    4667    219            B           2606    16658 (   respuestas fk_usuario_registra_respuesta    FK CONSTRAINT     �   ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT fk_usuario_registra_respuesta FOREIGN KEY (fk_usuario_responde) REFERENCES public.usuarios(id_user) NOT VALID;
 R   ALTER TABLE ONLY public.respuestas DROP CONSTRAINT fk_usuario_registra_respuesta;
       public               postgres    false    217    4665    219            @           2606    16620    recibos id_usuario_registra    FK CONSTRAINT     �   ALTER TABLE ONLY public.recibos
    ADD CONSTRAINT id_usuario_registra FOREIGN KEY (fk_usuario_registra) REFERENCES public.usuarios(id_user) NOT VALID;
 E   ALTER TABLE ONLY public.recibos DROP CONSTRAINT id_usuario_registra;
       public               postgres    false    218    4665    217            �   �   x�m�AN�0�ur
_�(��}UQ��8�P��̄�]�܆e��G��H"@�ҥg4����k(
T�)j�yvꠞy�5���ǤmA�SД�Y��e�Y�������y���?@%[]�p36.4\��P��{��:Z��o.δ�T[1y]�E�͠�������Ev���-pPw�[ˣv�}�6��H��T�xj��S���Y����ÏVZlWuiK�]:�ծk���Vq���G�a      �   �  x����R�0�ׇ�����E��u��Eg:)�#%�B_�G��L����0Bȟ��PL�f#��Ct=Dw��a�4�����X�z�j���!q��K3������g`@�ˈ0�WKR�mqT�\�p���N��b��ؙ(Ǡ �����'��v/Ob{v�����u�s�Ϣ�_�X�a�} ��A�頋F挰!/$"0I�+�ֹD�$E3�}�T0MԒ���Z ���,`>������ƾ��a8�}����1�(E��e�Do;�$+}Ak�#�*�&)EV��0�p�dE���8�����FVleV�U*�&]�o�^�n`JQ�������ߙ`Cv~�Ɛ�ͨ�c՟��4��2�gս�kt�����f��mA����=�C�WV��6z�m*���|��������3=�8�Z�-��w�L      �   �   x�}�=�0Fg��@��� �� +�ZE�DI��RQB��<E��-`�F
�����i�h	�Fw� ���
Y3s��ҵ�YM� �J�i[���A�k7�W��3cRcc���ӹ�;_.�L(�i?.)�v�B�K�ҧ��vi��4���_���Ύ%c�	�h�      �   �   x�U�K�@D�ݧ�D@@���n
f��ô��FN/��1��W/�S�	u�f���1�5X��k:[F�������K��.�5J�ܭ�RB//pJ��F~�v�����*m�Q�='��-���>%��HS5�     