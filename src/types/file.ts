/** Local file surfaced in Recent / picker flows */
export type FileRecord = {
  id: string;
  uri: string;
  name: string;
  sizeBytes?: number;
  mimeType?: string;
  modifiedAt: number;
  pinned?: boolean;
};
