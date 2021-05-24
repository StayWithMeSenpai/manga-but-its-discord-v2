class Module {
    #name;
    #commands = {};
    #events = {};

    client;

    constructor (name) {
        this.#name = name;
    }

    registerCommand(command, handler) {
        this.#commands[command.toUpperCase()] = handler;
    }

    registerEvent(event, handler) {
        this.#events[event] = this.#events[event] ?? [];
        this.#events[event].push(handler)
    }

    fireEvent(event, args) {
        args = args ?? [];
        for (const eventName in this.#events) {
            if (Object.hasOwnProperty.call(this.#events, eventName)) {
                const handlers = this.#events[eventName];
                if(eventName == event) {
                    handlers.forEach(handler => {
                        handler(...args);
                    });

                    return;
                }
            }
        }

        return;
    }

    fireCommand(command, msg, args) {
        if(typeof this.#commands[command.toUpperCase()] == "function") {
            return this.#commands[command.toUpperCase()](msg, args)
        }
    }

    get commands() {
        return this.#commands;
    }

    get events() {
        return this.#events;
    }
}

module.exports = Module