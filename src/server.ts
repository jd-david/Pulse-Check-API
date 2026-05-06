import app from "./app";
import { initCSVStore } from "./store/metrics.store";

const PORT = 8080;

initCSVStore().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
