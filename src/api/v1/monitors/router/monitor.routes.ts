import {Router} from "express";


const router = Router();

router.get("/", (_,__)=>{});

router.post("/", (_,__)=>{});

router.get("/:id", (_,__)=>{});

router.delete("/:id",(_,__)=>{});

router.post("/:id/heartbeat",(_,__)=>{});

router.post("/:id/pause",(_,__)=>{});

export default router;