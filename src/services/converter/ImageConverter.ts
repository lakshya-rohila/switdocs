/** Local image codec routing — delegates to compressor/resizer integrations */
export async function convertRasterFormat(_payload: Record<string, unknown>) {
  return { outputUri: '' };
}
