import workerpool from "workerpool";
import { findAvailableTable as inner } from "./a-sync.ts";

const pool = workerpool.pool();

// Before using this function make sure to measure the performance gain compared
// with the synchronous version. By using a thread pool, we ensure that this task
// does not block the main thread. But we must send the data to the thread which
// can be slower than actually finding the available table.

// Another option would be to use the setImmediate function to break the task into
// multiple subtasks, and to continue to run it on the main thread. Using
// setImmediate would give control back to the event loop and give a chance
// for other code to run before continuing to proceed with this task.
export const findAvailableTable = (tables: Array<boolean>): Promise<number> => {
	return new Promise((resolve, reject) => {
		pool.exec(inner, [tables]).then(resolve).catch(reject);
	});
};
