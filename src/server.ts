import app from "./app";
import { initCSVStore } from "./store/metrics.store";

const PORT = 3000;

initCSVStore().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
