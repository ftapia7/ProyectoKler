import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root123",
  database: process.env.DB_NAME || "matricula_db",
});

// Materias ofertadas
app.get("/api/materias", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.id_grupo, m.id_materia, m.codigo, m.mat_nombre, p.prof_nombre,
             g.modalidad, g.cupo_disp, h.dia_sem, h.hora_inicio, h.hora_fin, g.aula
      FROM grupo g
      JOIN materia m ON g.id_materia = m.id_materia
      JOIN profesor p ON g.id_profesor = p.id_profesor
      JOIN horario h ON g.id_grupo = h.id_grupo
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener materias" });
  }
});

// Confirmar matrícula
app.post("/api/confirmar-matricula", async (req, res) => {
  const { grupos } = req.body;
  try {
    const [matricula] = await pool.query(
      "SELECT id_matricula FROM matricula WHERE id_estudiante = 1 ORDER BY fecha DESC LIMIT 1"
    );

    let idMatricula;
    if (matricula.length === 0) {
      const [newMatricula] = await pool.query(
        "INSERT INTO matricula (id_estudiante) VALUES (1)" // Si no hay matricula, crea una nueva
      );
      idMatricula = newMatricula.insertId;
    } else {
      idMatricula = matricula[0].id_matricula;
      await pool.query("DELETE FROM detalle_matricula WHERE id_matricula = ?", [idMatricula]); //Si hay matricula, borra detalles anteriores
    }

    for (const idGrupo of grupos) {
      await pool.query(
        "INSERT INTO detalle_matricula (id_matricula, id_grupo) VALUES (?, ?)", //Inserta cada grupo en detalle_matricula
        [idMatricula, idGrupo]
      );
      await pool.query(
        "UPDATE grupo SET cupo_disp = cupo_disp - 1 WHERE id_grupo = ?",
        [idGrupo]
      );
    }

    res.json({ message: "Matrícula confirmada y actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al confirmar matrícula" });
  }
});

// Materias matriculadas
app.get("/api/mis-materias", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT dm.id_grupo, m.codigo, m.mat_nombre, p.prof_nombre,
             h.dia_sem, h.hora_inicio, h.hora_fin, g.modalidad, g.aula
      FROM detalle_matricula dm
      JOIN matricula ma ON dm.id_matricula = ma.id_matricula
      JOIN grupo g ON dm.id_grupo = g.id_grupo
      JOIN materia m ON g.id_materia = m.id_materia
      JOIN profesor p ON g.id_profesor = p.id_profesor
      JOIN horario h ON g.id_grupo = h.id_grupo
      WHERE ma.id_estudiante = 1;
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener materias matriculadas" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
