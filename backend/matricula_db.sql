
-- Crear BD
DROP DATABASE IF EXISTS matricula_db;
CREATE DATABASE matricula_db;

-- Cambiar a BD
USE matricula_db;

-- Crear Tablas de matricula
-- Estudiante
CREATE TABLE estudiante (
	id_estudiante INT PRIMARY KEY,
    est_nombre VARCHAR(50) NOT NULL,
    correo_inst VARCHAR(100) UNIQUE
);

-- Materia
CREATE TABLE materia (
	id_materia INT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL,
    mat_nombre VARCHAR(50) NOT NULL
);

-- Profesor
CREATE TABLE profesor (
	id_profesor INT PRIMARY KEY,
    prof_nombre VARCHAR(50) NOT NULL
);

-- Grupo
CREATE TABLE grupo (
	id_grupo INT PRIMARY KEY,
    id_materia INT NOT NULL,
    id_profesor INT NOT NULL,
    aula INT NOT NULL,
    modalidad ENUM('Presencial','Virtual','Hibrido') NOT NULL,
	cupo_max INT NOT NULL,
    cupo_disp INT NOT NULL,
    
    FOREIGN KEY (id_materia) REFERENCES materia(id_materia),
    FOREIGN KEY (id_profesor) REFERENCES profesor(id_profesor)
);

-- Horario
CREATE TABLE horario (
	id_horario INT PRIMARY KEY,
    id_grupo INT NOT NULL,
    dia_sem ENUM('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo)
);

-- Matricula
CREATE TABLE matricula (
	id_matricula INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_estudiante) REFERENCES estudiante(id_estudiante)
);

-- Detalle Matricula
CREATE TABLE detalle_matricula(
	id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_matricula INT NOT NULL,
    id_grupo INT NOT NULL,
    
	FOREIGN KEY (id_matricula) REFERENCES matricula(id_matricula),
	FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo),
    
    UNIQUE (id_matricula, id_grupo)
);



