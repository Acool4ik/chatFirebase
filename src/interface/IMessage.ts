export interface IReadMessage {
    message: string
    data: string
    name: string
    isChanged: boolean
    photo?: string | null
    file?: string | null
}

export interface IMessage extends IReadMessage {
    readonly uidM: string
    readonly key: string | number
}