export class InteractionFailedError extends Error {
    constructor() {
        super()
        this.name = 'InteractionFailed'
        this.message =
            'A Discord Component interaction failed to complete. \n  Either the message was deleted or something prevented the user to interact or the Discord Bot to respond. \n This can be ignored if the user deleted the interaction message.'
    }
}
