import axios from "axios";

export const waitForServer = async (server: string) => {
    return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            axios
                .get(server)
                .then(() => {
                    clearInterval(timer);
                    resolve({});
                })
                .catch(() => {
                    console.log("server not available... retry in 2s");
                });
        }, 2000);
    });
};

const globalSetup = async () => {
    await waitForServer("http://localhost:3000/");
};

export default globalSetup;
