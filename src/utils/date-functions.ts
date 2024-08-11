// Function to parse date strings into Date objects in UTC
function parseDate(dateStr) {
    return new Date(dateStr);
}

// Function to get the start of the chunk period (08:00 UTC)
function getChunkStart(date) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();

    let chunkStart = new Date(Date.UTC(year, month, day, 6, 0, 0));

    if (date.getUTCHours() < 6) {
        chunkStart = new Date(Date.UTC(year, month, day - 1, 6, 0, 0));
    }

    return chunkStart;
}

function getChunkEnd(chunkStart) {
    return new Date(chunkStart.getTime() + 24 * 60 * 60 * 1000);
}

export function chunkDataByDay(objects) {
    const chunks = [];

    objects.forEach(obj => {
        const dateTime = parseDate(obj.timeIn);
        const chunkStart = getChunkStart(dateTime);
        const chunkEnd = getChunkEnd(chunkStart);

        let chunk = chunks.find(chunk => chunk.start.getTime() === chunkStart.getTime());

        if (!chunk) {
            chunk = { start: chunkStart, end: chunkEnd, items: [] };
            chunks.push(chunk);
        }

        chunk.items.push(obj);
    });

    return chunks;
}
