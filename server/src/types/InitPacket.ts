import ServerData, { Player } from "./ServerData"

export default interface InitPacket extends ServerData {
   type: "init"
   you: Player
}
