export default interface World {
   structures: Structure[]
   size: number
}

export interface Structure {
   // Trees (for now, maybe more later)
   type: "tree"
   position: { x: number; y: number }
   data: {
      health: number
      size: number
   }
}
