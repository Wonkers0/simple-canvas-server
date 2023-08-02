import World, { Structure } from "./types/World"
import { randomBytes } from "node:crypto"

const WORLD_SIZE = 2500
export default function generate(): World {
   return {
      structures: generateTrees(),
      size: WORLD_SIZE
   }
}

function generateTrees(): Structure[] {
   const treeAmount = Math.floor(Math.random() * 7) + 3

   return new Array(treeAmount).fill(null).map(() => ({
      type: "tree",
      id: randomBytes(16).toString("hex"),
      position: {
         x: Math.random() * WORLD_SIZE,
         y: Math.random() * WORLD_SIZE
      },
      data: {
         health: 100,
         size: Math.floor(Math.random() * 3) + 1
      }
   }))
}
