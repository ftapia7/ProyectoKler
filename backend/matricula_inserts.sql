-- Inserts

-- Estudiante
INSERT INTO estudiante VALUES ('1','Jimena Rojas', 'jrojass@kler.com');

-- Materia
INSERT INTO materia VALUES ('1','03-0249', 'INNOVACION, TECNOLOGIA Y EMPRENDIMIENTO I');
INSERT INTO materia VALUES ('2','16-0584', 'INTELIGENCIA ARTIFICIAL');
INSERT INTO materia VALUES ('3','03-8005', 'SEMINARIO DE INVESTIGACION: COSTA RICA Y EL MUNDO');
INSERT INTO materia VALUES ('4','11-1120', 'BASES DE DATOS II');

-- Profesor
INSERT INTO profesor VALUES ('1', 'Ana Montero');
INSERT INTO profesor VALUES ('2', 'Luis Chaves');
INSERT INTO profesor VALUES ('3', 'Carolina Gomez');
INSERT INTO profesor VALUES ('4', 'Christian Rodriguez');

-- Grupo
INSERT INTO grupo VALUES ('1', '1', '1', '0', 'Virtual', '35', '14');
INSERT INTO grupo VALUES ('2', '1', '2', '617', 'Presencial', '30', '6');
INSERT INTO grupo VALUES ('3', '2', '2', '401', 'Presencial', '30', '0');
INSERT INTO grupo VALUES ('4', '2', '4', '0', 'Virtual', '35', '27');
INSERT INTO grupo VALUES ('5', '3', '4', '513', 'Hibrido', '30', '20');
INSERT INTO grupo VALUES ('6', '4', '3', '502', 'Presencial', '30', '7');

-- Horario
INSERT INTO horario VALUES ('1', '1', 'Lunes', '07:00:00', '10:00:00');
INSERT INTO horario VALUES ('2', '2', 'Jueves', '18:00:00', '21:00:00');
INSERT INTO horario VALUES ('3', '4', 'Lunes', '07:00:00', '10:00:00');
INSERT INTO horario VALUES ('4', '3', 'Miercoles', '07:00:00', '10:00:00');
INSERT INTO horario VALUES ('5', '6', 'Sabado', '08:00:00', '11:00:00');
INSERT INTO horario VALUES ('6', '5', 'Martes', '14:00:00', '17:00:00');
