import World from "./World"

export default interface ServerData {
   // all ServerData should be considered public, do not store sensitive information
   players: Player[]
   world: World
}

export interface Player {
   id: string
   position: { x: number; y: number }
}
