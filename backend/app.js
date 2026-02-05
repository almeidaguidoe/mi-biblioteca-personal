import express from "express";
import cors from "cors";
import librosRoutes from "./routes/libros.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/libros", librosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT);