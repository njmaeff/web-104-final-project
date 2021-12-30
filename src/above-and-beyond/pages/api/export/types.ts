export interface RecordParams {
    collection: string;
    id: string;
    uid: string;
    tz: string;
}

export interface ExportBody extends RecordParams {
    uploads: Awaited<{ name: string; url: string }>[];
    type: string;
}
