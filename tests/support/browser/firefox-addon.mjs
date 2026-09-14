import net from "node:net";

export async function freeDebugPort() {
    const server = net.createServer();
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    const port = server.address().port;
    await new Promise(resolve => server.close(resolve));
    return port;
}

// The same temporary-install actor used by Mozilla's web-ext:
// https://github.com/mozilla/web-ext/blob/master/src/firefox/remote.js
export async function installFirefoxAddon(port, addonPath) {
    return withFirefoxClient(port, async ({request}) => {
        const root = await request("root", "getRoot");
        if (!root.addonsActor) throw new Error("Firefox does not expose its temporary add-on installer");
        await request(root.addonsActor, "installTemporaryAddon", {addonPath});
    });
}

export async function withFirefoxClient(port, run) {
    const socket = net.createConnection({host: "127.0.0.1", port});
    let buffer = Buffer.alloc(0);
    const packets = [];
    let pending;
    let failure;
    socket.on("error", error => {
        failure = error;
        pending?.reject(error);
    });
    socket.on("data", data => {
        buffer = Buffer.concat([buffer, data]);
        while (true) {
            const colon = buffer.indexOf(58);
            if (colon < 0) return;
            const length = Number(buffer.subarray(0, colon).toString());
            if (buffer.length < colon + 1 + length) return;
            const packet = JSON.parse(buffer.subarray(colon + 1, colon + 1 + length).toString());
            buffer = buffer.subarray(colon + 1 + length);
            if (pending?.match(packet)) pending.resolve(packet);
            else packets.push(packet);
        }
    });
    const receive = match => {
        if (failure) return Promise.reject(failure);
        const index = packets.findIndex(match);
        if (index >= 0) return Promise.resolve(packets.splice(index, 1)[0]);
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                pending = undefined;
                reject(new Error("Firefox debugging request timed out"));
            }, 8000);
            pending = {
                match,
                resolve: packet => {
                    clearTimeout(timer);
                    pending = undefined;
                    resolve(packet);
                },
                reject: error => {
                    clearTimeout(timer);
                    pending = undefined;
                    reject(error);
                },
            };
        });
    };
    const request = async (to, type, fields = {}) => {
        const response = receive(packet => packet.from === to && !packet.type);
        const body = Buffer.from(JSON.stringify({to, type, ...fields}));
        socket.write(Buffer.concat([Buffer.from(`${body.length}:`), body]));
        const packet = await response;
        if (packet.error) throw new Error(`${packet.error}: ${packet.message}`);
        return packet;
    };
    try {
        await receive(packet => packet.applicationType === "browser");
        return await run({request, receive});
    } finally {
        socket.destroy();
    }
}
